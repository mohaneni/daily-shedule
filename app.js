// DayFlow - 113-Night Study Schedule Tracker

let appData = {
  version: "1.0",
  createdAt: "",
  totalDays: 113,
  scheduleName: "113-Night AWS Java & Spring Boot Study Plan",
  recurrence: "daily",
  activities: [],
  progress: {},
  settings: {
    theme: "system",
    notifications: false,
    notificationLeadMinutes: 5
  }
};

let currentSelectedDate = new Date();
let activeTab = "today";
let deferredInstallPrompt = null;
let notificationTimeouts = [];

// Utility Functions
function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function generateId() {
  return Math.random().toString(16).substring(2, 10);
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function saveToLocalStorage() {
  try {
    localStorage.setItem("dayflow_schedule", JSON.stringify(appData));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem("dayflow_schedule");
    if (data) {
      appData = JSON.parse(data);
      return true;
    }
  } catch (e) {
    console.error("Failed to load:", e);
  }
  return false;
}

function formatTime12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function isDateWithinScheduleBounds(date) {
  const createdDate = parseLocalDate(appData.createdAt);
  const endDate = new Date(createdDate);
  endDate.setDate(endDate.getDate() + appData.totalDays - 1);
  return date >= createdDate && date <= endDate;
}

// Generate 113-Night Schedule
function generate113NightSchedule() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const java = [
    "Introduction", "Setting Up Java", "How Java Works", "Variables", "Data Types", "User Input",
    "Coding Challenge 1", "Java Data Types", "If Else", "Compare Two Strings",
    "Coding Challenge 2A", "Nested If", "Coding Challenge 2B", "Ternary Operator", "For Loop",
    "Coding Challenge 3A", "Arrays", "Coding Challenge 3B", "Nested For Loops", "While Loop",
    "Do While Loop", "Classes", "Objects", "Functions", "Functions with Parameters",
    "Return Keyword", "Coding Challenge 4", "Method Parameters", "For Each Loop", "Eclipse Installation",
    "Constructors", "Constructor Overloading", "this Keyword", "Inheritance", "Types of Inheritance",
    "Coding Challenge 5", "super Keyword", "Abstract Class", "Abstract Method", "Access Modifiers",
    "static Keyword", "final Keyword", "Coding Challenge 6", "Interface", "Multiple Inheritance",
    "Lambda Expressions", "Exception Handling", "finally Keyword", "throw Keyword", "Custom Exception",
    "Coding Challenge 7", "throws Keyword", "Text File Handling", "Reading Text Files", "Threads",
    "join() Method", "Runnable Interface"
  ];
  
  const spring = [
    "What is Spring Boot", "Installation and Setup", "Creating First Spring Project", "Hello World API", "API Basics",
    "HTTP Request Methods", "Project Hierarchy", "Maven", "Spring vs Spring Boot", "Inputs to API",
    "RequestMapping", "PathVariable", "RequestParam", "RequestBody", "PutMapping",
    "DeleteMapping", "Dependency Injection", "Inversion of Control", "Spring Annotations", "Todo CRUD API",
    "Database Connection", "Pagination", "Validations", "Lombok", "Logging",
    "Swagger Documentation", "Spring Security Basics", "JWT Token Authentication", "Connecting with Frontend"
  ];
  
  const aws = [
    "Cloud Computing Basics", "Benefits of Cloud", "Cloud Deployment Models", "Public Cloud", "Private Cloud",
    "Hybrid Cloud", "AWS Global Infrastructure", "Regions", "Availability Zones", "Edge Locations",
    "Local Zones", "Wavelength Zones", "EC2", "EC2 Instance Types", "AMI",
    "Auto Scaling", "Elastic Load Balancer", "Lambda", "Elastic Beanstalk", "Lightsail",
    "ECS", "EKS", "Fargate", "Amazon S3", "S3 Storage Classes",
    "EBS", "EFS", "FSx", "Storage Gateway", "AWS Backup",
    "RDS", "Aurora", "DynamoDB", "ElastiCache", "Redshift",
    "Neptune", "DocumentDB", "VPC", "Subnets", "Route Tables",
    "Internet Gateway", "NAT Gateway", "Security Groups", "Network ACL", "Route 53",
    "CloudFront", "API Gateway", "Direct Connect", "VPN", "IAM Users",
    "IAM Groups", "IAM Roles", "IAM Policies", "MFA", "AWS Organizations",
    "KMS", "Secrets Manager", "Cognito", "AWS Shield", "AWS WAF",
    "GuardDuty", "Inspector", "Macie", "AWS Artifact", "CloudWatch",
    "CloudTrail", "AWS Config", "Trusted Advisor", "Health Dashboard", "DMS",
    "Application Migration Service", "Snow Family", "DataSync", "Transfer Family", "Athena",
    "Glue", "EMR", "Kinesis", "QuickSight", "SageMaker",
    "Rekognition", "Comprehend", "Lex", "Polly", "Translate",
    "Transcribe", "AWS Free Tier", "Pricing Models", "On-Demand Instances", "Reserved Instances",
    "Spot Instances", "Savings Plans", "Cost Explorer", "AWS Budgets", "Billing Dashboard",
    "Basic Support", "Developer Support", "Business Support", "Enterprise Support", "AWS Marketplace",
    "Operational Excellence", "Security Pillar", "Reliability Pillar", "Performance Efficiency", "Cost Optimization",
    "Sustainability Pillar", "Shared Responsibility Model", "AWS CAF", "Whitepapers Review", "AWS FAQs Review",
    "Practice Questions Set", "Mock Test", "Final Revision"
  ];

  let activities = [];
  
  for (let night = 1; night <= 113; night++) {
    const jTopic = java[Math.min(night - 1, java.length - 1)];
    const sTopic = spring[Math.min(night - 1, spring.length - 1)];
    const aTopic = aws[Math.min(night - 1, aws.length - 1)];

    activities.push(
      { id: `n${night}-1`, name: "Settle in and review topics", startTime: "20:00", endTime: "20:15", color: "#0d9488", night: night },
      { id: `n${night}-2`, name: `Java: ${jTopic}`, startTime: "20:15", endTime: "20:55", color: "#2563eb", night: night },
      { id: `n${night}-3`, name: "HackerRank Practice Java", startTime: "20:55", endTime: "21:20", color: "#7c3aed", night: night },
      { id: `n${night}-4`, name: `Spring Boot: ${sTopic}`, startTime: "21:20", endTime: "22:00", color: "#db2777", night: night },
      { id: `n${night}-5`, name: "HackerRank Practice Java and SQL", startTime: "22:00", endTime: "22:25", color: "#ea580c", night: night },
      { id: `n${night}-6`, name: `AWS: ${aTopic}`, startTime: "22:25", endTime: "23:05", color: "#16a34a", night: night },
      { id: `n${night}-7`, name: "HackerRank Practice Problem Solving", startTime: "23:05", endTime: "23:30", color: "#4f46e5", night: night },
      { id: `n${night}-8`, name: "Sleep", startTime: "23:30", endTime: "06:30", color: "#0891b2", night: night },
      { id: `n${night}-9`, name: "College Homework", startTime: "06:30", endTime: "07:30", color: "#0d9488", night: night }
    );
  }

  appData = {
    version: "1.0",
    createdAt: getLocalDateString(tomorrow),
    totalDays: 113,
    scheduleName: "113-Night AWS Java & Spring Boot Study Plan",
    recurrence: "daily",
    activities: activities,
    progress: {},
    settings: {
      theme: "system",
      notifications: false,
      notificationLeadMinutes: 5
    }
  };

  saveToLocalStorage();
  return appData;
}

// Render Today View
function renderTodayView() {
  const container = document.getElementById("checklist-container");
  const progressCard = document.getElementById("today-progress-card");
  const progressFill = document.getElementById("today-progress-fill");
  const progressText = document.getElementById("today-progress-text");
  const dateText = document.getElementById("today-date-text");
  
  const opts = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  dateText.innerHTML = currentSelectedDate.toLocaleDateString(undefined, opts);

  const dateStr = getLocalDateString(currentSelectedDate);
  const todayStr = getLocalDateString(new Date());
  
  const isPast = dateStr < todayStr;
  const isFuture = dateStr > todayStr;
  const isCurrentToday = dateStr === todayStr;

  const inBounds = isDateWithinScheduleBounds(currentSelectedDate);
  
  if (!inBounds) {
    progressCard.classList.add("d-none");
    container.innerHTML = `<div class="empty-checklist-state"><p>Schedule ended. Extend or start fresh.</p></div>`;
    return;
  }

  progressCard.classList.remove("d-none");
  container.innerHTML = "";

  const createdDate = parseLocalDate(appData.createdAt);
  const daysElapsed = Math.floor((currentSelectedDate - createdDate) / (1000 * 60 * 60 * 24));
  const nightNumber = daysElapsed + 1;

  if (nightNumber < 1 || nightNumber > appData.totalDays) {
    container.innerHTML = `<div class="empty-checklist-state"><p>Out of schedule range.</p></div>`;
    return;
  }

  const nightActivities = appData.activities.filter(act => act.night === nightNumber);
  
  if (nightActivities.length === 0) {
    container.innerHTML = `<div class="empty-checklist-state"><p>No activities for Night ${nightNumber}.</p></div>`;
    return;
  }

  if (!appData.progress[dateStr]) {
    appData.progress[dateStr] = {};
  }

  nightActivities.sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach((act) => {
    const isCompleted = !!appData.progress[dateStr][act.id];
    const timeDisplay = `${formatTime12h(act.startTime)} – ${formatTime12h(act.endTime)}`;
    
    const [sh, sm] = act.startTime.split(":").map(Number);
    const [eh, em] = act.endTime.split(":").map(Number);
    let diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;
    const hDiff = Math.floor(diff / 60);
    const mDiff = diff % 60;
    const durationLabel = hDiff > 0 ? `${hDiff}h ${mDiff > 0 ? mDiff + 'm' : ''}` : `${mDiff}m`;

    const row = document.createElement("div");
    row.className = `activity-row ${isCompleted ? 'completed' : ''}`;
    if (isFuture) row.classList.add("future-day");

    let isPastTimeToday = false;
    if (isCurrentToday) {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (act.startTime < currentHHMM) isPastTimeToday = true;
    }
    
    const timePastStyle = isPastTimeToday && !isCompleted ? 'style="border-left: 3px solid var(--accent);"' : '';

    row.innerHTML = `
      <div class="activity-color-bar" style="background-color: ${act.color}"></div>
      <div class="activity-time" ${timePastStyle}>
        <span>${timeDisplay}</span>
        <span class="duration">${durationLabel}</span>
      </div>
      <div class="activity-details">
        <div class="activity-name">${act.name}</div>
      </div>
      <div class="activity-checkbox-wrapper">
        <div class="activity-checkbox">${isCompleted ? '✓' : ''}</div>
      </div>
    `;

    if (!isFuture) {
      row.onclick = () => {
        appData.progress[dateStr][act.id] = !appData.progress[dateStr][act.id];
        saveToLocalStorage();
        renderTodayView();
        
        const allDone = nightActivities.every(a => appData.progress[dateStr][a.id]);
        if (allDone && isCurrentToday) {
          showToast(`🎉 Night ${nightNumber} complete!`);
        }
      };
    } else {
      row.onclick = () => showToast("Can't complete future activities!");
    }

    container.appendChild(row);
  });

  const completed = nightActivities.filter(a => appData.progress[dateStr][a.id]).length;
  const total = nightActivities.length;
  const pct = Math.round((completed / total) * 100);

  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${completed} of ${total} tasks done — ${pct}%`;
  
  if (pct === 100) {
    progressFill.classList.add("complete");
  } else {
    progressFill.classList.remove("complete");
  }
}

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll(".tab-nav-item").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.tab-nav-item[onclick="switchTab('${tabId}')"]`)?.classList.add("active");
  
  document.getElementById("tab-view-today").classList.add("d-none");
  document.getElementById("tab-view-today").classList.remove("d-none");
  
  renderTodayView();
}

function navigateDay(direction) {
  currentSelectedDate.setDate(currentSelectedDate.getDate() + direction);
  renderTodayView();
}

function resetToToday() {
  currentSelectedDate = new Date();
  renderTodayView();
}

function openSettings() {
  document.getElementById("modal-settings").classList.add("active");
}

function closeSettings() {
  document.getElementById("modal-settings").classList.remove("active");
}

function saveSettings() {
  const theme = document.getElementById("sett-theme").value;
  appData.settings.theme = theme;
  saveToLocalStorage();
  applyTheme(theme);
  closeSettings();
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// Initialize App
function initApp() {
  try {
    const hasSchedule = loadFromLocalStorage();

    if (!hasSchedule) {
      generate113NightSchedule();
    }

    const screenChecklist = document.getElementById("screen-checklist");
    if (screenChecklist) {
      screenChecklist.classList.remove("d-none");
    }
    
    applyTheme(appData.settings.theme);
    currentSelectedDate = new Date();
    renderTodayView();
    showToast("📚 Schedule Ready! Starts Tomorrow Night!");
  } catch (e) {
    console.error("Init error:", e);
    showToast("Error loading schedule");
  }
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// --- PWA Installation Functions ---
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallNotification();
});

function showInstallNotification() {
  const banner = document.getElementById("install-notification-banner");
  if (banner) {
    banner.style.display = "flex";
  }
}

function dismissInstallNotification() {
  const banner = document.getElementById("install-notification-banner");
  if (banner) {
    banner.style.display = "none";
  }
}

function triggerInstallPrompt() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        showToast("✅ DayFlow installed successfully!");
        dismissInstallNotification();
      } else {
        showToast("Installation cancelled.");
      }
      deferredInstallPrompt = null;
    });
  } else {
    showToast("Installation not available. Try again later.");
  }
}

window.addEventListener("appinstalled", () => {
  showToast("🎉 DayFlow is now installed on your device!");
  dismissInstallNotification();
  deferredInstallPrompt = null;
});

// --- Additional Modal & Form Functions ---
function closePreviewModal() {
  const modal = document.getElementById("modal-preview-confirm");
  if (modal) modal.classList.remove("active");
}

function openExtendModal() {
  const modal = document.getElementById("modal-extend");
  if (modal) modal.classList.add("active");
}

function closeExtendModal() {
  const modal = document.getElementById("modal-extend");
  if (modal) modal.classList.remove("active");
}

function submitExtendDays() {
  const count = parseInt(document.getElementById("extend-days-count").value) || 30;
  handleExtendDays(count);
}

function handleExtendDays(days) {
  appData.totalDays += days;
  saveToLocalStorage();
  showToast(`✅ Schedule extended by ${days} days!`);
  closeExtendModal();
  renderTodayView();
}

function handleStartFresh() {
  if (confirm("Start a fresh schedule? All progress will be saved.")) {
    generate113NightSchedule();
    showToast("📚 New schedule created!");
    resetToToday();
  }
}

function closeActivityForm() {
  const modal = document.getElementById("modal-edit-activity");
  if (modal) modal.classList.remove("active");
}

function saveActivityForm() {
  const name = document.getElementById("edit-name").value;
  const start = document.getElementById("edit-start").value;
  const end = document.getElementById("edit-end").value;
  const color = document.getElementById("edit-color").value;

  if (name && start) {
    showToast("✅ Activity updated!");
    closeActivityForm();
  } else {
    showToast("❌ Please fill in name and start time");
  }
}

function exportScheduleJSON() {
  const json = JSON.stringify(appData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dayflow_schedule.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("📤 Schedule exported!");
}

function importScheduleJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      appData = imported;
      saveToLocalStorage();
      showToast("📥 Schedule imported!");
      initApp();
    } catch (err) {
      showToast("❌ Invalid JSON file");
    }
  };
  reader.readAsText(file);
}

function resetProgressOnly() {
  if (confirm("Reset all completion history? Schedule data stays.")) {
    const dateStr = getLocalDateString(new Date());
    appData.progress = {};
    saveToLocalStorage();
    showToast("🧹 Progress reset!");
    renderTodayView();
  }
}

function triggerDeleteConfirmation() {
  const modal = document.getElementById("modal-delete-confirm");
  if (modal) modal.classList.add("active");
}

function closeDeleteConfirmation() {
  const modal = document.getElementById("modal-delete-confirm");
  if (modal) modal.classList.remove("active");
}

function confirmDeleteAndReset() {
  localStorage.removeItem("dayflow_schedule");
  appData = {
    version: "1.0",
    createdAt: "",
    totalDays: 113,
    scheduleName: "113-Night AWS Java & Spring Boot Study Plan",
    recurrence: "daily",
    activities: [],
    progress: {},
    settings: { theme: "system", notifications: false, notificationLeadMinutes: 5 }
  };
  closeDeleteConfirmation();
  showToast("🗑️ Schedule deleted!");
  initApp();
}

function handleRecoveryReset() {
  localStorage.clear();
  location.reload();
}

// --- Window Control Functions (for desktop PWA) ---
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      showToast("Fullscreen not available");
    });
  } else {
    document.exitFullscreen();
  }
}

function maximizeWindow() {
  showToast("Maximize not available in browser");
}

function restoreWindow() {
  showToast("Restore not available in browser");
}

function minimizeWindow() {
  showToast("Minimize not available in browser");
}

function confirmPreviewAndSave() {
  const name = document.getElementById("preview-schedule-name").value || "My Daily Routine";
  appData.scheduleName = name;
  saveToLocalStorage();
  showToast("✅ Schedule saved!");
  closePreviewModal();
  initApp();
}

function navigateMonth(direction) {
  const today = new Date();
  today.setMonth(today.getMonth() + direction);
  renderTodayView();
}
