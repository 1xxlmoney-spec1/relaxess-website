# Relaxess Website - Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Relaxess website to production on Cloudflare Pages (recommended) or alternative platforms.

## Archive Contents

The `relaxess-website-production.tar.gz` archive contains:

```
relaxess-website-prod/
├── index.html              # Home page
├── privacy/index.html      # Privacy Policy
├── terms/index.html        # Terms of Use
├── support/index.html      # Support & Help Center
├── contact/index.html      # Contact page
├── css/style.css           # Main stylesheet (1200+ lines)
├── js/script.js            # Main JavaScript (200+ lines)
├── assets/images/          # Image placeholders
├── robots.txt              # SEO configuration
├── sitemap.xml             # XML sitemap
├── manifest.json           # PWA manifest
├── _redirects              # Cloudflare Pages config
├── package.json            # Project metadata
├── README.md               # Documentation
└── .gitignore              # Git ignore rules
```

## Quick Start (5 minutes)

### Step 1: Extract Archive

```bash
tar -xzf relaxess-website-production.tar.gz
cd relaxess-website-prod
```

### Step 2: Update Configuration

1. **Replace placeholder URLs:**
   - `https://apps.apple.com/app/relaxess` → Your App Store URL
   - `https://play.google.com/store/apps/details?id=com.app.calmspace` → Your Google Play URL
   - `support@relaxess.com` → Your support email
   - `business@relaxess.com` → Your business email

2. **Update domain references:**
   - Replace `https://relaxess.app` with your actual domain

3. **Add images:**
   - Replace placeholder images in `assets/images/` with actual images:
     - `favicon.ico` - 16x16 or 32x32 icon
     - `favicon-32x32.png` - 32x32 favicon
     - `favicon-16x16.png` - 16x16 favicon
     - `apple-touch-icon.png` - 180x180 for iOS
     - `og-image.png` - 1200x630 for social media
     - `app-store-badge.svg` - App Store button
     - `google-play-badge.svg` - Google Play button

### Step 3: Deploy to Cloudflare Pages

#### Option A: GitHub Integration (Recommended)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Relaxess website"
   git remote add origin https://github.com/YOUR_USERNAME/relaxess-website.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Click "Pages" in the left sidebar
   - Click "Create a project"
   - Select "Connect to Git"
   - Authorize GitHub and select your repository
   - Configure build settings:
     - Framework: None
     - Build command: (leave empty)
     - Build output directory: /
   - Click "Save and Deploy"

3. **Configure Domain**
   - In Cloudflare Pages project settings, add your domain
   - Update your domain's nameservers to point to Cloudflare

#### Option B: Direct Upload

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Deploy**
   ```bash
   wrangler pages deploy .
   ```

3. **Configure Domain**
   - Follow Cloudflare's domain configuration instructions

### Step 4: Verify Deployment

1. **Check all pages load:**
   - https://relaxess.app/
   - https://relaxess.app/privacy/
   - https://relaxess.app/terms/
   - https://relaxess.app/support/
   - https://relaxess.app/contact/

2. **Test functionality:**
   - Click all navigation links
   - Test contact form
   - Verify FAQ accordion works
   - Check dark mode toggle
   - Test responsive design

3. **Verify SEO:**
   - Check meta tags in page source
   - Verify sitemap.xml loads
   - Check robots.txt loads
   - Test Open Graph tags

## Detailed Configuration

### 1. Update App Store Links

**File: `index.html`, `support/index.html`, `contact/index.html`**

Replace:
```html
<a href="https://apps.apple.com/app/relaxess">Download on App Store</a>
<a href="https://play.google.com/store/apps/details?id=com.app.calmspace">Get on Google Play</a>
```

With your actual URLs:
```html
<a href="https://apps.apple.com/app/relaxess-id-12345">Download on App Store</a>
<a href="https://play.google.com/store/apps/details?id=com.app.calmspace">Get on Google Play</a>
```

### 2. Update Contact Email

**Files: `index.html`, `privacy/index.html`, `terms/index.html`, `support/index.html`, `contact/index.html`**

Replace:
```html
<a href="mailto:support@relaxess.com">support@relaxess.com</a>
<a href="mailto:business@relaxess.com">business@relaxess.com</a>
```

With your actual emails.

### 3. Update Domain References

**Files: All HTML files**

Replace:
```html
https://relaxess.app
```

With your actual domain:
```html
https://your-domain.com
```

### 4. Add Custom Images

1. **Favicon** (16x16, 32x32, 64x64)
   - Save as `assets/images/favicon.ico`

2. **Apple Touch Icon** (180x180)
   - Save as `assets/images/apple-touch-icon.png`

3. **Open Graph Image** (1200x630)
   - Save as `assets/images/og-image.png`
   - Used for social media sharing

4. **App Store Badge** (SVG or PNG)
   - Save as `assets/images/app-store-badge.svg`

5. **Google Play Badge** (SVG or PNG)
   - Save as `assets/images/google-play-badge.svg`

### 5. Customize Branding

**File: `css/style.css`**

Update CSS variables:
```css
:root {
  --primary: #0a7ea4;           /* Main color */
  --background: #ffffff;         /* Light mode background */
  --text-primary: #11181c;       /* Text color */
  /* ... more colors ... */
}
```

## Platform Alternatives

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

### GitHub Pages

1. Push to GitHub
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose main branch
5. Save

### AWS S3 + CloudFront

1. Create S3 bucket
2. Upload website files
3. Create CloudFront distribution
4. Configure domain

## Performance Optimization

### Minify CSS and JavaScript

```bash
# Install minifiers
npm install -g csso-cli terser

# Minify CSS
csso css/style.css -o css/style.min.css

# Minify JavaScript
terser js/script.js -o js/script.min.js
```

Then update HTML to reference minified files:
```html
<link rel="stylesheet" href="/css/style.min.css">
<script src="/js/script.min.js"></script>
```

### Optimize Images

```bash
# Install image optimizer
npm install -g imagemin-cli

# Optimize images
imagemin assets/images/* --out-dir=assets/images
```

### Enable Gzip Compression

Cloudflare Pages automatically enables gzip compression.

## Security Configuration

### Content Security Policy

Add to `_redirects`:
```
/* /index.html 200
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS

Cloudflare Pages provides automatic HTTPS. All traffic is encrypted.

## Monitoring & Analytics

### Google Analytics

1. Create Google Analytics property
2. Add tracking code to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_ID');
   </script>
   ```

### Cloudflare Analytics

Included automatically with Cloudflare Pages.

## Maintenance

### Regular Updates

- Review content quarterly
- Update legal documents as needed
- Check for broken links
- Monitor analytics

### Backup

```bash
# Create backup
tar -czf relaxess-website-backup-$(date +%Y%m%d).tar.gz relaxess-website-prod/

# Store in safe location
```

## Troubleshooting

### Pages not loading

1. Check file paths are correct
2. Verify all HTML files are in correct directories
3. Check `_redirects` configuration
4. Clear browser cache

### Styles not applying

1. Check CSS file path is correct
2. Verify CSS file is not minified incorrectly
3. Clear browser cache
4. Check for CSS syntax errors

### Images not showing

1. Verify image files exist in `assets/images/`
2. Check image file paths in HTML
3. Verify image formats are supported
4. Check file permissions

### Contact form not working

1. Verify form HTML is correct
2. Check JavaScript is loaded
3. Test in different browser
4. Check browser console for errors

## Support

For issues or questions:
- Email: support@relaxess.com
- Website: https://relaxess.app
- GitHub Issues: https://github.com/relaxess/website/issues

## Next Steps

1. ✅ Extract website archive
2. ✅ Update configuration (URLs, emails, domain)
3. ✅ Add custom images
4. ✅ Deploy to Cloudflare Pages
5. ✅ Configure domain
6. ✅ Test all pages
7. ✅ Set up analytics
8. ✅ Monitor performance

## Checklist Before Launch

- [ ] All pages load correctly
- [ ] All links work
- [ ] Contact form works
- [ ] Images display correctly
- [ ] Dark mode works
- [ ] Responsive design works on mobile
- [ ] SEO meta tags are correct
- [ ] Open Graph tags display correctly
- [ ] Analytics tracking works
- [ ] SSL certificate is valid
- [ ] Performance is acceptable
- [ ] No console errors

## Timeline

- **Day 1:** Extract, configure, deploy
- **Day 2:** Test and verify
- **Day 3:** Monitor and optimize
- **Ongoing:** Maintenance and updates

---

**Version:** 1.0.0  
**Last Updated:** June 30, 2026  
**Status:** Production Ready
