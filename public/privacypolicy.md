# Privacy Policy

**Last updated:** 25 July 2026

Dayzi ("**Dayzi**", "**we**", "**us**", "**our**") is a social events application
that helps people discover, create, and join local events. Dayzi is owned and
operated by **Solika Ventures Pvt Ltd**, a company incorporated in India, which
is the **data controller** (and, where applicable, the "data fiduciary" or
"business") responsible for your personal data.

This Privacy Policy explains what personal data we process, why we process it,
the legal bases we rely on, how long we keep it, who we share it with, how we
protect it, and the rights available to you. It applies to:

- the **Dayzi mobile application** (the "**App**"); and
- the **Dayzi website** at **dayzi.live** (the "**Site**"), including our
  waitlist / early-registration sign-up.

We process your personal data only where we have a valid legal basis to do so.
Some processing is necessary to provide Dayzi under our Terms; some is based on
your consent; some is required by law; and some is based on our legitimate
interests, such as keeping Dayzi safe and preventing abuse. **Where we rely on
your consent, we will ask for it separately, and you may withdraw it at any time
through the App settings or by contacting us — this is as easy as giving it, and
does not affect processing already carried out before withdrawal.** For our full
lawful-basis model, see Section 2.

If you do not agree with this policy, please do not use Dayzi.

---

## 1. Information We Collect

Mandatory fields are those required to create and operate your account (marked
**required** below). All other fields are **optional** and are provided at your
choice; you can add, change, or remove them at any time from your profile.

### 1.1 Information You Provide
- **Account information (required):** first name, last name, email address,
  password (stored only as a secure hash), age / date of birth (used for age
  verification and the nearby-events age range), username
- **Account information (optional):** gender
- **Profile information (optional):** profile photo, bio ("about me"), favourite
  song, favourite show, user vibes, profile prompts
- **Event information:** event title, description, category, general location /
  area, date/time, cover image (provided when you create or edit an event)
- **Communications:** messages sent in event group chats, event join requests,
  and support or grievance requests you send to us
- **Preferences:** interests, privacy and visibility settings, notification
  preferences, theme preference
- **Face / identity verification (optional):** if you choose to complete face
  verification, we process a selfie image (with a gesture for liveness) to
  confirm you are a real, unique person (see Section 3.4)

### 1.2 Information Collected Automatically
- **Device and connection information:** device type, operating system version,
  app version, IP address, and general network information
- **Approximate location:** city and country, and the source used to derive it
  (device location services, where you grant permission, or a city you select
  manually). We do **not** collect or store precise GPS coordinates continuously
  or in the background (see Section 5)
- **Usage data:** events viewed, joined, and created; app interactions; session
  duration
- **Logs and security events:** authentication events, access logs, rate-limit
  and abuse-prevention signals, and other security telemetry
- **Moderation results:** the outcome of automated content moderation (for
  example, whether an image or text was flagged), and verification status
  including limited records of failed verification attempts (see Section 3)
- **Push notification tokens:** Firebase Cloud Messaging (FCM) device tokens
  used to deliver push notifications
- **Crash and performance data:** app crash logs and performance metrics (via
  Firebase Crashlytics)
- **Analytics data:** app usage patterns (via Firebase Analytics). The
  dayzi.live website does not currently use product analytics.

### 1.3 Information From Third Parties
- If you sign in using a third-party service (e.g., **Google** or **Apple**), we
  receive basic profile information you authorise, including the authentication
  provider's user identifier and, where you permit it, your name and email.

### 1.4 Information We Deliberately Do **Not** Collect or Store

We follow a data-minimisation approach. In particular:

- **Phone numbers:** Dayzi does **not** collect or store your phone number, and
  does not require one to use the service.
- **SOS / emergency contact number:** the App includes an optional **SOS safety
  feature**. If you choose to use it, you enter an emergency contact number (for
  example, a parent's or trusted person's number). **This number is stored only
  locally on your own device and is never transmitted to, or stored on, our
  servers.** When you trigger SOS, the App opens WhatsApp on your device so that
  *you* can send your message and location to that contact directly. We do not
  receive, process, or retain the emergency contact number, the SOS message, or
  the location shared through it. Because this exchange happens through WhatsApp,
  WhatsApp's own privacy policy applies to it (see also Section 5 and the Terms).
- **Precise, continuous GPS location:** see Section 5.
- **Payment card details:** Dayzi does not currently take payments and does not
  collect card or bank details through the App or Site.
- **Special-category data by inference:** we do not use automated systems to
  infer sensitive attributes such as religion, political views, sexual
  orientation, caste, health, or ethnicity (see Section 3.6).

---

## 2. How We Use Your Information and Our Legal Bases

We use your personal data only for the purposes below, and only where a lawful
basis applies. **We do not sell your personal data, and we do not use it for
third-party advertising or cross-context behavioural advertising.**

| Purpose | Data used | Legal basis (GDPR / equivalent) |
|---|---|---|
| Create and operate your account; authenticate you | Account information, auth provider ID, device/logs | Performance of our contract with you |
| Display your profile and enable event creation, discovery, join requests, and group chats | Profile, event, communications, approximate location | Performance of our contract with you |
| Show relevant nearby events within your chosen age range | Approximate location, age, interests | Performance of contract / legitimate interests |
| Keep Dayzi safe: detect and prevent abuse, spam, fake events, fraud, and inappropriate content | Content, moderation results, logs, verification status | Legitimate interests; compliance with legal obligations |
| Confirm you are a real, unique person (face verification) | Selfie + profile photo, verification status | **Explicit consent** (special-category / biometric data) |
| Generate an optional AI event description at your request | Event details you provide | Consent (optional feature you trigger) |
| Send transactional notifications (event updates, requests, approvals) | Account info, FCM token | Performance of contract |
| Send promotional / broadcast messages and waitlist updates | Email, FCM token, waitlist metadata | Consent (withdrawable at any time) |
| Diagnose crashes, measure performance, and improve Dayzi | Crash, performance, and analytics data | Legitimate interests |
| Comply with law; respond to legal requests; establish or defend legal claims | Relevant account and safety data | Compliance with legal obligations; legitimate interests |

Where we rely on **legitimate interests**, we balance those interests against
your rights and freedoms, and you may object at any time (see Section 8). Where
we rely on **consent**, you may withdraw it at any time without affecting the
lawfulness of processing before withdrawal.

---

## 3. AI, Content Moderation, and Automated Processing

To keep Dayzi safe we use automated tools. These tools assist our safety
decisions; they can make mistakes, and — except where the law allows automated
enforcement — they do not by themselves permanently suspend or terminate your
account without the possibility of human review (see Section 3.6).

### 3.1 Image Moderation
Uploaded images (profile photos, event cover images) are analysed by
**SightEngine** to detect inappropriate content (for example, nudity or
violence). Images flagged as inappropriate may be automatically blocked or
removed. You may appeal an image decision (see Section 3.6).

### 3.2 Text Moderation
Event names, descriptions, and other text may be analysed by **Google Gemini API
(via Google Cloud)** to detect offensive, hateful, or inappropriate language.

### 3.3 Optional AI-Generated Descriptions
We offer an **optional** feature that uses **Google Gemini API (via Google
Cloud)** to generate an event description from details you provide. This runs
only when you choose to use it.

### 3.4 Face Verification and Biometric Processing
Face verification is **optional** and is used only to confirm that you are a
real, unique person and to reduce fake accounts. It is **not** a background
check and is **not** a guarantee of anyone's identity, character, or safety.

- **Explicit consent:** because a facial image used to identify a person is
  special-category / biometric data, we ask for your **explicit consent** before
  processing your selfie and profile photo for identity/liveness verification.
- **What happens to your selfie:** your selfie is sent to **Google Gemini API
  (via Google Cloud)** for the comparison and is **not stored by Dayzi after the
  check**. We retain only your **verification status** (pass/fail), the
  **verification date**, and **limited audit logs** of attempts for security and
  abuse prevention.
- **No secondary use:** we do not use face-verification data for advertising,
  profiling, or any unrelated purpose.
- **Effect of refusal:** verification is optional; declining it does not block
  general use of Dayzi, though it may limit specific trust-and-safety features.
- **Human review:** if verification fails, you may contact us to request review
  by a person (see Section 3.6). You may also ask us to delete your verification
  status, unless we need to retain it for safety, fraud-prevention, or legal
  reasons.

### 3.5 AI Vendor Data Terms
We use **Google Gemini API as a paid service through a Google Cloud project**.
Under Google's paid API terms, Google does not use submitted prompts, images, or
responses to train or improve its products, and processes such data under its
applicable Data Processing Addendum. We do not use unpaid Gemini services for
moderation, description generation, or face verification. **SightEngine**
processes images under its data-processing terms and does not use your images to
train models for its own purposes.

### 3.6 Human Review, Appeals, and No Sensitive Inference
If your content is removed, restricted, or flagged, or if verification fails,
you may request **human review** by contacting **dayzibusiness@gmail.com**. We
will review the decision and respond within a reasonable period. Automated
moderation assists our safety decisions but does not make final,
irreversible account decisions without the possibility of review. **We do not
use AI moderation to infer sensitive attributes such as religion, political
views, sexual orientation, caste, health, or ethnicity.**

---

## 4. How We Share Information

We do **not** sell your personal data. We share information only as described
below, and our service providers act under written contracts, data-processing
agreements, and confidentiality and security obligations — not merely under
their own privacy policies.

### 4.1 Other Users
- Your public profile (name, username, photo, vibes, prompts) is visible to
  other users, subject to your visibility settings (see Section 5).
- Events you attend may be visible to other attendees (unless you disable "Show
  Attending Events" in Privacy Settings).
- Your messages in an event group chat are visible to other members of that
  group.

### 4.2 Service Providers (Sub-processors)

| Provider | Role | Location | Transfer safeguard |
|---|---|---|---|
| **Google Firebase** (Google Cloud Platform) | Authentication, database (Firestore), storage, cloud functions, push (FCM), analytics, crash reporting, App Check | USA / global | Google Cloud Data Processing Addendum + Standard Contractual Clauses |
| **Google Gemini API** (via Google Cloud) | Text moderation, optional description generation, face verification | USA / global | Google Cloud DPA (paid tier) + Standard Contractual Clauses |
| **SightEngine** | Image content moderation | EU | DPA; EU processing |
| **Cloudflare R2** | Event-data caching / CDN | Global | DPA + Standard Contractual Clauses |
| **Vercel** | Hosting of the dayzi.live website | USA / global | DPA + Standard Contractual Clauses |
| **EmailOctopus** | Waitlist / early-registration email management | UK / EU | DPA; UK/EU safeguards |

### 4.3 Legal, Safety, and Government Requests
We may disclose your data where required by a valid and legally binding request
(such as a court order or lawful government request), or where reasonably
necessary to protect the rights, safety, or property of Dayzi, our users, or the
public. We disclose to law enforcement only where the request is legally valid.

### 4.4 Business Transfers
If Dayzi is involved in a merger, acquisition, financing, reorganisation, or sale
of assets, your personal data may be transferred as part of that transaction. We
will require the recipient to honour this Privacy Policy or notify you of any
material change.

### 4.5 Professional Advisers
We may share data with our professional advisers (such as lawyers, auditors,
insurers, and accountants) where necessary for their services, subject to
confidentiality obligations.

---

## 5. Visibility, Location, and Privacy Controls

Dayzi is social by design, so privacy-by-default matters.

- **Visibility controls:** your name, username, profile photo, vibes, and
  prompts may be visible to other users. You can manage certain visibility
  settings in Privacy Settings, including whether events you attend are shown on
  your profile. We recommend reviewing these settings before joining or creating
  events.
- **Nearby events and age range:** events you create can be shown to nearby users
  within the age range you set, and you can see and request to join events
  created by nearby users within their range. Joining is by request: the creator
  chooses whether to accept or decline, and accepted members form the event
  group.
- **Location:** with your permission, we may access your device location to
  estimate your **city and country** for showing nearby events. We do **not**
  track your location continuously or in the background. You may disable location
  access in your device settings or, where available, set your city manually. If
  precise location is accessed only momentarily to derive your city/country, we
  do not store the precise coordinates unless expressly stated at the point of
  collection.
- **SOS / emergency contact:** as described in Section 1.4, any emergency contact
  number you add for the SOS feature stays **only on your device** and is never
  sent to us. Triggering SOS opens WhatsApp so you can share your message and
  location with your chosen contact directly.

---

## 6. International Data Transfers

Your personal data may be stored and processed in **India, the United States, the
European Union / EEA, the United Kingdom, and other countries** where we or our
service providers operate. Data stored on Firebase (Google Cloud) is primarily
hosted in the United States.

- **Where GDPR / UK GDPR applies**, we rely on appropriate safeguards for
  transfers outside the EEA/UK, such as **adequacy decisions**, **Standard
  Contractual Clauses**, **data-processing agreements**, and **transfer impact
  assessments** where required.
- **Where India's DPDP Act applies**, we will comply with any Government-notified
  restrictions on the transfer of personal data outside India.
- **Where Singapore's PDPA applies**, we transfer personal data overseas only
  where the recipient is bound by legally enforceable obligations to provide a
  comparable standard of protection.

The specific safeguard for each major provider is shown in the table in
Section 4.2.

---

## 7. Data Retention

We keep personal data only for as long as necessary for the purposes described in
this policy, or as required by law. The following periods are indicative and may
be extended where retention is required for legal, security, fraud-prevention,
dispute-resolution, or safety reasons.

| Data category | Retention period |
|---|---|
| Account profile | Until account deletion, then deleted or anonymised within 30 days |
| Selfie for face verification | Not stored after verification |
| Verification status | Until account deletion, or longer if needed for abuse-prevention / legal records (up to 2 years) |
| Chat messages | Until event/group deletion or account deletion, subject to safety/legal retention |
| Event data | Until event deletion or account deletion, unless retained for audit/safety/legal reasons |
| Crash logs | Up to 180 days |
| Analytics | Up to 26 months; aggregated/anonymised data may be kept longer |
| Waitlist email | Until you unsubscribe or the waitlist campaign ends |
| FCM tokens | Until logout, token refresh, or account deletion |
| Legal / safety / moderation logs | 180 days to 2 years, depending on risk and legal need |

**Backups.** Deleted data may remain in encrypted backups for up to **90 days**
before automatic deletion. It will not be restored except for disaster recovery
or legal/security purposes.

**Account deletion.** When you delete your account, we delete or anonymise the
personal data associated with it within **30 days**, unless retention is required
for legal, security, fraud-prevention, dispute-resolution, or safety reasons.
Content you shared with other users — such as group messages or event
participation records — may remain visible where necessary for event history,
safety, or integrity, but will no longer identify you where reasonably possible.
During the 30-day grace period you can restore your account by logging back in.

---

## 8. Your Rights and Choices

Subject to applicable law, you have rights over your personal data. To exercise
any right, contact **dayzibusiness@gmail.com** or use the in-App controls. We may
need to verify your identity before acting, and we may decline requests that are
manifestly unfounded, excessive, or that would infringe others' rights. We aim to
respond within **30 days** and will tell you if we need longer, up to the maximum
period the law allows.

### 8.1 Rights Available to Most Users
- **Access & portability:** view your data in the App and export a copy in JSON
  from **Privacy Settings → Download My Data**.
- **Correction:** update your profile at any time from **Edit Profile**.
- **Deletion (erasure):** delete your account and associated data from **Privacy
  Settings → Delete Account** (see our [Delete Account](/deleteaccount.html)
  page).
- **Withdraw consent:** disable optional features, turn off push notifications in
  device settings, unsubscribe from promotional messages, or withdraw
  face-verification consent — without affecting earlier lawful processing.
- **Manage visibility:** hide your attending events and manage other visibility
  settings in Privacy Settings.

### 8.2 EU / EEA and UK (GDPR and UK GDPR)
If you are in the EU/EEA or UK, you also have the right to: **object** to
processing based on legitimate interests; **restrict** processing; **not be
subject** to a decision based solely on automated processing that produces legal
or similarly significant effects without human involvement; and **lodge a
complaint** with your local supervisory authority (for example, your national
Data Protection Authority, or the UK ICO). If and where we are required to
appoint a representative in the EU/EEA or UK under Article 27 of the GDPR or UK
GDPR, we will appoint one and publish their contact details in this policy. In
the meantime, you can contact us about any GDPR matter at
**dayzibusiness@gmail.com**.

### 8.3 United States (California and Other States)
If you are a California resident, and where the CCPA/CPRA applies to us, you have
the right to **know** the categories and specific pieces of personal information
we collect, the purposes, and the categories of recipients; to **delete** and
**correct** your information; to **opt out** of any "sale" or "sharing" for
cross-context behavioural advertising; to **limit** the use of sensitive personal
information; and **not to be discriminated against** for exercising these rights.
**We do not sell or share your personal information for cross-context behavioural
advertising, and we do not use sensitive personal information to infer
characteristics.** Residents of other US states with comparable privacy laws
(for example, Virginia, Colorado, Connecticut, Texas, and Utah) may have similar
rights, which we will honour where they apply to us. To exercise these rights,
contact **dayzibusiness@gmail.com**.

### 8.4 Singapore (PDPA)
If you are in Singapore, we handle your personal data in line with the Personal
Data Protection Act. You may **withdraw consent**, and **access and correct**
your personal data, by contacting us. We will respond within the timeframes
required by the PDPA and may charge a reasonable fee for access requests where
permitted. We transfer personal data outside Singapore only with comparable
protection in place (see Section 6), and we will notify you and the Personal Data
Protection Commission of any notifiable data breach as required by law. Our Data
Protection Officer can be reached at **dayzibusiness@gmail.com**.

### 8.5 India (DPDP Act, 2023)
If you are in India, you have the right to **access** information about your
personal data, to **correct and erase** it, to **grievance redressal**, and to
**nominate** another individual to exercise your rights in the event of your
death or incapacity. To submit or update a nomination, or to raise a grievance,
contact our Grievance Officer (see Section 15). We will acknowledge grievances
within **48 hours** and aim to resolve them within **30 days**; certain rights
requests may take up to the period allowed under the DPDP Rules.

---

## 9. Data Security

We implement appropriate technical and organisational measures to protect your
data, including:

- Encryption in transit (TLS/SSL) and at rest
- Firebase App Check to verify app integrity, and Firebase Authentication for
  secure account access
- **Least-privilege access controls** and **logging of staff/administrative
  access** to personal data
- **Periodic access reviews** and **vendor security reviews** of our
  sub-processors
- An **incident-response process** for suspected security events
- Rate limiting on sensitive operations, and controlled deletion processes
- Encrypted backups with defined retention (see Section 7)

No system is 100% secure. Please keep your login credentials confidential.

---

## 10. Data Breach Notification

If we become aware of a personal data breach affecting your personal data, we
will notify affected users and the relevant authorities where required by
applicable law (including under the GDPR, India's DPDP Rules, and Singapore's
PDPA). The notice will describe, in plain language, the nature of the breach, its
likely consequences, the measures we have taken or propose to take, and how you
can contact us for assistance.

---

## 11. Children's Privacy

Dayzi is intended only for users aged **18 and above**. We do not knowingly
collect personal data from anyone under 18. We may ask you to confirm your age at
sign-up, and we may **suspend or delete** any account where we reasonably believe
the user is under 18. Because our AI provider's API terms require that the
service not be directed to, or likely to be accessed by, individuals under 18, we
enforce our 18+ requirement strictly. If you believe a minor is using Dayzi,
contact us at **dayzibusiness@gmail.com**.

---

## 12. Push Notifications

- **Transactional notifications** (event invitations, approvals, cancellations,
  request updates) are necessary for event functionality and are part of the
  service.
- **Promotional or broadcast notifications** are sent only where permitted by law
  and can be disabled.

You can disable push notifications in your device's system settings, and
broadcast/topic subscriptions are cleared on logout. FCM tokens are stored in
your user profile and deleted when you log out or delete your account.

---

## 13. Cookies, Server Logs, and Tracking

The App does not use browser cookies and uses **Firebase Analytics** for in-app
usage measurement. No third-party advertising trackers or ad SDKs are used.

The **dayzi.live** website and our infrastructure providers (for example,
**Vercel**, **Cloudflare**, **Firebase**, and **EmailOctopus**) may set strictly
necessary cookies and generate **server logs** (such as IP address and request
metadata) needed to operate, secure, and deliver the Site and to process waitlist
sign-ups. Where EmailOctopus records email open/click or unsubscribe status for
waitlist campaigns, we use it only to manage those campaigns.

---

## 14. Changes to This Policy

We may update this policy from time to time. We will notify you of significant
changes via in-app notification, push notification, or on the Site. **Where
required by law, we will seek fresh consent before applying material changes to
consent-based processing.** Continued use of Dayzi after other updates take
effect constitutes acceptance of the updated policy.

---

## 15. Grievance Officer and Regional Contacts

**Grievance Officer (India — DPDP Act, 2023) / Data Protection Officer:**

**Name:** Vishal Mandhane
**Designation:** Founder, Solika Ventures Pvt Ltd
**Email:** vishal.mandhane@dayzi.live

The Grievance Officer will acknowledge your request within **48 hours** and aim
to resolve it within **30 days**. If and where we are required to appoint a
representative in the EU/EEA or UK under Article 27 of the GDPR or UK GDPR, we
will appoint one and publish their contact details in this policy.

---

## 16. Contact Us

For any privacy-related questions, concerns, or requests:

**Solika Ventures Pvt Ltd**
B. No. 1, R. No. 403, Sarvodaya Galaxy, Nr. Kopar, Vishnunagar, Kalyan,
Thane – 421202, Maharashtra, India
**Email:** dayzibusiness@gmail.com

If you are not satisfied with our response, you may complain to the data
protection authority in your jurisdiction (in India, the Data Protection Board of
India; in the EU/EEA, your national supervisory authority; in the UK, the ICO; in
Singapore, the PDPC).
