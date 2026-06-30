# CalmSpace Infrastructure Preparation Audit
## Complete Web Infrastructure Setup for App Store Submission

**Audit Date:** June 25, 2026  
**Project:** CalmSpace (React Native/Expo Mobile App)  
**Status:** Planning & Recommendation Phase  
**Scope:** Website infrastructure, hosting, domain, and deployment

---

## EXECUTIVE SUMMARY

This audit provides a complete infrastructure preparation plan for CalmSpace before TestFlight and App Store submission. It includes:

1. **Website Structure** - Recommended folder layout and pages
2. **Hosting Recommendation** - Comparison of 4 platforms with recommendation
3. **Domain Recommendation** - Evaluation of 5 domain options
4. **Deployment Checklist** - Step-by-step setup instructions
5. **Pre-TestFlight URL Verification** - All URLs that must exist before submission

**Key Recommendation:** Use **Cloudflare Pages** with **calmspace.app** domain for simplicity, cost-effectiveness, and minimal maintenance.

---

## PART 1: WEBSITE STRUCTURE

### 1.1 Recommended Directory Structure

```
calmspace.app/
├── index.html                    (Home page)
├── privacy/
│   └── index.html               (Privacy Policy page)
├── terms/
│   └── index.html               (Terms of Use page)
├── support/
│   └── index.html               (Support page)
├── contact/
│   └── index.html               (Contact page)
├── css/
│   └── style.css                (Global styles)
├── js/
│   └── script.js                (Global scripts)
├── assets/
│   ├── logo.png
│   ├── icon.png
│   └── screenshots/
│       ├── screenshot-1.png
│       ├── screenshot-2.png
│       └── screenshot-3.png
├── robots.txt                   (SEO)
├── sitemap.xml                  (SEO)
└── .well-known/
    └── apple-app-site-association (iOS universal links)
```

### 1.2 Page Specifications

#### 1.2.1 Home Page (index.html)

**Purpose:** Landing page for CalmSpace app  
**Content:**
- App name and tagline
- Brief description (2-3 sentences)
- Key features (AI chat, relaxation exercises, audio)
- Call-to-action buttons (App Store, Google Play)
- Links to Privacy Policy and Terms of Use in footer
- Contact information

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CalmSpace - AI Companion for Relaxation</title>
    <meta name="description" content="CalmSpace: AI-powered relaxation app with meditation, breathing exercises, and ambient audio.">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <h1>CalmSpace</h1>
            <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#download">Download</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="hero">
            <h1>Find Your Calm</h1>
            <p>AI-powered relaxation at your fingertips</p>
            <div id="download">
                <a href="https://apps.apple.com/..." class="btn">Download on App Store</a>
                <a href="https://play.google.com/..." class="btn">Get on Google Play</a>
            </div>
        </section>

        <section id="features">
            <h2>Features</h2>
            <div class="features">
                <div class="feature">
                    <h3>AI Conversations</h3>
                    <p>Chat with an emotionally intelligent AI companion</p>
                </div>
                <div class="feature">
                    <h3>Relaxation Exercises</h3>
                    <p>Guided breathing, body scan, grounding, and more</p>
                </div>
                <div class="feature">
                    <h3>Ambient Audio</h3>
                    <p>Calming soundscapes: music, forest, rain</p>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
        <p>&copy; 2026 CalmSpace. All rights reserved.</p>
    </footer>

    <script src="/js/script.js"></script>
</body>
</html>
```

#### 1.2.2 Privacy Policy Page (privacy/index.html)

**Purpose:** Display Privacy Policy for app store compliance  
**Content:**
- Full Privacy Policy text (from PRIVACY_POLICY.md)
- Last updated date
- Link back to home page
- Link to Terms of Use

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - CalmSpace</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="/">← Back to CalmSpace</a>
        </nav>
    </header>

    <main class="legal-page">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: June 25, 2026</p>
        
        <!-- Full privacy policy content here -->
        <h2>1. Introduction</h2>
        <p>CalmSpace ("we," "us," "our," or "Company") is committed to protecting your privacy...</p>
        
        <!-- ... rest of privacy policy ... -->
    </main>

    <footer>
        <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </footer>

    <script src="/js/script.js"></script>
</body>
</html>
```

#### 1.2.3 Terms of Use Page (terms/index.html)

**Purpose:** Display Terms of Use for app store compliance  
**Content:**
- Full Terms of Use text (from TERMS_OF_USE.md)
- Last updated date
- Link back to home page
- Link to Privacy Policy

**Implementation:** Similar structure to Privacy Policy page

#### 1.2.4 Support Page (support/index.html)

**Purpose:** Provide support information and FAQ  
**Content:**
- Support contact information
- FAQ section
- Common issues and solutions
- Link to contact form
- Response time expectations

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Support - CalmSpace</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="/">← Back to CalmSpace</a>
        </nav>
    </header>

    <main class="support-page">
        <h1>Support</h1>
        
        <section class="contact-info">
            <h2>Contact Us</h2>
            <p>Email: <a href="mailto:support@calmspace.com">support@calmspace.com</a></p>
            <p>Response time: Within 24 hours</p>
        </section>

        <section class="faq">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-item">
                <h3>How do I cancel my subscription?</h3>
                <p>You can cancel your subscription through your device's app store settings...</p>
            </div>
            <div class="faq-item">
                <h3>Is my data private?</h3>
                <p>Yes, we do not store your chat messages. See our Privacy Policy for details...</p>
            </div>
            <!-- More FAQ items -->
        </section>

        <section class="contact-form">
            <h2>Send us a message</h2>
            <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
                <input type="email" name="email" placeholder="Your email" required>
                <textarea name="message" placeholder="Your message" required></textarea>
                <button type="submit">Send</button>
            </form>
        </section>
    </main>

    <footer>
        <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </footer>

    <script src="/js/script.js"></script>
</body>
</html>
```

#### 1.2.5 Contact Page (contact/index.html)

**Purpose:** Simple contact form for inquiries  
**Content:**
- Contact form
- Email address
- Response time expectations
- Links to social media (optional)

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - CalmSpace</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="/">← Back to CalmSpace</a>
        </nav>
    </header>

    <main class="contact-page">
        <h1>Contact Us</h1>
        
        <section>
            <h2>Get in Touch</h2>
            <p>Have a question? We'd love to hear from you.</p>
            
            <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
                <div>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div>
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required>
                </div>
                <div>
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
        </section>

        <section>
            <h2>Direct Contact</h2>
            <p>Email: <a href="mailto:support@calmspace.com">support@calmspace.com</a></p>
            <p>Response time: Within 24 hours</p>
        </section>
    </main>

    <footer>
        <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </footer>

    <script src="/js/script.js"></script>
</body>
</html>
```

### 1.3 CSS Styling (css/style.css)

**Recommended approach:** Minimal, clean design that matches app branding

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #11181C;
    background-color: #ffffff;
}

header {
    background-color: #0a7ea4;
    color: white;
    padding: 1rem 2rem;
}

header nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header nav h1 {
    font-size: 1.5rem;
}

header nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
}

header nav a {
    color: white;
    text-decoration: none;
}

header nav a:hover {
    opacity: 0.8;
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #0a7ea4;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    margin: 0.5rem;
    transition: opacity 0.3s;
}

.btn:hover {
    opacity: 0.8;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.feature {
    padding: 1.5rem;
    background-color: #f5f5f5;
    border-radius: 8px;
}

.legal-page {
    max-width: 900px;
    line-height: 1.8;
}

.legal-page h1 {
    margin: 2rem 0 1rem 0;
}

.legal-page h2 {
    margin: 1.5rem 0 0.75rem 0;
}

.legal-page p {
    margin: 0.75rem 0;
}

.last-updated {
    color: #687076;
    font-size: 0.9rem;
}

footer {
    background-color: #f5f5f5;
    padding: 2rem;
    margin-top: 3rem;
    text-align: center;
    border-top: 1px solid #E5E7EB;
}

footer ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
}

footer a {
    color: #0a7ea4;
    text-decoration: none;
}

footer a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    header nav {
        flex-direction: column;
        gap: 1rem;
    }

    header nav ul {
        flex-direction: column;
        gap: 0.5rem;
    }

    main {
        padding: 1rem;
    }

    footer ul {
        flex-direction: column;
        gap: 0.5rem;
    }
}
```

### 1.4 JavaScript (js/script.js)

**Minimal functionality:**

```javascript
// Simple mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Add any interactive functionality here
    console.log('CalmSpace website loaded');
});

// Analytics (optional)
// Add Google Analytics or similar tracking
```

---

## PART 2: HOSTING PLATFORM COMPARISON & RECOMMENDATION

### 2.1 Platform Comparison Matrix

| Feature | GitHub Pages | Cloudflare Pages | Netlify | Vercel |
|---------|--------------|------------------|---------|--------|
| **Cost** | Free | Free | Free (with limits) | Free (with limits) |
| **Custom Domain** | ✓ | ✓ | ✓ | ✓ |
| **HTTPS/SSL** | ✓ (automatic) | ✓ (automatic) | ✓ (automatic) | ✓ (automatic) |
| **Setup Time** | 10-15 min | 5-10 min | 10-15 min | 10-15 min |
| **Maintenance** | Minimal | Minimal | Minimal | Minimal |
| **Performance** | Good | Excellent | Excellent | Excellent |
| **CDN** | GitHub's CDN | Cloudflare's CDN | Netlify's CDN | Vercel's CDN |
| **Build Tools** | Limited | Limited | Full | Full |
| **Form Handling** | Need third-party | Need third-party | Built-in | Built-in |
| **Analytics** | Need third-party | Built-in | Optional | Optional |
| **Uptime SLA** | 99.9% | 99.95% | 99.99% | 99.99% |
| **Learning Curve** | Moderate | Low | Low | Low |
| **Best For** | Static sites | Static sites + performance | Static + dynamic | Static + dynamic |

### 2.2 Detailed Platform Analysis

#### 2.2.1 GitHub Pages

**Pros:**
- Completely free
- Integrated with GitHub
- Good for developers
- Automatic HTTPS

**Cons:**
- Limited features
- No built-in form handling
- Requires git knowledge
- Slower than alternatives

**Best For:** Developers comfortable with git and GitHub

**Setup Time:** 15 minutes

---

#### 2.2.2 Cloudflare Pages ⭐ RECOMMENDED

**Pros:**
- Free tier with excellent features
- Extremely fast (Cloudflare CDN)
- Simple deployment (drag & drop or git)
- Automatic HTTPS and SSL
- Built-in analytics
- Excellent uptime (99.95%)
- No build step required for static sites
- Easy custom domain setup
- Minimal maintenance
- Great for beginners

**Cons:**
- Fewer advanced features than Netlify/Vercel
- Limited form handling (need third-party)

**Best For:** Single developers wanting simplicity and performance

**Setup Time:** 5-10 minutes

**Why Recommended:**
- Simplest setup process
- Best performance for static sites
- Cloudflare's reputation for reliability
- Minimal ongoing maintenance
- Free tier is generous
- Perfect for a single developer with no DevOps background

---

#### 2.2.3 Netlify

**Pros:**
- Free tier with good features
- Built-in form handling
- Excellent documentation
- Good performance
- Easy deployment

**Cons:**
- Slightly more complex than Cloudflare Pages
- Free tier has bandwidth limits
- More features than needed for this use case

**Best For:** Developers who want more features and don't mind complexity

**Setup Time:** 10-15 minutes

---

#### 2.2.4 Vercel

**Pros:**
- Excellent for Next.js projects
- Very fast performance
- Great documentation
- Good free tier

**Cons:**
- Overkill for static sites
- More complex than needed
- Designed for dynamic applications

**Best For:** Dynamic applications, not static sites

**Setup Time:** 10-15 minutes

---

### 2.3 RECOMMENDATION: Cloudflare Pages

**Decision:** Use **Cloudflare Pages** for CalmSpace website

**Rationale:**
1. **Simplicity:** Easiest setup process (5-10 minutes)
2. **Performance:** Cloudflare's global CDN ensures fast loading worldwide
3. **Reliability:** 99.95% uptime SLA
4. **Cost:** Completely free for static sites
5. **Maintenance:** Virtually zero ongoing maintenance
6. **Scalability:** Can handle any traffic spike
7. **Security:** Automatic HTTPS, DDoS protection
8. **Single Developer Friendly:** No complex DevOps required

**Setup Process:**
1. Create Cloudflare account (free)
2. Add domain to Cloudflare
3. Create GitHub repository for website
4. Connect GitHub to Cloudflare Pages
5. Deploy (automatic on every git push)

---

## PART 3: DOMAIN RECOMMENDATION

### 3.1 Domain Options Evaluation

#### Option 1: calmspace.app

| Criteria | Rating | Notes |
|----------|--------|-------|
| **Branding** | ⭐⭐⭐⭐⭐ | Perfect - clearly indicates it's an app |
| **Memorability** | ⭐⭐⭐⭐⭐ | Very easy to remember |
| **App Store Alignment** | ⭐⭐⭐⭐⭐ | Matches app name perfectly |
| **Availability** | ⭐⭐⭐⭐ | Likely available (newer TLD) |
| **Cost** | ⭐⭐⭐ | ~$12-15/year (.app is premium TLD) |
| **Professionalism** | ⭐⭐⭐⭐⭐ | Very professional |
| **SEO** | ⭐⭐⭐⭐ | Good for app-related searches |
| **Typing** | ⭐⭐⭐⭐⭐ | Easy to type |

**Verdict:** ✅ EXCELLENT - Recommended

---

#### Option 2: calmspace.ai

| Criteria | Rating | Notes |
|----------|--------|-------|
| **Branding** | ⭐⭐⭐⭐ | Good - indicates AI features |
| **Memorability** | ⭐⭐⭐⭐ | Easy to remember |
| **App Store Alignment** | ⭐⭐⭐ | Emphasizes AI, not app |
| **Availability** | ⭐⭐⭐ | May be taken (popular TLD) |
| **Cost** | ⭐⭐ | ~$50-100/year (.ai is expensive) |
| **Professionalism** | ⭐⭐⭐⭐ | Professional but trendy |
| **SEO** | ⭐⭐⭐⭐ | Good for AI searches |
| **Typing** | ⭐⭐⭐⭐⭐ | Easy to type |

**Verdict:** ⚠️ GOOD BUT EXPENSIVE - Not recommended due to cost

---

#### Option 3: calmspace.co

| Criteria | Rating | Notes |
|----------|--------|-------|
| **Branding** | ⭐⭐⭐ | Generic, doesn't indicate app |
| **Memorability** | ⭐⭐⭐⭐ | Easy to remember |
| **App Store Alignment** | ⭐⭐⭐ | Neutral |
| **Availability** | ⭐⭐⭐⭐ | Likely available |
| **Cost** | ⭐⭐⭐ | ~$10-15/year |
| **Professionalism** | ⭐⭐⭐⭐ | Professional |
| **SEO** | ⭐⭐⭐ | Neutral for searches |
| **Typing** | ⭐⭐⭐⭐⭐ | Easy to type |

**Verdict:** ⚠️ ACCEPTABLE - Works but not ideal

---

#### Option 4: calmspacehealth.com

| Criteria | Rating | Notes |
|----------|--------|-------|
| **Branding** | ⭐⭐ | Too medical/clinical |
| **Memorability** | ⭐⭐ | Long and harder to remember |
| **App Store Alignment** | ⭐⭐ | Doesn't match app name |
| **Availability** | ⭐⭐⭐⭐ | Likely available |
| **Cost** | ⭐⭐⭐⭐ | ~$10-15/year (.com is cheap) |
| **Professionalism** | ⭐⭐⭐ | Professional but misleading |
| **SEO** | ⭐⭐⭐ | Good for health searches |
| **Typing** | ⭐⭐ | Long to type |

**Verdict:** ❌ NOT RECOMMENDED - Misleading branding

---

#### Option 5: calmspace-relax.com

| Criteria | Rating | Notes |
|----------|--------|-------|
| **Branding** | ⭐⭐ | Redundant (calm + relax) |
| **Memorability** | ⭐⭐ | Long and harder to remember |
| **App Store Alignment** | ⭐⭐ | Doesn't match app name |
| **Availability** | ⭐⭐⭐ | May be taken |
| **Cost** | ⭐⭐⭐⭐ | ~$10-15/year (.com is cheap) |
| **Professionalism** | ⭐⭐⭐ | Professional but verbose |
| **SEO** | ⭐⭐⭐ | Neutral |
| **Typing** | ⭐⭐ | Long to type |

**Verdict:** ❌ NOT RECOMMENDED - Too verbose

---

### 3.2 RECOMMENDATION: calmspace.app

**Decision:** Use **calmspace.app** as primary domain

**Rationale:**
1. **Perfect Branding:** Clearly indicates it's an app
2. **App Store Alignment:** Matches the app name exactly
3. **Memorability:** Short and easy to remember
4. **Professional:** Modern and credible
5. **Cost:** Reasonable (~$12-15/year)
6. **Typing:** Very easy to type
7. **SEO:** Good for app-related searches
8. **Availability:** Likely available (check immediately)

**Secondary Recommendation:** Also purchase **calmspace.co** as backup
- Cost: ~$10-15/year
- Redirect to calmspace.app
- Protects against typos

**Total Annual Cost:** ~$25-30 for both domains

---

## PART 4: DEPLOYMENT CHECKLIST

### 4.1 Pre-Deployment Preparation

- [ ] **Create GitHub Repository**
  - Repository name: `calmspace-website`
  - Visibility: Public
  - Add README.md with project description
  - Add .gitignore for static sites

- [ ] **Prepare Website Files**
  - [ ] Create index.html (home page)
  - [ ] Create privacy/index.html (privacy policy)
  - [ ] Create terms/index.html (terms of use)
  - [ ] Create support/index.html (support page)
  - [ ] Create contact/index.html (contact page)
  - [ ] Create css/style.css (styling)
  - [ ] Create js/script.js (scripts)
  - [ ] Create robots.txt (SEO)
  - [ ] Create sitemap.xml (SEO)
  - [ ] Add assets/logo.png
  - [ ] Add assets/icon.png

- [ ] **Prepare Legal Documents**
  - [ ] Copy PRIVACY_POLICY.md content to privacy/index.html
  - [ ] Copy TERMS_OF_USE.md content to terms/index.html
  - [ ] Replace all placeholders with actual information
  - [ ] Have legal team review

- [ ] **Set Up Contact Forms**
  - [ ] Create Formspree account (free)
  - [ ] Create form for contact page
  - [ ] Create form for support page
  - [ ] Test forms locally

### 4.2 Domain Setup

- [ ] **Register Domain**
  - [ ] Check availability of calmspace.app
  - [ ] Register calmspace.app (recommended registrar: Namecheap, GoDaddy, or Google Domains)
  - [ ] Register calmspace.co as backup
  - [ ] Enable auto-renewal
  - [ ] Save domain credentials securely

- [ ] **Set Up Cloudflare Account**
  - [ ] Create free Cloudflare account
  - [ ] Add domain to Cloudflare
  - [ ] Update domain nameservers to Cloudflare:
    - `ns1.cloudflare.com`
    - `ns2.cloudflare.com`
  - [ ] Wait for nameserver propagation (up to 48 hours, usually 5-30 minutes)

- [ ] **Configure DNS**
  - [ ] Verify domain is active in Cloudflare
  - [ ] Add DNS records if needed (usually automatic)
  - [ ] Test DNS resolution: `nslookup calmspace.app`

### 4.3 Hosting Setup (Cloudflare Pages)

- [ ] **Connect GitHub to Cloudflare Pages**
  - [ ] Log in to Cloudflare dashboard
  - [ ] Go to "Pages" section
  - [ ] Click "Create a project"
  - [ ] Select "Connect to Git"
  - [ ] Authorize GitHub account
  - [ ] Select `calmspace-website` repository
  - [ ] Configure build settings:
    - Build command: (leave empty for static site)
    - Build output directory: / (root)
  - [ ] Click "Save and deploy"

- [ ] **Configure Custom Domain**
  - [ ] In Cloudflare Pages project settings
  - [ ] Go to "Custom domains"
  - [ ] Add `calmspace.app`
  - [ ] Add `www.calmspace.app` (optional)
  - [ ] Verify DNS configuration

- [ ] **Enable HTTPS/SSL**
  - [ ] Automatic - Cloudflare handles this
  - [ ] Verify SSL certificate is active
  - [ ] Test HTTPS: `https://calmspace.app`

### 4.4 Website Deployment

- [ ] **Push Website to GitHub**
  - [ ] Commit all website files
  - [ ] Push to main branch
  - [ ] Cloudflare Pages automatically deploys

- [ ] **Verify Deployment**
  - [ ] Visit `https://calmspace.app` in browser
  - [ ] Verify all pages load correctly
  - [ ] Check that all links work
  - [ ] Verify responsive design on mobile
  - [ ] Check page load speed (should be < 1 second)

- [ ] **Test All URLs**
  - [ ] [ ] `https://calmspace.app` - Home page loads
  - [ ] [ ] `https://calmspace.app/privacy` - Privacy policy loads
  - [ ] [ ] `https://calmspace.app/terms` - Terms of use loads
  - [ ] [ ] `https://calmspace.app/support` - Support page loads
  - [ ] [ ] `https://calmspace.app/contact` - Contact page loads
  - [ ] [ ] All external links work
  - [ ] [ ] Contact forms submit successfully

### 4.5 SSL/HTTPS Verification

- [ ] **Verify SSL Certificate**
  - [ ] Use SSL Labs: https://www.ssllabs.com/ssltest/
  - [ ] Enter `calmspace.app`
  - [ ] Verify grade is A or A+
  - [ ] Check certificate is valid
  - [ ] Check certificate doesn't expire soon

- [ ] **Test HTTPS on All Pages**
  - [ ] Visit each page with HTTPS
  - [ ] No mixed content warnings
  - [ ] Green lock icon in browser
  - [ ] Test on multiple browsers

### 4.6 SEO & Metadata

- [ ] **Configure robots.txt**
  - [ ] Allow all crawlers
  - [ ] Point to sitemap.xml

- [ ] **Create sitemap.xml**
  - [ ] Include all pages
  - [ ] Include privacy policy
  - [ ] Include terms of use
  - [ ] Include support page
  - [ ] Include contact page

- [ ] **Add Meta Tags**
  - [ ] Title tags on all pages
  - [ ] Meta descriptions on all pages
  - [ ] Open Graph tags (for social sharing)
  - [ ] Twitter Card tags (optional)

- [ ] **Submit to Search Engines**
  - [ ] Google Search Console: https://search.google.com/search-console
  - [ ] Bing Webmaster Tools: https://www.bing.com/webmasters
  - [ ] Submit sitemap.xml

### 4.7 Analytics & Monitoring

- [ ] **Enable Cloudflare Analytics**
  - [ ] Log in to Cloudflare dashboard
  - [ ] Go to Analytics
  - [ ] View traffic statistics
  - [ ] Monitor uptime

- [ ] **Set Up Monitoring**
  - [ ] Use Cloudflare's built-in monitoring
  - [ ] Set up alerts for downtime
  - [ ] Monitor page load speed

### 4.8 Final Verification Before App Store Submission

- [ ] **Verify All URLs Exist**
  - [ ] `https://calmspace.app/privacy` returns 200 OK
  - [ ] `https://calmspace.app/terms` returns 200 OK
  - [ ] `https://calmspace.app/support` returns 200 OK
  - [ ] `https://calmspace.app/contact` returns 200 OK

- [ ] **Verify HTTPS**
  - [ ] All URLs use HTTPS
  - [ ] No mixed content warnings
  - [ ] SSL certificate is valid

- [ ] **Verify Content**
  - [ ] Privacy Policy is complete and accurate
  - [ ] Terms of Use is complete and accurate
  - [ ] All placeholders are replaced
  - [ ] Contact information is correct
  - [ ] Support information is helpful

- [ ] **Verify Accessibility**
  - [ ] All pages are mobile-responsive
  - [ ] All pages load in < 2 seconds
  - [ ] All links work
  - [ ] All forms work

---

## PART 5: PRE-TESTFLIGHT URL VERIFICATION CHECKLIST

### 5.1 Required URLs Before TestFlight Submission

**All of the following URLs MUST exist and be accessible before submitting to TestFlight:**

| URL | Purpose | Status | Required For |
|-----|---------|--------|--------------|
| `https://calmspace.app` | Home page | ✗ Not created | Both |
| `https://calmspace.app/privacy` | Privacy Policy | ✗ Not created | Both |
| `https://calmspace.app/terms` | Terms of Use | ✗ Not created | Both |
| `https://calmspace.app/support` | Support page | ✗ Not created | Optional |
| `https://calmspace.app/contact` | Contact page | ✗ Not created | Optional |
| `https://www.calmspace.app` | WWW redirect | ✗ Not created | Optional |

### 5.2 Content Requirements

#### Privacy Policy URL
- **URL:** `https://calmspace.app/privacy`
- **Content:** Full Privacy Policy text
- **Must Include:**
  - Data collection practices
  - Microphone permission usage
  - OpenAI API integration
  - AWS S3 audio streaming
  - Subscription information
  - Contact information
  - Last updated date
- **Status:** ✓ Content ready (in PRIVACY_POLICY.md)

#### Terms of Use URL
- **URL:** `https://calmspace.app/terms`
- **Content:** Full Terms of Use text
- **Must Include:**
  - License grant
  - Service description
  - Subscription terms
  - Refund policy
  - Disclaimer (not medical service)
  - Contact information
  - Last updated date
- **Status:** ✓ Content ready (in TERMS_OF_USE.md)

#### Support URL (Optional but Recommended)
- **URL:** `https://calmspace.app/support`
- **Content:** Support information
- **Should Include:**
  - Contact email
  - FAQ section
  - Common issues
  - Response time expectations
- **Status:** ✓ Can be created

#### Contact URL (Optional but Recommended)
- **URL:** `https://calmspace.app/contact`
- **Content:** Contact form
- **Should Include:**
  - Contact form
  - Email address
  - Response time expectations
- **Status:** ✓ Can be created

### 5.3 Technical Requirements

#### HTTPS/SSL
- [ ] All URLs must use HTTPS
- [ ] SSL certificate must be valid
- [ ] No mixed content warnings
- [ ] SSL Labs grade: A or A+

#### Performance
- [ ] All pages load in < 2 seconds
- [ ] Mobile responsive
- [ ] No broken links
- [ ] All forms work

#### Availability
- [ ] 99.9% uptime
- [ ] No 404 errors
- [ ] No 500 errors
- [ ] Accessible 24/7

### 5.4 App Store Submission URLs

#### Apple App Store Connect
**Where to add URLs:**
1. Log in to App Store Connect
2. Select your app
3. Go to "App Information"
4. Scroll to "License Agreement"
5. Add Privacy Policy URL
6. Add Terms of Use URL (if using custom)
7. Add Support Email

**Required Fields:**
- [ ] Privacy Policy URL: `https://calmspace.app/privacy`
- [ ] Terms of Use URL: `https://calmspace.app/terms` (or paste text)
- [ ] Support Email: `support@calmspace.com`

#### Google Play Console
**Where to add URLs:**
1. Log in to Google Play Console
2. Select your app
3. Go to "Store listing"
4. Scroll to "Policies"
5. Add Privacy Policy URL
6. Add Terms of Service URL
7. Add Support Email

**Required Fields:**
- [ ] Privacy Policy URL: `https://calmspace.app/privacy`
- [ ] Terms of Service URL: `https://calmspace.app/terms`
- [ ] Support Email: `support@calmspace.com`

### 5.5 Final Pre-TestFlight Checklist

**Before submitting to TestFlight, verify:**

- [ ] Domain registered: `calmspace.app`
- [ ] Domain transferred to Cloudflare
- [ ] Cloudflare Pages deployed
- [ ] HTTPS/SSL active
- [ ] Home page loads: `https://calmspace.app`
- [ ] Privacy page loads: `https://calmspace.app/privacy`
- [ ] Terms page loads: `https://calmspace.app/terms`
- [ ] Support page loads: `https://calmspace.app/support` (optional)
- [ ] Contact page loads: `https://calmspace.app/contact` (optional)
- [ ] All pages are mobile responsive
- [ ] All pages load in < 2 seconds
- [ ] All links work
- [ ] All forms work
- [ ] SSL certificate is valid (A or A+ grade)
- [ ] Privacy Policy content is complete
- [ ] Terms of Use content is complete
- [ ] All placeholders are replaced
- [ ] Contact information is correct
- [ ] URLs added to App Store Connect
- [ ] URLs added to Google Play Console
- [ ] Legal team has reviewed documents
- [ ] No 404 or 500 errors
- [ ] Website is accessible 24/7

---

## PART 6: ESTIMATED TIMELINE & COSTS

### 6.1 Timeline

| Task | Estimated Time |
|------|-----------------|
| Domain registration | 5 minutes |
| Cloudflare account setup | 5 minutes |
| Website file creation | 30-60 minutes |
| Content preparation | 15-30 minutes |
| GitHub setup | 5-10 minutes |
| Cloudflare Pages deployment | 5-10 minutes |
| DNS propagation | 5-30 minutes (up to 48 hours) |
| Testing & verification | 15-30 minutes |
| **Total** | **1.5-3 hours** |

### 6.2 Costs

| Item | Cost | Notes |
|------|------|-------|
| Domain (calmspace.app) | $12-15/year | One-time setup |
| Domain (calmspace.co backup) | $10-15/year | Optional |
| Hosting (Cloudflare Pages) | Free | Unlimited bandwidth |
| SSL/HTTPS | Free | Automatic |
| Email (support@calmspace.com) | Varies | Use existing email provider |
| **Total First Year** | **$22-30** | Very affordable |
| **Total Annual** | **$22-30** | Minimal ongoing cost |

### 6.3 Maintenance

**Ongoing maintenance required:**
- Update Privacy Policy if features change: 15 minutes
- Update Terms of Use if policies change: 15 minutes
- Monitor uptime: 5 minutes/month
- Respond to support emails: As needed

**Total monthly maintenance:** ~10-15 minutes

---

## SUMMARY & NEXT STEPS

### Recommended Configuration

| Item | Recommendation |
|------|-----------------|
| **Domain** | calmspace.app |
| **Hosting** | Cloudflare Pages |
| **Website Structure** | Static HTML (5 pages) |
| **SSL/HTTPS** | Automatic (Cloudflare) |
| **Deployment** | GitHub + Cloudflare Pages |
| **Estimated Setup Time** | 1.5-3 hours |
| **Estimated Cost** | $22-30/year |
| **Maintenance** | ~10-15 minutes/month |

### Immediate Action Items

1. **Check domain availability:** `calmspace.app`
2. **Create GitHub repository:** `calmspace-website`
3. **Create website files:** 5 HTML pages + CSS + JS
4. **Set up Cloudflare account:** Free tier
5. **Deploy website:** Connect GitHub to Cloudflare Pages
6. **Test all URLs:** Verify everything works
7. **Add to App Store Connect:** Add URLs to metadata
8. **Add to Google Play Console:** Add URLs to metadata

### Timeline to TestFlight

- **Day 1:** Register domain, set up Cloudflare
- **Day 1:** Create website files
- **Day 1:** Deploy to Cloudflare Pages
- **Day 1-2:** DNS propagation (up to 48 hours)
- **Day 2:** Verify all URLs work
- **Day 2:** Add URLs to App Store Connect and Google Play Console
- **Day 3:** Submit to TestFlight

**Total time to TestFlight:** 2-3 days

---

## APPENDIX: QUICK START GUIDE

### Step-by-Step Quick Start

1. **Register Domain**
   ```
   Go to: namecheap.com, godaddy.com, or google.com/domains
   Search: calmspace.app
   Register: $12-15/year
   ```

2. **Create Cloudflare Account**
   ```
   Go to: cloudflare.com
   Sign up: Free account
   Add domain: calmspace.app
   Update nameservers: Point to Cloudflare
   ```

3. **Create GitHub Repository**
   ```
   Go to: github.com
   Create new repo: calmspace-website
   Clone locally: git clone https://github.com/[username]/calmspace-website
   ```

4. **Create Website Files**
   ```
   Create: index.html, privacy/index.html, terms/index.html, etc.
   Add: css/style.css, js/script.js
   Commit: git add . && git commit -m "Initial website"
   Push: git push origin main
   ```

5. **Deploy to Cloudflare Pages**
   ```
   Go to: Cloudflare Dashboard → Pages
   Create project: Connect GitHub
   Select repo: calmspace-website
   Deploy: Automatic
   ```

6. **Configure Custom Domain**
   ```
   In Cloudflare Pages: Add custom domain
   Domain: calmspace.app
   Verify: DNS automatically configured
   ```

7. **Test**
   ```
   Visit: https://calmspace.app
   Verify: All pages load
   Check: HTTPS works
   ```

8. **Add to App Stores**
   ```
   App Store Connect: Add privacy policy URL
   Google Play Console: Add privacy policy URL
   ```

---

**End of Infrastructure Preparation Audit**

**Status:** Ready for Implementation  
**Date:** June 25, 2026  
**Next Phase:** Website Creation & Deployment
