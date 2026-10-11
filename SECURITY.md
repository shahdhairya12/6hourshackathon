# 🛡️ PULSE OS Security Policy

## 1. Supported Versions

We actively maintain and provide security updates for the current major release of PULSE OS.

| Version | Release Date | Status | Maintenance Support |
| :--- | :--- | :--- | :--- |
| **1.1.x** | October 2026 | :white_check_mark: Active | Full security patches & maintenance |
| **1.0.x** | October 2026 | :white_check_mark: Supported | Critical security fixes only |
| **< 1.0.0** | N/A | :x: Unsupported | End of life |

---

## 2. Local-First Client Security & Data Privacy

PULSE OS is engineered around an **uncompromising local-first client architecture**:

1. **Zero Remote Data Exfiltration**:
   - All financial simulation inputs, transaction logs, bill obligations, and savings goals reside exclusively within the user's browser via encrypted `window.localStorage`.
   - No financial data, telemetry, or behavioral profiles are ever transmitted across any remote server, cloud API, or third-party database.
2. **Zero Third-Party Trackers**:
   - The application does not embed Google Analytics, Facebook Pixel, tracking beacons, or cross-site fingerprinting scripts.
3. **Client-Side Audio Synthesis**:
   - Audio effects and Indian UPI Soundbox voice announcements are synthesized in real-time via the native Web Audio API and SpeechSynthesis API without downloading external audio streams.
4. **Input Sanitization & Injection Defense**:
   - User transaction descriptions, custom amounts, and simulation labels undergo strict type-checking and sanitization to prevent Cross-Site Scripting (XSS) and DOM injection attacks.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability or potential threat vector in PULSE OS, please do **NOT** open a public issue on GitHub.

Instead, please report the vulnerability directly to our security coordination team:

- **Security Contact**: `security@pulse-fintech.org`
- **PGP Key Fingerprint**: `9B42 E081 7F12 D344 8A19 C552 4F30 119A D84B 62C1`
- **Subject Line**: `[SECURITY VULNERABILITY] <Component/Module Name>`

### Required Reporting Details:
Please include the following information in your report:
1. Type of vulnerability (e.g., XSS, LocalStorage corruption, Prototype pollution).
2. Step-by-step reproduction instructions or proof-of-concept (PoC) code.
3. Affected components, files, or browser environments.
4. Assessment of potential exploit impact on client state integrity.

---

## 4. Response & Remediation Timelines (SLA)

Our security response team commits to the following Service Level Agreement (SLA) timelines:

| Stage | Response Commitment | Action |
| :--- | :--- | :--- |
| **Initial Acknowledgment** | **< 24 Hours** | Formal receipt confirmation and ticket assignment |
| **Vulnerability Triage** | **< 72 Hours** | Validation, severity rating (CVSS v3.1), and reproduction |
| **Patch & Remediation** | **< 7 Days** | Pull request creation, testing, and production deployment |
| **Public Disclosure** | Coordinated | Disclosure coordinated with reporter after patch deployment |

---

## 5. Safe Harbor Policy

Activities conducted in good faith under this policy will be considered authorized conduct:
- We will not pursue legal action against researchers for accidental, good-faith violations of this policy.
- We will work collaboratively with you to understand and resolve the issue quickly.
- We will publicly recognize your contribution in our release notes (unless anonymity is requested).
