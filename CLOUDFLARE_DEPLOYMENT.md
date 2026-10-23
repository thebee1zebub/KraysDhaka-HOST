# Deploying KRAYS DHAKA to Cloudflare Pages

Cloudflare Pages provides lightning-fast global edge distribution, free automatic SSL certificates, unlimited bandwidth, and continuous deployment directly from your GitHub repository.

---

## ⚡ Deployment Method 1: Connect to GitHub (Recommended)

This method automatically builds and deploys your website whenever you push new changes to GitHub.

### Step 1: Push your code to GitHub
If you haven't already pushed your code to GitHub:
```bash
git init
git add .
git commit -m "feat: complete KRAYS DHAKA atelier site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/krays-dhaka.git
git push -u origin main
```

### Step 2: Set Up Cloudflare Pages
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Workers & Pages**.
3. Click the blue **Create application** button.
4. Select the **Pages** tab and click **Connect to Git**.
5. Connect your GitHub account and authorize access to your `krays-dhaka` repository.
6. Click **Begin setup**.

### Step 3: Configure Build Settings
Fill in the deployment settings:
- **Project name**: `krays-dhaka` (or your preferred name)
- **Production branch**: `main`
- **Framework preset**: `Vite` (or `None`)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` *(leave empty)*
- **Environment variables**: None required! All assets and data are self-contained.

### Step 4: Deploy
1. Click **Save and Deploy**.
2. Cloudflare will clone your repository, run the build, and deploy the site across their global edge network in ~45 seconds.
3. You will receive a live URL: `https://krays-dhaka.pages.dev`.

---

## 🚀 Deployment Method 2: Direct Upload (Drag-and-Drop, No Git Required)

If you just want to get your site live immediately without connecting GitHub:

1. Build the production bundle locally:
   ```bash
   npm run build
   ```
   *This creates a self-contained `dist/` directory with all compiled HTML, CSS, JavaScript, images, and Cloudflare `_redirects` and `_headers`.*

2. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages**.
3. Select **Upload assets**.
4. Set Project name: `krays-dhaka`.
5. Drag and drop the **`dist`** folder directly into the upload area.
6. Click **Deploy site**.
7. Your site is instantly live!

---

## 💻 Deployment Method 3: Cloudflare Wrangler CLI

You can also deploy straight from your local terminal using Cloudflare's official CLI:

1. Build the production distribution:
   ```bash
   npm run build
   ```

2. Deploy using Wrangler:
   ```bash
   npx wrangler pages deploy dist --project-name=krays-dhaka
   ```
   *(If running for the first time, Wrangler will open a browser window to authenticate with your Cloudflare account).*

---

## 🌐 Connecting Your Custom Domain (e.g., `kraysdhaka.com`)

1. Go to your Cloudflare Pages project dashboard (`Workers & Pages` → `krays-dhaka`).
2. Click on the **Custom domains** tab.
3. Click **Set up a custom domain**.
4. Enter your domain name (e.g., `kraysdhaka.com` or `www.kraysdhaka.com`).
5. Follow the DNS instructions (if your domain is managed by Cloudflare, it is 1-click automatic; if external, add a CNAME record pointing to `krays-dhaka.pages.dev`).
6. Cloudflare will automatically provision and renew a free SSL/TLS certificate.

---

## 🛠️ Included Cloudflare Optimizations

Your project is pre-configured with:
- **`public/_redirects`**: Automatically copied to `dist/_redirects`. Routes all paths (`/collections`, `/bespoke`, `/process`, `/admin`) to `index.html` with status `200` to ensure smooth Single-Page App navigation and zero 404s.
- **`public/_headers`**: Applies browser security headers (`X-Frame-Options`, `X-Content-Type-Options`) and sets immutable 1-year caching for compiled assets (`/assets/*`).
- **`wrangler.toml`**: Configures project name and points `pages_build_output_dir` to `dist`.

---

## 🔐 Admin Portal Access on Cloudflare
Once deployed, your Atelier Admin portal is accessible at:
- `https://your-domain.com/#/admin` (or `https://krays-dhaka.pages.dev/#/admin`)
- **Default Passcode**: `Krays@Admin26`
- **Atelier Address**: `37, Avenue-1, Mirpur-10, Dhaka`
