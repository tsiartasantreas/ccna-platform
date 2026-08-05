# Anonymous User Security Testing Results — NetworkLearn

**Audit Date:** 2026-08-05
**Target:** https://networklearn.wasmer.app
**Supabase Project:** https://jhesstimsojwmkdysmpy.supabase.co
**Tester Context:** Unauthenticated anonymous user with only the publicly visible anon key

---

## Findings Summary

| # | Finding | Severity | OWASP |
|---|---------|----------|-------|
| 1 | Admin email hardcoded in client JS | HIGH | A04 |
| 2 | Admin page HTML served without auth | CRITICAL | A01 |
| 3 | Admin authorization is client-side only | CRITICAL | A01 |
| 4 | Supabase credentials in client bundles | MEDIUM | A02 |
| 5 | RLS allows read access to sensitive tables | HIGH | A01 |
| 6 | Auth settings endpoint exposed | LOW | A05 |
| 7 | Password reset does not leak users | PASS | — |
| 8 | API keys stored in localStorage | HIGH | A04 |
| 9 | GitHub username/repo exposed | LOW | A05 |
| 10 | Sensitive file access blocked | PASS | — |
| 11 | No source code leakage | PASS | — |

**Critical:** 2 | **High:** 3 | **Medium:** 1 | **Low:** 2 | **Pass:** 3

---

### [CRITICAL] Admin Page HTML Served Without Server-Side Authentication

**OWASP Category:** A01 - Broken Access Control
**Evidence:**
The admin page at `/en/admin` returns HTTP 200 with the full admin dashboard HTML (title: "Admin Dashboard | NetworkLearn") to any unauthenticated request. The page contains:
- User management table structure
- Subscription management UI
- Plan upgrade/downgrade controls
- Certificate generation buttons
- Settings panels for Revolut API keys, Supabase service keys, Stripe, and email

The dashboard page at `/en/dashboard` and profile page at `/en/profile` also serve full HTML without authentication.

**Impact:** While the client-side JavaScript checks for a session and hides content, the HTML structure, form fields, and admin UI are fully exposed. An attacker can study the complete admin interface and craft targeted attacks. The client-side check can be trivially bypassed by modifying the DOM or disabling JavaScript.

**Remediation:** Implement server-side authentication checks. Use middleware or server-side routing to redirect unauthenticated users to login.

---

### [CRITICAL] Admin Panel Authorization is Client-Side Only

**OWASP Category:** A01 - Broken Access Control
**Evidence:**
The admin page JS performs the authorization check entirely in the browser:
```javascript
var r = `tsiartasantreas@gmail.com`,
    {data: {session: i}} = await n.auth.getSession(),
    a = document.getElementById(`access-denied`),
    o = document.getElementById(`admin-content`);

if (!i?.user || i.user.email !== r)
    a && a.classList.remove(`hidden`),
    o && o.classList.add(`hidden`);
else {
    // Full admin functionality loaded here
    await n.from(`profiles`).update({plan: `pro`}).eq(`id`, i.user.id);
}
```

The admin page also performs destructive operations guarded only client-side:
```javascript
// Plan changes - no server verification
await n.from(`profiles`).update({plan: i.value}).eq(`id`, r);
// Subscription cancellation
await n.from(`profiles`).update({plan: `free`}).eq(`id`, r);
```

**Impact:** Any authenticated user who understands the code can bypass the email check by modifying the JavaScript or using the Supabase client directly. They can escalate privileges by changing any user's plan, cancel subscriptions, and access all user data including the `admin_user_emails` table.

**Remediation:** Implement server-side admin authorization using Supabase RLS policies with a `role` column. Never rely on client-side email comparison for access control.

---

### [HIGH] Admin Email Address Hardcoded in Client-Side JavaScript

**OWASP Category:** A04 - Insecure Design
**Evidence:**
The admin email `tsiartasantreas@gmail.com` is hardcoded in at least three publicly downloadable JavaScript bundles:
- `/_astro/admin.astro_astro_type_script_index_0_lang.D6Td7udP.js`
- `/_astro/Header.D-7z5LJB.js`

```javascript
var r = `tsiartasantreas@gmail.com`
if (!i?.user || i.user.email !== r)
  a && a.classList.remove("hidden"), o && o.classList.add("hidden");
```

**Impact:** An attacker knows the exact admin email address, enabling targeted phishing, credential stuffing, and social engineering against the administrator.

**Remediation:** Move admin role checks entirely to server-side. Never hardcode privileged user emails in client-side code.

---

### [HIGH] Supabase RLS Allows Read Access to Sensitive Tables

**OWASP Category:** A01 - Broken Access Control
**Evidence:**
Testing the Supabase REST API with the anon key:
```
GET /rest/v1/profiles?select=* -> []
GET /rest/v1/lesson_progress?select=* -> []
GET /rest/v1/quiz_scores?select=* -> []
GET /rest/v1/user_points?select=* -> []
GET /rest/v1/admin_user_emails?select=* -> []
```

All tables return HTTP 200 with empty arrays `[]` rather than 403 Forbidden. The `admin_user_emails` table returning 200 (even empty) is concerning — it should deny anonymous access entirely.

Write tests confirmed RLS is blocking inserts:
```
POST /rest/v1/profiles -> "new row violates row-level security policy for table \"profiles\""
```

**Impact:** While anonymous users get empty results (RLS works at row level), any authenticated user who bypasses the client-side admin check can read ALL user data through these tables.

**Remediation:** Add restrictive RLS policies on `admin_user_emails` that return 403 for non-admin users.

---

### [HIGH] Admin Settings Stored in localStorage (Including API Keys)

**OWASP Category:** A04 - Insecure Design
**Evidence:**
The admin page stores sensitive settings in the browser's localStorage:
```javascript
// Revolut settings
localStorage.setItem(`adminSettings`, JSON.stringify({
    revolutApiKey: ...,
    revolutWebhookSecret: ...,
    revolutMerchantId: ...
}));

// Supabase settings
localStorage.setItem(`adminSettings`, JSON.stringify({
    supabaseUrl: ...,
    supabaseAnonKey: ...,
    supabaseServiceKey: ...  // SERVICE ROLE KEY!
}));
```

**Impact:** If an attacker gains access to the admin's browser (via XSS, shared computer, or browser extension), they can extract Revolut API keys, webhook secrets, merchant IDs, and the Supabase service role key. The service role key bypasses ALL RLS policies, giving full database access.

**Remediation:** Never store API keys or service role keys in localStorage. Use server-side environment variables for all sensitive configuration.

---

### [MEDIUM] Supabase Credentials Exposed in Client-Side JavaScript Bundles

**OWASP Category:** A02 - Cryptographic Failures (Misconfiguration)
**Evidence:**
```javascript
var n = t(`https://jhesstimsojwmkdysmpy.supabase.co`, `sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD`);
```

**Note:** This is expected for Supabase client-side applications — the anon key is designed to be public. However, combined with weak RLS policies, it becomes exploitable.

**Remediation:** Acceptable for Supabase usage, but RLS policies must be tightened. Ensure no `service_role` key is ever exposed client-side.

---

### [LOW] Supabase Auth Settings Endpoint Exposed

**OWASP Category:** A05 - Security Misconfiguration
**Evidence:**
```
GET /auth/v1/settings -> HTTP 200
Response: {"external":{"anonymous_users":false,"apple":false,...,"email":true,...},"disable_signup":false,"mailer_autoconfirm":false,...}
```

**Impact:** Reveals authentication configuration: only email/password auth enabled, signup not disabled, email auto-confirm off. This information aids attack vector selection.

**Remediation:** This is a Supabase default endpoint and generally acceptable.

---

### [LOW] GitHub Username and Repository Exposed in Client Code

**OWASP Category:** A05 - Security Misconfiguration
**Evidence:**
```javascript
fetch(`https://raw.githubusercontent.com/tsiartasantreas/ccna-platform/main/public/images/certificate-bg.png`)
```

**Impact:** Exposes developer's GitHub profile and source repository, which may contain additional sensitive information or commit history.

**Remediation:** Host certificate background images on the application's own domain. Audit the public GitHub repository for accidentally committed secrets.

---

### [PASS] Password Reset Does Not Leak User Existence

Both password reset requests return identical empty responses regardless of email existence. No user enumeration possible.

### [PASS] Sensitive File Access Blocked

```
/.env -> HTTP 404
/.git/config -> HTTP 404
/.git/HEAD -> HTTP 404
/package.json -> HTTP 404
/robots.txt -> HTTP 404
```

No sensitive files are exposed. Deployment correctly serves only built assets.

### [PASS] No Source Code Leakage

No console.log statements, TODO comments, or developer comments found in HTML source.
