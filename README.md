SEO & Deployment Checklist for mohdmonish.tech

This README contains step-by-step instructions to deploy the site and make sure search engines correctly index your pages and social previews look great.

1) Files you should host at the site root
- /index.html
- /gcsb.html
- /skill.html
- /sitemap.xml
- /robots.txt
- /img/og-image.png (primary social preview)
- /img/og-image.svg (fallback)

2) Generate og-image PNG locally (Windows PowerShell)
- Install Node dependencies and generate PNG from the SVG:

```powershell
cd "C:\Users\mrmon\OneDrive\Documents\Portfolio"
npm install
npm run convert-og
```

This produces `img/og-image.png` (1200x630). Upload both the PNG and SVG to `/img/` on your host.

3) Verify absolute canonical and meta tags
- The project already uses absolute canonical and OG/Twitter meta tags that point to `https://mohdmonish.tech/` and page variants (`/gcsb.html`, `/skill.html`). If your production domain differs, update the following in each HTML head:
  - `<link rel="canonical" href="https://YOURDOMAIN/">`
  - `<meta property="og:url" content="https://YOURDOMAIN/...">`
  - `<meta property="og:image" content="https://YOURDOMAIN/img/og-image.png">`
  - `<meta name="twitter:image" content="https://YOURDOMAIN/img/og-image.png">`

4) Upload sitemap & robots
- Upload `sitemap.xml` to `https://mohdmonish.tech/sitemap.xml`
- Upload `robots.txt` to `https://mohdmonish.tech/robots.txt` (it already references the sitemap)

5) Add site to Google Search Console & submit sitemap
- Sign in to Google Search Console
- Add property `https://mohdmonish.tech/` and verify ownership (DNS TXT recommended)
- Go to Sitemaps → enter `/sitemap.xml` and submit
- Use the URL Inspection tool for important pages (`/`, `/gcsb.html`, `/skill.html`) and click "Request Indexing"

6) Validate structured data (JSON-LD)
- Use Google Rich Results Test: https://search.google.com/test/rich-results
- Paste one of your page URLs (or use the HTML source) to ensure the Person schema has no errors.

7) Re-scrape social previews
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/ — enter the page URL and click "Scrape"
- Twitter Card Validator: https://cards-dev.twitter.com/validator — enter URL and preview card

8) Hosting-specific notes (pick one)
- GitHub Pages:
  - Push the repo to a GitHub repository and enable Pages from `main`/`/` root.
  - In repo settings → Pages → set custom domain to `mohdmonish.tech` and add required DNS records.
  - Ensure `sitemap.xml` and `robots.txt` are in the repo root.
- Netlify:
  - Drag & drop the site folder or Git-connected deploy. Netlify serves files from root by default.
  - Add your custom domain in Site settings and configure DNS.
  - Netlify automatically provides HTTPS.
- Vercel:
  - Connect the repo and deploy. Vercel will serve the root and provide HTTPS.
  - Add custom domain and update DNS.
- Generic FTP/Hosting:
  - Upload files to the domain root (`public_html` or `www`) via your host control panel or FTP/SFTP.
  - Ensure `sitemap.xml` and `robots.txt` are in the root.

9) Monitor & iterate
- Google Search Console: check Performance (queries, impressions, CTR)
- Adjust meta description/title and structured data if CTR is low for targeted queries (e.g., "Mohd Monish portfolio")
- Consider adding Google Analytics / GA4 to track traffic

10) Optional extras I can do for you
- Generate a JPEG fallback (`og-image.jpg`) and add tags for it.
- Replace spaces in image filenames (I used `profile photo linkedin.png` in the repo) to avoid URL encoding issues; update HTML references accordingly.
- Create a small deployment README for a specific host (Netlify/Vercel/GitHub Pages) with DNS steps.

If you want me to perform any of the optional extras (generate PNG/JPEG and commit it, change file names to remove spaces, or create a host-specific deployment guide), tell me which one and I'll proceed.