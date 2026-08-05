# External Reconnaissance Findings — NetworkLearn

**Target:** https://networklearn.wasmer.app
**Date:** 2026-08-05
**Scope:** External black-box reconnaissance (no authentication)

---

## Findings Summary

| Severity | Count | Key Issues |
|----------|-------|------------|
| CRITICAL | 3 | Client-side admin check, exposed admin email, Supabase key exposure |
| HIGH | 2 | Missing security headers, sensitive data in localStorage |
| MEDIUM | 2 | Client-side DB upserts, project reference leak |
| LOW | 2 | No security.txt, no robots.txt |
| INFO | 5 | TLS OK, source maps OK, directory enum clean, tech stack, Supabase RLS partially working |

---

### [CRITICAL] Admin Role Check Performed Client-Side Only

**OWASP Category:** A01 - Broken Access Control
**Evidence:**
In `/_astro/Header.D-7z5LJB.js`, the admin email is hardcoded and the admin check is performed entirely in the browser:
```javascript
var o=r(`https://jhesstimsojwmkdysmpy.supabase.co`,`sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD`),s=`tsiartasantreas@gmail.com`
// ...
p(e.user.email===s)
```

**Impact:** Any authenticated user can grant themselves admin access by modifying JavaScript state at runtime.

**Remediation:** Move admin role checks to server-side. Use Supabase RLS policies with a `role` column.

---

### [CRITICAL] Admin Email Address Exposed in Client-Side JavaScript

**OWASP Category:** A04 - Insecure Design
**Evidence:**
The admin email `tsiartasantreas@gmail.com` is hardcoded as a string literal in `/_astro/Header.D-7z5LJB.js`.

**Impact:** An attacker immediately knows the exact admin email, enabling targeted phishing and social engineering.

**Remediation:** Remove hardcoded email from client-side code. Use database-driven admin assignment.

---

### [CRITICAL] Supabase Anon Key Exposed in Multiple Client-Side Bundles

**OWASP Category:** A07 - Identification and Authentication Failures
**Evidence:**
The Supabase anon key and project URL are embedded in multiple JS bundles:
```javascript
createClient(`https://jhesstimsojwmkdysmpy.supabase.co`,`sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD`)
```

**Impact:** While anon keys are designed for client use, the risk depends on RLS configuration. Combined with weak RLS, this key can be used to query tables.

**Remediation:** Audit all Supabase RLS policies. Ensure no table is accessible without proper authentication.

---

### [HIGH] Missing All Critical HTTP Security Headers

**OWASP Category:** A05 - Security Misconfiguration
**Evidence:**
Response headers from the homepage:
```
HTTP/2 200
content-length: 122
content-type: text/html
cache-control: public, max-age=86400
```

**Missing headers:**
- `Content-Security-Policy` — allows arbitrary script injection
- `X-Frame-Options` — site can be framed (clickjacking)
- `X-Content-Type-Options` — MIME sniffing possible
- `Strict-Transport-Security` — no HSTS
- `Referrer-Policy` — referrer data leaked
- `Permissions-Policy` — no feature restrictions

**Custom Wasmer headers exposed:**
- `x-wasmer-request-id` — reveals internal request tracking
- `x-edge-app-version-id: dav_nX3IVt3uQ645` — reveals deployment version

**Impact:** Vulnerable to clickjacking, MIME sniffing, HTTP downgrade attacks, and script injection.

**Remediation:** Add security headers via Wasmer edge configuration or Astro middleware:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://jhesstimsojwmkdysmpy.supabase.co
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

### [HIGH] Sensitive User Data Stored in localStorage

**OWASP Category:** A05 - Security Misconfiguration
**Evidence:**
```javascript
localStorage.setItem(`userEmail`, e.user.email || ``)
localStorage.setItem(`userId`, e.user.id)
localStorage.getItem(`adminSettings`)
localStorage.getItem(`userAvatar`)
```

**Impact:** localStorage is accessible to any JavaScript on the page. Without CSP, XSS can exfiltrate all stored data.

**Remediation:** Use httpOnly cookies for sensitive session data. Implement CSP. Minimize localStorage usage.

---

### [MEDIUM] Client-Side Database Upserts Without Server-Side Validation

**OWASP Category:** A03 - Injection
**Evidence:**
```javascript
await t.from(`profiles`).upsert({
  id: e.user.id,
  email: r,
  display_name: a || r?.split(`@`)[0],
  plan: `free`
}, {onConflict: `id`})
```

**Impact:** If RLS is not properly configured, any authenticated user could modify any user's profile data.

**Remediation:** Implement strict RLS policies. Use `auth.uid() = id` for profiles.

---

### [MEDIUM] Supabase Project Reference Exposed in HTTP Headers

**OWASP Category:** A05 - Security Misconfiguration
**Evidence:**
```
sb-project-ref: jhesstimsojwmkdysmpy
sb-gateway-version: 1
```

**Impact:** Reveals the Supabase project identifier, which can be used to target the project.

**Remediation:** This is a Supabase platform behavior. Ensure all tables have proper RLS policies.

---

### [LOW] No security.txt File

**OWASP Category:** A05 - Security Misconfiguration
**Evidence:** `/.well-known/security.txt` returns 404.

**Impact:** Security researchers have no way to report vulnerabilities responsibly.

**Remediation:** Create `/.well-known/security.txt` with contact information.

---

### [LOW] No robots.txt or sitemap.xml

**OWASP Category:** A05 - Security Misconfiguration
**Evidence:** Both `/robots.txt` and `/sitemap.xml` return 404.

**Impact:** No guidance for search engine crawlers. Sensitive paths not hidden from scanners.

**Remediation:** Create a `robots.txt` that disallows crawling of admin, dashboard, and login paths.

---

### [INFO] SSL/TLS Configuration — PASS

**Evidence:**
```
Protocol: TLSv1.3
Cipher: TLS_AES_256_GCM_SHA384
Subject: CN=*.wasmer.app
Issuer: Let's Encrypt
Not After: Sep 13 2026
```

**Assessment:** Strong TLS configuration. Certificate expires Sep 13, 2026 — ensure auto-renewal is configured.

---

### [INFO] Source Maps Not Exposed — PASS

**Evidence:** `/_astro/Header.D-7z5LJB.js.map` returns 404.

**Assessment:** Source maps are not publicly accessible.

---

### [INFO] Directory Enumeration — Clean

**Evidence:**
| Path | Status |
|------|--------|
| `/admin` | 404 |
| `/api` | 404 |
| `/.env` | 404 |
| `/.git/config` | 404 |
| `/.git/HEAD` | 404 |
| `/robots.txt` | 404 |
| `/sitemap.xml` | 404 |
| `/.well-known/` | 404 |

**Assessment:** No sensitive paths exposed. Standard trailing-slash redirects in place.

---

### [INFO] Technology Stack Identified

**Evidence:**
- **Framework:** Astro (SSR with client-side hydration)
- **UI Library:** React
- **3D Engine:** Three.js
- **Backend:** Supabase (PostgreSQL + Auth)
- **Hosting:** Wasmer Edge (fr-pari1 region)
- **Fonts:** Google Fonts (Inter, JetBrains Mono)
- **Copyright:** abcdigital360

**Impact:** Knowing the tech stack helps attackers target known vulnerabilities.

**Remediation:** Keep all dependencies updated. Monitor for CVEs.
