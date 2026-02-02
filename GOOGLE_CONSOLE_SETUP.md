# How to Connect to Google Search Console

Follow these steps to index your website on Google.

## Step 1: Add Property
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **"Add property"**.
3. Choose **"URL prefix"** (Recommended for quick setup).
4. Enter your URL: `https://ayaan-alam.vercel.app`.
5. Click **Continue**.

## Step 2: Verify Ownership
You will verify using the **HTML Tag** method (easiest with the code I added).

1. Select **"HTML tag"** under "Other verification methods".
2. You will see a meta tag like `<meta name="google-site-verification" content="...code..." />`.
3. **Copy only the code** inside the `content="..."`. 
   - Example: specific long string of letters and numbers.
4. Open the file `app/layout.tsx` in your code.
5. Find this section I added:
   ```typescript
   verification: {
     google: 'your-google-verification-code', // <--- PASTE HERE
   },
   ```
6. Replace `'your-google-verification-code'` with your actual code.
7. **Deploy** your changes (push to GitHub).
8. Once deployed, go back to Google Search Console and click **"Verify"**.

## Step 3: Submit Sitemap
Once verified:
1. Detailed dashboard will open.
2. In the left menu, click **"Sitemaps"**.
3. Under "Add a new sitemap", type `sitemap.xml`.
4. Click **Submit**.

Google will now crawl your site. It may take a few days to appear in search results.
