// ==========================================
// 0. GLOBAL GAME STATE SCHEMA (SINGLE SOURCE OF TRUTH)
// ==========================================

const gameState = {
    // Narrative, progression, & system metadata
    meta: {
        currentStage: 0,                           // Tracks current story/engine stage
        saveVersion: "1.0.0",                       // Schema version for future save systems
        lastTimestamp: Date.now(),                 // Timestamp of last loop tick
        victoryAchieved: false,                    // Master game victory flag
        morseTriggered: false,                     // Signal intercept activated at 50J
        morseDecoded: false,                       // Decoding countdown finished flag
        morseCountdown: 30,                        // Active countdown timer integer
        stage0_ideologicalChoice: null,            // Permanent path choice: "A" (AC) or "B" (DC)
        capacitorOvercharged: false,               // One-time emergency dump flag
        logIncrementId: 0                          // Terminal log counter ID
    },
    // Core game resource balances
    resources: {
        joules: 0.0,                               // Raw electrical energy balance
        wiring: 0,                                 // Processed copper wiring items
        knowledgePoints: 0.0                       // Research currency for tech trees
    },
    // Maximum resource storage boundaries
    caps: {
        joulesMax: 100.0,                          // Maximum Joule capacity ceiling
        wireStorageCap: 20                         // Maximum copper wire storage limit
    },
    // Upgrade Progression Tier Tracking
    upgrades: {
        rackTier: 0,                               // 0: Unbuilt, 1: Initial (20), 2: +20 (40), 3: +20 (60), 4: +20 (80), 5: +20 (100)
        loomSpeedTier: 1                           // 1: Base (OFF/LOW unlocked), 2: MED unlocked, 3: HIGH unlocked
    },
    // Machine and structural infrastructure tracking
    structures: {
        handCrank: { count: 1, baseYield: 1.0 },   // Starting manual dynamo structure
        turbines: { count: 0, baseYield: 1.0 },    // Stage 0 Bluff-Side Hydro/Wind Turbines
        automatedLoom: { 
            built: false,                          // Unlocked pneumatic loom state
            count: 0,                              // Total looms constructed
            tensionSetting: "off",                 // Active tension toggle ("off", "low", "medium", "high")
            isBroken: false                        // Broken/jammed flag for loom repair cycles
        },
        junctionBox: { built: false, count: 0 },   // Branch B defense mitigation structure
        morseReceiver: { built: false, activeDecoding: false }, // Morse communications module
        acGenerators: 0,                           // Path A high-yield generators
        faradayCages: 0,                           // Path A defense units
        leydenJars: 0                              // Path B defense/storage units
    },
    // Engine job execution queues
    queues: {
        activeExpeditions: [],                     // Active outbound scouting missions
        constructionJobs: [],                      // Structure creation pipelines
        combatCooldowns: []                        // Attack delay timers
    },
    // Step 2 Expedition Transport Crate Storage State
    crate: {
        wires: 0,
        generators: 0,                              // AC Generators (Path A) or Leyden Jars (Path B)
        unlocked: false
    },
    // Edison Trust conflict & threat state
    combat: {
        trustActivated: false,                     // Flag initiating saboteur attack loop
        underAttack: false,                        // Blackout lockout flag during raids
        attackCountdown: 10,                       // Blackout lockout duration remaining
        nextAttackTime: 0,                         // Timer to next raid
        threatLevel: 0.0,                          // Aggro meter scaling attack frequency
        defenseModifiers: {
            attackSlowingFactor: 1.0,              // Multiplier slowing down enemy strikes
            damageReductionFactor: 1.0             // Multiplier blunting incoming resource damage
        }
    },
    // Client view & interface state
    uiState: {
        activeTab: "station-floor",                // Currently targeted navigation tab
        terminalScrolledOut: false,                // Sticky banner scroll alert flag
        lastLogText: "",                           // Deduplication: raw text of last incoming log
        lastLogClass: "",                          // Deduplication: style class of last log
        lastLogCount: 1,                           // Deduplication: repeat count multiplier
        lastLogElement: null                       // Deduplication: reference to last log DOM element
    }
};

// ==========================================
// 1. GAME CONSTANTS & REFERENCE VALUES
// ==========================================
// These values never change while the game is running. They are our balance blueprint.

const INITIAL_WIRE_STORAGE_CAP = 20; // Default max limit for carrying copper wiring
const SYSTEM_TICK_RATE_MS = 1000;    // The global heartbeat timer runs every 1000ms (1 second)

// This dictionary holds the precise tuning metrics for our automated loom machinery
const LOOM_CONFIGS = {
    off:    { jouleDrain: 0,  wireIntervalMs: 0,     label: "OFF " },
    low:    { jouleDrain: 2,  wireIntervalMs: 10000, label: "LOW " },
    medium: { jouleDrain: 5,  wireIntervalMs: 5000,  label: "MED " },
    high:   { jouleDrain: 15, wireIntervalMs: 2000,  label: "HIGH " }
};

// Centralized atmospheric Tesla-punk flavor pools for kinetic player actions
const FLAVOR_POOLS = {
    crank: [
        "Dynamo armature manually cranked. Produced 1 Joule.",
        "Brass crank turned. Blue sparks shower from the commutator.",
        "Flywheel spun to speed. Kinetic torque converted to raw Joules.",
        "Heavy armature rotated against magnetic field resistance."
    ],
    forgeWire: [
        "Drew hot raw copper through processing dies. Created +1 Wiring units.",
        "Red-hot copper rod extruded into fine conductive filament.",
        "Tension calibrated on wire drawer. +1 Wire spooled.",
        "Ductile copper forced through diamond dies into precision wire."
    ],
    turbine: [
        "Coastal cliff wind engaged. Bluff-Side Turbine online.",
        "Bluff winds catch turbine blades. Kinetic drive engaged.",
        "Gearing locked into main bus line. Wind turbine spinning."
    ],
    loomSnap: [
        "\uD83D\uDCA5 SYSTEM CRASH: Dynamic shuttle lines snapped under High Tension load! Loom halted.",
        "\uD83D\uDCA5 MECHANISM JAM: Tension load sheared shuttle guide pins! Loom offline.",
        "\uD83D\uDCA5 CABLE FAILURE: Overspeed stress snapped primary weave wire! Loom halted."
    ]
};

// Selection of warning warnings triggered when an Edison saboteur strikes the station
const ATTACK_MESSAGES = [
    "An agent cut the transmission lines!",
    "Saboteur spotted in the relay room. Emergency shutdown initiated.",
    "Wire stripper located in sector 3. Generation disrupted.",
    "Agent interference — capacitor array shorted out.",
    "Edison operative breached the dynamo room."
];

// ==========================================
// 2. THE CORE GAME STATE VARIABLES
// ==========================================
// ALL mutable game state variables have been fully migrated into the single 
// source of truth object tree 'gameState' defined at the top of this script.
//
// - Core Resources & Limits -> gameState.resources & gameState.caps
// - Structures & Upgrades   -> gameState.structures
// - Construction Queues     -> gameState.queues
// - Story & Progression     -> gameState.meta & gameState.structures.morseReceiver
// - Edison Trust Threat    -> gameState.combat
// - UI & Viewport Flags     -> gameState.uiState

// Operational Runtime Internal Timers (Non-persisted loop sub-ticks)
let loomProgressMs = 0;          // Internal millisecond timer tracking active loom progress
let buildCooldownRemaining = 0; // Internal cooldown tracking seconds remaining on active construction


// ==========================================
// 3. CACHING ELEMENT ID SELECTORS
// ==========================================
// Instead of scanning the layout constantly, we look up and link our HTML elements right here.

const elJoules = document.getElementById("stat-joules");
const elMaxJoules = document.getElementById("stat-max-joules");
const elWiring = document.getElementById("stat-wiring");
const elMachines = document.getElementById("stat-machines");
const elDynamicLabel = document.getElementById("dynamic-stat-label");
const elGridStatus = document.getElementById("grid-status");
const elTerminalLog = document.getElementById("terminal-log");
const elAlertBanner = document.getElementById("alert-banner");
const elAlertText = document.getElementById("alert-text");

// Cache Panels and Structural Buttons
const btnCrank = document.getElementById("btn-crank");
const btnForge = document.getElementById("btn-forge");
const btnBuildLoom = document.getElementById("btn-build-loom");
const btnOvercharge = document.getElementById("btn-overcharge");
const btnBuildTurbine = document.getElementById("btn-build-turbine");
const btnBuildAcGen = document.getElementById("btn-build-ac-gen");
const btnBuildLeyden = document.getElementById("btn-build-leyden");
const btnBuildFaraday = document.getElementById("btn-build-faraday");
const btnBuildJunction = document.getElementById("btn-build-junction");
const btnChoiceAC = document.getElementById("btn-choiceAC");
const btnChoiceDC = document.getElementById("btn-choiceDC");

const panelWarehouse = document.getElementById("panel-warehouse");
const btnExpandWarehouse = document.getElementById("btn-expand-warehouse");
const warehouseCostReadout = document.getElementById("warehouse-cost-readout");
const warehouseDesc = document.getElementById("warehouse-desc");
const panelOverchargeDepleted = document.getElementById("panel-overcharge-depleted");

// Loom Speed Upgrade Controls
const panelLoomUpgrade = document.getElementById("panel-loom-upgrade");
const btnUpgradeLoom = document.getElementById("btn-upgrade-loom");
const loomUpgradeLabel = document.getElementById("loom-upgrade-label");
const loomUpgradeSubtext = document.getElementById("loom-upgrade-subtext");
const panelLoomControls = document.getElementById("panel-loom-controls");
const btnRepairLoom = document.getElementById("btn-repair-loom");
const panelMorseEncounter = document.getElementById("stage0-ideological-choice");

// Step 2 Expedition Crate DOM Cache References
const panelTransportCrate = document.getElementById("panel-transport-crate");
const crateBranchLabel = document.getElementById("crate-branch-label");
const crateWireStatus = document.getElementById("crate-wire-status");
const crateGenStatus = document.getElementById("crate-gen-status");
const btnPackWire = document.getElementById("btn-pack-wire");
const btnPackGen = document.getElementById("btn-pack-gen");
const btnLaunchExpedition = document.getElementById("btn-launch-expedition");
const launchSubtext = document.getElementById("launch-subtext");

// Tension Buttons Group
const btnTensionOff = document.getElementById("btn-tension-off");
const btnTensionLow = document.getElementById("btn-tension-low");
const btnTensionMed = document.getElementById("btn-tension-med");
const btnTensionHigh = document.getElementById("btn-tension-high");
const elTensionDesc = document.getElementById("tension-description");
const elLoomRuntimeStatus = document.getElementById("loom-runtime-status");

// Informational Sub-banners
const bannerPassiveGen = document.getElementById("passive-generation-banner");
const bannerLoomStatus = document.getElementById("loom-status-banner");
const bannerThreatStatus = document.getElementById("threat-status-banner");
const bannerLogisticsBlocked = document.getElementById("banner-logistics-blocked");
const markerMorseDecoding = document.getElementById("marker-morse-decoding");
const markerGridBranch = document.getElementById("marker-grid-branch");
const markerVictory = document.getElementById("marker-victory");

// Footer Quick-stats readouts
const footJoules = document.getElementById("foot-joules");
const footWiring = document.getElementById("foot-wiring");
const footGeneration = document.getElementById("foot-generation");
const footLoom = document.getElementById("foot-loom");
const footThreat = document.getElementById("foot-threat");
const footDefenses = document.getElementById("foot-defenses");

// Wire Rack Cost & Capacity Table (Strictly under 150J cap)
const RACK_TIER_CONFIG = [
    { tier: 0, costJ: 15,  cap: 20,  label: "BUILD INITIAL RACK (+20 CAP)", subtext: "Cost: 15 Joules" },
    { tier: 1, costJ: 30,  cap: 40,  label: "EXPAND RACK (+20 / 40 CAP)",   subtext: "Cost: 30 Joules" },
    { tier: 2, costJ: 50,  cap: 60,  label: "EXPAND RACK (+20 / 60 CAP)",   subtext: "Cost: 50 Joules" },
    { tier: 3, costJ: 75,  cap: 80,  label: "EXPAND RACK (+20 / 80 CAP)",   subtext: "Cost: 75 Joules" },
    { tier: 4, costJ: 110, cap: 100, label: "EXPAND RACK (+20 / 100 CAP)",  subtext: "Cost: 110 Joules" }
];

// Loom Tier Upgrade Requirements
const LOOM_UPGRADE_CONFIG = [
    { targetTier: 2, costJ: 50,  costW: 30, label: "[ UPGRADE LOOM: MED ]",  subtext: "Requires 50 Joules & 30 Wires" },
    { targetTier: 3, costJ: 100, costW: 50, label: "[ UPGRADE LOOM: HIGH ]", subtext: "Requires 100 Joules & 50 Wires" }
];

// ==========================================
// 4. CORE ENGINE UTILITY FUNCTIONS
// ==========================================

// Injects a stylized line of status update text inside the central scrolling log box
function writeLog(text, type = "system") {
    // Ensure meta & uiState structures exist safely
    if (!gameState.meta) gameState.meta = {};
    if (!gameState.uiState) gameState.uiState = {};

    gameState.meta.lastTimestamp = Date.now();

    if (!elTerminalLog) return;

    // --- 1. USER-SCROLL RETENTION MEASUREMENT ---
    // Calculate distance from bottom before appending or modifying DOM elements (30px threshold)
    const scrollThreshold = 30;
    const isAtBottom = (elTerminalLog.scrollHeight - elTerminalLog.scrollTop - elTerminalLog.clientHeight) <= scrollThreshold;

    // --- 2. DEDUPLICATION / MESSAGE STACKING ---
    const isDuplicate = (text === gameState.uiState.lastLogText) && (type === gameState.uiState.lastLogClass) && gameState.uiState.lastLogElement;

    if (isDuplicate) {
        gameState.uiState.lastLogCount++;

        // Locate or create counter badge span element
        let counterBadge = gameState.uiState.lastLogElement.querySelector(".log-counter");
        if (!counterBadge) {
            counterBadge = document.createElement("span");
            counterBadge.className = "log-counter";
            gameState.uiState.lastLogElement.appendChild(counterBadge);
        }
        counterBadge.innerText = `[x${gameState.uiState.lastLogCount}]`;
    } else {
        // Increment log sequence ID only on brand-new message entries
        gameState.meta.logIncrementId = (gameState.meta.logIncrementId || 0) + 1;

        const entry = document.createElement("div");
        entry.className = `log-entry log-${type}`;
        entry.innerText = `[t+${gameState.meta.logIncrementId}] ${text}`;

        elTerminalLog.appendChild(entry);

        // Update tracking state for deduplication
        gameState.uiState.lastLogText = text;
        gameState.uiState.lastLogClass = type;
        gameState.uiState.lastLogCount = 1;
        gameState.uiState.lastLogElement = entry;
    }

    // --- 3. SCROLL POSITION EXECUTION ---
    if (isAtBottom) {
        elTerminalLog.scrollTop = elTerminalLog.scrollHeight;
    }

    // --- 4. VIEWPORT SCROLL ALERT BANNER TRIGGER ---
    const logBoundingRect = elTerminalLog.getBoundingClientRect();
    const isHighPriorityLog = (type === "system" || type === "warning" || type === "disaster" || type === "milestone");
    const activeSabotage = gameState.combat ? gameState.combat.underAttack : false;
    const activeMorseDecoding = gameState.meta.morseTriggered && !gameState.meta.morseDecoded;

    if (isHighPriorityLog && logBoundingRect.bottom < 0 && !activeSabotage && !activeMorseDecoding) {
        gameState.uiState.terminalScrolledOut = true;
    }
}

// Helper wrapper to output random atmospheric flavor strings from FLAVOR_POOLS
function writeFlavorLog(poolKey, logClass = "action") {
    const pool = FLAVOR_POOLS[poolKey];
    if (pool && pool.length > 0) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        writeLog(pool[randomIndex], logClass);
    } else {
        writeLog(`Action recorded: ${poolKey}`, logClass);
    }
}

// Helper wrapper to output explicit narrative & story progression milestone strings
function writeStoryLog(text, logClass = "system") {
    writeLog(text, logClass);
}

// Enforces capacity limits on resources using the unified gameState tree
function enforceBoundaries() {
    // Ensure nested objects exist in gameState
    if (!gameState.resources) gameState.resources = { joules: 0, wiring: 0 };
    if (!gameState.caps) gameState.caps = { joulesMax: 100, wireStorageCap: 10 };

    // Clamp Joules between 0 and joulesMax
    if (gameState.resources.joules < 0) gameState.resources.joules = 0;
    if (gameState.resources.joules > gameState.caps.joulesMax) {
        gameState.resources.joules = gameState.caps.joulesMax;
    }

    // Clamp Wiring between 0 and wireStorageCap
    if (gameState.resources.wiring < 0) gameState.resources.wiring = 0;
    if (gameState.resources.wiring > gameState.caps.wireStorageCap) {
        gameState.resources.wiring = gameState.caps.wireStorageCap;
    }
}

// ==========================================
// 5. INTERFACE REFRESH CONTROL
// ==========================================

function renderUI() {
    enforceBoundaries();

    // Standard Value Display Injections reading from gameState
    if (elJoules) elJoules.innerText = Math.floor(gameState.resources.joules);
    if (elWiring) elWiring.innerText = gameState.resources.wiring;
    
    if (footJoules) footJoules.innerText = `J: ${Math.floor(gameState.resources.joules)}`;
    if (footWiring) footWiring.innerText = `W: ${gameState.resources.wiring} / ${gameState.caps.wireStorageCap}`;

    // Always show the current energy storage ceiling layout
    if (elMaxJoules) {
        elMaxJoules.classList.remove("hidden");

        // DYNAMIC DESIGNATION RENDERER ASSET OVERRIDE
        if (gameState.meta.stage0_ideologicalChoice === "A") {
            elMaxJoules.innerText = "/ 150";
        } else if (gameState.meta.stage0_ideologicalChoice === "B" && gameState.structures.leydenJars > 0) {
            let currentMax = 100 + (gameState.structures.leydenJars * 100);
            elMaxJoules.innerText = `/ ${currentMax}`; 
        } else {
            elMaxJoules.innerText = "/ 100";
        }
    }

    // Toggle Visibility of Action Buttons based on Progression thresholds in gameState
    if (btnForge) {
        if (gameState.resources.joules >= 10 || gameState.resources.wiring > 0) {
            btnForge.classList.remove("hidden");
        }
    }
    
    if (btnBuildLoom) {
        if (gameState.resources.wiring >= 2 || gameState.structures.automatedLoom.built) {
            btnBuildLoom.classList.remove("hidden");
        }
    }
    
    if (btnBuildTurbine) {
        if (gameState.resources.wiring >= 3 || gameState.structures.turbines.count > 0) {
            btnBuildTurbine.classList.remove("hidden");
        }
    }

    // --- CAPACITOR OVERCHARGE VISIBILITY TRIGGER ---
    // Reads branch choice and overcharge flag from gameState
    if (gameState.meta.stage0_ideologicalChoice === "A" && gameState.resources.wiring >= 5 && !gameState.meta.capacitorOvercharged) {        btnOvercharge.classList.remove("hidden");
    } else {
        btnOvercharge.classList.add("hidden");
    }
    
    // Handle Logistics Spool-Rack Overflow Overload banners
    if (gameState.resources.wiring >= gameState.caps.wireStorageCap) {
        bannerLogisticsBlocked.classList.remove("hidden");
    } else {
        bannerLogisticsBlocked.classList.add("hidden");
    }

    // Toggle Warehouse Expansion Card Panel Visibility & Rack Progression
    if (gameState.structures.automatedLoom.built) {
        panelWarehouse.classList.remove("hidden");

        const currentRackTier = gameState.upgrades ? gameState.upgrades.rackTier : 0;
        if (currentRackTier >= 5 || gameState.caps.wireStorageCap >= 100) {
            // Permanently hide build expansion button and cost readout at max storage
            if (btnExpandWarehouse) btnExpandWarehouse.classList.add("hidden");
            if (warehouseCostReadout) warehouseCostReadout.classList.add("hidden");
            if (warehouseDesc) warehouseDesc.innerText = "Wire spool rack logistics fully expanded (Maximum 100 Wires Storage Cap reached).";
        } else {
            const nextConfig = RACK_TIER_CONFIG[currentRackTier];
            if (nextConfig) {
                if (btnExpandWarehouse) {
                    btnExpandWarehouse.classList.remove("hidden");
                    btnExpandWarehouse.innerText = nextConfig.label;
                    if (buildCooldownRemaining > 0) {
                        btnExpandWarehouse.style.opacity = "0.35";
                        btnExpandWarehouse.disabled = true;
                    } else if (gameState.resources.joules >= nextConfig.costJ) {
                        btnExpandWarehouse.style.opacity = "1.0";
                        btnExpandWarehouse.disabled = false;
                    } else {
                        btnExpandWarehouse.style.opacity = "0.35";
                        btnExpandWarehouse.disabled = true;
                    }
                }
                if (warehouseCostReadout) {
                    warehouseCostReadout.classList.remove("hidden");
                    warehouseCostReadout.innerText = nextConfig.subtext;
                }
            }
        }
    }

    // Render Dynamic Content in Machine Status counters depending on Branch choice in gameState
    if (gameState.meta.stage0_ideologicalChoice === null) {
        elMachines.innerText = Math.max(0, gameState.structures.turbines ? gameState.structures.turbines.count : 0);
    } else if (gameState.meta.stage0_ideologicalChoice === "A") {
        elDynamicLabel.innerText = "AC GENS";
        elMachines.innerText = gameState.structures.acGenerators || 0;
    } else if (gameState.meta.stage0_ideologicalChoice === "B") {
        elDynamicLabel.innerText = "TURBINES";
        elMachines.innerText = Math.max(0, gameState.structures.turbines ? gameState.structures.turbines.count : 0);
    }

    // Manage Loom Panel Control States & Snap Alert Flags
    if (gameState.structures.automatedLoom.built) {
        btnBuildLoom.classList.add("hidden");
        panelLoomControls.classList.remove("hidden");

        if (gameState.structures.automatedLoom.isBroken) {
            elLoomRuntimeStatus.innerText = "BROKEN/HALT";
            elLoomRuntimeStatus.className = "text-danger";
            btnRepairLoom.classList.remove("hidden");
        } else {
            const currentTension = gameState.structures.automatedLoom.tensionSetting;
            if (currentTension === "off") {
                elLoomRuntimeStatus.innerText = "STANDBY (OFF)";
                elLoomRuntimeStatus.className = "text-danger";
            } else {
                elLoomRuntimeStatus.innerText = `RUNNING (${LOOM_CONFIGS[currentTension].label})`;
                elLoomRuntimeStatus.className = "status-online";
            }
            btnRepairLoom.classList.add("hidden");
        }

        // Enforce Speed Button Lock States based on loomSpeedTier
        const loomTier = gameState.upgrades ? gameState.upgrades.loomSpeedTier : 1;
        if (btnTensionMed) btnTensionMed.disabled = (loomTier < 2);
        if (btnTensionHigh) btnTensionHigh.disabled = (loomTier < 3);

        // Highlight currently active tension state button and sync description
        const activeTension = gameState.structures.automatedLoom.tensionSetting || "off";
        
        if (btnTensionOff) btnTensionOff.classList.toggle("active", activeTension === "off");
        if (btnTensionLow) btnTensionLow.classList.toggle("active", activeTension === "low");
        if (btnTensionMed) btnTensionMed.classList.toggle("active", activeTension === "medium");
        if (btnTensionHigh) btnTensionHigh.classList.toggle("active", activeTension === "high");

        // Handle Loom Upgrade Button Visibility and Tiers
        if (loomTier >= 3) {
            if (panelLoomUpgrade) panelLoomUpgrade.classList.add("hidden");
        } else {
            if (panelLoomUpgrade) panelLoomUpgrade.classList.remove("hidden");
            const upgradeConfig = LOOM_UPGRADE_CONFIG[loomTier - 1];
            if (upgradeConfig) {
                if (loomUpgradeLabel) loomUpgradeLabel.innerText = upgradeConfig.label;
                if (loomUpgradeSubtext) loomUpgradeSubtext.innerText = upgradeConfig.subtext;

                if (gameState.resources.joules >= upgradeConfig.costJ && gameState.resources.wiring >= upgradeConfig.costW) {
                    if (btnUpgradeLoom) {
                        btnUpgradeLoom.style.opacity = "1.0";
                        btnUpgradeLoom.disabled = false;
                    }
                } else {
                    if (btnUpgradeLoom) {
                        btnUpgradeLoom.style.opacity = "0.35";
                        btnUpgradeLoom.disabled = true;
                    }
                }
            }
        }

        if (activeTension === "off") {
            elTensionDesc.innerText = "OFF — 0J/sec drain · Loom suspended";
        } else if (activeTension === "low") {
            elTensionDesc.innerText = "LOW — 2J/sec drain · 1 Wire every 10s · No snap risk";
        } else if (activeTension === "medium") {
            elTensionDesc.innerText = "MED — 5J/sec drain · 1 Wire every 5s · No snap risk";
        } else if (activeTension === "high") {
            elTensionDesc.innerText = "HIGH — 15J/sec drain · 1 Wire every 2s · 10% snap risk per increment";
        }
    }


    // Toggle Choice Encounter Overlay Panels reading from gameState.meta
    if (gameState.meta.morseDecoded && gameState.meta.stage0_ideologicalChoice === null) {
        panelMorseEncounter.classList.remove("hidden");
    } else {
        panelMorseEncounter.classList.add("hidden");
    }

    // Render Active Core Branch Tech Upgrades Buttons reading from gameState.meta.stage0_ideologicalChoice
    if (gameState.meta.stage0_ideologicalChoice === "A") {
        markerGridBranch.classList.remove("hidden");
        markerGridBranch.innerText = "✦ GRID SYSTEM: ALTERNATING CURRENT (AC)";
        markerGridBranch.className = "status-banner text-special";
        
        btnBuildAcGen.classList.remove("hidden");
        btnBuildFaraday.classList.remove("hidden");
    } else if (gameState.meta.stage0_ideologicalChoice === "B") {
        markerGridBranch.classList.remove("hidden");
        markerGridBranch.innerText = "⌗ GRID SYSTEM: DIRECT CURRENT (DC)";
        markerGridBranch.className = "status-banner";

        btnBuildTurbine.classList.remove("hidden");
        btnBuildLeyden.classList.remove("hidden");
        btnBuildJunction.classList.remove("hidden");
    }

    // Handle Victory Banner triggers reading from gameState.meta
    if (gameState.meta.victoryAchieved) {
        markerVictory.classList.remove("hidden");
    }

    // Step 2 Expedition Transport Crate UI Renderer
    if (gameState.crate && gameState.crate.unlocked && panelTransportCrate) {
        panelTransportCrate.classList.remove("hidden");

        const isPathA = gameState.meta.stage0_ideologicalChoice === "A";
        const minWires = 40;
        const maxWires = 100;
        const minGens = isPathA ? 2 : 5;
        const maxGens = isPathA ? 6 : 12;
        const unitName = isPathA ? "AC GENERATOR" : "LEYDEN JAR";

        // Branch indicator text
        if (crateBranchLabel) {
            crateBranchLabel.innerText = isPathA ? "BRANCH: AC GRID" : "BRANCH: DC MICRO-GRID";
        }

        // Available items beyond operational baseline limits
        const baselineWires = isPathA ? 40 : 30;
        const baselineGens = isPathA ? 5 : 0; // AC Generators (Path A) / Leyden Jars (Path B)
        const currentGenCount = isPathA ? (gameState.structures.acGenerators || 0) : (gameState.structures.leydenJars || 0);

        const availableWireToPack = Math.max(0, gameState.resources.wiring - baselineWires);
        const availableGenToPack = Math.max(0, currentGenCount - baselineGens);

        // Update packed item counts
        if (crateWireStatus) {
            crateWireStatus.innerText = `PACKED WIRES: ${gameState.crate.wires} / ${minWires} (MIN) [MAX ${maxWires}] (RESERVE REQ: ${baselineWires})`;        }
        if (crateGenStatus) {
            crateGenStatus.innerText = `PACKED ${unitName}S: ${gameState.crate.generators} / ${minGens} (MIN) [MAX ${maxGens}]`;
        }

        // Pack Wire Button state
        if (btnPackWire) {
            btnPackWire.innerText = `[ PACK WIRE (+1) ]`;
            if (availableWireToPack > 0 && gameState.crate.wires < maxWires) {
                btnPackWire.style.opacity = "1.0";
                btnPackWire.disabled = false;
            } else {
                btnPackWire.style.opacity = "0.35";
                btnPackWire.disabled = true;
            }
        }

        // Pack Generator/Jar Button state
        if (btnPackGen) {
            btnPackGen.innerText = `[ PACK ${unitName} (+1) ]`;
            if (availableGenToPack > 0 && gameState.crate.generators < maxGens) {
                btnPackGen.style.opacity = "1.0";
                btnPackGen.disabled = false;
            } else {
                btnPackGen.style.opacity = "0.35";
                btnPackGen.disabled = true;
            }
        }

        // Launch Button readiness state
        if (btnLaunchExpedition) {
            const hasMinWires = gameState.crate.wires >= minWires;
            const hasMinGens = gameState.crate.generators >= minGens;

            if (hasMinWires && hasMinGens) {
                btnLaunchExpedition.style.opacity = "1.0";
                btnLaunchExpedition.disabled = false;
                if (launchSubtext) launchSubtext.innerText = "ALL MINIMUMS MET — READY FOR LAUNCH";
            } else {
                btnLaunchExpedition.style.opacity = "0.35";
                btnLaunchExpedition.disabled = true;
                if (launchSubtext) launchSubtext.innerText = `REQUIRES: ${minWires} Wires & ${minGens} ${unitName}s`;
            }
        }
    } else if (panelTransportCrate) {
        panelTransportCrate.classList.add("hidden");
    }

// Handle Top Sticky Alert Bar flashing states using gameState.combat & uiState
    if (gameState.combat.underAttack) {
        elAlertBanner.classList.remove("hidden");
        elAlertBanner.style.backgroundColor = "var(--ember-red)";
        elAlertText.innerText = `⚠ SECURITY ALERT — EDISON SABOTAGE ACTIVE (${gameState.combat.attackCountdown || 10}s) ⚠`;
    } else if (gameState.meta.morseTriggered && !gameState.meta.morseDecoded) {
        // Fallback guard to ensure countdown is a valid number
        const displaySeconds = (typeof gameState.meta.morseCountdown === "number" && !isNaN(gameState.meta.morseCountdown)) 
            ? gameState.meta.morseCountdown 
            : 30;

        elAlertBanner.classList.remove("hidden");
        elAlertBanner.classList.remove("scroll-alert");
        elAlertBanner.style.backgroundColor = "var(--electric-cyan)";
        elAlertText.innerText = `▸ DECODING SIGNAL FROM POUGHKEEPSIE STATION (${displaySeconds}s) ◂`;
    } else if (gameState.uiState.terminalScrolledOut) {
        elAlertBanner.classList.remove("hidden");
        elAlertBanner.classList.add("scroll-alert");
        elAlertBanner.style.backgroundColor = "";
        elAlertText.innerText = "▸ NEW LOG ENTRY AVAILABLE — CLICK TO VIEW TERMINAL ◂";
    } else {
        elAlertBanner.classList.add("hidden");
        elAlertBanner.classList.remove("scroll-alert");
    }

    // Manage Grid Connection Visual Status Indicators
    if (gameState.meta.victoryAchieved) {
        elGridStatus.innerText = "SECURED / STABLE";
        elGridStatus.className = "status-online";
    } else if (gameState.combat.underAttack) {
        elGridStatus.innerText = "SABOTAGED LOCKOUT";
        elGridStatus.className = "status-offline";
    } else if (gameState.meta.stage0_ideologicalChoice !== null) {
        elGridStatus.innerText = "OPERATIONAL POWERED";
        elGridStatus.className = "status-online";
    } else {
        elGridStatus.innerText = "OFFLINE";
        elGridStatus.className = "status-offline";
    }

    // Dynamic Button Dimming reading costs from gameState
    if (gameState.resources.joules < 10) { btnForge.style.opacity = "0.35"; } else { btnForge.style.opacity = "1.0"; }
    if (gameState.resources.wiring < 10) { btnBuildTurbine.style.opacity = "0.35"; } else { btnBuildTurbine.style.opacity = "1.0"; }
    if (gameState.resources.joules < 50) { btnBuildLoom.style.opacity = "0.35"; } else { btnBuildLoom.style.opacity = "1.0"; }
    if (gameState.resources.joules < 20 || gameState.resources.wiring < 5 || buildCooldownRemaining > 0) { btnBuildAcGen.style.opacity = "0.35"; } else { btnBuildAcGen.style.opacity = "1.0"; }
    if (gameState.resources.wiring < 20) { btnBuildFaraday.style.opacity = "0.35"; } else { btnBuildFaraday.style.opacity = "1.0"; }
    if (gameState.resources.wiring < 5 || buildCooldownRemaining > 0) { btnBuildLeyden.style.opacity = "0.35"; } else { btnBuildLeyden.style.opacity = "1.0"; }
    if (gameState.resources.joules < 200) { btnBuildJunction.style.opacity = "0.35"; } else { btnBuildJunction.style.opacity = "1.0"; }
    if (btnWarehouse) {
        if (gameState.resources.joules < 80 || gameState.resources.wiring < 10) {
            btnWarehouse.style.opacity = "0.35";
        } else {
            btnWarehouse.style.opacity = "1.0";
        }
    }

    // Handle Status Footers & Rates Data Output Rows
    const acGens = gameState.structures.acGenerators || 0;
    const turbineCount = gameState.structures.turbines ? gameState.structures.turbines.count : 0;
    let passiveSum = (gameState.meta.stage0_ideologicalChoice === "A") ? (acGens * 5) : (turbineCount * 1);
    if (passiveSum > 0) {
        footGeneration.classList.remove("hidden");
        footGeneration.innerText = `+${passiveSum}J/s${gameState.combat.underAttack ? " [OFF]" : ""}`;
        footGeneration.className = gameState.combat.underAttack ? "text-danger" : "text-special";
    }

    if (gameState.structures.automatedLoom.built) {
        footLoom.classList.remove("hidden");
        const loomObj = gameState.structures.automatedLoom;
        footLoom.innerText = `LOOM:${loomObj.isBroken ? "HALT" : LOOM_CONFIGS[loomObj.tensionSetting].label}`;
        footLoom.className = loomObj.isBroken ? "text-danger" : "";
    }

    if (gameState.combat.trustActivated && !gameState.meta.victoryAchieved) {
        footThreat.classList.remove("hidden");
    } else {
        footThreat.classList.add("hidden");
    }

    const fCages = gameState.structures.faradayCages || 0;
    const jBoxes = gameState.structures.junctionBox.count || 0;
    let defSum = fCages + jBoxes;
    if (defSum > 0) {
        footDefenses.classList.remove("hidden");
        footDefenses.innerText = `DEF: ${fCages}FC / ${jBoxes}JB`;
    }
}


// ==========================================
// 6. PLAYER BUTTON INTERACTION HANDLERS (UPDATED FOR FULL GAMESTATE)
// ==========================================

// Manual Kinetic Dynamo Crank Handler
btnCrank.addEventListener("click", () => {
    if (!gameState.caps) gameState.caps = { joulesMax: 100, wireStorageCap: 10 };

    let maxJouleCap = 100;

    if (gameState.meta.stage0_ideologicalChoice === "A") {
        maxJouleCap = 150;
    } else if (gameState.meta.stage0_ideologicalChoice === "B" && gameState.structures.leydenJars > 0) {
        maxJouleCap = 100 + (gameState.structures.leydenJars * 100);
    }

    gameState.caps.joulesMax = maxJouleCap;

    if (gameState.resources.joules < gameState.caps.joulesMax) {
        gameState.resources.joules += 1;
        writeFlavorLog("crank", "action");

        // Unlock Morse Decoder trigger threshold reading/writing gameState.meta
        if (gameState.resources.joules >= 50 && !gameState.meta.morseTriggered) {
            gameState.meta.morseTriggered = true;
            gameState.meta.morseCountdown = 30; // Initialize 30-second countdown integer
            gameState.structures.morseReceiver.built = true;
            gameState.structures.morseReceiver.activeDecoding = true;
            
            writeStoryLog("The spark-gap Morse receiver springs to life! It is automatically recording an incoming long-distance frequencies pattern...", "unlock");
            if (markerMorseDecoding) markerMorseDecoding.classList.remove("hidden");
        }
    } else {
        writeStoryLog("\u26A0\uFE0F Joule containment ceiling reached. Excess energy dispersed.", "warning");
    }

    renderUI();
});

// Manual Wiring Wire Forge Button
btnForge.addEventListener("click", () => {
    if (gameState.resources.joules >= 10) {
        if (gameState.resources.wiring >= gameState.caps.wireStorageCap) {
            writeStoryLog("Logistics error: Stored spool rack capacity overflow limits hit. Upgrade warehouse storage capacity to forge more.", "warning");
            return;
        }
        gameState.resources.joules -= 10;
        gameState.resources.wiring += 1;
        writeFlavorLog("forgeWire", "action");
    }
    renderUI();
});


// Build Automated Loom Infrastructure
btnBuildLoom.addEventListener("click", () => {
    if (gameState.resources.joules >= 50) {
        gameState.resources.joules -= 50;
        
        // Update structural state in gameState (explicitly defaulting to OFF)
        gameState.structures.automatedLoom.built = true;
        gameState.structures.automatedLoom.count = 1;
        gameState.structures.automatedLoom.tensionSetting = "off";
        
        writeLog("Constructed automated mechanical Pneumatic Loom system. System in STANDBY (OFF).", "unlock");
    }
    renderUI();
});

// Repair Snap Event
btnRepairLoom.addEventListener("click", () => {
    if (gameState.resources.joules >= 10) {
        gameState.resources.joules -= 10;
        
        // Reset loom broken state in gameState
        gameState.structures.automatedLoom.isBroken = false;
        loomProgressMs = 0; // Reset progress tracking counter
        
        writeLog("Re-threaded snapped shuttle lines and centered guides. Loom mechanical reliability restored.", "action");
    }
    renderUI();
});


// Loom Speed Tuning Selectors
function setLoomTension(mode) {
    if (gameState.structures.automatedLoom.isBroken) return;

    const currentLoomTier = gameState.upgrades ? gameState.upgrades.loomSpeedTier : 1;
    if (mode === "medium" && currentLoomTier < 2) {
        writeLog("\u26A0\uFE0F MED tension locked. Requires Loom Speed Upgrade Tier 2.", "warning");
        return;
    }
    if (mode === "high" && currentLoomTier < 3) {
        writeLog("\u26A0\uFE0F HIGH tension locked. Requires Loom Speed Upgrade Tier 3.", "warning");
        return;
    }
    
    // Timer Reset Rule: Reset progress on any state switch
    if (gameState.structures.automatedLoom.tensionSetting !== mode) {
        loomProgressMs = 0;
    }

    // Save tension setting into gameState tree
    gameState.structures.automatedLoom.tensionSetting = mode;
    
    writeLog(`Pneumatic loom cycle frequency regulator adjusted to [${mode.toUpperCase()} TENSION].`, "action");
    
    // Refresh UI to update active button styles and descriptions
    renderUI();
}J


if (btnTensionOff) btnTensionOff.addEventListener("click", () => setLoomTension("off"));
btnTensionLow.addEventListener("click", () => setLoomTension("low"));
btnTensionMed.addEventListener("click", () => setLoomTension("medium"));
btnTensionHigh.addEventListener("click", () => setLoomTension("high"));


// Wire Spool Rack Expansion Handler (5-second Timer & Tier Costs)
if (btnExpandWarehouse) {
    btnExpandWarehouse.addEventListener("click", () => {
        if (buildCooldownRemaining > 0) {
            writeLog("\u26A0\uFE0F Floor construction lines busy. Awaiting structural frame assembly.", "warning");
            return;
        }

        if (!gameState.upgrades) gameState.upgrades = { rackTier: 0, loomSpeedTier: 1 };
        const currentTier = gameState.upgrades.rackTier;

        if (currentTier >= 5 || gameState.caps.wireStorageCap >= 100) {
            writeLog("Maximum Wire Rack capacity (100) already reached.", "warning");
            return;
        }

        const config = RACK_TIER_CONFIG[currentTier];
        if (gameState.resources.joules >= config.costJ) {
            gameState.resources.joules -= config.costJ;
            buildCooldownRemaining = 5; // 5-second build timer

            gameState.queues.constructionJobs.push({
                id: `RACK_TIER_${currentTier + 1}`,
                onComplete: () => {
                    gameState.upgrades.rackTier++;
                    gameState.caps.wireStorageCap = config.cap;
                    writeLog(`\uD83D\uDD27 Wire Spool Rack expansion complete! Capacity increased to ${config.cap} Wires.`, "unlock");
                    renderUI();
                }
            });

            writeLog(`Initiating Wire Spool Rack construction tier (5s build time)...`, "action");
        } else {
            writeLog(`Insufficient Joules. Requires ${config.costJ} Joules for this rack expansion tier.`, "warning");
        }
        renderUI();
    });
}

// Vertical Pneumatic Loom Speed Tier Upgrade Handler
if (btnUpgradeLoom) {
    btnUpgradeLoom.addEventListener("click", () => {
        if (!gameState.upgrades) gameState.upgrades = { rackTier: 0, loomSpeedTier: 1 };
        const loomTier = gameState.upgrades.loomSpeedTier;

        if (loomTier >= 3) return;

        const config = LOOM_UPGRADE_CONFIG[loomTier - 1];
        if (gameState.resources.joules >= config.costJ && gameState.resources.wiring >= config.costW) {
            gameState.resources.joules -= config.costJ;
            gameState.resources.wiring -= config.costW;
            gameState.upgrades.loomSpeedTier++;

            const unlockedMode = gameState.upgrades.loomSpeedTier === 2 ? "MED" : "HIGH";
            writeLog(`\u26A1 Pneumatic Loom drive mechanisms upgraded! Unlocked [${unlockedMode}] speed setting.`, "unlock");
        } else {
            writeLog(`Insufficient resources. Requires ${config.costJ} Joules and ${config.costW} Wires.`, "warning");
        }
        renderUI();
    });
}

// Emergency Capacitor Dump Button
btnOvercharge.addEventListener("click", () => {
    if (gameState.resources.wiring >= 5 && !gameState.meta.capacitorOvercharged) {
        gameState.meta.capacitorOvercharged = true;
        
        let generatedYield = Math.floor(gameState.resources.joules / 10) * 2;
        gameState.caps.wireStorageCap += generatedYield;
        gameState.resources.wiring += generatedYield;
        gameState.resources.joules = 0;

        btnOvercharge.classList.add("hidden");
        panelOverchargeDepleted.classList.remove("hidden");

        writeLog(`\u26A0\uFE0F CRITICAL DIRECT OVERCHARGE SPENT! Dissipated entire storage core to weld out +${generatedYield} Wiring instantly.`, "warning");
    }
    renderUI();
});

// Branch Encounter Choice A (AC Path)
btnChoiceAC.addEventListener("click", () => {
    if (gameState.resources.wiring >= 15) {
        gameState.resources.wiring -= 15;
        gameState.meta.stage0_ideologicalChoice = "A";
        gameState.combat.trustActivated = true; // Edison trust begins tracking
        gameState.combat.nextAttackTime = 30;   // Arm first sabotage window
        panelMorseEncounter.classList.add("hidden");
        markerMorseDecoding.classList.add("hidden");
        
        gameState.caps.joulesMax = 150;

        document.getElementById("btn-expand-warehouse").querySelector(".btn-subtext").innerText = "Cost: 80J, 10 Wiring — Expands max wire storage cap by +20";

        writeStoryLog("Agreement Signed. Poughkeepsie Station shares Alternating Current blueprints. \u26A0\uFE0F Warning: The Edison Trust has declared our project an illegal patent infringement!", "warning");
    }
    renderUI();
});

// Branch Encounter Choice B (DC Path)
btnChoiceDC.addEventListener("click", () => {
    if (gameState.resources.wiring >= 10) {
        gameState.resources.wiring -= 10;
        gameState.meta.stage0_ideologicalChoice = "B";
        
        // Path B starts with 0 Leyden Jars (Max = 100J until first Jar built)
        gameState.structures.leydenJars = 0;
        
        gameState.combat.trustActivated = true;
        gameState.combat.nextAttackTime = 45;
        panelMorseEncounter.classList.add("hidden");
        markerMorseDecoding.classList.add("hidden");
        writeStoryLog("Transmission Denied. Locked keys down. We will shelter behind local isolation fields and store power natively inside Leyden arrays.", "unlock");
    }
    renderUI();
});


// Assemble Bluff-Side Turbine Stack
btnBuildTurbine.addEventListener("click", () => {
    if (gameState.resources.wiring >= 10) {
        gameState.resources.wiring -= 10;
        
        // Increment handCrank / coil count in gameState structures
        // Increment Bluff-Side Turbines count in gameState structures
        gameState.structures.turbines.count++;
        const turbineTotal = gameState.structures.turbines.count;
        
        writeFlavorLog("turbine", "unlock");
        writeStoryLog(`Turbine assembly #${turbineTotal} mounted along coastal cliff (+1J/s).`, "unlock");
    }
    renderUI();
});

// Branch Specific Builders Buttons
// Build AC Generator Upgrade
btnBuildAcGen.addEventListener("click", () => {
    if (buildCooldownRemaining > 0) {
        writeLog("Construction lines busy. Awaiting core configuration assembly stabilization.", "warning");
        return;
    }

    if (gameState.resources.joules >= 20 && gameState.resources.wiring >= 5) {
        buildCooldownRemaining = 5; // Start 5s queue countdown
        gameState.resources.joules -= 20;
        gameState.resources.wiring -= 5;

        // Push structural construction job into the gameState queue
        gameState.queues.constructionJobs.push({
            id: "AC_GEN",
            onComplete: () => {
                // Ensure acGenerators property exists and increment it directly
                gameState.structures.acGenerators = (gameState.structures.acGenerators || 0) + 1;
                writeLog(`Heavy rotation turbine configured. AC Generator system #${gameState.structures.acGenerators} integrated. (+5J/s)`, "unlock");
                renderUI(); // Refresh UI immediately on build completion
            }
        });

        writeLog("Initiating assembly sequence for Heavy AC Generator core...", "action");
    } else {
        writeLog("Incomplete sub-components inventory. Cannot construct AC generation configuration matrix.", "warning");
    }
    renderUI();
});

// Build Leyden Jar Assembly (Path B Exclusive)
btnBuildLeyden.addEventListener("click", () => {
    if (buildCooldownRemaining > 0) {
        writeLog("Assembly lines occupied. Awaiting capacitive stabilization.", "warning");
        return;
    }

    if (gameState.resources.wiring >= 5) {
        buildCooldownRemaining = 5; // Start 5s queue countdown
        gameState.resources.wiring -= 5;

        // Push Leyden Jar construction job into queue
        gameState.queues.constructionJobs.push({
            id: "LEYDEN_JAR",
            onComplete: () => {
                gameState.structures.leydenJars = (gameState.structures.leydenJars || 0) + 1;
                
                // Base capacity is 100J. Each Leyden Jar adds +100J storage capacity.
                // 1 Jar = 200J, 2 Jars = 300J, 3 Jars = 400J
                const newMax = 100 + (gameState.structures.leydenJars * 100);
                gameState.caps.joulesMax = newMax;

                writeLog(`Capacitive array sealed. Leyden Jar #${gameState.structures.leydenJars} connected! Storage ceiling expanded to ${newMax}J.`, "unlock");
                renderUI();
            }
        });

        writeLog("Initiating glass-and-foil foil layering sequence for Leyden Jar...", "action");
    } else {
        writeLog("Insufficient Wiring. 5 Wiring required to fashion capacitive plates.", "warning");
    }
    renderUI();
});

// Faraday Cage Shield Builder (Path A Exclusive)
btnBuildFaraday.addEventListener("click", () => {
    if (gameState.resources.wiring >= 20) {
        gameState.resources.wiring -= 20;
        gameState.structures.faradayCages = (gameState.structures.faradayCages || 0) + 1;
        writeLog(`Copper mesh framework anchored. Faraday Cage shields #${gameState.structures.faradayCages} established. Threat approach windows extended.`, "unlock");
    }
    renderUI();
});

// Build Junction Box Shield Builder (Path B Exclusive)
btnBuildJunction.addEventListener("click", () => {
    if (gameState.resources.joules >= 200) {
        gameState.resources.joules -= 200;
        
        if (!gameState.structures.junctionBox) {
            gameState.structures.junctionBox = { built: true, count: 0 };
        }
        gameState.structures.junctionBox.built = true;
        gameState.structures.junctionBox.count = (gameState.structures.junctionBox.count || 0) + 1;

        writeLog(`Isolated relay point wired. Junction Box #${gameState.structures.junctionBox.count} installed. Incoming sabotage damage blunted.`, "unlock");
    } else {
        writeLog("Insufficient Joules. Requires 200J to energize localized isolation breaker.", "warning");
    }
    renderUI();
});


// ==========================================
// 7. THE MASTER INTERVAL TICK ENGINE (1Hz) (100% GAMESTATE BOUND)
// ==========================================

setInterval(() => {
    // --------------------------------------
    // Part A: Saboteur Ambush Event Systems Lockouts
    // --------------------------------------
    if (gameState.combat.underAttack) {
        gameState.combat.attackCountdown--;
        if (gameState.combat.attackCountdown <= 0) {
            gameState.combat.underAttack = false;
            writeLog("Relay lines reset. Local generator networks back online.", "system");
        }
        renderUI();
        return;
    }

    // --------------------------------------
    // Part B: Passive Generation Accumulation
    // --------------------------------------
    let generatedJoules = 0;
    
    if (gameState.meta.stage0_ideologicalChoice === "A") {
        const acGens = gameState.structures.acGenerators || 0;
        generatedJoules = acGens * 5; 
    } else {
        const activeTurbines = gameState.structures.turbines ? gameState.structures.turbines.count : 0;
        generatedJoules = activeTurbines * 1; 
    }
    
    gameState.resources.joules += generatedJoules;

    // --------------------------------------
    // Part C: Automated Loom Processing Logic
    // --------------------------------------
    const loom = gameState.structures.automatedLoom;
    if (loom.built && !loom.isBroken && loom.tensionSetting !== "off" && gameState.resources.wiring < gameState.caps.wireStorageCap) {
        const activeConfig = LOOM_CONFIGS[loom.tensionSetting];
        
        if (gameState.resources.joules >= activeConfig.jouleDrain) {
            gameState.resources.joules -= activeConfig.jouleDrain;
            loomProgressMs += 1000;

            if (loomProgressMs >= activeConfig.wireIntervalMs) {
                loomProgressMs = 0;

                if (loom.tensionSetting === "high" && Math.random() < 0.10) {
                    loom.isBroken = true;
                    writeFlavorLog("loomSnap", "warning");
                } else {
                    gameState.resources.wiring += 1;
                    writeLog("Automated loom shuttle finishes cycle unit tracking block. Wire +1 produced.", "system");
                }
            }
        } else {
            writeLog("Loom system brownout: Field pressure falling below requirement metrics.", "warning");
        }
    }

// --------------------------------------
    // Part D: Morse Decoder Timeline Progression Countdown
    // --------------------------------------
    if (gameState.meta.morseTriggered && !gameState.meta.morseDecoded) {
        if (typeof gameState.meta.morseCountdown !== "number" || isNaN(gameState.meta.morseCountdown)) {
            gameState.meta.morseCountdown = 30;
        }

        gameState.meta.morseCountdown--;

        if (gameState.meta.morseCountdown <= 0) {
            gameState.meta.morseDecoded = true;
            if (gameState.structures.morseReceiver) {
                gameState.structures.morseReceiver.activeDecoding = false;
            }
            
            if (markerMorseDecoding) markerMorseDecoding.classList.add("hidden");
            
            writeStoryLog("\uD83D\uDCE1 SIGNAL FULLY DECODED. Open transmission lines from Poughkeepsie Station are requiring immediate field response commands.", "unlock");

            // Force dynamic overlay display toggle on tick completion
            if (panelMorseEncounter) {
                panelMorseEncounter.classList.remove("hidden");
            }
        }
    }

    // --------------------------------------
    // Part E: Edison Trust Raid Scheduler Logic
    // --------------------------------------
    if (gameState.combat.trustActivated && !gameState.meta.victoryAchieved) {
        gameState.combat.nextAttackTime--;
        if (gameState.combat.nextAttackTime <= 0) {
            gameState.combat.underAttack = true;
            gameState.combat.attackCountdown = 10;
            
            const msgIndex = Math.floor(Math.random() * ATTACK_MESSAGES.length);
            writeLog(`⚠ EXTRALIEGAL ATTACK: ${ATTACK_MESSAGES[msgIndex]} Stored resources damaged!`, "warning");

            let lossWiring = (gameState.meta.stage0_ideologicalChoice === "A") ? 5 : 3;
            const jBoxes = gameState.structures.junctionBox.count || 0;
            if (jBoxes > 0) {
                lossWiring = Math.max(0, Math.floor(lossWiring / (2 * jBoxes)));
            }
            gameState.resources.wiring -= lossWiring;

            const fCages = gameState.structures.faradayCages || 0;
            const safetyBuffer = fCages * 15;
            const baseIntervalWindow = (gameState.meta.stage0_ideologicalChoice === "A") ? 30 : 45;
            gameState.combat.nextAttackTime = baseIntervalWindow + safetyBuffer + Math.floor(Math.random() * 20);
        }
    }

// --------------------------------------
    // Part F: Global Build Queue Cooldown Decrement & Completion
    // --------------------------------------
    if (buildCooldownRemaining > 0) {
        buildCooldownRemaining--;
        
        if (buildCooldownRemaining > 0) {
            if (gameState.meta.stage0_ideologicalChoice === "A" && btnBuildAcGen) {
                btnBuildAcGen.querySelector(".btn-text").innerText = `[ Assembling... ${buildCooldownRemaining}s ]`;
            } else if (gameState.meta.stage0_ideologicalChoice === "B" && btnBuildLeyden) {
                btnBuildLeyden.querySelector(".btn-text").innerText = `[ Assembling... ${buildCooldownRemaining}s ]`;
            }
        
        } else {
            if (btnBuildAcGen) btnBuildAcGen.querySelector(".btn-text").innerText = "[ BUILD AC GENERATOR ]";
            if (btnBuildLeyden) btnBuildLeyden.querySelector(".btn-text").innerText = "[ BUILD LEYDEN JAR ]";

            // Process job from gameState.queues.constructionJobs queue
            if (gameState.queues.constructionJobs && gameState.queues.constructionJobs.length > 0) {
                const job = gameState.queues.constructionJobs.shift(); // Shift job off queue
                if (typeof job.onComplete === "function") {
                    job.onComplete(); // Triggers onComplete, incrementing generator count
                }
            }
        }
    }

// --------------------------------------
    // Part G: Win Condition Evaluation
    // --------------------------------------
    const acGens = gameState.structures.acGenerators || 0;
    const activeTurbines = gameState.structures.turbines ? gameState.structures.turbines.count : 0;

    if (gameState.meta.stage0_ideologicalChoice === "A" && acGens >= 5 && gameState.resources.wiring >= 40) {
        if (!gameState.meta.victoryAchieved) {
            writeLog("\uD83C\uDFC6 VICTORY ACHIEVED! Alternating Current power grid fully stabilized and secured against Edison Trust interference!", "milestone");        }
        gameState.meta.victoryAchieved = true;
        if (gameState.crate) gameState.crate.unlocked = true;
    } else if (gameState.meta.stage0_ideologicalChoice === "B" && activeTurbines >= 10 && gameState.resources.wiring >= 30) {
        if (!gameState.meta.victoryAchieved) {
            writeLog("\uD83C\uDFC6 VICTORY ACHIEVED! Isolated Direct Current micro-grid completely fortified and operational!", "milestone");        }
        gameState.meta.victoryAchieved = true;
        if (gameState.crate) gameState.crate.unlocked = true;
    }

    renderUI();
}, SYSTEM_TICK_RATE_MS);



// ==========================================
// 8. INITIAL BOOTSTRAP INITIALIZATION
// ==========================================

// --- GLOBAL WINDOW SCROLL & BANNER INTERACTION LISTENERS ---
window.addEventListener("scroll", () => {
    if (gameState.uiState.terminalScrolledOut) {
        const logBoundingRect = elTerminalLog.getBoundingClientRect();
        if (logBoundingRect.bottom >= 0) {
            gameState.uiState.terminalScrolledOut = false;
            renderUI();
        }
    }
});

elAlertBanner.addEventListener("click", () => {
    if (gameState.uiState.terminalScrolledOut) {
        gameState.uiState.terminalScrolledOut = false;
        elTerminalLog.scrollIntoView({ behavior: "smooth", block: "center" });
        renderUI();
    }
});

// ==========================================
// 9. EXPEDITION TRANSPORT CRATE EVENT HANDLERS
// ==========================================

if (btnPackWire) {
    btnPackWire.addEventListener("click", () => {
        const isPathA = gameState.meta.stage0_ideologicalChoice === "A";
        const baselineWires = isPathA ? 40 : 30;
        const maxWires = 100;

        if (gameState.resources.wiring > baselineWires && gameState.crate.wires < maxWires) {
            gameState.resources.wiring -= 1;
            gameState.crate.wires += 1;
            writeLog(`Packed +1 Copper Wiring into Transport Crate. (Crate Wires: ${gameState.crate.wires})`, "action");
        } else {
            writeLog("Cannot pack wire: Operational baseline reached or Crate wire capacity full.", "warning");
        }
        renderUI();
    });
}

if (btnPackGen) {
    btnPackGen.addEventListener("click", () => {
        const isPathA = gameState.meta.stage0_ideologicalChoice === "A";
        const maxGens = isPathA ? 6 : 12;
        const unitName = isPathA ? "AC Generator" : "Leyden Jar";

        if (isPathA) {
            const baselineGens = 5; // Operational baseline for AC path
            if ((gameState.structures.acGenerators || 0) > baselineGens && gameState.crate.generators < maxGens) {
                gameState.structures.acGenerators -= 1;
                gameState.crate.generators += 1;
                writeLog(`Packed +1 ${unitName} into Transport Crate. Active generation adjusted. (Crate Units: ${gameState.crate.generators})`, "action");
            } else {
                writeLog(`Cannot pack ${unitName}: Baseline capacity locked or Crate ceiling met.`, "warning");
            }
        } else {
            const baselineJars = 0; // Baseline for Leyden Jars
            if ((gameState.structures.leydenJars || 0) > baselineJars && gameState.crate.generators < maxGens) {
                gameState.structures.leydenJars -= 1;
                gameState.crate.generators += 1;
                
                // Recalculate max Joule capacity on packing a Jar
                const newMax = 100 + (gameState.structures.leydenJars * 100);
                gameState.caps.joulesMax = newMax;

                writeLog(`Packed +1 ${unitName} into Transport Crate. Storage capacity re-indexed to ${newMax}J. (Crate Units: ${gameState.crate.generators})`, "action");
            } else {
                writeLog(`Cannot pack ${unitName}: Crate ceiling met or no extra jars available.`, "warning");
            }
        }
        renderUI();
    });
}

if (btnLaunchExpedition) {
    btnLaunchExpedition.addEventListener("click", () => {
        const isPathA = gameState.meta.stage0_ideologicalChoice === "A";
        const minWires = 40;
        const minGens = isPathA ? 2 : 5;

        if (gameState.crate.wires >= minWires && gameState.crate.generators >= minGens) {
            writeStoryLog("\uD83D\uDE80 EXPEDITION LAUNCHED! The crate is sealed and strapped to the rail line. Wardenclyffe pioneers advance to Stage 1!", "milestone");        }
        renderUI();
    });
}

// Links standard layout buttons to text targets and sets opening message.
writeStoryLog("System initialization sequence complete. Field station primary terminal online.", "system");
renderUI();
