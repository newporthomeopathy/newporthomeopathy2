# Deployment

## Vercel

1. Push this repository to GitHub and import it in Vercel. The framework preset is detected as **Astro**.
2. Build command `npm run build`. Output is handled by the `@astrojs/vercel` adapter.
3. Add the environment variables below (Project → Settings → Environment Variables).
4. Add both domains, `newporthomeopathy.com` and `www.newporthomeopathy.com`. `vercel.json` 301-redirects `www` to the apex domain.

`vercel.json` also sets:
- **Redirects:** `/index.html` and `/inner-page.html` go to `/`, and `/sitemap.xml` goes to `/sitemap-index.xml`. Trailing slashes are added.
- **Security headers:** HSTS, nosniff, Referrer-Policy, Permissions-Policy and a Content-Security-Policy (allows Google Analytics, Cloudflare Turnstile and the Google Maps embed only).
- **Caching:** `/_astro/*` and `/fonts/*` cache for 1 year (immutable). Icons and the OG image cache for 1 week.

The old PHP files (`ajax.php`, `assets/forms/*.php`) don't exist in this build, so they return 404.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | To send email | Booking-form emails via [Resend](https://resend.com). Without it, production shows "couldn't send, please call". In `npm run dev` the form still completes but sends nothing. |
| `CLINIC_INBOX` | No | Where enquiries go. Defaults to the clinic email in `site.ts` (cavitasuresh@yahoo.com). |
| `TURNSTILE_SECRET_KEY` + `PUBLIC_TURNSTILE_SITE_KEY` | Recommended | Cloudflare Turnstile spam check on the form. |
| `PUBLIC_GA_ID` | Optional | GA4 measurement ID. The cookie banner appears only when this is set, and GA loads only after Accept. |
| `PUBLIC_BOOKING_EMBED_URL` | Optional | Setmore / Calendly / Cliniko embed URL. When set, it replaces the enquiry form on `/book-appointment/`. |

A template is in `.env.example`. Copy it to `.env` for local development (`.env` is git-ignored).

## Email sending (Resend)

1. Create a Resend account and add the domain `newporthomeopathy.com`.
2. Add the DNS records Resend gives you (SPF, DKIM), plus a DMARC record. Start with `v=DMARC1; p=none; rua=mailto:cavitasuresh@yahoo.com` and move to `p=quarantine` after two clean weeks.
3. Emails are sent from `noreply@newporthomeopathy.com` with Reply-To set to the patient. The patient also gets an automatic acknowledgement.

## After launch

- **Google Search Console:** verify the domain by DNS TXT record, submit `https://newporthomeopathy.com/sitemap-index.xml`, and request indexing of the home page.
- **Bing Webmaster Tools:** import the property from Search Console.
- **Google Business Profile:** the name, address and phone must match the site exactly. Website link: `https://newporthomeopathy.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
- **GA4:** mark `click_call`, `click_whatsapp`, `click_email`, `generate_lead` and `click_book` as key events. Exclude internal traffic. Add an "AI assistants" channel group matching `chatgpt\.com|chat\.openai\.com|perplexity\.ai|copilot\.microsoft\.com|gemini\.google\.com|claude\.ai`.
- **Validate:** run the Schema Markup Validator and the Rich Results Test on the live URLs. Run Lighthouse on mobile for Home, a consultation page, Book and a blog post. Aim for 90+ in all categories.

Full status of every requirement: [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md).
