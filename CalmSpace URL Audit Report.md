# CalmSpace URL Audit Report
## Complete Inventory of Legal & Support URL Locations

**Audit Date:** June 25, 2026  
**Project:** CalmSpace (React Native/Expo Mobile App)  
**Status:** Audit Complete - No Code Modifications Made

---

## Executive Summary

This audit identifies **all locations** in the CalmSpace project where the following URLs will eventually be required:

- **Privacy Policy URL** (e.g., `https://calmspace.com/privacy`)
- **Terms of Use URL** (e.g., `https://calmspace.com/terms`)
- **Support URL** (e.g., `https://calmspace.com/support`)
- **Contact Email** (e.g., `support@calmspace.com`)

**Total Locations Identified:** 18 locations across 5 categories

---

## 1. CONFIGURATION FILES

### 1.1 app.config.ts (Expo Configuration)

| File | Line | Current Value | Recommended Replacement | Required For | Status |
|------|------|---------------|------------------------|--------------|----|
| `app.config.ts` | 31 | `appName: "{{project_title}}"` | `appName: "CalmSpace"` | Both | ✓ Placeholder |
| `app.config.ts` | 32 | `appSlug: "calmspace"` | Keep as-is | Both | ✓ Fixed |
| `app.config.ts` | 35 | `logoUrl: ""` | S3 URL from logo generation | Both | ✓ Optional |

**Note:** app.config.ts does NOT currently contain Privacy/Terms/Support URLs. These should be added to the env object for centralized configuration.

**Recommended Addition to app.config.ts:**
```typescript
const env = {
  // ... existing config ...
  privacyPolicyUrl: "https://calmspace.com/privacy",
  termsOfUseUrl: "https://calmspace.com/terms",
  supportUrl: "https://calmspace.com/support",
  supportEmail: "support@calmspace.com",
};
```

---

## 2. LEGAL DOCUMENTS

### 2.1 PRIVACY_POLICY.md

| File | Line | Current Value | Recommended Replacement | Required For | Status |
|------|------|---------------|------------------------|--------------|----|
| `PRIVACY_POLICY.md` | 266 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |
| `PRIVACY_POLICY.md` | 267 | `[Company Address]` | Your company address | Both | ✓ Placeholder |
| `PRIVACY_POLICY.md` | 268 | `[www.calmspace.com]` | Your website URL | Both | ✓ Placeholder |
| `PRIVACY_POLICY.md` | 224 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |
| `PRIVACY_POLICY.md` | 234 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |
| `PRIVACY_POLICY.md` | 242 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |

**Document Status:** Publication-ready after placeholder replacement

**Hosting Requirements:**
- Host at: `https://[your-domain]/privacy`
- Must be accessible via HTTPS
- URL must never change (permanent link)
- Include in app store listings

### 2.2 TERMS_OF_USE.md

| File | Line | Current Value | Recommended Replacement | Required For | Status |
|------|------|---------------|------------------------|--------------|----|
| `TERMS_OF_USE.md` | 272 | `https://[your-domain]/privacy` | `https://calmspace.com/privacy` | Both | ✓ Placeholder |
| `TERMS_OF_USE.md` | 350 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |
| `TERMS_OF_USE.md` | 378 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |
| `TERMS_OF_USE.md` | 393 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |
| `TERMS_OF_USE.md` | 405 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |

**Additional Placeholders in TERMS_OF_USE.md (Section 18 - Contact Information):**
| File | Line | Current Value | Recommended Replacement | Required For | Status |
|------|------|---------------|------------------------|--------------|----|
| `TERMS_OF_USE.md` | 376 | `[Company Name]` | Your company name | Both | ✓ Placeholder |
| `TERMS_OF_USE.md` | 377 | `[support@calmspace.com]` | `support@calmspace.com` | Both | ✓ Placeholder |
| `TERMS_OF_USE.md` | 379 | `[www.calmspace.com]` | Your website URL | Both | ✓ Placeholder |

**Document Status:** Publication-ready after placeholder replacement

**Hosting Requirements:**
- Host at: `https://[your-domain]/terms`
- Must be accessible via HTTPS
- URL must never change (permanent link)
- Include in app store listings

---

## 3. APPLICATION SOURCE CODE

### 3.1 Settings Screen (app/(tabs)/settings.tsx)

| File | Line | Current Value | Recommended Replacement | Required For | Status |
|------|------|---------------|------------------------|--------------|----|
| `app/(tabs)/settings.tsx` | N/A | No legal links present | Add "Privacy Policy" link | Both | ✗ Missing |
| `app/(tabs)/settings.tsx` | N/A | No legal links present | Add "Terms of Use" link | Both | ✗ Missing |
| `app/(tabs)/settings.tsx` | N/A | No legal links present | Add "Contact Support" link | Both | ✗ Missing |

**Current State:**
- Settings screen displays: Theme, Language, Subscription, Disclaimer
- NO legal/support links currently present
- Disclaimer text exists but no clickable links to full policies

**Recommended Implementation:**
Add a new "Legal & Support" section at bottom of Settings screen with:
- "Privacy Policy" → Opens `privacyPolicyUrl` in browser
- "Terms of Use" → Opens `termsOfUseUrl` in browser
- "Contact Support" → Opens email or support URL

**Example Implementation:**
```tsx
{/* Legal & Support Section */}
<View className="gap-4 mb-8">
  <Text className="text-sm font-semibold text-muted uppercase">
    {t("settings.legal")}
  </Text>
  <Pressable onPress={() => Linking.openURL(privacyPolicyUrl)}>
    <Text className="text-foreground">{t("settings.privacy")}</Text>
  </Pressable>
  <Pressable onPress={() => Linking.openURL(termsOfUseUrl)}>
    <Text className="text-foreground">{t("settings.terms")}</Text>
  </Pressable>
  <Pressable onPress={() => Linking.openURL(`mailto:${supportEmail}`)}>
    <Text className="text-foreground">{t("settings.support")}</Text>
  </Pressable>
</View>
```

### 3.2 i18n.ts (Internationalization)

| File | Line | Current Value | Recommended Replacement | Required For | Status |
|------|------|---------------|------------------------|--------------|----|
| `lib/i18n.ts` | 162 | `'settings.support': 'Support'` | Already exists | Both | ✓ Exists |

**Current State:**
- Translation key `'settings.support'` exists in all 6 languages
- Currently NOT used in any screen
- Ready for UI implementation

**New Translation Keys Needed:**
```typescript
// English
'settings.legal': 'Legal & Support',
'settings.privacy': 'Privacy Policy',
'settings.terms': 'Terms of Use',
'settings.contact': 'Contact Support',

// Spanish
'settings.legal': 'Legal y Soporte',
'settings.privacy': 'Política de Privacidad',
'settings.terms': 'Términos de Uso',
'settings.contact': 'Contactar Soporte',

// German
'settings.legal': 'Rechtliches und Unterstützung',
'settings.privacy': 'Datenschutzrichtlinie',
'settings.terms': 'Nutzungsbedingungen',
'settings.contact': 'Support kontaktieren',

// French
'settings.legal': 'Juridique et Support',
'settings.privacy': 'Politique de Confidentialité',
'settings.terms': 'Conditions d\'Utilisation',
'settings.contact': 'Contacter le Support',

// Portuguese
'settings.legal': 'Legal e Suporte',
'settings.privacy': 'Política de Privacidade',
'settings.terms': 'Termos de Uso',
'settings.contact': 'Contatar Suporte',

// Japanese
'settings.legal': '法的情報とサポート',
'settings.privacy': 'プライバシーポリシー',
'settings.terms': '利用規約',
'settings.contact': 'サポートに連絡',
```

### 3.3 openai-context.tsx (Error Message)

| File | Line | Current Value | Recommended Replacement | Required For | Status |
|------|------|---------------|------------------------|--------------|----|
| `lib/openai-context.tsx` | 70 | `'OpenAI API key not configured. Please contact support.'` | Use support URL/email | Optional | ✓ Generic |

**Current State:**
- Generic error message when OpenAI API key is missing
- Suggests contacting support but doesn't provide link
- This is a development-time error, not user-facing

**Recommended Change:**
```typescript
setError(`OpenAI API key not configured. Please contact support at ${supportEmail}`);
```

---

## 4. THIRD-PARTY SERVICE INTEGRATIONS

### 4.1 OpenAI API Integration

| Service | URL | Current Value | Status | Required For |
|---------|-----|---------------|--------|--------------|
| OpenAI API | `https://api.openai.com/v1` | Hardcoded in lib/openai-service.ts | ✓ Fixed | Both |
| OpenAI Terms | https://openai.com/terms/ | Referenced in TERMS_OF_USE.md | ✓ Fixed | Both |
| OpenAI Privacy | https://openai.com/privacy/ | Referenced in TERMS_OF_USE.md | ✓ Fixed | Both |

**Status:** No changes needed - URLs are external and fixed

### 4.2 AWS S3 Audio Streaming

| Service | URL | Current Value | Status | Required For |
|---------|-----|---------------|--------|--------------|
| AWS S3 Bucket | `https://calmspace-audio.s3.us-east-1.amazonaws.com/` | Hardcoded in lib/_core/audio-manager.ts | ✓ Fixed | Both |
| AWS Privacy | https://aws.amazon.com/privacy/ | Referenced in TERMS_OF_USE.md | ✓ Fixed | Both |

**Status:** No changes needed - URLs are external and fixed

### 4.3 App Store Integrations

| Service | URL | Current Value | Status | Required For |
|---------|-----|---------------|--------|--------------|
| Apple App Store | https://www.apple.com/legal/internet-services/itunes/ | Referenced in TERMS_OF_USE.md | ✓ Fixed | iOS |
| Google Play Store | https://play.google.com/about/play-terms/ | Referenced in TERMS_OF_USE.md | ✓ Fixed | Android |

**Status:** No changes needed - URLs are external and fixed

---

## 5. APP STORE SUBMISSION REQUIREMENTS

### 5.1 Apple App Store Connect

**Required Configuration:**
| Field | Current Value | Required Value | Status |
|-------|---------------|-----------------|--------|
| Privacy Policy URL | Not set | `https://calmspace.com/privacy` | ✗ Missing |
| Terms of Use URL | Not set | `https://calmspace.com/terms` | ✗ Missing |
| Support Email | Not set | `support@calmspace.com` | ✗ Missing |
| Support URL | Not set | `https://calmspace.com/support` | ✗ Missing |

**Location in App Store Connect:**
1. Log in to App Store Connect
2. Select your app
3. Go to "App Information"
4. Scroll to "License Agreement"
5. Select "Custom"
6. Paste Terms of Use text OR provide URL
7. Add Privacy Policy URL in "Privacy Policy" field
8. Save and submit

### 5.2 Google Play Console

**Required Configuration:**
| Field | Current Value | Required Value | Status |
|-------|---------------|-----------------|--------|
| Privacy Policy URL | Not set | `https://calmspace.com/privacy` | ✗ Missing |
| Terms of Service URL | Not set | `https://calmspace.com/terms` | ✗ Missing |
| Support Email | Not set | `support@calmspace.com` | ✗ Missing |

**Location in Google Play Console:**
1. Log in to Google Play Console
2. Select your app
3. Go to "Store listing"
4. Scroll to "Policies"
5. Add Privacy Policy URL
6. Add Terms of Service URL
7. Add Support Email
8. Save and submit

---

## SUMMARY TABLE: All Required URLs

| URL Type | Placeholder | Recommended Value | Required For | Hosting | Status |
|----------|-------------|-------------------|--------------|---------|--------|
| Privacy Policy | `[www.calmspace.com]/privacy` | `https://calmspace.com/privacy` | Both | Website | ✗ Needed |
| Terms of Use | `[www.calmspace.com]/terms` | `https://calmspace.com/terms` | Both | Website | ✗ Needed |
| Support | `[www.calmspace.com]/support` | `https://calmspace.com/support` | Optional | Website | ✗ Needed |
| Support Email | `[support@calmspace.com]` | `support@calmspace.com` | Both | Email | ✗ Needed |
| Company Website | `[www.calmspace.com]` | `https://calmspace.com` | Optional | Website | ✗ Needed |
| Company Address | `[Company Address]` | Your address | Both | Legal | ✗ Needed |
| Company Name | `[Company Name]` | Your company name | Both | Legal | ✗ Needed |

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Prepare Infrastructure
- [ ] Register domain (e.g., calmspace.com)
- [ ] Set up HTTPS certificate
- [ ] Create website with legal pages
- [ ] Host Privacy Policy at `https://calmspace.com/privacy`
- [ ] Host Terms of Use at `https://calmspace.com/terms`
- [ ] Create support page at `https://calmspace.com/support`
- [ ] Set up support email (support@calmspace.com)

### Phase 2: Update Legal Documents
- [ ] Replace `[Company Name]` in PRIVACY_POLICY.md
- [ ] Replace `[Company Name]` in TERMS_OF_USE.md
- [ ] Replace `[support@calmspace.com]` in both documents
- [ ] Replace `[Company Address]` in both documents
- [ ] Replace `[www.calmspace.com]` in both documents
- [ ] Have legal team review documents
- [ ] Verify compliance with local laws

### Phase 3: Update Application Code
- [ ] Add URL constants to app.config.ts
- [ ] Add new translation keys to lib/i18n.ts (all 6 languages)
- [ ] Add Legal & Support section to Settings screen
- [ ] Implement links to Privacy Policy
- [ ] Implement links to Terms of Use
- [ ] Implement link to Support
- [ ] Test all links on iOS and Android
- [ ] Test all links on web

### Phase 4: Configure App Stores
- [ ] Add Privacy Policy URL to Apple App Store Connect
- [ ] Add Terms of Use URL to Apple App Store Connect
- [ ] Add Support Email to Apple App Store Connect
- [ ] Add Privacy Policy URL to Google Play Console
- [ ] Add Terms of Service URL to Google Play Console
- [ ] Add Support Email to Google Play Console
- [ ] Verify all URLs are accessible
- [ ] Verify all URLs match the app

### Phase 5: Final Verification
- [ ] All URLs are HTTPS
- [ ] All URLs are permanent (will not change)
- [ ] All URLs are accessible
- [ ] All documents are complete
- [ ] All placeholders are replaced
- [ ] All links work in app
- [ ] All links work in app stores
- [ ] Legal team approval obtained

---

## NO CODE MODIFICATIONS MADE

This audit is **read-only**. No code has been modified. All findings are documented for future implementation.

**Audit Performed By:** Manus AI Agent  
**Audit Date:** June 25, 2026  
**Status:** Complete

