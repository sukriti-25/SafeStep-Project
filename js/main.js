(() => {
  "use strict";
  const menu = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  const closeMenu = (restoreFocus = false) => {
    if (!menu || !nav) return;
    const wasOpen = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    if (restoreFocus && wasOpen) menu.focus();
  };
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  window
    .matchMedia("(min-width: 701px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    if (!tab) return;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(tabs[next], true);
      }
    });
  });
  document
    .querySelector("[data-open-scenario]")
    ?.addEventListener("click", () => {
      selectTab(document.getElementById("tab-scenario"), true);
    });
  document
    .querySelector("[data-jump-scenario]")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      const scenario = document.getElementById("tab-scenario");
      selectTab(scenario, true);
      scenario.scrollIntoView({
        block: "center",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  const hazards = [...document.querySelectorAll("[data-hazard]")];
  const found = new Set();
  hazards.forEach((hazard) => {
    hazard.addEventListener("click", () => {
      found.add(hazard);
      hazard.setAttribute("aria-pressed", "true");
      hazard.textContent = "✓";
      document.getElementById("hazard-count").textContent =
        `${found.size} of ${hazards.length} explored${found.size === hazards.length ? " — scenario complete" : ""}`;
      document.getElementById("hazard-feedback").textContent =
        hazard.dataset.hazard;
    });
  });
  document
    .querySelector("[data-reset-scenario]")
    ?.addEventListener("click", () => {
      found.clear();
      hazards.forEach((hazard) => {
        hazard.setAttribute("aria-pressed", "false");
        hazard.textContent = "!";
      });
      document.getElementById("hazard-count").textContent = "0 of 3 explored";
      document.getElementById("hazard-feedback").textContent =
        "Small observations can lead to safer decisions.";
      hazards[0]?.focus();
    });

  const simulation = document.querySelector(
    "#legacy-interactive-simulation:not([hidden])",
  );
  if (simulation) {
    const simulationScenarios = {
      warehouse: {
        name: "Warehouse",
        environment: "Environment: Logistics Warehouse Floor",
        hint: "Hint: Look closely at the emergency door, high rack tier, moving machinery lane, floor surface, and manual lifting posture.",
        completion:
          "Outstanding job. You successfully identified all 5 warehouse safety risks. In the full SafeStep platform, this completes module exercise 1.3.",
        hazards: [
          {
            id: "warehouse-1",
            title: "Obstructed Fire Exit",
            severity: "critical",
            x: 18,
            y: 38,
            description:
              "Pallets and cartons are stacked directly against the emergency egress door, blocking escape routes in a smoke emergency.",
            action:
              "Immediately remove obstructions and maintain a minimum 1.2m clear corridor to all emergency exits at all times.",
          },
          {
            id: "warehouse-2",
            title: "Unsecured High-Tier Pallet",
            severity: "critical",
            x: 44,
            y: 24,
            description:
              "A top-rack pallet is loosely wrapped with overhang, presenting an immediate falling object hazard to workers below.",
            action:
              "Wrap pallet loads securely, inspect weight distribution, and store heavier loads on lower racking tiers.",
          },
          {
            id: "warehouse-3",
            title: "Blind Intersection Without Mirror",
            severity: "critical",
            x: 78,
            y: 52,
            description:
              "Forklift operating near a pedestrian aisle without a convex safety mirror or audible proximity beepers.",
            action:
              "Install wide-angle parabolic mirrors at every blind junction and enforce designated pedestrian walkways.",
          },
          {
            id: "warehouse-4",
            title: "Unmarked Fluid Spill",
            severity: "moderate",
            x: 62,
            y: 78,
            description:
              "Hydraulic oil leak on the smooth polished warehouse floor with no warning triangle or absorbent powder applied.",
            action:
              "Cordon off the area with a wet-floor cone immediately, deploy absorbent boom pads, and report the machinery leak.",
          },
          {
            id: "warehouse-5",
            title: "Improper Manual Handling Posture",
            severity: "moderate",
            x: 33,
            y: 68,
            description:
              "Worker bending straight from the waist with locked knees while lifting a heavy 25kg container.",
            action:
              "Bend knees, keep back straight, bring the load close to the chest, and use mechanical lifting aids for loads over 20kg.",
          },
        ],
      },
      height: {
        name: "Working at Height",
        environment: "Environment: Scaffold and Elevated Work Zone",
        hint: "Hint: Check the open platform edge, ladder angle, harness connection, loose tools, and scaffold foundations.",
        completion:
          "Excellent inspection. You identified all 5 working-at-height risks and completed the SafeStep access-safety exercise.",
        hazards: [
          {
            id: "height-1",
            title: "Missing Edge Protection",
            severity: "critical",
            x: 52,
            y: 20,
            description:
              "The elevated work platform has an open edge without a top rail, mid rail, or toe board.",
            action:
              "Install compliant edge protection before work starts and prevent access until it has been inspected.",
          },
          {
            id: "height-2",
            title: "Unsecured Access Ladder",
            severity: "critical",
            x: 22,
            y: 55,
            description:
              "The access ladder is not tied and is positioned at an unstable angle against the scaffold.",
            action:
              "Set the ladder at a 1:4 angle, secure both stiles, and extend it sufficiently above the landing point.",
          },
          {
            id: "height-3",
            title: "Harness Not Connected",
            severity: "critical",
            x: 60,
            y: 37,
            description:
              "The worker is wearing a harness but the lanyard is not connected to a rated anchor point.",
            action:
              "Inspect the fall-arrest equipment and connect the lanyard to an approved anchor before approaching the edge.",
          },
          {
            id: "height-4",
            title: "Unsecured Tools at Height",
            severity: "moderate",
            x: 78,
            y: 29,
            description:
              "Loose tools are stored close to the platform edge and could fall onto people working below.",
            action:
              "Use tool lanyards and secured storage, fit toe boards, and establish a clearly marked exclusion zone below.",
          },
          {
            id: "height-5",
            title: "Unstable Scaffold Base",
            severity: "critical",
            x: 82,
            y: 82,
            description:
              "A scaffold standard rests on uneven ground without a suitable base plate or sole board.",
            action:
              "Rebuild on a firm, level foundation with correct base plates and obtain inspection approval before use.",
          },
        ],
      },
      cyber: {
        name: "Cyber Awareness",
        environment: "Environment: Connected Office Workstation",
        hint: "Hint: Inspect the urgent email, removable device, unlocked screen, visible password, and unverified QR code.",
        completion:
          "Great work. You identified all 5 cyber-awareness risks and completed the SafeStep digital workplace exercise.",
        hazards: [
          {
            id: "cyber-1",
            title: "Urgent Password-Reset Email",
            severity: "critical",
            x: 26,
            y: 44,
            description:
              "An unexpected email uses urgency and an unfamiliar link to request an immediate password reset.",
            action:
              "Do not follow the link. Report the message through the approved phishing channel and verify requests independently.",
          },
          {
            id: "cyber-2",
            title: "Unknown USB Device",
            severity: "critical",
            x: 74,
            y: 78,
            description:
              "An unlabelled USB device has been left beside the workstation and its source is unknown.",
            action:
              "Do not connect unknown media. Isolate it and give it to the authorised IT or security team.",
          },
          {
            id: "cyber-3",
            title: "Unlocked Workstation",
            severity: "moderate",
            x: 78,
            y: 32,
            description:
              "The workstation is signed in and unattended, exposing company systems and information.",
            action:
              "Lock the device whenever it is unattended and use an approved automatic screen-lock timeout.",
          },
          {
            id: "cyber-4",
            title: "Password Left in View",
            severity: "critical",
            x: 50,
            y: 62,
            description:
              "Login credentials are written on a note beside the computer where other people can see them.",
            action:
              "Remove the note, change the exposed password, and store credentials in an approved password manager.",
          },
          {
            id: "cyber-5",
            title: "Unverified QR Code",
            severity: "moderate",
            x: 42,
            y: 30,
            description:
              "A QR code from an unverified message could direct the user to a fraudulent sign-in page.",
            action:
              "Verify the sender and destination before scanning, and report suspicious QR-code requests to IT.",
          },
        ],
      },
    };
    let activeScenarioKey = "warehouse";
    const simulationPins = [...simulation.querySelectorAll("[data-sim-index]")];
    const scenarioChoices = [
      ...simulation.querySelectorAll("[data-sim-scenario]"),
    ];
    const foundHazards = new Set();
    const count = simulation.querySelector("[data-sim-count]");
    const total = simulation.querySelector("[data-sim-total]");
    const environment = simulation.querySelector("[data-sim-environment]");
    const title = simulation.querySelector("[data-sim-title]");
    const severity = simulation.querySelector("[data-sim-severity]");
    const status = simulation.querySelector("[data-sim-status]");
    const description = simulation.querySelector("[data-sim-description]");
    const action = simulation.querySelector("[data-sim-action]");
    const complete = simulation.querySelector("[data-sim-complete]");
    const completeCopy = simulation.querySelector("[data-sim-complete-copy]");
    const hint = simulation.querySelector("[data-sim-hint-panel]");
    const hintText = simulation.querySelector("[data-sim-hint-text]");
    const hintButton = simulation.querySelector("[data-sim-hint]");
    const previewName = simulation.querySelector("[data-sim-preview-name]");

    const getScenario = () => simulationScenarios[activeScenarioKey];

    function showHazard(hazard) {
      simulationPins.forEach((pin) => {
        pin.classList.toggle(
          "is-selected",
          pin.dataset.simHazard === hazard.id,
        );
      });
      const identified = foundHazards.has(hazard.id);
      title.textContent = hazard.title;
      severity.textContent = `${hazard.severity} risk`;
      severity.classList.toggle("is-moderate", hazard.severity === "moderate");
      status.textContent = identified ? "Identified & Logged" : "Active Hazard";
      status.classList.toggle("is-identified", identified);
      description.textContent = hazard.description;
      action.textContent = hazard.action;
    }

    function resetSimulation(restoreFocus = false) {
      const scenario = getScenario();
      foundHazards.clear();
      count.textContent = "0";
      total.textContent = scenario.hazards.length;
      complete.hidden = true;
      hint.hidden = true;
      hintButton.querySelector("span").textContent = "Show Hint";
      simulationPins.forEach((pin, index) => {
        const hazard = scenario.hazards[index];
        pin.hidden = !hazard;
        if (!hazard) return;
        pin.dataset.simHazard = hazard.id;
        pin.style.left = `${hazard.x}%`;
        pin.style.top = `${hazard.y}%`;
        pin.setAttribute("aria-label", `Hazard ${index + 1}: ${hazard.title}`);
        pin.setAttribute("aria-pressed", "false");
        pin.querySelector("span").textContent = String(index + 1);
        pin.querySelector("small").textContent = `Inspect Point #${index + 1}`;
      });
      showHazard(scenario.hazards[0]);
      if (restoreFocus) simulationPins[0].focus();
    }

    function activateScenario(key) {
      if (!simulationScenarios[key]) return;
      activeScenarioKey = key;
      const scenario = getScenario();
      scenarioChoices.forEach((choice) => {
        const active = choice.dataset.simScenario === key;
        choice.classList.toggle("is-active", active);
        choice.setAttribute("aria-pressed", String(active));
      });
      simulation.querySelectorAll("[data-sim-visual]").forEach((visual) => {
        const active = visual.dataset.simVisual === key;
        visual.hidden = !active;
        visual.classList.toggle("is-active", active);
      });
      environment.textContent = scenario.environment;
      hintText.textContent = scenario.hint;
      previewName.textContent = scenario.name;
      completeCopy.textContent = scenario.completion;
      resetSimulation();
    }

    simulationPins.forEach((pin) => {
      pin.addEventListener("click", () => {
        const scenario = getScenario();
        const hazard = scenario.hazards[Number(pin.dataset.simIndex)];
        if (!hazard) return;
        foundHazards.add(hazard.id);
        pin.setAttribute("aria-pressed", "true");
        pin.querySelector("span").textContent = "✓";
        pin.querySelector("small").textContent = hazard.title;
        count.textContent = foundHazards.size;
        showHazard(hazard);
        complete.hidden = foundHazards.size !== scenario.hazards.length;
      });
    });

    scenarioChoices.forEach((choice) => {
      choice.addEventListener("click", () =>
        activateScenario(choice.dataset.simScenario),
      );
    });

    simulation
      .querySelector("[data-sim-reset]")
      .addEventListener("click", () => resetSimulation(true));

    hintButton.addEventListener("click", () => {
      const showing = hint.hidden;
      hint.hidden = !showing;
      hintButton.querySelector("span").textContent = showing
        ? "Hide Hints"
        : "Show Hint";
    });

    activateScenario("warehouse");
  }
})();
