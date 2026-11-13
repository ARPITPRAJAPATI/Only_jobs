# Alumni Services Layer

Yeh directory JobsOnly ke Alumni Module ke core business services aur data ingestion workflows ke liye reserved hai.

## 📌 Architecture Components

### 1. Ingestion & Crawler Pipeline (`crawler.service.js`)
* **Source:** TPO placement Excel sheets & self-declared alumni updates.
* **Public Search Engine Extraction:** Crawls public LinkedIn headlines & verified companies without bot bans or authenticated session risks.
* **Normalizer:** Maps raw designations (e.g., *"Crypto Ninja"* ➔ *"SDE-1"*, *"Backend Guy"* ➔ *"Distributed Systems"*).

### 2. Candidate Dossier Generator (`dossier.service.js`)
* Generates the institutional verified markdown/text candidate pitch when a student requests a referral:
  * Pulls student's verified CGPA from `AcademicRecord`.
  * Pulls student's top 2 verified projects with GitHub & live links.
  * Pulls pinned approved badges from `StudentBadge`.
  * Generates 1-click clipboard paste text for LinkedIn messaging.

### 3. Verification Sync (`verification.service.js`)
* Periodic 60-day background validation of company updates.
* TPO batch verification hooks.

