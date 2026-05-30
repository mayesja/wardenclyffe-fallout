// ==========================================
// 1. GAME CONSTANTS & REFERENCE VALUES
// ==========================================
// These values never change while the game is running. They are our balance blueprint.

const INITIAL_WIRE_STORAGE_CAP = 20; // Default max limit for carrying copper wiring
const SYSTEM_TICK_RATE_MS = 1000;    // The global heartbeat timer runs every 1000ms (1 second)

// This dictionary holds the precise tuning metrics for our automated loom machinery
const LOOM_CONFIGS = {
    low:    { jouleDrain: 2,  wireIntervalMs: 10000, label: "LOW" },
    medium: { jouleDrain: 5,  wireIntervalMs: 5000,  label: "MED" },
    high:   { jouleDrain: 15, wireIntervalMs: 2000,  label: "HIGH" }
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
// These hold the numbers that change second-to-second. This is your player's data.

let joules = 0;             // Current raw energy reserves
let wiring = 0;             // Current stored copper wire items
let wireStorageCap = INITIAL_WIRE_STORAGE_CAP; // Current limit on how much wire player can carry

// Mechanical Automation Trackers
let loomBuilt = false;      // Tracks if player unlocked the loom machine infrastructure
let loomTension = "low";    // Current setting of loom speed toggle ("low", "medium", "high")
let loomBroken = false;     // Safety flag: turns true if a high-tension snap event occurs
let loomProgressMs = 0;     // Internal timer tracking progress toward forging the next wire unit

// Technological Progression Branching
let morseTriggered = false; // Tracks if the 50 Joule threshold was hit to start Morse receiver decoding
let morseDecoded = false;   // Set to true when the 30-second receiver text log countdown finishes
let morseCountdown = 30;    // How many seconds remain until Station Omaha's letter arrives
let morseChoice = null;     // Permanent branch choice tracker: "A" (AC System) or "B" (DC System)

// Automated Infrastructure Counts
let teslaCoils = 0;         // Base automated energy collectors (+1 Joule/sec each)
let acGenerators = 0;       // Branch A High-yield generators (+5 Joules/sec each)
let faradayCages = 0;       // Branch A Defense units: reduces the frequency of enemy attacks
let leydenJars = 0;         // Branch B Defense/Storage units: tracks owned Leyden Jar arrays
let junctionBoxes = 0;      // Branch B Defense units: blunts the raw resource damage of attacks

// Disaster & Victory State Trackers
let trustActivated = false; // Flag that permanently summons the Edison Trust strike loop
let underAttack = false;    // Temporary lockout: turns true for 10 seconds during a raid
let attackCountdown = 0;    // Remaining duration of the current generator blackout lock
let nextAttackTime = 0;     // Randomized variable counting down to the next ambush event
let capacitorOvercharged = false; // Tracks if the one-time emergency power dump was spent
let victoryAchieved = false; // Set to true when win condition criteria are successfully satisfied

// Internal Log ID Indexer
let logIncrementId = 0;

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
const btnAssembleCoil = document.getElementById("btn-assemble-coil");
const btnBuildAcGen = document.getElementById("btn-build-ac-gen");
const btnBuildLeyden = document.getElementById("btn-build-leyden");
const btnBuildFaraday = document.getElementById("btn-build-faraday");
const btnBuildJunction = document.getElementById("btn-build-junction");
const btnChoiceAC = document.getElementById("btn-choiceAC");
const btnChoiceDC = document.getElementById("btn-choiceDC");

const panelWarehouse = document.getElementById("panel-warehouse");
const btnExpandWarehouse = document.getElementById("btn-expand-warehouse");
const panelOverchargeDepleted = document.getElementById("panel-overcharge-depleted");
const panelLoomControls = document.getElementById("panel-loom-controls");
const btnRepairLoom = document.getElementById("btn-repair-loom");
const panelMorseEncounter = document.getElementById("panel-morse-encounter");

// Tension Buttons Group
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


// ==========================================
// 4. CORE ENGINE UTILITY FUNCTIONS
// ==========================================

// Injects a stylized line of status update text inside the central scrolling log box
function writeLog(text, type = "system") {
    logIncrementId++;
    const entry = document.createElement("div");
    entry.className = `log-entry log-${type}`;
    entry.innerText = `[t+${logIncrementId}] ${text}`;
    elTerminalLog.appendChild(entry);
    
    // Forces the logging box container viewport to automatically scroll down to stick to latest text
    elTerminalLog.scrollTop = elTerminalLog.scrollHeight;
}

function enforceBoundaries() {
    // ENFORCING DESIGN LIMITATION: Joules cannot exceed the capacity of your field array
    let maxJouleCap = 100; 
    
    // SURGICAL UPDATE: Every built Leyden Jar dynamically adds +100 to the max capacity ceiling
    if (morseChoice === "B" && leydenJars > 0) {
        maxJouleCap = 100 + (leydenJars * 100); 
    }
    
    // Clamp Joules to the current maximum allowance
    if (joules > maxJouleCap) {
        joules = maxJouleCap;
    }
    
    // Wire inventories cannot cross the active structural storage caps
    if (wiring > wireStorageCap) wiring = wireStorageCap;
    if (wiring < 0) wiring = 0;
    if (joules < 0) joules = 0;
}

// ==========================================
// 5. INTERFACE REFRESH CONTROL (THE UI RENDERER)
// ==========================================
// This single master engine checks the raw data states and forces the HTML page elements to reflect updates.

function renderUI() {
    enforceBoundaries();

    // Standard Value Display Injections
    elJoules.innerText = Math.floor(joules);
    elWiring.innerText = wiring;
    
    footJoules.innerText = `J: ${Math.floor(joules)}`;
    footWiring.innerText = `W: ${wiring} / ${wireStorageCap}`;

    // Always show the current energy storage ceiling layout so players track their waste thresholds[cite: 10]
    elMaxJoules.classList.remove("hidden");

    // SURGICAL UPDATE: Dynamically calculate and render the total capacity based on built Leyden Jars
    if (morseChoice === "B" && leydenJars > 0) {
        let currentMax = 100 + (leydenJars * 100);
        elMaxJoules.innerText = `/ ${currentMax}`; 
    } else {
        elMaxJoules.innerText = "/ 100"; // Standard baseline starting array max[cite: 10]
    }

    // Toggle Visibility of Action Buttons based on Progression thresholds
    if (joules >= 10 || wiring > 0) btnForge.classList.remove("hidden");
    if (wiring >= 2 || loomBuilt) btnBuildLoom.classList.remove("hidden");
    
    // EARLY PROGRESSION: Reveal Tesla Coil assembly as soon as player proves they can make wire
    if (wiring >= 3 || teslaCoils > 0) {
        btnAssembleCoil.classList.remove("hidden");
    }

    // --- CAPACITOR OVERCHARGE VISIBILITY TRIGGER ---
    // This emergency button should only appear if the player is on Path A (AC),
    // has at least 5 Wires to handle the arc, and hasn't spent their one-time blast yet.
    if (morseChoice === "A" && wiring >= 5 && !capacitorOvercharged) {
        btnOvercharge.classList.remove("hidden");
    } else {
        // Keep it hidden otherwise (or hide it immediately after it is clicked)
        btnOvercharge.classList.add("hidden");
    }
    
    // Handle Logistics Spool-Rack Overflow Overload banners
    if (wiring >= wireStorageCap) {
        bannerLogisticsBlocked.classList.remove("hidden");
    } else {
        bannerLogisticsBlocked.classList.add("hidden");
    }

    // Toggle Warehouse Expansion Card Panel Visibility
    if (loomBuilt) {
        panelWarehouse.classList.remove("hidden");
    }

    // Render Dynamic Content in Machine Status counters depending on Branch choice
    if (morseChoice === null) {
        elMachines.innerText = teslaCoils;
    } else if (morseChoice === "A") {
        elDynamicLabel.innerText = "AC GENS";
        elMachines.innerText = acGenerators;
    } else if (morseChoice === "B") {
        elDynamicLabel.innerText = "COILS";
        elMachines.innerText = teslaCoils;
    }

    // Manage Loom Panel Control States & Snap Alert Flags
    if (loomBuilt) {
        btnBuildLoom.classList.add("hidden"); // Collapse build block button once it is fully created
        panelLoomControls.classList.remove("hidden");

        if (loomBroken) {
            elLoomRuntimeStatus.innerText = "BROKEN/HALT";
            elLoomRuntimeStatus.className = "text-danger";
            btnRepairLoom.classList.remove("hidden");
        } else {
            elLoomRuntimeStatus.innerText = `RUNNING (${LOOM_CONFIGS[loomTension].label})`;
            elLoomRuntimeStatus.className = "status-online";
            btnRepairLoom.classList.add("hidden");
        }
    }

    // Toggle Choice Encounter Overlay Panels
    if (morseDecoded && morseChoice === null) {
        panelMorseEncounter.classList.remove("hidden");
    } else {
        panelMorseEncounter.classList.add("hidden");
    }

    // Render Active Core Branch Tech Upgrades Buttons
    if (morseChoice === "A") {
        markerGridBranch.classList.remove("hidden");
        markerGridBranch.innerText = "✦ GRID SYSTEM: ALTERNATING CURRENT (AC)";
        markerGridBranch.className = "status-banner text-special";
        
        btnBuildAcGen.classList.remove("hidden");
        btnBuildFaraday.classList.remove("hidden");
    } else if (morseChoice === "B") {
        markerGridBranch.classList.remove("hidden");
        markerGridBranch.innerText = "⌗ GRID SYSTEM: DIRECT CURRENT (DC)";
        markerGridBranch.className = "status-banner";

        btnAssembleCoil.classList.remove("hidden");
        btnBuildLeyden.classList.remove("hidden");
        btnBuildJunction.classList.remove("hidden");
    }



    // Handle Victory Banner triggers
    if (victoryAchieved) {
        markerVictory.classList.remove("hidden");
    }

    // Handle Top Sticky Alert Bar flashing states
    if (underAttack) {
        elAlertBanner.classList.remove("hidden");
        elAlertBanner.style.backgroundColor = "var(--ember-red)";
        elAlertText.innerText = `⚠ SECURITY ALERT — EDISON SABOTAGE ACTIVE (${attackCountdown}s) ⚠`;
    } else if (morseTriggered && !morseDecoded) {
        elAlertBanner.classList.remove("hidden");
        elAlertBanner.style.backgroundColor = "var(--electric-cyan)";
        elAlertText.innerText = `▸ DECODING SIGNAL FROM STATION OMAHA (${morseCountdown}s) ◂`;
    } else {
        elAlertBanner.classList.add("hidden");
    }

    // Manage Grid Connection Visual Status Indicators
    if (victoryAchieved) {
        elGridStatus.innerText = "SECURED / STABLE";
        elGridStatus.className = "status-online";
    } else if (underAttack) {
        elGridStatus.innerText = "SABOTAGED LOCKOUT";
        elGridStatus.className = "status-offline";
    } else if (morseChoice !== null) {
        elGridStatus.innerText = "OPERATIONAL POWERED";
        elGridStatus.className = "status-online";
    } else {
        elGridStatus.innerText = "OFFLINE";
        elGridStatus.className = "status-offline";
    }

    // ==========================================
    // SURGICAL UPDATE: DYNAMIC BUTTON DIMMING
    // ==========================================
    // Evaluates resource counts against costs and dynamically dims unaffordable actions.

    // 1. Forge Copper Wiring Button (Cost: 10 Joules)
    if (joules < 10) { btnForge.style.opacity = "0.35"; // Dim to 35% strength if short on energy
    } else { btnForge.style.opacity = "1.0";  // Restore to full crisp intensity
    }

    // 2. Assemble Tesla Coil Button (Cost: 10 Wiring)
    if (wiring < 10) { btnAssembleCoil.style.opacity = "0.35"; 
    } else { btnAssembleCoil.style.opacity = "1.0"; }

    // 3. Build Automated Loom Button (Cost: 50 Joules)
    if (joules < 50) { btnBuildLoom.style.opacity = "0.35";
    } else { btnBuildLoom.style.opacity = "1.0"; }

    // 4. Build AC Generator Button (Cost: 20 Joules + 5 Wiring — Path A exclusive)
    if (joules < 20 || wiring < 5) { btnBuildAcGen.style.opacity = "0.35";
    } else { btnBuildAcGen.style.opacity = "1.0"; }

    // 5. Build Faraday Cage Button (Cost: 20 Wiring — Path A exclusive)
    if (wiring < 20) { btnBuildFaraday.style.opacity = "0.35";
    } else { btnBuildFaraday.style.opacity = "1.0"; }

    // 6. Build Leyden Jar Button (Cost: 5 Wiring — Path B exclusive)
    if (wiring < 5) { btnBuildLeyden.style.opacity = "0.35";
    } else { btnBuildLeyden.style.opacity = "1.0"; }

    // 7. Build Junction Box Button (Cost: 200 Joules — Path B exclusive)
    if (joules < 200) { btnBuildJunction.style.opacity = "0.35";
    } else { btnBuildJunction.style.opacity = "1.0"; }

    // Handle Status Footers & Rates Data Output Rows
    let passiveSum = (morseChoice === "A") ? (acGenerators * 5) : (teslaCoils * 1);
    if (passiveSum > 0) {
        footGeneration.classList.remove("hidden");
        footGeneration.innerText = `+${passiveSum}J/s${underAttack ? " [OFF]" : ""}`;
        footGeneration.className = underAttack ? "text-danger" : "text-special";
    }

    if (loomBuilt) {
        footLoom.classList.remove("hidden");
        footLoom.innerText = `LOOM:${loomBroken ? "HALT" : LOOM_CONFIGS[loomTension].label}`;
        footLoom.className = loomBroken ? "text-danger" : "";
    }

    if (trustActivated && !victoryAchieved) {
        footThreat.classList.remove("hidden");
    } else {
        footThreat.classList.add("hidden");
    }

    let defSum = faradayCages + junctionBoxes;
    if (defSum > 0) {
        footDefenses.classList.remove("hidden");
        footDefenses.innerText = `DEF: ${faradayCages}FC / ${junctionBoxes}JB`;
    }
}


// ==========================================
// 6. PLAYER BUTTON INTERACTION HANDLERS
// ==========================================

// Manual Crank Logic
btnCrank.addEventListener("click", () => {
    joules += 1;
    writeLog("Dynamo armature manually cranked. Produced +1 Joule.", "action");

    // Progression Unlock Trigger Condition: Passing 50 Joules fires up Morse receiver
    if (joules >= 50 && !morseTriggered) {
        morseTriggered = true;
        writeLog("The spark-gap Morse receiver springs to life! It is automatically recording an incoming long-distance frequencies pattern...", "unlock");
        markerMorseDecoding.classList.remove("hidden");
    }
    renderUI();
});

// Manual Wiring Wire Forge Button
btnForge.addEventListener("click", () => {
    if (joules >= 10) {
        if (wiring >= wireStorageCap) {
            writeLog("Logistics error: Stored spool rack capacity overflow limits hit. Upgrade warehouse storage capacity to forge more.", "warning");
            return;
        }
        joules -= 10;
        wiring += 1;
        writeLog("Drew hot raw copper through processing dies. Created +1 Wiring units.", "action");
    }
    renderUI();
});

// Build Automated Loom Infrastructure
btnBuildLoom.addEventListener("click", () => {
    if (joules >= 50) {
        joules -= 50;
        loomBuilt = true;
        writeLog("Constructed automated mechanical Pneumatic Loom system. Fabric production lines online.", "unlock");
    }
    renderUI();
});

// Repair Snap Event
btnRepairLoom.addEventListener("click", () => {
    if (joules >= 10) {
        joules -= 10;
        loomBroken = false;
        loomProgressMs = 0; // Reset progress tracking counter
        writeLog("Re-threaded snapped shuttle lines and centered guides. Loom mechanical reliability restored.", "action");
    }
    renderUI();
});

// Loom Speed Tuning Selectors
function setLoomTension(mode) {
    if (loomBroken) return;
    loomTension = mode;
    
    // Reset toggle styles manually inside DOM list array
    btnTensionLow.classList.remove("active");
    btnTensionMed.classList.remove("active");
    btnTensionHigh.classList.remove("active");

    if (mode === "low") {
        btnTensionLow.classList.add("active");
        elTensionDesc.innerText = "LOW — 2J/sec drain · 1 Wire every 10s · No snap risk";
    } else if (mode === "medium") {
        btnTensionMed.classList.add("active");
        elTensionDesc.innerText = "MED — 5J/sec drain · 1 Wire every 5s · No snap risk";
    } else if (mode === "high") {
        btnTensionHigh.classList.add("active");
        elTensionDesc.innerText = "HIGH — 15J/sec drain · 1 Wire every 2s · 10% snap risk per increment";
    }
    writeLog(`Pneumatic loom cycle frequency regulator adjusted to [${mode.toUpperCase()} TENSION].`, "action");
}

btnTensionLow.addEventListener("click", () => setLoomTension("low"));
btnTensionMed.addEventListener("click", () => setLoomTension("medium"));
btnTensionHigh.addEventListener("click", () => setLoomTension("high"));

// Expand Spool Rack Inventory Storage Capacity Limit
btnExpandWarehouse.addEventListener("click", () => {
    if (joules >= 150 && wiring >= 15) {
        joules -= 150;
        wiring -= 15;
        wireStorageCap += 20; // Step stack capability enlargement
        writeLog(`Warehouse storage facility blueprint scaled out. New inventory ceiling: ${wireStorageCap} spools.`, "unlock");
    } else {
        writeLog("Insufficient materials to construct storage racks expansion infrastructure. Requirements: 150J, 15 Wire.", "warning");
    }
    renderUI();
});

// Emergency Capacitor Dump Button
btnOvercharge.addEventListener("click", () => {
    if (wiring >= 5 && !capacitorOvercharged) {
        capacitorOvercharged = true;
        
        // Math loop formula calculating yield from current power dump volume
        let generatedYield = Math.floor(joules / 10);
        let availableSpace = wireStorageCap - wiring;
        
        // Clamp output so overflowing wire limits doesn't cause tracking bugs
        if (generatedYield > availableSpace) generatedYield = availableSpace;
        
        wiring += generatedYield;
        joules = 0; // Sacrifices all current electrical charge fields completely

        btnOvercharge.classList.add("hidden");
        panelOverchargeDepleted.classList.remove("hidden");

        writeLog(`💥 CRITICAL DIRECT OVERCHARGE SPENT! Dissipated entire storage core to weld out +${generatedYield} Wiring instantly.`, "warning");
    }
    renderUI();
});

// Branch Encounter Decisions Choices
btnChoiceAC.addEventListener("click", () => {
    if (wiring >= 15) {
        wiring -= 15;
        morseChoice = "A";
        trustActivated = true; // Edison trust begins scouting tracking points
        nextAttackTime = 30;   // Arm first sabotage drop event timer window
        panelMorseEncounter.classList.add("hidden");
        markerMorseDecoding.classList.add("hidden");
        writeLog("Agreement Signed. Station Omaha shares Alternating Current blueprints. Warning: The Edison Trust has declared our project an illegal patent infringement!", "warning");
    }
    renderUI();
});

btnChoiceDC.addEventListener("click", () => {
    if (wiring >= 10) {
        wiring -= 10;
        morseChoice = "B";
        
        // SURGICAL UPDATE: Align game state with the button text. 
        // Choosing DC automatically awards your first Leyden Jar!
        leydenJars = 1; 
        
        trustActivated = true; // Edison trust begins monitoring tracking points[cite: 10]
        nextAttackTime = 45;   // DC enjoys a slightly longer initial scouting window cushion[cite: 10]
        panelMorseEncounter.classList.add("hidden"); //[cite: 10]
        markerMorseDecoding.classList.add("hidden"); //[cite: 10]
        writeLog("Transmission Denied. Locked keys down. We will turtle behind local isolation fields and store power natively inside Leyden arrays.", "unlock"); //[cite: 10]
    }
    renderUI();
});

// Branch Specific Builders Buttons
btnAssembleCoil.addEventListener("click", () => {
    if (wiring >= 10) {
        wiring -= 10;
        teslaCoils++;
        writeLog(`Resonator stack calibrated. Tesla Coil array assembly #${teslaCoils} online. (+1J/s)`, "unlock");
    }
    renderUI();
});

btnBuildAcGen.addEventListener("click", () => {
    if (joules >= 20 && wiring >= 5) {
        joules -= 20;
        wiring -= 5;
        acGenerators++;
        writeLog(`Heavy heavy rotation turbine configured. AC Generator system #${acGenerators} integrated. (+5J/s)`, "unlock");
    }
    renderUI();
});

// Build Leyden Jar Storage Upgrade
btnBuildLeyden.addEventListener("click", () => {
    if (wiring >= 5) {
        wiring -= 5;
        leydenJars++; // SURGICAL UPDATE: Increment our tracking state variable by 1
        
        writeLog("Insulated capacitor glass banks arranged. Energy core structural limits increased.", "unlock");
        // btnBuildLeyden.classList.add("hidden"); // One-time structural upgrade asset
    }
    renderUI();
});

btnBuildFaraday.addEventListener("click", () => {
    if (wiring >= 20) {
        wiring -= 20;
        faradayCages++;
        writeLog(`Copper mesh mesh framework anchored. Faraday Cage shields #${faradayCages} established. Threat approach windows extended.`, "unlock");
    }
    renderUI();
});

btnBuildJunction.addEventListener("click", () => {
    if (joules >= 200) {
        joules -= 200;
        junctionBoxes++;
        writeLog(`Heavy iron isolated circuit paths fused. Protected Junction Box #${junctionBoxes} operational. Attack damage blunted.`, "unlock");
    }
    renderUI();
});


// ==========================================
// 7. THE MASTER INTERVAL TICK ENGINE (1Hz)
// ==========================================
// This unified loop acts as the primary time machine replacing fragmented React hooks.

setInterval(() => {
    // --------------------------------------
    // Part A: Saboteur Ambush Event Systems Lockouts
    // --------------------------------------
    if (underAttack) {
        attackCountdown--;
        if (attackCountdown <= 0) {
            underAttack = false;
            writeLog("Relay lines reset. Local generator networks back online.", "system");
        }
        renderUI();
        return; // While actively sabotaged, all passive generation and loom systems freeze instantly
    }

    // --------------------------------------
    // Part B: Passive Generation Accumulation
    // --------------------------------------
    let generatedJoules = 0;
    
    if (morseChoice === "A") {
        // Alternating Current path swaps your primary engine over to heavy generators
        generatedJoules = acGenerators * 5; 
    } else {
        // Baseline and DC path: Every individual calibrated Tesla Coil stack adds +1 Joule every tick
        generatedJoules = teslaCoils * 1; 
    }
    
    // Only accumulate electricity if we aren't currently frozen by an active Edison raid lockout
    joules += generatedJoules;

    // --------------------------------------
    // Part C: Automated Loom Processing Logic
    // --------------------------------------
    if (loomBuilt && !loomBroken && wiring < wireStorageCap) {
        const activeConfig = LOOM_CONFIGS[loomTension];
        
        // Verify current core engine power level satisfies layout costs
        if (joules >= activeConfig.jouleDrain) {
            joules -= activeConfig.jouleDrain;
            loomProgressMs += 1000; // Increment progress clock tracker by 1 full second

            // Check if processing cycle interval threshold requirements are satisfied
            if (loomProgressMs >= activeConfig.wireIntervalMs) {
                loomProgressMs = 0; // Reset progress track loop step

                // Execute high-tension high-frequency snap lottery evaluation check
                if (loomTension === "high" && Math.random() < 0.10) {
                    loomBroken = true;
                    writeLog("💥 SYSTEM CRASH: Dynamic shuttle lines snapped under High Tension load! Loom halted.", "warning");
                } else {
                    wiring += 1;
                    writeLog("Automated loom shuttle finishes cycle unit tracking block. Wire +1 produced.", "system");
                }
            }
        } else {
            // Insufficient energy core supplies trigger warning drops
            writeLog("Loom system brownout: Field pressure falling below requirement metrics.", "warning");
        }
    }

    // --------------------------------------
    // Part D: Morse Decoder Timeline Progression Countdown
    // --------------------------------------
    if (morseTriggered && !morseDecoded) {
        morseCountdown--;
        if (morseCountdown <= 0) {
            morseDecoded = true;
            markerMorseDecoding.classList.add("hidden");
            writeLog("📡 SIGNAL FULLY DECODED. Open transmission lines from Station Omaha are requiring immediate field response commands.", "unlock");
        }
    }

    // --------------------------------------
    // Part E: Edison Trust Raid Scheduler Logic
    // --------------------------------------
    if (trustActivated && !victoryAchieved) {
        nextAttackTime--;
        if (nextAttackTime <= 0) {
            // Trigger ambush raid event sequences
            underAttack = true;
            attackCountdown = 10; // 10 seconds blackout lock window duration
            
            // Draw randomized text log warning layout entry
            const msgIndex = Math.floor(Math.random() * ATTACK_MESSAGES.length);
            writeLog(`⚠ EXTRALIEGAL ATTACK: ${ATTACK_MESSAGES[msgIndex]} Stored resources damaged!`, "warning");

            // Compute attack damages modifiers
            let lossWiring = (morseChoice === "A") ? 5 : 3;
            // Junction Boxes reduce incoming resource damages by half per defense stack
            if (junctionBoxes > 0) {
                lossWiring = Math.max(0, Math.floor(lossWiring / (2 * junctionBoxes)));
            }
            wiring -= lossWiring;

            // Recalculate and schedule next attack interval window
            // Faraday cages extend attack delays by adding +15 seconds safety cushion intervals per stack
            const safetyBuffer = faradayCages * 15;
            const baseIntervalWindow = (morseChoice === "A") ? 30 : 45;
            nextAttackTime = baseIntervalWindow + safetyBuffer + Math.floor(Math.random() * 20);
        }
    }

    // --------------------------------------
    // Part F: Win Condition Evaluation Evaluation
    // --------------------------------------
    if (morseChoice === "A" && acGenerators >= 5 && wiring >= 40) {
        victoryAchieved = true;
    } else if (morseChoice === "B" && teslaCoils >= 10 && wiring >= 30) {
        victoryAchieved = true;
    }

    renderUI();
}, SYSTEM_TICK_RATE_MS);


// ==========================================
// 8. INITIAL BOOTSTRAP INITIALIZATION
// ==========================================
// Links standard layout buttons to text targets and sets opening message.

writeLog("System initialization sequence complete. Field station primary terminal online.", "system");
renderUI();