GitHub Pages deployment & DNS for mohdmonish.tech

This guide shows how to deploy your static site to GitHub Pages and point your custom domain `mohdmonish.tech` to it. It includes DNS records, repository steps, verification, and troubleshooting tips.

---

Prerequisites
- A GitHub repository containing your site (this repo).
- You control the domain `mohdmonish.tech` and can edit DNS records at your registrar.
- Recommended: have `sitemap.xml`, `robots.txt`, and `img/og-image.png` in the repo root (they are present in this repo).

1) Add a CNAME file to the repo (optional but recommended)
- Create a file named `CNAME` in the repository root that contains exactly:

```
mohdmonish.tech
```

- Commit and push it:

```powershell
git add CNAME
git commit -m "Add custom domain CNAME"
git push origin main
```

Why: GitHub Pages reads this file and registers the custom domain for your repository automatically.

2) Configure GitHub Pages in the repository settings
- Go to your repository on GitHub → Settings → Pages.
- Under "Build and deployment" / "Source" choose:
  - Branch: `main` (or whichever branch you deploy from)
  - Folder: `/ (root)`
- Save.
- In "Custom domain", type `mohdmonish.tech` and Save.
- GitHub will show the DNS records you need to configure.

3) Add DNS records at your registrar
- For an apex domain (`mohdmonish.tech`) add four A records pointing to GitHub Pages IPs:

| Host | Type | Value |
|------|------|-------|
| @    | A    | 185.199.108.153 |
| @    | A    | 185.199.109.153 |
| @    | A    | 185.199.110.153 |
| @    | A    | 185.199.111.153 |

- For the `www` subdomain (optional), add a CNAME record pointing to `<your-github-username>.github.io`:

| Host | Type  | Value |
|------|-------|-------|
| www  | CNAME | Mohd-Monish.github.io. |

Notes:
- Some DNS providers offer ANAME/ALIAS records for apex domains. If available, you can create an ALIAS/ANAME pointing `@` to `Mohd-Monish.github.io.` instead of multiple A records.
- If you already have other A records for the apex (e.g., an older host), remove them to avoid conflicts.

4) Wait for DNS propagation and enable HTTPS on GitHub
- DNS updates can take a few minutes to 48 hours depending on TTL.
- After GitHub detects the DNS settings, the Pages settings page will allow you to "Enforce HTTPS" — enable it.
- GitHub will provision a TLS certificate automatically; this can take some minutes to an hour.

5) Verify DNS and site reachability (PowerShell)
- Check A records:

```powershell
Resolve-DnsName mohdmonish.tech -Type A
```

- Check CNAME for `www`:

```powershell
Resolve-DnsName www.mohdmonish.tech -Type CNAME
```

- Quick HTTP test:

```powershell
Invoke-WebRequest -Uri https://mohdmonish.tech -UseBasicParsing
```

6) Add Google Search Console and submit sitemap
- Go to https://search.google.com/search-console
- Add property `https://mohdmonish.tech/` and verify ownership (DNS TXT verification is recommended).
- In Search Console → Sitemaps, submit `https://mohdmonish.tech/sitemap.xml`.
- Use URL Inspection → Request Indexing for high-priority pages (`/`, `/gcsb.html`, `/skill.html`).

7) Social previews & OG image
- Make sure `img/og-image.png` (1200×630) is uploaded to `/img/` at the domain root.
- Use Facebook Sharing Debugger and Twitter Card Validator to re-scrape pages and preview cards.

8) HTTPS and Cloudflare notes
- If you use Cloudflare (or another reverse proxy) set the DNS "proxy" (orange cloud) to OFF for the apex and `www` while setting up GitHub Pages — GitHub checks the naked records directly.
- If you must use Cloudflare proxy, set SSL/TLS to "Full (strict)" and follow GitHub guidance — but the simplest option is to keep DNS unproxied so GitHub can issue certificates.

9) Troubleshooting
- Certificate not provisioning:
  - Ensure A records match the four GitHub IPs.
  - Remove old conflicting records.
  - Wait 10–60 minutes and refresh the Pages settings.
- 404 or incorrect content:
  - Confirm Pages source is `main` / root and that `index.html` exists.
  - If using a custom domain, ensure CNAME is present and DNS has propagated.
- Redirect loops with Cloudflare:
  - Disable Cloudflare proxy or set SSL mode to Full/Full (strict) and use page rules carefully.

10) Optional: verify structured data & SEO
- Use Google Rich Results Test:
  - https://search.google.com/test/rich-results — paste a page URL and validate JSON-LD.
- Monitor Search Console Performance for queries and impressions.

11) Final checks after deployment
- Confirm `https://mohdmonish.tech/` loads with a valid TLS certificate.
- Confirm `https://mohdmonish.tech/og-image.png` is accessible.
- Submit sitemap and request indexing for main pages.

If you'd like, I can:
- Create and commit the `CNAME` file for you (I can add it to the repo in a follow-up change).
- Produce a short PowerShell script to periodically check DNS and HTTPS provisioning and notify when ready.

---

If you want me to add the `CNAME` file and commit it now, reply `yes` and I'll add it to the repo.