# Lakespring Investments — Website

A personal investing journal: portfolio dashboard, articles, and email signup.

---

## 🚀 Quick start (you are here)

You've just downloaded the project files. Here's what to do next, in order:

### 1. Unzip the folder
Put it somewhere stable — your **Documents** folder is great. Avoid Desktop (gets cluttered fast) and avoid OneDrive/iCloud folders (can cause sync issues with the code).

### 2. Open GitHub Desktop
- Click **File → Add Local Repository**
- Browse to the unzipped `lakespring-site` folder
- It'll say "This directory doesn't appear to be a Git repository. Would you like to create a repository here?" → Click **Create a Repository**
- Repository name: `lakespring-site`
- Leave the rest as defaults → Click **Create Repository**

### 3. Publish to GitHub
- In GitHub Desktop, click the big blue **Publish repository** button (top right)
- Keep the name as `lakespring-site`
- **Uncheck** "Keep this code private" if you're comfortable with public code (recommended — it's just a website). Or leave it checked if you prefer.
- Click **Publish Repository**

Your code is now on GitHub at:
`github.com/lakespringinvestments/lakespring-site`

### 4. Deploy to Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- You'll see your `lakespring-site` repo in the list — click **Import**
- Don't touch any settings — Vercel auto-detects Next.js
- Click **Deploy**
- Wait ~60 seconds → Site is live at `lakespring-site-xxx.vercel.app`

### 5. Connect your domain
- In Vercel, click your project → **Settings → Domains**
- Type `lakespringinvestments.com` → Add
- Vercel shows you DNS instructions
- Go to Cloudflare → your domain → DNS → add the records Vercel showed you
- Wait 5-30 minutes for DNS to propagate
- Your site is now live at `lakespringinvestments.com` 🎉

---

## 📊 Wire up the portfolio data

The site is currently showing **mock data** so it looks alive on first launch. To connect your real numbers from Google Sheets:

### Step 1: Create your public data sheet
1. Open Google Sheets → create new spreadsheet
2. Name it: `Lakespring_Website_Public_Data`
3. Create two tabs:

**Tab 1: `Holdings`** — first row is headers:

| Ticker | Name | Price | Weight | Day_Change_Pct |
|--------|------|-------|--------|----------------|
| TSLA   | Tesla | 342.18 | 26 | 3.42 |
| NVDA   | Nvidia | 148.92 | 20 | 1.88 |

Pull these from your master tracker with `IMPORTRANGE` — example formula in A2:
```
=IMPORTRANGE("your_master_file_id_here", "X_Position_Sheet!A2:E10")
```

**Tab 2: `Performance`** — first row is headers:

| Date | Portfolio_Value | Premium_YTD |
|------|-----------------|-------------|
| 2026-05-01 | 460000 | 7800 |
| 2026-05-02 | 462000 | 7820 |

### Step 2: Publish each tab as CSV
1. File → **Share → Publish to web**
2. Choose the **Holdings** tab from the dropdown
3. Format: **Comma-separated values (.csv)**
4. Click **Publish** → copy the URL
5. Repeat for the **Performance** tab

### Step 3: Add the URLs to Vercel
1. In Vercel, go to your project → **Settings → Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SHEET_HOLDINGS_URL` = the Holdings CSV URL
   - `NEXT_PUBLIC_SHEET_PERFORMANCE_URL` = the Performance CSV URL
3. Click **Save**
4. Go to **Deployments** tab → click the three dots on the latest → **Redeploy**

That's it. The site refreshes its data every 5 minutes automatically.

---

## ✍️ Writing articles

1. Open the `src/content/articles/` folder
2. Create a new file: `my-new-article.md`
3. Use this template:

```markdown
---
title: "Your article title"
date: "2026-05-15"
excerpt: "One-sentence summary that shows on the article list page."
---

Your article content goes here in regular markdown.

## A heading

Regular paragraph text. **Bold**, *italic*, [links](https://example.com).

![Image caption](/articles/your-image.png)
```

4. Save the file
5. In GitHub Desktop:
   - You'll see the new file appear
   - Type a summary like "Added new article on Tesla"
   - Click **Commit to main** → **Push origin**
6. Vercel auto-deploys in ~30 seconds. Your article is live.

### Adding images to articles
1. Save the image (PNG or JPG) into `public/articles/`
2. Reference it: `![Caption](/articles/your-image.png)`
3. Commit and push as above

---

## 🛠️ Editing the site

To change any code, you can use any text editor. I recommend:
- **VS Code** (free, fantastic) — code.visualstudio.com
- Or just **TextEdit** (Mac) / **Notepad** (Windows) for simple changes

After editing any file, the workflow is always the same:
1. Save the file
2. Open GitHub Desktop
3. Write a one-line summary of what you changed
4. **Commit to main** → **Push origin**
5. Site updates in ~30 seconds

---

## 📁 What's where

- `src/app/page.tsx` — the homepage (dashboard)
- `src/app/about/page.tsx` — the About page text
- `src/app/trades/page.tsx` — the "coming soon" Trades page
- `src/components/Dashboard/` — the 4 dashboard pieces
- `src/components/Layout/Navbar.tsx` — top nav (change links here)
- `src/content/articles/*.md` — your articles
- `src/lib/data.ts` — where dashboard data comes from
- `tailwind.config.ts` — brand colors (teal #034147 etc.)
- `public/articles/` — images for your articles

---

## 💰 What this costs

- **Hosting (Vercel):** Free
- **Code hosting (GitHub):** Free
- **Email (Beehiiv):** Free up to 2,500 subscribers
- **Domain (Cloudflare):** ~$10/year
- **Total monthly cost:** ~$1/month (just the domain)

---

## 🚧 What's coming later

When you're ready to launch the paid tier:
1. Sign up for Stripe (stripe.com)
2. Sign up for Supabase (supabase.com — free tier)
3. Tell me you're ready — I'll guide you through adding auth + paywall to the `/trades` route

---

## ❓ Troubleshooting

**Site shows "Application error" or won't build on Vercel**
→ Check the Vercel deployment logs (Deployments tab → click the failed one). Usually a typo somewhere. Send me the error.

**Dashboard shows mock data even after I added sheet URLs**
→ Make sure you redeployed in Vercel after adding env vars. They don't apply to existing deployments.

**Email signup form doesn't show**
→ Check that `NEXT_PUBLIC_BEEHIIV_EMBED_URL` env var is set in Vercel, or that the default URL in `src/components/EmailSignup.tsx` matches your publication.

**Article images don't appear**
→ Check the filename matches exactly (case-sensitive) and the path starts with `/articles/` not `./articles/` or `articles/`.

---

## License

Personal project. Code is yours.
