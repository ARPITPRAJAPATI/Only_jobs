/**
 * Only_Jobs (KIET Campus Platform) — Master Frontend Application Controller
 * Enterprise Black & White + LinkedIn Blue Design Standard
 * Comprehensive architecture interactions across all 10 platform modules.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSidebarToggle();
  initPersonaSwitch();
  initGlobalSearch();
  initLeetCodeHeatmap();
  initPillarSwitcher();
  initPillar3Recommendations('all');
  initCapstonesTable();
  initExamCountdown();
  initAlumniSearch();
});

/* ==========================================================================
   1. Toast Notification System
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   2. Navigation & View Routing
   ========================================================================== */
function initNavigation() {
  const menuButtons = document.querySelectorAll('.sidebar-menu .menu-item');
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navigateToTab(targetTab);
    });
  });
}

function navigateToTab(tabId) {
  // Update sidebar active button
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
  });

  // Switch active main view panel
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });

  // Scroll to top of viewport
  const viewport = document.getElementById('mainViewport');
  if (viewport) viewport.scrollTop = 0;
}

/* ==========================================================================
   3. Sidebar Collapse Toggle
   ========================================================================== */
function initSidebarToggle() {
  const btn = document.getElementById('sidebarCollapseBtn');
  const sidebar = document.getElementById('appSidebar');

  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
}

/* ==========================================================================
   4. Persona / Role Switcher
   ========================================================================== */
function initPersonaSwitch() {
  const select = document.getElementById('personaSwitch');
  if (!select) return;

  select.addEventListener('change', (e) => {
    const role = e.target.value;
    const roleLabels = {
      student: 'Student POV (Arpit Prajapati — CSE 3rd Year)',
      tpo: 'TPO POV (Training & Placement Cell Admin Controls Active)',
      faculty: 'Faculty POV (Lab Reviewer & Endorsement Mode Active)',
      dean: 'Dean Executive POV (7,140 Student Analytics Heatmap)'
    };
    showToast(`Switched view to: ${roleLabels[role] || role}`);
  });
}

/* ==========================================================================
   5. Global Search Bar & Keyboard Shortcut (Cmd+K)
   ========================================================================== */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  // Keyboard shortcut Cmd+K or Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;

    // Quick intelligent router based on query keywords
    if (query.includes('devops') || query.includes('course') || query.includes('cert')) {
      navigateToTab('tab-learning');
      switchLearningView('devops');
    } else if (query.includes('drive') || query.includes('amazon') || query.includes('place') || query.includes('job')) {
      navigateToTab('tab-placement');
    } else if (query.includes('alumni') || query.includes('referral')) {
      navigateToTab('tab-alumni');
    } else if (query.includes('exam') || query.includes('test')) {
      navigateToTab('tab-exams');
    }
  });
}

/* ==========================================================================
   6. LeetCode Heatmap Generator
   ========================================================================== */
function initLeetCodeHeatmap() {
  const strip = document.getElementById('leetcodeHeatmapStrip');
  if (!strip) return;

  strip.innerHTML = '';
  // 52 weeks representation
  for (let i = 0; i < 52; i++) {
    const sq = document.createElement('div');
    sq.className = 'heatmap-sq';
    const rand = Math.random();
    if (rand > 0.8) sq.classList.add('l-4');
    else if (rand > 0.6) sq.classList.add('l-3');
    else if (rand > 0.35) sq.classList.add('l-2');
    else if (rand > 0.15) sq.classList.add('l-1');
    strip.appendChild(sq);
  }
}

/* ==========================================================================
   7. Triple-Pillar Placement ATS Controller
   ========================================================================== */
function initPillarSwitcher() {
  const toggleBtns = document.querySelectorAll('.pillar-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-pillar');
      document.querySelectorAll('.pillar-view').forEach(view => {
        view.classList.toggle('active', view.id === targetId);
      });
    });
  });

  // Year filter buttons in Pillar 3
  const yearBtns = document.querySelectorAll('.year-btn');
  yearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      yearBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const year = btn.getAttribute('data-year');
      initPillar3Recommendations(year);
    });
  });
}

const OPPORTUNITIES_CATALOG = [
  {
    id: 'opp-1',
    title: 'Google Summer of Code (GSoC) 2027 Mentorship Track',
    company: 'Open Source Community (Linux Foundation / CNCF)',
    year: 1,
    stipend: '$1,500 – $3,000 Stipend • Summer 2027',
    matchScore: 94,
    skills: ['Git', 'C++', 'Linux Fundamentals', 'Basic Python'],
    missingSkills: ['Signed Contributor License', 'Proposal Draft Approved'],
    applyUrl: 'https://summerofcode.withgoogle.com'
  },
  {
    id: 'opp-2',
    title: 'Junior Frontend Contributor Apprentice',
    company: 'Devfolio Hackathon Incubator',
    year: 2,
    stipend: '₹25,000 / month • Winter Remote',
    matchScore: 91,
    skills: ['React.js', 'Tailwind', 'REST APIs', 'Node.js'],
    missingSkills: ['TypeScript strict types in GitHub repo'],
    applyUrl: '#'
  },
  {
    id: 'opp-3',
    title: 'Backend Systems & SRE Summer Intern (PPI Track)',
    company: 'Postman • Core API Gateway Team',
    year: 3,
    stipend: '₹60,000 / month • 6-Month Pre-Placement Intern',
    matchScore: 89,
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    missingSkills: ['Kafka Event Streaming', 'gRPC Protocol Benchmarks'],
    applyUrl: '#'
  },
  {
    id: 'opp-4',
    title: 'Software Development Engineer (SDE-1)',
    company: 'Amazon Web Services (AWS) — Cloud Infrastructure',
    year: 4,
    stipend: '₹18.5 LPA CTC • Batch 2026',
    matchScore: 86,
    skills: ['Distributed Systems', 'Java / Node.js', 'Postgres'],
    missingSkills: ['AWS Certified Cloud Practitioner', 'DynamoDB Indexing'],
    applyUrl: '#'
  }
];

function initPillar3Recommendations(yearFilter) {
  const container = document.getElementById('recommendationsList');
  if (!container) return;

  const filtered = (yearFilter === 'all')
    ? OPPORTUNITIES_CATALOG
    : OPPORTUNITIES_CATALOG.filter(item => item.year === parseInt(yearFilter));

  container.innerHTML = filtered.map(item => `
    <div class="rec-item-card">
      <div>
        <div class="code-ref">Target: Year ${item.year} Students • Semantic Vector Score</div>
        <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 4px;">${item.title}</h4>
        <div style="font-size: 12px; color: #a1a1aa; margin-bottom: 2px;">${item.company}</div>
        <div style="font-size: 13px; font-weight: 700; color: #fff; font-family: var(--font-mono); margin-bottom: 8px;">${item.stipend}</div>
        <div class="tags-flex-wrap">
          ${item.skills.map(s => `<span class="code-tag">${s}</span>`).join('')}
        </div>
        <div class="rec-skill-gap-line">
          ⚠️ Missing to reach 100%: <strong>${item.missingSkills.join(', ')}</strong>
        </div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
        <div class="rec-pct">${item.matchScore}% Match</div>
        <button class="btn btn-primary btn-sm" onclick="showToast('Viewing candidate dossier for: ${item.company}')">Apply / View Dossier</button>
      </div>
    </div>
  `).join('');
}

function applyDrive(companyName) {
  const confirmApply = confirm(`Apply to ${companyName} On-Campus Placement Drive?\n\n• Your verified academic record (CGPA: 8.74) will be dispatched to TPO.\n• Your Top 3 GitHub repositories & LeetCode stats will be attached.\n• Institutional 1-Student 1-Job rule applies once an offer is released.`);
  if (confirmApply) {
    showToast(`Application submitted to ${companyName}! Status: APPLIED (OA Round Shortlist in progress).`);
  }
}

/* ==========================================================================
   8. Learning & Certification Subview Controller
   ========================================================================== */
function switchLearningView(viewId) {
  const catalogView = document.getElementById('learningCatalogView');
  const devopsView = document.getElementById('learningDevOpsView');
  const btnCatalog = document.getElementById('btnViewCatalog');
  const btnDevOps = document.getElementById('btnViewDevOps');

  if (viewId === 'catalog') {
    catalogView.classList.add('active');
    devopsView.classList.remove('active');
    btnCatalog.classList.add('active');
    btnDevOps.classList.remove('active');
  } else {
    catalogView.classList.remove('active');
    devopsView.classList.add('active');
    btnCatalog.classList.remove('active');
    btnDevOps.classList.add('active');
  }
}

/* Top 20 Production Capstone Projects */
const TOP_20_CAPSTONES = [
  // Phase 1 (1–6)
  { num: 1, name: "Multi-Stage Dockerfile Optimization (Alpine & Non-Root)", phase: "Phase 1: Beginner", tech: "Docker, Alpine, Node.js", target: "Local / Docker Hub" },
  { num: 2, name: "Automated Linux Server Hardening & SSH Bastion Script", phase: "Phase 1: Beginner", tech: "Bash, iptables, Fail2ban", target: "Ubuntu Cloud VPS" },
  { num: 3, name: "Nginx Reverse Proxy with Automated Let's Encrypt SSL Renewal", phase: "Phase 1: Beginner", tech: "Nginx, Certbot, Cron", target: "AWS EC2 / DigitalOcean" },
  { num: 4, name: "Centralized System Health Monitor with Discord/Slack Webhooks", phase: "Phase 1: Beginner", tech: "Shell, cURL, Webhooks", target: "Linux Cron Daemon" },
  { num: 5, name: "Automated Git Linter & Semantic Release via GitHub Actions", phase: "Phase 1: Beginner", tech: "GitHub Actions, Commitlint", target: "GitHub Platform" },
  { num: 6, name: "Static Site Hosting on AWS S3 + CloudFront with Custom Domain", phase: "Phase 1: Beginner", tech: "AWS S3, CloudFront, Route53", target: "AWS Cloud" },

  // Phase 2 (7–13)
  { num: 7, name: "Production GitHub Actions CI/CD to Amazon EKS Cluster", phase: "Phase 2: Intermediate", tech: "GitHub Actions, EKS, Docker", target: "AWS EKS Kubernetes" },
  { num: 8, name: "Self-Healing Kubernetes Cluster with Custom Helm Packaging", phase: "Phase 2: Intermediate", tech: "Kubernetes, Helm, Secrets", target: "K8s Microservices" },
  { num: 9, name: "Prometheus + Grafana Observability Stack with Alertmanager", phase: "Phase 2: Intermediate", tech: "Prometheus, Grafana, Alertmgr", target: "Kubernetes Cluster" },
  { num: 10, name: "Automated PostgreSQL DB Backup, Encryption & S3 Rotation", phase: "Phase 2: Intermediate", tech: "PostgreSQL, GPG, S3 CLI", target: "AWS S3 Glacier" },
  { num: 11, name: "Zero-Downtime Blue/Green Deployment with Nginx Ingress Controller", phase: "Phase 2: Intermediate", tech: "Nginx Ingress, K8s Services", target: "Production K8s" },
  { num: 12, name: "Centralized Logging Cluster with EFK (Elastic, Fluentd, Kibana)", phase: "Phase 2: Intermediate", tech: "Elasticsearch, Fluentd, Kibana", target: "Distributed Storage" },
  { num: 13, name: "Docker Compose to Kubernetes Migration: 4-Tier Distributed System", phase: "Phase 2: Intermediate", tech: "Kompose, K8s Manifests", target: "Cluster Ingestion" },

  // Phase 3 (14–20)
  { num: 14, name: "End-to-End GitOps Continuous Delivery with ArgoCD", phase: "Phase 3: Advanced", tech: "ArgoCD, GitOps, Kubernetes", target: "Multi-Node K3s Cluster" },
  { num: 15, name: "Multi-Cloud Infrastructure as Code (IaC) Provisioning via Terraform", phase: "Phase 3: Advanced", tech: "Terraform, AWS, Cloudflare", target: "Multi-Cloud Environment" },
  { num: 16, name: "Istio Service Mesh with Mutual TLS (mTLS) & Traffic Shifting", phase: "Phase 3: Advanced", tech: "Istio, Envoy, mTLS", target: "Zero-Trust K8s Mesh" },
  { num: 17, name: "Chaos Engineering & Fault Injection Pipeline with Chaos Mesh", phase: "Phase 3: Advanced", tech: "Chaos Mesh, EKS, Pod Killing", target: "High-Availability K8s" },
  { num: 18, name: "Container Vulnerability Scanning & Cryptographic Signing (Trivy + Cosign)", phase: "Phase 3: Advanced", tech: "Trivy, Cosign, OCI Registry", target: "DevSecOps Pipeline" },
  { num: 19, name: "Serverless Event-Driven Data Pipeline on AWS Lambda, SQS & DynamoDB", phase: "Phase 3: Advanced", tech: "AWS Lambda, SQS, DynamoDB", target: "Serverless Architecture" },
  { num: 20, name: "Multi-AZ High-Availability Disaster Recovery & Automatic DNS Failover", phase: "Phase 3: Advanced", tech: "Route 53, Multi-AZ RDS, K8s", target: "Production Enterprise" }
];

function initCapstonesTable() {
  const tbody = document.getElementById('capstonesTableBody');
  if (!tbody) return;

  tbody.innerHTML = TOP_20_CAPSTONES.map(p => `
    <tr>
      <td><strong>${p.num}</strong></td>
      <td><strong>${p.name}</strong></td>
      <td><span class="code-ref">${p.phase}</span></td>
      <td><span class="code-tag">${p.tech}</span></td>
      <td>${p.target}</td>
    </tr>
  `).join('');
}

/* Modals */
function openRecommendCourseModal() {
  const modal = document.getElementById('recommendCourseModal');
  if (modal) modal.classList.add('open');
}

function openExamRegistrationModal(phaseName) {
  const modal = document.getElementById('examRegModal');
  const title = document.getElementById('examRegTitle');
  if (title) title.innerText = `Apply For End-Sem Exam: ${phaseName}`;
  if (modal) modal.classList.add('open');
}

function openPhaseSubmissionModal(phaseName) {
  const repo = prompt(`Submit Capstone Project for ${phaseName} (20 Marks):\nEnter public GitHub repository URL:`, "https://github.com/arpitprajapati/kubernetes-devops-capstone");
  if (repo) {
    showToast(`Project submitted! FastAPI Tree-Sitter AST inspection queued for ${phaseName}.`);
  }
}

function viewPhaseModules(phaseName) {
  showToast(`Opening ${phaseName} modules. 100% open exploration access active!`);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

/* Career Aspiration select reactive change */
const careerSelect = document.getElementById('userCareerSelect');
if (careerSelect) {
  careerSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    const card = document.getElementById('recommendationCard');
    if (val === 'fintech') {
      card.innerHTML = `
        <div class="rec-score-badge">94% Career Fit Match</div>
        <h4>Recommended Track: High-Scale Distributed Systems (Go + Redis)</h4>
        <p><strong>Why This Fits You:</strong> Your profile reflects deep PostgreSQL optimization and BullMQ concurrency. Learning Go and event-driven architectures with Kafka directly aligns with Cred and Razorpay placement drives.</p>
        <div class="rec-footer-row">
          <span>Suggested Action: <strong>New Foundation Track</strong></span>
          <button class="btn btn-primary btn-sm" onclick="closeModal('recommendCourseModal'); navigateToTab('tab-learning');">Explore Curriculum &rarr;</button>
        </div>
      `;
    } else if (val === 'ai') {
      card.innerHTML = `
        <div class="rec-score-badge">91% Career Fit Match</div>
        <h4>Recommended Track: AI Systems & Applied Machine Learning</h4>
        <p><strong>Why This Fits You:</strong> You already understand AST inspection. Learning vector embeddings (pgvector) and PyTorch will prepare you for emerging startup AI engineering roles.</p>
        <div class="rec-footer-row">
          <span>Suggested Action: <strong>New Foundation Track</strong></span>
          <button class="btn btn-primary btn-sm" onclick="closeModal('recommendCourseModal'); navigateToTab('tab-learning');">Explore Curriculum &rarr;</button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="rec-score-badge">96% Career Fit Match</div>
        <h4>Recommended Track: Cloud Native DevOps Engineering</h4>
        <p><strong>Why This Fits You:</strong> You completed Full-Stack Software Architecture and hold 24 Node.js repositories. Pairing this with Docker, Kubernetes, and CI/CD will place you into the top 5% of candidate dossiers for AWS and Tier-1 recruiters.</p>
        <div class="rec-footer-row">
          <span>Suggested Action: <strong>Specialization Continuation Track</strong></span>
          <button class="btn btn-primary btn-sm" onclick="closeModal('recommendCourseModal'); navigateToTab('tab-learning'); switchLearningView('devops');">Launch DevOps Track &rarr;</button>
        </div>
      `;
    }
  });
}

/* ==========================================================================
   9. Simulated Nightly Batch Sync (00:00 AM Cron)
   ========================================================================== */
const syncBtn = document.getElementById('simulateSyncBtn');
if (syncBtn) {
  syncBtn.addEventListener('click', () => {
    syncBtn.innerText = "⏳ BullMQ Worker Running...";
    syncBtn.disabled = true;

    setTimeout(() => {
      showToast("Nightly Sync Completed! 7,140 profiles synchronized via BullMQ queue. Sub-10ms delivery ready.");
      syncBtn.innerText = "Simulate Nightly Batch Sync";
      syncBtn.disabled = false;
      initLeetCodeHeatmap();
    }, 1200);
  });
}

/* ==========================================================================
   10. Campus Feed Post Creation with Redis Quota (3 Posts/Day)
   ========================================================================== */
let dailyQuota = 2;
function publishFeedPost() {
  const input = document.getElementById('feedPostInput');
  const quotaDisplay = document.getElementById('userPostQuota');
  const stream = document.getElementById('postsStream');

  if (!input || !input.value.trim()) {
    showToast("Please write a post before publishing.");
    return;
  }

  if (dailyQuota <= 0) {
    alert("Redis Atomic Limit Enforced!\n\nYou have consumed your daily quota of 3 posts per day. This policy eliminates social media clutter and ensures the feed remains focused on verified proof-of-work achievements.");
    return;
  }

  dailyQuota--;
  quotaDisplay.innerText = `${dailyQuota} of 3 Posts Remaining`;

  const card = document.createElement('div');
  card.className = 'post-card';
  card.innerHTML = `
    <div class="post-author-bar">
      <div class="author-avatar-sm">AP</div>
      <div>
        <span class="author-title">Arpit Prajapati <span class="tag-verified">&check; Verified</span></span>
        <span class="post-timestamp">Just now • CSE 3rd Year</span>
      </div>
    </div>
    <p class="post-text">${input.value}</p>
    <div class="post-tags-line">#ProofOfWork #ActiveMilestone #KIET</div>
  `;

  stream.prepend(card);
  input.value = '';
  showToast(`Published to campus feed! (Remaining daily quota: ${dailyQuota})`);
}

/* ==========================================================================
   11. Exam Countdown Timer
   ========================================================================== */
function initExamCountdown() {
  const timer = document.getElementById('examCountdown');
  if (!timer) return;

  let totalSecs = 44 * 60 + 12;
  setInterval(() => {
    if (totalSecs <= 0) return;
    totalSecs--;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    timer.innerText = `Time Remaining: ${m}:${s < 10 ? '0' : ''}${s}`;
  }, 1000);

  // Toggle active radio option visually
  document.querySelectorAll('.answer-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.answer-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
}

/* ==========================================================================
   12. Alumni Directory Live Search
   ========================================================================== */
function initAlumniSearch() {
  const filterInput = document.getElementById('alumniSearchFilter');
  if (!filterInput) return;

  filterInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('#alumniCardsGrid .alumni-card');
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(term) ? 'block' : 'none';
    });
  });
}
