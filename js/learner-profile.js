// Learner Profile and Portfolio Sharing JavaScript

(async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get("id");
  
  const skeletonLoader = document.getElementById("skeletonLoader");
  const profileContainer = document.getElementById("profileContainer");
  const headerActions = document.getElementById("headerActions");

  // Default badges definitions
  const badgeConfigList = [
    { id: 'first-steps', name: 'First Steps', description: 'Complete your first learning module', icon: '🚶' },
    { id: 'week-streak', name: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: '🔥' },
    { id: 'admin-master', name: 'Admin Master', description: 'Complete all Salesforce Admin modules', icon: '👑' },
    { id: 'apex-champion', name: 'Apex Champion', description: 'Complete all Apex Development modules', icon: '⚡' },
    { id: 'flow-creator', name: 'Flow Creator', description: 'Complete all Salesforce Flow modules', icon: '🔄' },
    { id: 'lwc-builder', name: 'LWC Builder', description: 'Complete all Lightning Web Components modules', icon: '🧱' },
    { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Ask 50 questions to Zentom AI', icon: '❓' },
    { id: 'practice-makes-perfect', name: 'Practice Makes Perfect', description: 'Complete 100 Trailhead challenges', icon: '💪' },
    { id: 'interview-ready', name: 'Interview Ready', description: 'Complete 10 mock interviews', icon: '🎤' },
    { id: 'continuous-learner', name: 'Continuous Learner', description: 'Maintain a 30-day learning streak', icon: '📚' }
  ];

  // Curriculum modules mapping
  const adminModules = [
    { id: 1, name: "Platform Foundations", skillId: "salesforce-platform-foundations" },
    { id: 2, name: "Data Modeling", skillId: "salesforce-data-modeling" },
    { id: 3, name: "Relationships", skillId: "salesforce-relationships" },
    { id: 4, name: "UI Customization", skillId: "salesforce-ui-customization" },
    { id: 5, name: "Security Model", skillId: "salesforce-security-model" },
    { id: 6, name: "Data Management", skillId: "salesforce-data-management" },
    { id: 7, name: "Formulas & Validation", skillId: "salesforce-formulas-validation" },
    { id: 8, name: "Flow Automation", skillId: "salesforce-flow-automation" },
    { id: 9, name: "Approval Processes", skillId: "salesforce-approval-processes" },
    { id: 10, name: "Data Management II", skillId: "salesforce-data-management" }
  ];

  let profileData = null;
  let isGuestMode = false;
  let loggedInUser = null;

  // Check if there is an active session
  try {
    loggedInUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || 
                   JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1"));
  } catch (e) {
    // Ignore
  }

  // Inject header links based on session
  if (loggedInUser) {
    headerActions.innerHTML = `
      <a href="/learner-dashboard" class="btn-secondary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </a>
    `;
  } else {
    headerActions.innerHTML = `
      <a href="access.html" class="btn-secondary px-5 py-2.5 rounded-xl font-bold text-xs">Sign In</a>
      <a href="access.html?tab=signup" class="btn-lime px-5 py-2.5 rounded-xl font-bold text-xs">Join Academy</a>
    `;
  }

  // Helper to resolve progress values from local storage or server response
  function getProgressValue(key, fallback = null) {
    if (isGuestMode) {
      const val = profileData?.progress?.[key];
      if (!val) return fallback;
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    } else {
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
  }

  // Load the profile details
  if (studentId) {
    isGuestMode = true;
    try {
      const res = await fetch(`/api/public-profile?id=${encodeURIComponent(studentId)}`);
      if (!res.ok) throw new Error("Profile not found");
      profileData = await res.json();
    } catch (err) {
      showErrorCard("Profile Not Found", "The requested student profile could not be loaded or does not exist.");
      return;
    }
  } else {
    // Self-view mode. Require logged-in session
    if (!loggedInUser) {
      window.location.replace("access.html?next=profile");
      return;
    }
    profileData = {
      id: loggedInUser.userId || loggedInUser.id,
      name: loggedInUser.name,
      createdAt: loggedInUser.enrolledAt || new Date().toISOString(),
      tier: loggedInUser.tier || "free"
    };
  }

  renderProfile();

  function renderProfile() {
    skeletonLoader.classList.add("hidden");
    profileContainer.classList.remove("hidden");

    // Profile Details
    const name = profileData.name || "Student Learner";
    document.getElementById("profileName").textContent = name;
    document.getElementById("profileAvatar").textContent = name.charAt(0).toUpperCase();
    document.getElementById("profileJoined").textContent = formatDate(profileData.createdAt);
    
    // Tier Tag
    const isFounder = profileData.tier === "founder";
    const tierEl = document.getElementById("profileTier");
    tierEl.textContent = isFounder ? "★ Founder Access" : "Free Starter";
    tierEl.className = `text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
      isFounder ? "bg-lime/20 text-lime border border-lime/30" : "bg-white/10 text-slate-300 border border-white/10"
    }`;

    // Streak
    const streakData = getProgressValue("tomcodex.streakData", { currentStreak: 0 });
    document.getElementById("profileStreak").textContent = `${streakData?.currentStreak || 0} ${
      streakData?.currentStreak === 1 ? "Day" : "Days"
    }`;

    // Calculate core statistics
    let totalLabs = 0;
    let totalLabScoreSum = 0;
    let totalQuizzes = 0;
    const evaluationHistory = [];

    // Process structured courses (Legacy format)
    const courses = ["admin", "apex", "flow", "lwc"];
    courses.forEach((course) => {
      const quizScores = getProgressValue(`tomcodex.${course}MasteryScores.v1`, {});
      const screenshotScores = getProgressValue(`tomcodex.${course}MasteryScores.v1.screenshots`, {});
      
      Object.entries(quizScores).forEach(([_, entry]) => {
        if (entry?.score >= 80) totalQuizzes++;
      });

      Object.entries(screenshotScores).forEach(([modIndex, entry]) => {
        const scoreVal = Number(entry?.score) || 0;
        if (scoreVal > 0) {
          totalLabs++;
          totalLabScoreSum += scoreVal;
          let title = `${course.toUpperCase()} Module ${Number(modIndex) + 1}`;
          if (course === "admin" && Number(modIndex) === 0) title = "Salesforce Platform Foundations";

          evaluationHistory.push({
            title,
            score: scoreVal,
            passed: Boolean(entry.passed),
            timestamp: entry.timestamp || new Date().toISOString()
          });
        }
      });
    });

    // Process dynamic lab attempts (Modern format)
    const dynamicAttempts = getProgressValue("tomcodex.adminLabAttempts.v1", {});
    Object.entries(dynamicAttempts).forEach(([key, val]) => {
      if (Array.isArray(val) && key.startsWith("admin-") && !key.startsWith("admin-module-")) {
        val.forEach((attempt) => {
          const scoreVal = Number(attempt.score) || 0;
          totalLabs++;
          totalLabScoreSum += scoreVal;
          
          let title = `Admin Module`;
          if (key === "admin-1") title = "Salesforce Platform Foundations";
          else if (key === "admin-2") title = "Student Success CRM Object Model";
          else if (key === "admin-3") title = "Security and Access Control";
          else {
            title = `Admin Module ${key.split("-")[1]}`;
          }

          evaluationHistory.push({
            title,
            score: scoreVal,
            passed: attempt.status === "Verified",
            timestamp: attempt.createdAt || new Date().toISOString()
          });
        });
      }
    });

    // Stats Grid
    const avgLabScore = totalLabs > 0 ? Math.round(totalLabScoreSum / totalLabs) : 0;
    document.getElementById("statLabs").textContent = totalLabs;
    document.getElementById("statAvgScore").textContent = `${avgLabScore}%`;
    document.getElementById("statModules").textContent = totalQuizzes;
    
    // AI Tutor Requests
    const settingsQuota = getProgressValue("tomcodex.aiQuotaUsage", { count: 0 });
    document.getElementById("statAiSessions").textContent = settingsQuota?.count || 0;

    // Badges Showcase
    const earnedBadges = getProgressValue("tomcodex.earnedBadges", []);
    const badgesGrid = document.getElementById("badgesGrid");
    badgesGrid.innerHTML = "";
    badgeConfigList.forEach((badge) => {
      const isEarned = earnedBadges.includes(badge.id);
      const badgeDiv = document.createElement("div");
      badgeDiv.className = `flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 text-center ${
        isEarned ? "border-lime/20" : "badge-locked"
      }`;
      badgeDiv.innerHTML = `
        <span class="text-3xl filter-none">${badge.icon}</span>
        <strong class="text-xs text-white block mt-2 font-bold">${badge.name}</strong>
        <span class="text-[10px] text-slate-400 leading-tight block mt-1">${badge.description}</span>
      `;
      badgesGrid.appendChild(badgeDiv);
    });
    document.getElementById("badgeCount").textContent = `${earnedBadges.length} earned`;

    // Skills Passport progress pills
    const passportGrid = document.getElementById("skillsPassportGrid");
    passportGrid.innerHTML = "";
    
    let adminVerifiedForCert = 0;
    const TOTAL_CERT_MODULES = 10;
    let adminScores = getProgressValue("tomcodex.adminMasteryScores.v1", {});

    adminModules.forEach((mod) => {
      const bestLab = dynamicAttempts[`admin-${mod.id}:summary`]?.bestScore || 
                      dynamicAttempts[`admin-module-${mod.id}:summary`]?.bestScore || 0;
      const quizScore = adminScores[mod.id - 1]?.score || 0;
      const verified = bestLab >= 80 || quizScore >= 80;
      if (verified) adminVerifiedForCert++;

      const skillDiv = document.createElement("div");
      skillDiv.className = "flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5";
      skillDiv.innerHTML = `
        <div>
          <strong class="text-xs text-white block font-bold">Module ${mod.id}: ${mod.name}</strong>
          <span class="text-[10px] text-slate-400 block mt-0.5">${verified ? "Lab verified & unlocked" : "In Progress"}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-300">${Math.max(bestLab, quizScore)}%</span>
          <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            verified ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-slate-400 border border-white/10"
          }">${verified ? "Passed" : "Locked"}</span>
        </div>
      `;
      passportGrid.appendChild(skillDiv);
    });

    // Certificate Eligibility status UI card
    const certStatusWrap = document.getElementById("certStatusWrap");
    if (adminVerifiedForCert >= TOTAL_CERT_MODULES && isFounder) {
      certStatusWrap.innerHTML = `
        <div class="p-4 rounded-2xl bg-lime text-brand-950 font-black text-center text-xs tracking-wider uppercase">
          ★ Verifiable Graduate Badge Active
        </div>
      `;
    } else {
      const progressPercent = Math.round((adminVerifiedForCert / TOTAL_CERT_MODULES) * 100);
      certStatusWrap.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span>Verified Modules</span>
            <strong class="text-lime font-bold">${adminVerifiedForCert} / ${TOTAL_CERT_MODULES}</strong>
          </div>
          <div class="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div class="h-full bg-lime rounded-full" style="width: ${progressPercent}%"></div>
          </div>
          <p class="text-[10px] text-slate-400 text-center leading-normal mt-2">
            ${isFounder ? "" : "Founder upgrade & "} ${TOTAL_CERT_MODULES - adminVerifiedForCert} more modules required to unlock certificate.
          </p>
        </div>
      `;
    }

    // Recent attempts log
    const activityLog = document.getElementById("activityLog");
    activityLog.innerHTML = "";
    if (evaluationHistory.length === 0) {
      activityLog.innerHTML = `
        <div class="text-center py-6 text-slate-500 text-xs">
          No lab history or verifications recorded yet.
        </div>
      `;
    } else {
      // Sort descending and slice to top 5
      evaluationHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .forEach((attempt) => {
          const actDiv = document.createElement("div");
          actDiv.className = "p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3";
          actDiv.innerHTML = `
            <div>
              <strong class="text-xs text-white block font-bold">${attempt.title}</strong>
              <span class="text-[10px] text-slate-500 block mt-0.5">${formatDate(attempt.timestamp)}</span>
            </div>
            <div class="flex items-center gap-2">
              <strong class="text-xs ${attempt.passed ? "text-lime" : "text-red-400"}">${attempt.score}%</strong>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                attempt.passed ? "bg-lime/10 text-lime" : "bg-red-400/10 text-red-400"
              }">${attempt.passed ? "Pass" : "Failed"}</span>
            </div>
          `;
          activityLog.appendChild(actDiv);
        });
    }

    // Share Portfolio Event handler
    document.getElementById("shareProfileBtn").addEventListener("click", () => {
      const shareUrl = `${window.location.origin}/learner-profile?id=${profileData.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("Profile link copied to clipboard!");
      }).catch(() => {
        showToast("Could not copy link. Manually copy the address bar.");
      });
    });
  }

  // Toast Notification Helper
  function showToast(message) {
    const toast = document.getElementById("toastNotification");
    document.getElementById("toastMessage").textContent = message;
    toast.className = toast.className.replace("translate-y-20 opacity-0", "translate-y-0 opacity-100");
    setTimeout(() => {
      toast.className = toast.className.replace("translate-y-0 opacity-100", "translate-y-20 opacity-0");
    }, 2800);
  }

  // Format timestamp helper
  function formatDate(isoString) {
    if (!isoString) return "Recently";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    } catch {
      return "Recently";
    }
  }

  // Render Error Card Helper
  function showErrorCard(title, message) {
    skeletonLoader.classList.add("hidden");
    profileContainer.classList.add("hidden");
    
    const errDiv = document.createElement("div");
    errDiv.className = "glass-card rounded-3xl p-10 text-center max-w-md mx-auto my-12 border border-red-500/20";
    errDiv.innerHTML = `
      <div class="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto text-2xl mb-4 font-bold">✕</div>
      <h2 class="text-xl font-bold text-white">${title}</h2>
      <p class="text-slate-400 text-xs mt-3 leading-relaxed">${message}</p>
      <a href="index.html" class="btn-secondary px-5 py-3 rounded-2xl font-bold text-xs inline-block mt-6">Go to Homepage</a>
    `;
    document.querySelector("main").appendChild(errDiv);
  }

})();
