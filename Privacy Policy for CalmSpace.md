# Privacy Policy for Relaxess

**Effective Date:** June 25, 2026  
**Last Updated:** June 25, 2026

---

## 1. Introduction

Relaxess ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, Relaxess (the "Application").

Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Application.

---

## 2. Information We Collect

### 2.1 Information You Provide Directly

**Chat Messages and Voice Input**
- When you use the Session or Sleep Mode features, you may provide text or voice input to communicate with our AI assistant.
- Voice input is temporarily processed for transcription purposes.
- Chat messages are sent to OpenAI's API for processing and response generation.
- We do not store your chat messages on our servers. Messages are processed in real-time and then discarded.

**Microphone Permission**
- To use voice input features, we request access to your device's microphone.
- Voice data is only used for transcription and is not stored after processing.
- You can revoke microphone permission at any time through your device settings.

**Premium Subscription Information**
- When you purchase a Premium subscription, payment information is processed through Apple App Store (iOS) or Google Play (Android).
- We do not store credit card or payment information.
- Your subscription status is stored locally on your device.

### 2.2 Information Automatically Collected

**Local Device Storage (AsyncStorage)**
- We store the following information locally on your device:
  - Your selected language preference
  - Your selected theme (light/dark mode)
  - Your premium subscription status
  - Premium subscription expiration date
  - Audio playback preferences

**Device Information**
- We may collect information about your device type, operating system version, and app version for troubleshooting and analytics purposes.

**Audio Streaming**
- When you stream audio from our AWS S3 bucket (Music, Forest, Rain sounds), your device connects directly to AWS S3.
- AWS may collect standard web server logs including IP address and access time.
- We do not store information about which audio tracks you listen to.

---

## 3. How We Use Your Information

### 3.1 Primary Uses

**AI Conversation Processing**
- Your chat messages and voice input are sent to OpenAI's API to generate responses.
- OpenAI processes this data according to their privacy policy.
- We use this information solely to provide the AI-powered conversation feature.

**Premium Subscription Management**
- We track your premium subscription status to enable premium features.
- Subscription information is stored locally on your device.

**Audio Streaming**
- We provide direct links to audio files stored on AWS S3.
- Audio streaming is used to deliver Quiet Relaxation audio content.

**Application Functionality**
- We use locally stored preferences to personalize your experience.
- Language and theme preferences are used to display the app in your chosen language and theme.

### 3.2 Secondary Uses

**Troubleshooting and Support**
- We may use device information to troubleshoot technical issues.
- Error messages may be logged to help us improve the application.

**Analytics and Improvement**
- We may collect anonymized usage data to understand how users interact with the application.
- This data helps us improve features and fix bugs.

---

## 4. Third-Party Services

### 4.1 OpenAI API

**Purpose:** Provides AI-powered conversation responses

**Data Shared:** Your chat messages and voice transcriptions

**Privacy Policy:** https://openai.com/privacy/

**Data Retention:** OpenAI retains data according to their privacy policy. Please review OpenAI's privacy policy for details.

### 4.2 AWS S3

**Purpose:** Hosts audio files for Quiet Relaxation feature

**Data Shared:** Your device's IP address and access logs

**Privacy Policy:** https://aws.amazon.com/privacy/

**Data Retention:** AWS retains standard web server logs according to their privacy policy.

### 4.3 Apple App Store / Google Play

**Purpose:** Processes premium subscription payments

**Data Shared:** Your subscription status and payment information (processed by Apple/Google, not by us)

**Privacy Policy:** 
- Apple: https://www.apple.com/privacy/
- Google: https://policies.google.com/privacy

**Data Retention:** Apple and Google retain subscription information according to their policies.

---

## 5. Data We Do NOT Collect

**What We Do NOT Do:**
- ❌ We do NOT sell your personal data
- ❌ We do NOT use advertising SDKs or ad networks
- ❌ We do NOT use tracking SDKs (Google Analytics, Mixpanel, etc.)
- ❌ We do NOT use social media trackers
- ❌ We do NOT share your data with third parties for marketing
- ❌ We do NOT store your chat messages on our servers
- ❌ We do NOT store your voice recordings
- ❌ We do NOT track which audio tracks you listen to
- ❌ We do NOT collect location data
- ❌ We do NOT collect contact information
- ❌ We do NOT collect health information beyond what you voluntarily share in chat

---

## 6. Data Security

### 6.1 Local Storage Security

All data stored locally on your device (preferences, subscription status, theme) is stored using AsyncStorage, which uses the device's native secure storage mechanisms:
- **iOS:** Keychain (encrypted)
- **Android:** SharedPreferences (encrypted on Android 6.0+)

### 6.2 Data in Transit

- Chat messages sent to OpenAI are encrypted in transit using HTTPS/TLS.
- Audio streams from AWS S3 are encrypted in transit using HTTPS/TLS.
- All API communications use industry-standard encryption.

### 6.3 Server-Side Security

- We do not store user data on servers.
- All processing happens in real-time and data is discarded after use.
- OpenAI and AWS maintain their own security practices. Please review their privacy policies.

---

## 7. Data Retention

### 7.1 Chat Messages

- Chat messages are NOT stored on our servers.
- Messages are processed in real-time by OpenAI and then discarded.
- OpenAI may retain messages according to their privacy policy (please review https://openai.com/privacy/).

### 7.2 Voice Recordings

- Voice recordings are NOT stored on our servers.
- Recordings are transcribed in real-time and then discarded.
- OpenAI may retain transcriptions according to their privacy policy.

### 7.3 Local Device Data

- Data stored locally on your device (preferences, subscription status) remains until:
  - You delete the application
  - You clear the app's data through device settings
  - You manually reset preferences in the app

### 7.4 Audio Access Logs

- AWS S3 may retain standard web server logs for up to 90 days.
- These logs are not associated with your identity.

---

## 8. Your Privacy Rights

### 8.1 Access Your Data

You have the right to access the personal data we hold about you. Since we store data locally on your device, you can access this data by:
- Reviewing your preferences in the Settings screen
- Checking your device's app storage settings

### 8.2 Delete Your Data

You can delete all data we store by:
- Uninstalling the application
- Clearing the app's data through your device settings
- Resetting preferences in the app's Settings screen

### 8.3 Opt-Out of Data Collection

Since we do not use advertising or tracking SDKs, there is no opt-out mechanism needed. However, you can:
- Disable microphone permission to prevent voice input
- Disable network access to prevent audio streaming
- Use Do Not Track settings on your device

### 8.4 Your Rights Under GDPR (EU Users)

If you are located in the European Union, you have additional rights under the General Data Protection Regulation (GDPR):
- **Right to Access:** Request a copy of your personal data
- **Right to Rectification:** Correct inaccurate data
- **Right to Erasure:** Request deletion of your data
- **Right to Restrict Processing:** Limit how we use your data
- **Right to Data Portability:** Receive your data in a portable format
- **Right to Object:** Object to processing of your data

To exercise these rights, contact us at: support@relaxess.com

### 8.5 Your Rights Under CCPA (California Users)

If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
- **Right to Know:** Request what personal data we collect
- **Right to Delete:** Request deletion of your data
- **Right to Opt-Out:** Opt out of data sales (we do not sell data)
- **Right to Non-Discrimination:** We do not discriminate based on privacy choices

To exercise these rights, contact us at: support@relaxess.com

---

## 9. Children's Privacy

Relaxess is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will delete such information immediately.

If you are a parent or guardian and believe your child has provided information to Relaxess, please contact us immediately at: support@relaxess.com

---

## 10. International Data Transfers

Your information may be transferred to, stored in, and processed in countries other than your country of residence, including the United States. These countries may have data protection laws that differ from your home country.

By using Relaxess, you consent to the transfer of your information to countries outside your country of residence, which may have different data protection rules.

---

## 11. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this Privacy Policy.

Your continued use of Relaxess after any changes constitutes your acceptance of the updated Privacy Policy.

---

## 12. Contact Us

If you have questions about this Privacy Policy or our privacy practices, please contact us at:

**Email:** support@relaxess.com  
**Mailing Address:** [Company Address]  
**Website:** https://relaxess.app

We will respond to your inquiry within 30 days.

---

## 13. App Store Compliance

### 13.1 Apple App Store Requirements

This Privacy Policy complies with Apple's App Store Review Guidelines:
- ✓ Clearly describes data collection practices
- ✓ Explains use of microphone permission
- ✓ Describes third-party services (OpenAI, AWS)
- ✓ Explains subscription information
- ✓ Provides contact information
- ✓ Explains user rights and data deletion

### 13.2 Google Play Requirements

This Privacy Policy complies with Google Play's Developer Program Policies:
- ✓ Clearly describes data collection practices
- ✓ Explains use of microphone permission
- ✓ Describes third-party services
- ✓ Explains subscription information
- ✓ Provides contact information
- ✓ Explains user rights and data deletion

---

## 14. Summary of Data Practices

| Data Type | Collected | Stored | Shared | Deleted |
|-----------|-----------|--------|--------|---------|
| Chat Messages | Yes | No (OpenAI) | OpenAI | Real-time |
| Voice Recordings | Yes | No (OpenAI) | OpenAI | Real-time |
| Subscription Status | Yes | Local Device | Apple/Google | On uninstall |
| Language Preference | Yes | Local Device | No | On uninstall |
| Theme Preference | Yes | Local Device | No | On uninstall |
| Audio Preferences | Yes | Local Device | No | On uninstall |
| Device Information | Limited | No | No | N/A |
| IP Address | Yes | AWS Logs | AWS | 90 days |
| Payment Information | No | No | Apple/Google | N/A |
| Location Data | No | No | No | N/A |
| Health Data | No | No | No | N/A |

---

## 15. Disclaimer

This Privacy Policy is provided as-is. Relaxess is not a medical service and does not provide medical advice. Any health-related information you share in the application is for personal wellness purposes only and should not be considered medical advice.

Please consult with a healthcare professional for medical concerns.

---

**End of Privacy Policy**

---

## Implementation Notes for App Store/Play Store Submission

### Required Actions Before Submission:

1. **Replace Placeholder Contact Information:**
   - Support email configured: support@relaxess.com
   - Replace `[Company Address]` with actual company address
   - Website URL configured: https://relaxess.app

2. **Host Privacy Policy Online:**
   - Upload this Privacy Policy to your website
   - Ensure it's accessible at a permanent URL (e.g., https://relaxess.app/privacy)
   - Add this URL to `app.config.ts` in the app configuration

3. **Add to App Store Metadata:**
   - Add privacy policy URL to Apple App Store Connect
   - Add privacy policy URL to Google Play Console
   - Ensure URL is accessible and matches the policy in the app

4. **Review and Customize:**
   - Review all sections for accuracy
   - Ensure all features mentioned are currently implemented
   - Customize for your specific company and contact information
   - Have legal review if required by your organization

5. **Maintain Compliance:**
   - Update Privacy Policy if you add new features
   - Update if you change data practices
   - Update if you add new third-party services
   - Notify users of significant changes

---

**Privacy Policy Status:** Ready for App Store and Google Play submission (after placeholder replacement and legal review)
