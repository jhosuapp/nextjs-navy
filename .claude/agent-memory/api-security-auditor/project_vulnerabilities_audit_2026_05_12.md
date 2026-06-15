---
name: vulnerabilities-audit-2026-05-12
description: Findings from the first full security audit of nextjs-navy API routes, dated 2026-05-12
metadata:
  type: project
---

Audit date: 2026-05-12. Branch: feat/v3.0.

Critical:
- No authentication on POST /api/bot/username-update (public mutation endpoint, no API key or shared secret)
- .env contains a real production DATABASE_URL with credentials hardcoded (should never be committed; currently gitignored but present on disk)

High:
- discord_id exposed in all /api/v2/profile/* responses and in ISR bans page props (platform-internal identifier)
- punisher_id exposed in ISR bans page static props (server-side leaked to client HTML)
- Rate limiter IP extracted from X-Forwarded-For without validation — trivially bypassable with spoofed header
- Missing HSTS, CSP, Referrer-Policy, Permissions-Policy headers in next.config.js
- Unbounded limit parameter in filter-by-modalitie.ts (Number(req.query.limit) with no max cap)
- Unbounded page parameter with no NaN/negative guard in filter-by-modalitie.ts and overall-upd.ts

Medium:
- Cache key collision: profile:nick:{rawUserInput} with no sanitization — colons or special chars in nick could collide
- uuid vs cleanUuid mismatch in username-update.ts (staff verified with cleanUuid, punishments/tiers updated with raw uuid with dashes — likely logic bug)
- No input length limits on any parameter (uuid, nick, query fields)
- No Retry-After header on 429 responses
- No UUID format validation before use in SQL/Mojang URL construction
- dangerouslyAllowSVG: true in next.config.js without strict CSP
- Double rate-limit implementation in filter-by-modalitie.ts (inconsistent enforcement)

Low:
- No API versioning or deprecation strategy beyond /v2/ path prefix
- Error messages in Spanish (inconsistent with security best practices for production APIs)
- Missing Content-Security-Policy header globally
- N+1 query pattern in rankings.ts (one query per game the user has a tier in, inside a for loop)

**Why:** First full audit. Use as baseline for regression testing.
**How to apply:** Cross-reference in future audits to detect regressions or confirm fixes.
