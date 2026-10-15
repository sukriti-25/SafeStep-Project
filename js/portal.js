(() => {
  "use strict";

  const STORAGE = {
    users: "safestepUsers",
    session: "safestepSession",
    progressPrefix: "safestepProgress:",
  };

  const DEMO_USERS = [
    {
      id: "learner-sijan",
      role: "learner",
      name: "Sijan Bhandari",
      email: "learner@safestep.demo",
      password: "SafeStep123!",
      organisation: "Laliguras",
      phone: "+977 9801234567",
    },
    {
      id: "admin-sukriti",
      role: "admin",
      name: "Sukriti Rimal",
      email: "admin@safestep.demo",
      password: "AdminSafe123!",
      organisation: "Laliguras",
      phone: "+977 9801234567",
    },
  ];

  const emptyProgress = () => ({
    warehouse: { complete: false, percent: 0, completedAt: null, seconds: 0 },
    height: { complete: false, percent: 0, completedAt: null, seconds: 0 },
  });

  const parse = (value, fallback) => {
    try {
      return JSON.parse(value) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const getUsers = () => {
    const saved = parse(localStorage.getItem(STORAGE.users), []);
    const byId = new Map(saved.map((user) => [user.id, user]));
    DEMO_USERS.forEach((user) => {
      if (!byId.has(user.id)) byId.set(user.id, user);
    });
    const users = [...byId.values()];
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
    return users;
  };

  const saveUsers = (users) =>
    localStorage.setItem(STORAGE.users, JSON.stringify(users));

  const getSession = () =>
    parse(sessionStorage.getItem(STORAGE.session), null) ||
    parse(localStorage.getItem(STORAGE.session), null);

  const setSession = (user) => {
    const safeUser = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };
    localStorage.setItem(STORAGE.session, JSON.stringify(safeUser));
    sessionStorage.setItem(STORAGE.session, JSON.stringify(safeUser));
  };

  const getProgress = (userId) => {
    const saved = parse(
      localStorage.getItem(`${STORAGE.progressPrefix}${userId}`),
      {},
    );
    return {
      warehouse: { ...emptyProgress().warehouse, ...(saved.warehouse || {}) },
      height: { ...emptyProgress().height, ...(saved.height || {}) },
    };
  };

  const saveProgress = (userId, progress) =>
    localStorage.setItem(
      `${STORAGE.progressPrefix}${userId}`,
      JSON.stringify(progress),
    );

  const initials = (name = "SafeStep User") =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const completedCount = (progress) =>
    [progress.warehouse, progress.height].filter((item) => item.complete)
      .length;

  const averageScore = (progress) => {
    const completed = [progress.warehouse, progress.height].filter(
      (item) => item.complete,
    );
    if (!completed.length) return 0;
    return Math.round(
      completed.reduce((total, item) => total + Number(item.percent || 0), 0) /
        completed.length,
    );
  };

  const formatDate = (value, options = {}) => {
    if (!value) return "Not completed";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...options,
    }).format(new Date(value));
  };

  const currentUser = () => {
    const session = getSession();
    if (!session) return null;
    return getUsers().find((user) => user.id === session.id) || session;
  };

  function routeFor(user) {
    return user.role === "admin" ? "admin.html" : "dashboard.html";
  }

  function protectPage() {
    const requiredRole = document.body.dataset.requireRole;
    if (!requiredRole) return null;
    const user = currentUser();
    if (!user) {
      const next = encodeURIComponent(
        location.pathname.split("/").pop() || "dashboard.html",
      );
      location.replace(`login.html?next=${next}`);
      return null;
    }
    if (requiredRole !== "any" && user.role !== requiredRole) {
      location.replace(routeFor(user));
      return null;
    }
    return user;
  }

  function renderGlobalUser(user) {
    if (!user) return;
    document.querySelectorAll("[data-user-name]").forEach((element) => {
      element.textContent = user.name;
    });
    document.querySelectorAll("[data-user-first]").forEach((element) => {
      element.textContent = user.name.split(/\s+/)[0];
    });
    document.querySelectorAll("[data-user-role]").forEach((element) => {
      element.textContent = user.role;
    });
    document.querySelectorAll("[data-user-initials]").forEach((element) => {
      element.textContent = initials(user.name);
    });
    document.querySelectorAll("[data-current-date]").forEach((element) => {
      element.textContent = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    });
  }

  function bindLogout() {
    document.querySelectorAll("[data-logout]").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.removeItem(STORAGE.session);
        sessionStorage.removeItem(STORAGE.session);
        location.href = "login.html";
      });
    });
  }

  function initLogin() {
    const form = document.querySelector("[data-login-form]");
    if (!form) return;

    const existing = currentUser();
    if (existing && !new URLSearchParams(location.search).has("switch")) {
      document.querySelector("[data-existing-session]").hidden = false;
      const continueLink = document.querySelector("[data-continue-session]");
      continueLink.href = routeFor(existing);
      continueLink.textContent = `Continue as ${existing.name}`;
    }

    const roleInput = form.elements.role;
    const emailInput = form.elements.email;
    const passwordInput = form.elements.password;
    const error = document.querySelector("[data-login-error]");
    const tabs = [...document.querySelectorAll("[data-role-tab]")];

    const setRole = (role) => {
      roleInput.value = role;
      tabs.forEach((tab) =>
        tab.setAttribute("aria-selected", String(tab.dataset.roleTab === role)),
      );
      const account = DEMO_USERS.find((user) => user.role === role);
      const hint = document.querySelector("[data-demo-credentials]");
      hint.innerHTML = `<strong>${role === "admin" ? "Administrator" : "Learner"} demo account</strong>${account.email}<br>${account.password}`;
    };

    tabs.forEach((tab) =>
      tab.addEventListener("click", () => setRole(tab.dataset.roleTab)),
    );
    document.querySelector("[data-demo-fill]").addEventListener("click", () => {
      const account = DEMO_USERS.find((user) => user.role === roleInput.value);
      emailInput.value = account.email;
      passwordInput.value = account.password;
      emailInput.focus();
    });

    setRole("learner");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      error.textContent = "";
      const email = emailInput.value.trim().toLowerCase();
      const user = getUsers().find(
        (candidate) =>
          candidate.role === roleInput.value &&
          candidate.email.toLowerCase() === email &&
          candidate.password === passwordInput.value,
      );
      if (!user) {
        error.textContent =
          "Those details do not match the selected account type. Use the demo credentials shown below.";
        return;
      }
      setSession(user);
      const params = new URLSearchParams(location.search);
      const requested = params.get("next");
      const safeNext =
        requested && /^[a-z0-9-]+\.html(?:[?#].*)?$/i.test(requested);
      location.href = safeNext ? requested : routeFor(user);
    });
  }

  function moduleState(module) {
    if (module.complete) return ["Completed", "complete"];
    if (module.percent > 0) return ["In progress", "progress"];
    return ["Not started", ""];
  }

  function renderModuleCard(key, module) {
    const card = document.querySelector(`[data-module-card="${key}"]`);
    if (!card) return;
    const [label, className] = moduleState(module);
    const badge = card.querySelector("[data-module-status]");
    badge.textContent = label;
    badge.className = `status-badge ${className}`.trim();
    card.querySelector("[data-module-progress]").style.width =
      `${module.percent}%`;
    card.querySelector("[data-module-percent]").textContent =
      `${module.percent}%`;
    const action = card.querySelector("[data-module-action]");
    action.textContent = module.complete
      ? "Repeat activity →"
      : "Start activity →";
  }

  function initDashboard(user) {
    if (document.body.dataset.page !== "dashboard") return;
    const progress = getProgress(user.id);
    const complete = completedCount(progress);
    const average = averageScore(progress);
    const seconds =
      Number(progress.warehouse.seconds || 0) +
      Number(progress.height.seconds || 0);
    document.querySelector("[data-completed-count]").textContent =
      `${complete} / 2`;
    document.querySelector("[data-overall-progress]").style.width =
      `${complete * 50}%`;
    document.querySelector("[data-certificate-count]").textContent =
      complete === 2 ? "1" : "0";
    document.querySelector("[data-average-score]").textContent = `${average}%`;
    document.querySelector("[data-training-time]").textContent =
      `${Math.max(0, Math.round(seconds / 60))}`;
    renderModuleCard("warehouse", progress.warehouse);
    renderModuleCard("height", progress.height);

    const certificate = document.querySelector("[data-certificate-teaser]");
    const certificateLink = certificate.querySelector("a");
    const certificateTitle = certificate.querySelector("h3");
    const certificateText = certificate.querySelector("p");
    if (complete === 2) {
      certificateTitle.textContent = "Your SafeStep certificate is ready";
      certificateText.textContent = `Both safety activities are complete with an average result of ${average}%. View or print your completion certificate.`;
      certificateLink.textContent = "View certificate →";
      certificateLink.href = "certificate.html";
    } else {
      certificateTitle.textContent = "Certificate progress";
      certificateText.textContent = `Complete ${2 - complete} remaining safety ${2 - complete === 1 ? "activity" : "activities"} to unlock your SafeStep reward certificate.`;
      certificateLink.textContent = "Continue learning →";
      certificateLink.href = "#my-learning";
    }

    const activity = document.querySelector("[data-activity-list]");
    const entries = [
      ["Warehouse Hazard Training", progress.warehouse],
      ["Working at Height", progress.height],
    ].filter(([, item]) => item.complete);
    activity.innerHTML = entries.length
      ? entries
          .sort(
            (a, b) => new Date(b[1].completedAt) - new Date(a[1].completedAt),
          )
          .map(
            ([name, item]) =>
              `<div class="activity-item"><span class="stat-icon">✓</span><div><strong>${name}</strong><small>${item.percent}% · ${formatDate(item.completedAt)}</small></div></div>`,
          )
          .join("")
      : '<div class="activity-item"><span class="stat-icon">↗</span><div><strong>Your learning journey starts here</strong><small>Choose either activity to begin.</small></div></div>';
  }

  function initProfile(user) {
    const form = document.querySelector("[data-profile-form]");
    if (!form) return;
    form.elements.name.value = user.name || "";
    form.elements.email.value = user.email || "";
    form.elements.organisation.value = user.organisation || "";
    form.elements.phone.value = user.phone || "";
    form.elements.role.value = user.role || "learner";
    document.querySelector("[data-profile-email]").textContent = user.email;
    document.querySelector("[data-profile-organisation]").textContent =
      user.organisation || "Not set";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const users = getUsers();
      const index = users.findIndex((entry) => entry.id === user.id);
      if (index < 0) return;
      users[index] = {
        ...users[index],
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        organisation: form.elements.organisation.value.trim(),
        phone: form.elements.phone.value.trim(),
      };
      saveUsers(users);
      setSession(users[index]);
      document.querySelector("[data-form-message]").textContent =
        "Your profile has been updated.";
      renderGlobalUser(users[index]);
    });
  }

  function initCertificate(user) {
    if (document.body.dataset.page !== "certificate") return;
    const progress = getProgress(user.id);
    const unlocked = completedCount(progress) === 2;
    const locked = document.querySelector("[data-certificate-locked]");
    const stage = document.querySelector("[data-certificate-stage]");
    if (!unlocked) {
      locked.hidden = false;
      stage.hidden = true;
      const remaining = 2 - completedCount(progress);
      locked.querySelector("[data-remaining]").textContent = String(remaining);
      return;
    }

    locked.hidden = true;
    stage.hidden = false;
    const average = averageScore(progress);
    const latest = [progress.warehouse.completedAt, progress.height.completedAt]
      .filter(Boolean)
      .sort()
      .pop();
    document.querySelector("[data-certificate-name]").textContent = user.name;
    document.querySelector("[data-certificate-score]").textContent =
      `${average}%`;
    document.querySelector("[data-certificate-date]").textContent =
      formatDate(latest);
    document.querySelector("[data-certificate-id]").textContent = `SS-${user.id
      .replace(/[^a-z0-9]/gi, "")
      .slice(-8)
      .toUpperCase()}-${new Date(latest).getFullYear()}`;
    document
      .querySelector("[data-print-certificate]")
      .addEventListener("click", () => window.print());
  }

  function initAdmin(user) {
    if (document.body.dataset.page !== "admin") return;
    const learners = getUsers().filter((entry) => entry.role === "learner");
    const rows = learners.map((learner) => {
      const progress = getProgress(learner.id);
      return {
        learner,
        progress,
        complete: completedCount(progress),
        average: averageScore(progress),
      };
    });
    const certified = rows.filter((row) => row.complete === 2).length;
    const completionRate = learners.length
      ? Math.round((certified / learners.length) * 100)
      : 0;
    document.querySelector("[data-admin-learners]").textContent = String(
      learners.length,
    );
    document.querySelector("[data-admin-certified]").textContent =
      String(certified);
    document.querySelector("[data-admin-rate]").textContent =
      `${completionRate}%`;
    document.querySelector("[data-admin-table]").innerHTML = rows
      .map(
        ({ learner, progress, complete, average }) => `<tr>
          <td><strong>${learner.name}</strong><br><small>${learner.email}</small></td>
          <td>${learner.organisation || "—"}</td>
          <td>${progress.warehouse.complete ? `${progress.warehouse.percent}%` : "Not started"}</td>
          <td>${progress.height.complete ? `${progress.height.percent}%` : "Not started"}</td>
          <td><span class="status-badge ${complete === 2 ? "complete" : "progress"}">${complete}/2 complete</span></td>
          <td>${average}%</td>
          <td><button class="secondary" type="button" data-reset-user="${learner.id}">Reset</button></td>
        </tr>`,
      )
      .join("");
    document.querySelectorAll("[data-reset-user]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm("Reset this learner's training progress?")) return;
        saveProgress(button.dataset.resetUser, emptyProgress());
        initAdmin(user);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    getUsers();
    initLogin();
    const user = protectPage();
    if (!document.body.dataset.requireRole || !user) return;
    renderGlobalUser(user);
    bindLogout();
    initDashboard(user);
    initProfile(user);
    initCertificate(user);
    initAdmin(user);
  });
})();
