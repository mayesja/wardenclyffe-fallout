import { useState, useEffect, useRef, useCallback } from "react";

interface LogEntry {
  id: number;
  text: string;
  type: "system" | "action" | "unlock" | "warning";
}

type MorseChoice = "A" | "B" | null;
type LoomTension = "low" | "medium" | "high";
type AlertBadge = "signal" | "emergency" | "attack" | null;

const BASE_MAX_JOULES = 100;

const ATTACK_MSGS = [
  "An agent cut the transmission lines!",
  "Saboteur spotted in the relay room. Emergency shutdown initiated.",
  "Wire stripper located in sector 3. Generation disrupted.",
  "Agent interference — capacitor array shorted out.",
  "Edison operative breached the dynamo room.",
];

const LOOM = {
  low:    { drain: 2,  interval: 10000, label: "LOW",  desc: "2J/sec · 1 Wire/10s" },
  medium: { drain: 5,  interval: 5000,  label: "MED",  desc: "5J/sec · 1 Wire/5s" },
  high:   { drain: 15, interval: 2000,  label: "HIGH", desc: "15J/sec · 1 Wire/2s · 10% snap" },
} as const;

export default function Game() {
  // Core resources
  const [joules, setJoules] = useState(0);
  const [wiring, setWiring] = useState(0);
  const [coils, setCoils] = useState(0);

  // Branch A — AC path
  const [acGenerators, setAcGenerators] = useState(0);
  const [acUnlocked, setAcUnlocked] = useState(false);
  const [faradayCages, setFaradayCages] = useState(0);

  // Branch B — DC path
  const [leydenJars, setLeydenJars] = useState(0);
  const [leydenUnlocked, setLeydenUnlocked] = useState(false);
  const [junctionBoxes, setJunctionBoxes] = useState(0);

  // Unlock flags
  const [wiringUnlocked, setWiringUnlocked] = useState(false);
  const [coilUnlocked, setCoilUnlocked] = useState(false);
  const [coilBuilt, setCoilBuilt] = useState(false);
  const [morseStarted, setMorseStarted] = useState(false);
  const [morseDecoded, setMorseDecoded] = useState(false);
  const [morseChoice, setMorseChoice] = useState<MorseChoice>(null);

  // Threat system
  const [trustActivated, setTrustActivated] = useState(false);
  const [underAttack, setUnderAttack] = useState(false);
  const [victoryAchieved, setVictoryAchieved] = useState(false);

  // Pneumatic Loom
  const [loomBuilt, setLoomBuilt] = useState(false);
  const [loomTension, setLoomTension] = useState<LoomTension>("low");
  const [loomBroken, setLoomBroken] = useState(false);

  // Emergency mechanic
  const [overchargeUsed, setOverchargeUsed] = useState(false);

  // Alert badge
  const [alertBadge, setAlertBadge] = useState<AlertBadge>(null);

  const [log, setLog] = useState<LogEntry[]>([
    {
      id: 0,
      text: "WARDENCLYFFE STATION DISCONNECTED. EDISON GRID OFFLINE. STANDBY FOR LOCAL POWER HARVEST.",
      type: "system",
    },
  ]);

  // Refs
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);
  const coilsRef = useRef(coils);
  coilsRef.current = coils;
  const acGenRef = useRef(acGenerators);
  acGenRef.current = acGenerators;
  const faradayCagesRef = useRef(faradayCages);
  faradayCagesRef.current = faradayCages;
  const junctionBoxesRef = useRef(junctionBoxes);
  junctionBoxesRef.current = junctionBoxes;
  const underAttackRef = useRef(false);
  const wiringEarnedRef = useRef(0);
  const joulesClickedRef = useRef(0);
  const trustFiredRef = useRef(false);
  const victoryFiredRef = useRef(false);
  const morseChoiceRef = useRef(morseChoice);
  morseChoiceRef.current = morseChoice;
  const loomTensionRef = useRef<LoomTension>("low");
  loomTensionRef.current = loomTension;
  const loomBrokenRef = useRef(false);
  loomBrokenRef.current = loomBroken;
  const coilUnlockedRef = useRef(coilUnlocked);
  coilUnlockedRef.current = coilUnlocked;

  // Computed values
  const maxJoules = BASE_MAX_JOULES * Math.pow(2, leydenJars);
  const totalPassive = coils + acGenerators * 5;
  const totalDefenses = faradayCages + junctionBoxes;
  const showMorseEncounter = morseDecoded && morseChoice === null;

  const addLog = useCallback((text: string, type: LogEntry["type"] = "action") => {
    setLog((prev) => {
      const next = [...prev, { id: idRef.current++, text, type }];
      return next.slice(-80);
    });
  }, []);

  // Scroll log to bottom on new entries
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  // ── Alert badge triggers ───────────────────────────────────────
  // Emergency takes priority; signal only sets if no emergency active

  useEffect(() => {
    if (loomBroken) setAlertBadge("emergency");
    else if (alertBadge === "emergency") setAlertBadge(null);
  }, [loomBroken]);

  useEffect(() => {
    if (morseStarted) setAlertBadge((prev) => prev === "emergency" ? prev : "signal");
  }, [morseStarted]);

  useEffect(() => {
    if (morseDecoded) setAlertBadge((prev) => prev === "emergency" ? prev : "signal");
  }, [morseDecoded]);

  useEffect(() => {
    if (trustActivated) setAlertBadge("attack");
  }, [trustActivated]);

  useEffect(() => {
    if (underAttack) setAlertBadge("attack");
  }, [underAttack]);

  // ── Passive generation effects ─────────────────────────────────

  // Tesla Coil passive — 1J/sec per coil, pauses under attack
  useEffect(() => {
    if (coils === 0) return;
    const interval = setInterval(() => {
      if (underAttackRef.current) return;
      const n = coilsRef.current;
      if (n === 0) return;
      setJoules((prev) => Math.min(prev + n, maxJoules));
    }, 1000);
    return () => clearInterval(interval);
  }, [coils > 0, maxJoules]);

  // AC Generator passive — 5J/sec per gen, pauses under attack
  useEffect(() => {
    if (acGenerators === 0) return;
    const interval = setInterval(() => {
      if (underAttackRef.current) return;
      const n = acGenRef.current;
      if (n === 0) return;
      setJoules((prev) => Math.min(prev + n * 5, maxJoules));
    }, 1000);
    return () => clearInterval(interval);
  }, [acGenerators > 0, maxJoules]);

  // Loom Joule drain — every second while active and not broken
  useEffect(() => {
    if (!loomBuilt) return;
    const interval = setInterval(() => {
      if (loomBrokenRef.current) return;
      const drain = LOOM[loomTensionRef.current].drain;
      setJoules((prev) => Math.max(0, prev - drain));
    }, 1000);
    return () => clearInterval(interval);
  }, [loomBuilt]);

  // Loom wire production — reruns when tension changes or loom is repaired
  useEffect(() => {
    if (!loomBuilt || loomBroken) return;
    const tension = loomTension;
    const cfg = LOOM[tension];

    const interval = setInterval(() => {
      if (tension === "high" && Math.random() < 0.1) {
        loomBrokenRef.current = true;
        setLoomBroken(true);
        addLog("LOOM FAIL: Wiring snapped under high tension! Production halted.", "warning");
        return;
      }

      setWiring((prev) => prev + 1);
      wiringEarnedRef.current += 1;
      const total = wiringEarnedRef.current;

      if (total === 10 && !coilUnlockedRef.current) {
        setCoilUnlocked(true);
        addLog(`Loom [${cfg.label}]: 10 lengths produced. ASSEMBLE TESLA COIL now available.`, "unlock");
      } else if (total % 5 === 0) {
        addLog(`Loom [${cfg.label}]: +1 Wiring. [${total} total]`, "action");
      }
    }, cfg.interval);

    return () => clearInterval(interval);
  }, [loomBuilt, loomBroken, loomTension, addLog]);

  // Auto-decode morse after 4 seconds
  useEffect(() => {
    if (!morseStarted || morseDecoded) return;
    const timer = setTimeout(() => {
      setMorseDecoded(true);
      addLog("— · — · · — · · — — — · · · · — — —", "action");
      addLog("DECODING SIGNAL...", "action");
      setTimeout(() => {
        addLog(
          "STATION OMAHA CALLING. WE HAVE TESLA'S AC SCHEMATICS BUT NEED COPPER TO REPAIR OUR SHIELDING. WILL TRADE FOR 15 WIRING.",
          "system"
        );
        setTimeout(() => {
          addLog("RESPOND VIA RECEIVER. YOUR CHOICE WILL DEFINE THIS STATION'S FUTURE.", "unlock");
        }, 800);
      }, 900);
    }, 4000);
    return () => clearTimeout(timer);
  }, [morseStarted, morseDecoded, addLog]);

  // Edison Trust trigger
  useEffect(() => {
    if (trustFiredRef.current || victoryAchieved) return;
    const acTrigger = morseChoice === "A" && totalPassive > 50;
    const dcTrigger = morseChoice === "B" && maxJoules > 1000;
    if (acTrigger || dcTrigger) {
      trustFiredRef.current = true;
      setTrustActivated(true);
      addLog("WARNING: EDISON TRUST DETECTORS ACTIVATED. SABOTEURS EN ROUTE.", "warning");
      setTimeout(() => {
        addLog(
          morseChoice === "A"
            ? "BUILD FARADAY CAGE to reduce attack frequency. Each cage doubles the interval."
            : "BUILD CONCEALED JUNCTION BOX to reduce power drain. Each box halves the damage.",
          "unlock"
        );
      }, 1000);
    }
  }, [totalPassive, maxJoules, morseChoice, victoryAchieved, addLog]);

  // Edison Trust attack interval
  useEffect(() => {
    if (!trustActivated || victoryAchieved) return;
    const intervalMs =
      morseChoiceRef.current === "A"
        ? 30000 * Math.pow(2, faradayCages)
        : 30000;

    const interval = setInterval(() => {
      if (underAttackRef.current) return;
      const msg = ATTACK_MSGS[Math.floor(Math.random() * ATTACK_MSGS.length)];
      addLog(`⚠ EDISON TRUST: ${msg}`, "warning");
      const drainMultiplier =
        morseChoiceRef.current === "B"
          ? Math.pow(0.5, junctionBoxesRef.current)
          : 1;
      setJoules((prev) => {
        const drain = Math.max(1, Math.floor(prev * 0.2 * drainMultiplier));
        addLog(
          `Power drained: -${drain}J (${Math.round(20 * drainMultiplier)}% of reserves). Generation offline for 5 seconds.`,
          "warning"
        );
        return Math.max(0, prev - drain);
      });
      underAttackRef.current = true;
      setUnderAttack(true);
      setTimeout(() => {
        underAttackRef.current = false;
        setUnderAttack(false);
        addLog("Grid systems restored. Generation resuming.", "action");
      }, 5000);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [trustActivated, faradayCages, victoryAchieved, addLog]);

  // Victory condition
  useEffect(() => {
    if (victoryFiredRef.current) return;
    if (totalDefenses >= 3 && (totalPassive >= 200 || maxJoules >= 5000)) {
      victoryFiredRef.current = true;
      setVictoryAchieved(true);
      setUnderAttack(false);
      underAttackRef.current = false;
      addLog(
        "Station stabilized. The Edison Trust has retreated from this sector. The grid belongs to the future.",
        "system"
      );
      setTimeout(() => {
        addLog(
          morseChoice === "A"
            ? "AC power flows freely across the region. Tesla's dream, realized."
            : "The capacitor banks hold enough charge to outlast any siege. Self-sufficiency achieved.",
          "unlock"
        );
      }, 1200);
    }
  }, [totalDefenses, totalPassive, maxJoules, morseChoice, addLog]);

  // ── Handlers ──────────────────────────────────────────────────

  const handleBadgeDismiss = () => {
    setAlertBadge(null);
    logRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCrankDynamo = () => {
    joulesClickedRef.current += 1;
    setJoules((prev) => {
      const next = Math.min(prev + 1, maxJoules);
      if (next >= 20 && !wiringUnlocked) {
        setWiringUnlocked(true);
        addLog("Dynamo reaches critical RPM. Smelting apparatus operable. FORGE COPPER WIRING available.", "unlock");
      } else if (joulesClickedRef.current === 5) {
        addLog("Copper brushes worn but still conducting. The flywheel holds.", "action");
      } else if (joulesClickedRef.current === 15) {
        addLog("A faint glow from the filament array. Something stirs in the circuit.", "action");
      } else if (next % 20 === 0 && next > 0) {
        const msgs = [
          "The dynamo belt strains under load. Output maintained.",
          `Current output: ${next}J. Voltage steady.`,
          "The armature spins. Electromagnetic induction does its silent work.",
          "Sparks at the commutator ring. You press on.",
        ];
        addLog(msgs[Math.floor(Math.random() * msgs.length)]);
      }
      return next;
    });
  };

  const handleForgeWiring = () => {
    if (joules >= 20) {
      setJoules((prev) => prev - 20);
      setWiring((prev) => {
        const next = prev + 1;
        wiringEarnedRef.current += 1;
        const total = wiringEarnedRef.current;
        if (total === 1) {
          addLog("Furnace renders copper into wiring. Length #1 coiled and ready. [-20J]", "action");
          addLog("With enough wiring, a resonance coil becomes possible.", "unlock");
        } else if (total === 10 && !coilUnlocked) {
          setCoilUnlocked(true);
          addLog(`Wiring length #${next} forged. [-20J]`, "action");
          addLog("10 lengths of copper. ASSEMBLE TESLA COIL is now available.", "unlock");
        } else {
          addLog(`Wiring length #${next} forged. [-20J]`, "action");
        }
        return next;
      });
    } else {
      addLog("INSUFFICIENT POWER. 20 Joules required to operate the forge.", "warning");
    }
  };

  const handleBuildLoom = () => {
    if (joules >= 50) {
      setJoules((prev) => prev - 50);
      setLoomBuilt(true);
      addLog("Pneumatic Loom assembled and bolted to the workshop floor. [-50J]", "unlock");
      addLog("Set Loom Tension below to begin automated wiring production.", "action");
    } else {
      addLog("INSUFFICIENT POWER. Pneumatic Loom requires 50 Joules.", "warning");
    }
  };

  const handleRepairLoom = () => {
    if (joules >= 10) {
      setJoules((prev) => prev - 10);
      setLoomBroken(false);
      loomBrokenRef.current = false;
      addLog("Loom repaired. [-10J] Wire tension re-calibrated. Production resuming.", "action");
    } else {
      addLog("INSUFFICIENT POWER. Loom repair requires 10 Joules.", "warning");
    }
  };

  const handleOvercharge = () => {
    if (overchargeUsed || joules === 0) return;
    const stored = joules;
    const wiresGained = Math.max(1, Math.floor(stored / 20));
    setJoules(0);
    setWiring((prev) => prev + wiresGained);
    wiringEarnedRef.current += wiresGained;
    setOverchargeUsed(true);
    addLog(
      `⚡ CAPACITOR OVERCHARGE! ${stored}J discharged in surge. +${wiresGained} Wiring produced. Capacitor bank depleted — one-time use only.`,
      "warning"
    );
    if (wiringEarnedRef.current >= 10 && !coilUnlockedRef.current) {
      setCoilUnlocked(true);
      setTimeout(() => addLog("Wiring threshold exceeded. ASSEMBLE TESLA COIL now available.", "unlock"), 300);
    }
  };

  const handleAssembleTeslaCoil = () => {
    if (wiring >= 10) {
      setWiring((prev) => prev - 10);
      setCoils((prev) => {
        const next = prev + 1;
        setCoilBuilt(true);
        if (next === 1) {
          addLog(
            "The coil hums to life, throwing blue arcs across the lab. The air smells of ozone. A faint morse-code signal begins clicking from the receiver...",
            "system"
          );
          setMorseStarted(true);
          setTimeout(() => {
            addLog("PASSIVE GENERATION ONLINE. +1 Joule/sec per active coil.", "unlock");
          }, 1200);
        } else {
          addLog(`Tesla Coil #${next} assembled. [-10 Wiring] +${next}J/sec total.`, "unlock");
        }
        return next;
      });
    } else {
      addLog("INSUFFICIENT WIRING. 10 lengths required.", "warning");
    }
  };

  const handleChoiceA = () => {
    if (wiring < 15) { addLog("INSUFFICIENT WIRING. Omaha requires 15 lengths.", "warning"); return; }
    setWiring((prev) => prev - 15);
    setMorseChoice("A");
    setAcUnlocked(true);
    addLog("[A] You key in your reply and load copper spools into the crate.", "action");
    addLog("OMAHA STATION: 'Received. Transmitting Tesla's AC schematics via carrier wave now.'", "system");
    setTimeout(() => {
      addLog("AC GENERATOR schematics received. +5J/sec per generator. BUILD AC GENERATOR now available.", "unlock");
    }, 1000);
  };

  const handleChoiceB = () => {
    if (wiring < 10) { addLog("INSUFFICIENT WIRING. 10 lengths required.", "warning"); return; }
    setWiring((prev) => prev - 10);
    setMorseChoice("B");
    setLeydenUnlocked(true);
    addLog("[B] You silence the receiver. Station Omaha's signal fades into static.", "action");
    addLog("Self-reliance is strength. Copper redirected into capacitor construction.", "system");
    setTimeout(() => {
      addLog("LEYDEN JAR BATTERY schematics ready. Doubles maximum Joule storage. BUILD LEYDEN JAR now available.", "unlock");
    }, 1000);
  };

  const handleBuildAcGenerator = () => {
    if (joules >= 20 && wiring >= 5) {
      setJoules((prev) => prev - 20);
      setWiring((prev) => prev - 5);
      setAcGenerators((prev) => {
        const next = prev + 1;
        addLog(`AC Generator #${next} online. [-20J, -5 Wiring] +5J/sec. Total: ${coils + next * 5}J/sec.`, "unlock");
        return next;
      });
    } else {
      addLog("INSUFFICIENT RESOURCES. Requires 20 Joules + 5 Wiring.", "warning");
    }
  };

  const handleBuildLeydenJar = () => {
    if (wiring >= 5) {
      setWiring((prev) => prev - 5);
      setLeydenJars((prev) => {
        const next = prev + 1;
        const newMax = BASE_MAX_JOULES * Math.pow(2, next);
        addLog(`Leyden Jar #${next} charged. [-5 Wiring] Max capacity: ${newMax}J.`, "unlock");
        return next;
      });
    } else {
      addLog("INSUFFICIENT WIRING. 5 lengths required.", "warning");
    }
  };

  const handleBuildFaradayCage = () => {
    if (wiring >= 20) {
      setWiring((prev) => prev - 20);
      setFaradayCages((prev) => {
        const next = prev + 1;
        const newInterval = 30 * Math.pow(2, next);
        addLog(`Faraday Cage #${next} erected. [-20 Wiring] Attack interval extended to every ${newInterval}s.`, "unlock");
        return next;
      });
    } else {
      addLog("INSUFFICIENT WIRING. Faraday Cage requires 20 lengths.", "warning");
    }
  };

  const handleBuildJunctionBox = () => {
    if (joules >= 200) {
      setJoules((prev) => prev - 200);
      setJunctionBoxes((prev) => {
        const next = prev + 1;
        const dmg = Math.round(20 * Math.pow(0.5, next));
        addLog(`Junction Box #${next} concealed. [-200J] Attack drain reduced to ${dmg}% of reserves.`, "unlock");
        return next;
      });
    } else {
      addLog("INSUFFICIENT POWER. Junction Box requires 200 Joules.", "warning");
    }
  };

  // ── Render helpers ─────────────────────────────────────────────

  const logTypeClass: Record<LogEntry["type"], string> = {
    system: "text-amber-bright",
    action: "text-amber",
    unlock: "text-electric",
    warning: "text-ember",
  };

  const attackIntervalSec = morseChoice === "A" ? 30 * Math.pow(2, faradayCages) : 30;
  const drainPct = morseChoice === "B" ? Math.round(20 * Math.pow(0.5, junctionBoxes)) : 20;

  const tensionBtnClass = (t: LoomTension) => {
    const selected = loomTension === t;
    const base = "brass-btn flex-1 text-center py-3 px-1 text-sm";
    if (selected && t === "high") return `${base} border-ember text-ember`;
    if (selected) return `${base} brass-btn-special`;
    return base;
  };

  return (
    <div
      className="min-h-screen bg-vault flex items-start justify-center p-4"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* ── Sticky alert badge ──────────────────────────────────── */}
      {alertBadge && (
        <button
          onClick={handleBadgeDismiss}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            fontFamily: "'Courier New', Courier, monospace",
          }}
          className={`w-full py-3 px-5 text-center text-sm font-bold tracking-widest border-b-2 animate-pulse-slow ${
            alertBadge === "signal"
              ? "bg-electric border-electric"
              : "bg-ember border-ember"
          }`}
        >
          {alertBadge === "signal" && (
            <span style={{ color: "#0e0b06" }}>▸ NEW SIGNAL INCOMING — TAP TO VIEW ◂</span>
          )}
          {alertBadge === "emergency" && (
            <span style={{ color: "#fff" }}>⚠ SYSTEM EMERGENCY: LOOM HALTED — TAP TO VIEW</span>
          )}
          {alertBadge === "attack" && (
            <span style={{ color: "#fff" }}>⚠ EDISON TRUST ATTACK INCOMING — TAP TO VIEW</span>
          )}
        </button>
      )}

      <div className="w-full max-w-lg border border-amber-glow shadow-amber" style={{ marginTop: alertBadge ? "48px" : "0" }}>

        {/* Header */}
        <div className={`px-4 pt-4 pb-3 border-b border-opacity-30 ${underAttack ? "border-ember" : "border-amber-glow"}`}>
          <div className="text-xs text-amber-dim tracking-widest mb-1">
            ▓▒░ WARDENCLYFFE FIELD STATION ░▒▓
          </div>
          <div className="flex items-center justify-between text-xs tracking-wide mt-1">
            <span className="text-amber-dim uppercase">Local Grid Status</span>
            <span className={`font-bold ${victoryAchieved ? "text-electric" : underAttack ? "text-ember animate-pulse-slow" : coilBuilt ? "text-electric" : "text-ember"}`}>
              {victoryAchieved ? "SECURED" : underAttack ? "⚠ UNDER ATTACK" : coilBuilt ? "ACTIVE" : "OFFLINE"}
            </span>
          </div>
          {totalPassive > 0 && !underAttack && (
            <div className="mt-1 text-xs text-electric tracking-widest animate-pulse-slow">
              ⚡ +{totalPassive}J/sec — {coils} COIL{coils !== 1 ? "S" : ""}{acGenerators > 0 ? ` · ${acGenerators} AC GEN` : ""}
            </div>
          )}
          {underAttack && (
            <div className="mt-1 text-xs text-ember tracking-widest animate-pulse-slow">
              ▓ GENERATION OFFLINE — RESTORING IN 5s ▓
            </div>
          )}
          {loomBuilt && !loomBroken && (
            <div className="mt-1 text-xs text-amber tracking-widest">
              ◈ LOOM [{LOOM[loomTension].label}] RUNNING — {LOOM[loomTension].desc}
            </div>
          )}
          {loomBuilt && loomBroken && (
            <div className="mt-1 text-xs text-ember tracking-widest animate-pulse-slow">
              ◈ LOOM HALTED — WIRE SNAPPED — REPAIR REQUIRED
            </div>
          )}
          {trustActivated && !victoryAchieved && (
            <div className="mt-1 text-xs text-ember tracking-widest">
              ◈ TRUST THREAT — {morseChoice === "A" ? `ATTACK/${attackIntervalSec}s` : `DRAIN: ${drainPct}%`}
              {totalDefenses > 0 && ` · DEF ${totalDefenses}/3`}
            </div>
          )}
          {morseChoice === "B" && (
            <div className="mt-1 text-xs text-amber tracking-widest">
              ◈ MAX STORAGE: {maxJoules}J{leydenJars > 0 ? ` (×${Math.pow(2, leydenJars)})` : ""}
            </div>
          )}
          {victoryAchieved && (
            <div className="mt-1 text-xs text-electric tracking-widest">
              ★ EDISON TRUST RETREATED — GRID SECURED ★
            </div>
          )}
        </div>

        <div className="px-4 pt-3 pb-3">
          {/* Log */}
          <div
            ref={logRef}
            className={`h-48 overflow-y-auto space-y-0.5 mb-3 pr-1 border border-opacity-20 p-2 bg-black bg-opacity-30 ${
              underAttack ? "border-ember" : loomBroken ? "border-ember border-opacity-40" : "border-amber-glow"
            }`}
          >
            {log.map((entry) => (
              <div key={entry.id} className={`text-sm leading-snug ${logTypeClass[entry.type]}`}>
                <span className="text-amber-dim mr-1">›</span>
                {entry.text}
              </div>
            ))}
          </div>

          <div className="h-px bg-amber-glow opacity-20 mb-3" />

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="border border-amber-glow border-opacity-40 px-1 py-2 text-center col-span-2">
              <span className="text-amber-dim text-xs block tracking-widest mb-1">JOULES</span>
              <span className="text-amber-bright text-2xl font-bold tabular-nums">{joules}</span>
              {morseChoice === "B" && (
                <span className="text-amber-dim text-xs block mt-0.5">/ {maxJoules}</span>
              )}
            </div>
            <div className="border border-amber-glow border-opacity-40 px-1 py-2 text-center">
              <span className="text-amber-dim text-xs block tracking-widest mb-1">WIRING</span>
              <span className="text-amber-bright text-2xl font-bold tabular-nums">{wiring}</span>
            </div>
            <div className="border border-amber-glow border-opacity-40 px-1 py-2 text-center">
              <span className="text-amber-dim text-xs block tracking-widest mb-1">
                {morseChoice === "A" ? "CAGES" : morseChoice === "B" ? "JARS" : "COILS"}
              </span>
              <span className={`text-2xl font-bold tabular-nums ${trustActivated ? "text-electric" : "text-amber-bright"}`}>
                {morseChoice === "A" ? faradayCages : morseChoice === "B" ? leydenJars : coils}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Core actions — always visible */}
            <button onClick={handleCrankDynamo} className="brass-btn w-full">
              <span className="text-base">[ CRANK DYNAMO ]</span>
              <span className="block text-xs text-amber-dim mt-1">+1 Joule per crank</span>
            </button>

            {wiringUnlocked && (
              <button onClick={handleForgeWiring} className={`brass-btn w-full ${joules < 20 ? "brass-btn-disabled" : ""}`}>
                <span className="text-base">[ FORGE COPPER WIRING ]</span>
                <span className="block text-xs text-amber-dim mt-1">Cost: 20 Joules → +1 Wiring</span>
              </button>
            )}

            {/* Pneumatic Loom — unlocks once wiring is possible */}
            {wiringUnlocked && !loomBuilt && (
              <button onClick={handleBuildLoom} className={`brass-btn w-full ${joules < 50 ? "brass-btn-disabled" : ""}`}>
                <span className="text-base">[ BUILD PNEUMATIC LOOM ]</span>
                <span className="block text-xs text-amber-dim mt-1">
                  Cost: 50 Joules — Automates wiring production
                </span>
              </button>
            )}

            {/* Capacitor Overcharge — one-time emergency, unlocks after loom is built */}
            {loomBuilt && !overchargeUsed && (
              <button
                onClick={handleOvercharge}
                className={`brass-btn w-full border-ember ${joules === 0 ? "brass-btn-disabled" : ""}`}
              >
                <span className="text-base text-ember">[ CAPACITOR OVERCHARGE ]</span>
                <span className="block text-xs mt-1" style={{ color: "#7a5200" }}>
                  ONE-TIME · Dumps all {joules}J → {Math.max(1, Math.floor(joules / 20))} Wiring instantly
                </span>
              </button>
            )}
            {loomBuilt && overchargeUsed && (
              <div className="border border-dashed px-4 py-3 text-xs tracking-widest" style={{ borderColor: "#7a5200", color: "#7a5200" }}>
                ◈ CAPACITOR OVERCHARGE — DEPLETED
              </div>
            )}

            {/* Loom control panel */}
            {loomBuilt && (
              <div className={`border p-3 space-y-2 ${loomBroken ? "border-ember border-opacity-60" : "border-amber-glow border-opacity-40"}`}>
                <div className="flex items-center justify-between text-xs tracking-widest mb-1">
                  <span className="text-amber-dim">◈ PNEUMATIC LOOM</span>
                  <span className={loomBroken ? "text-ember animate-pulse-slow" : "text-electric"}>
                    {loomBroken ? "HALTED" : "RUNNING"}
                  </span>
                </div>

                {/* Tension selector */}
                <div className="text-xs text-amber-dim tracking-widest mb-1">LOOM TENSION</div>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as LoomTension[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        if (loomBroken) return;
                        if (loomTension !== t) {
                          setLoomTension(t);
                          addLog(`Loom tension set to ${LOOM[t].label}. ${LOOM[t].desc}`, "action");
                        }
                      }}
                      className={tensionBtnClass(t)}
                      style={{ minHeight: "52px" }}
                    >
                      <div className="font-bold">{LOOM[t].label}</div>
                      <div className="text-xs mt-0.5 opacity-70">
                        {t === "low" && "2J/s"}
                        {t === "medium" && "5J/s"}
                        {t === "high" && "15J/s"}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Tension detail */}
                <div className="text-xs text-amber-dim pt-1 border-t border-amber-glow border-opacity-20">
                  {loomTension === "low" && "LOW — 2J/sec drain · 1 Wire every 10s · No snap risk"}
                  {loomTension === "medium" && "MEDIUM — 5J/sec drain · 1 Wire every 5s · No snap risk"}
                  {loomTension === "high" && "HIGH — 15J/sec drain · 1 Wire every 2s · 10% snap chance"}
                </div>

                {/* Repair button */}
                {loomBroken && (
                  <button
                    onClick={handleRepairLoom}
                    className={`brass-btn w-full border-ember ${joules < 10 ? "brass-btn-disabled" : ""}`}
                    style={{ marginTop: "6px" }}
                  >
                    <span className="text-base text-ember">[ REPAIR LOOM ]</span>
                    <span className="block text-xs text-amber-dim mt-1">Cost: 10 Joules — Re-thread the wire</span>
                  </button>
                )}
              </div>
            )}

            {/* Morse encounter — shown inline, beneath core buttons */}
            {showMorseEncounter && (
              <div className="border border-electric border-opacity-50 p-4 space-y-3">
                <div className="text-xs text-electric tracking-widest animate-pulse-slow mb-2">
                  ▸ INCOMING TRANSMISSION — STATION OMAHA ◂
                </div>
                <p className="text-amber-bright text-sm leading-relaxed">
                  The receiver clicks out a decoded message:
                </p>
                <p className="text-electric text-sm leading-relaxed italic pl-3 border-l border-electric border-opacity-40">
                  "STATION OMAHA CALLING. WE HAVE TESLA'S AC SCHEMATICS BUT NEED COPPER TO REPAIR OUR SHIELDING. WILL TRADE FOR 15 WIRING."
                </p>
                <p className="text-amber-dim text-xs">Your response will define this station's future.</p>
                <div className="space-y-2 pt-1">
                  <button onClick={handleChoiceA} className={`brass-btn brass-btn-special w-full ${wiring < 15 ? "brass-btn-disabled" : ""}`}>
                    <span className="text-base">[A] Accept AC Schematics</span>
                    <span className="block text-xs mt-1">
                      Cost: 15 Wiring — Unlocks AC Generator (+5J/sec) · Defense: Faraday Cage
                    </span>
                  </button>
                  <button onClick={handleChoiceB} className={`brass-btn w-full ${wiring < 10 ? "brass-btn-disabled" : ""}`}>
                    <span className="text-base">[B] Reject &amp; Build Leyden Jar</span>
                    <span className="block text-xs mt-1">
                      Cost: 10 Wiring — Unlocks Leyden Jar (2× storage) · Defense: Junction Box
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Tesla Coil */}
            {coilUnlocked && (
              <button onClick={handleAssembleTeslaCoil} className={`brass-btn brass-btn-special w-full ${wiring < 10 ? "brass-btn-disabled" : ""}`}>
                <span className="text-base">[ ASSEMBLE TESLA COIL{coilBuilt ? ` #${coils + 1}` : ""} ]</span>
                <span className="block text-xs mt-1">
                  Cost: 10 Wiring — +1J/sec{coilBuilt ? ` (total: +${coils + 1}J/sec)` : ""}
                </span>
              </button>
            )}

            {/* AC path upgrades */}
            {acUnlocked && (
              <button onClick={handleBuildAcGenerator} className={`brass-btn brass-btn-special w-full ${joules < 20 || wiring < 5 ? "brass-btn-disabled" : ""}`}>
                <span className="text-base">[ BUILD AC GENERATOR ]</span>
                <span className="block text-xs mt-1">
                  Cost: 20J + 5 Wiring — +5J/sec{acGenerators > 0 ? ` (now: +${(acGenerators + 1) * 5}J/sec)` : ""}
                </span>
              </button>
            )}

            {/* DC path upgrades */}
            {leydenUnlocked && (
              <button onClick={handleBuildLeydenJar} className={`brass-btn w-full ${wiring < 5 ? "brass-btn-disabled" : ""}`}>
                <span className="text-base">[ BUILD LEYDEN JAR ]</span>
                <span className="block text-xs text-amber-dim mt-1">
                  Cost: 5 Wiring — Max: {maxJoules}J → {maxJoules * 2}J
                </span>
              </button>
            )}

            {/* Defenses */}
            {trustActivated && !victoryAchieved && morseChoice === "A" && (
              <button onClick={handleBuildFaradayCage} className={`brass-btn w-full border-ember ${wiring < 20 ? "brass-btn-disabled" : ""}`}>
                <span className="text-base">[ BUILD FARADAY CAGE ]</span>
                <span className="block text-xs text-amber-dim mt-1">
                  Cost: 20 Wiring — Interval: {attackIntervalSec}s → {attackIntervalSec * 2}s
                  {faradayCages > 0 ? ` (cages: ${faradayCages})` : ""}
                </span>
              </button>
            )}

            {trustActivated && !victoryAchieved && morseChoice === "B" && (
              <button onClick={handleBuildJunctionBox} className={`brass-btn w-full border-ember ${joules < 200 ? "brass-btn-disabled" : ""}`}>
                <span className="text-base">[ BUILD JUNCTION BOX ]</span>
                <span className="block text-xs text-amber-dim mt-1">
                  Cost: 200J — Drain: {drainPct}% → {Math.round(drainPct / 2)}%
                  {junctionBoxes > 0 ? ` (boxes: ${junctionBoxes})` : ""}
                </span>
              </button>
            )}

            {/* Status badges */}
            {morseStarted && !morseDecoded && (
              <div className="border border-electric border-opacity-30 px-4 py-3 text-xs text-electric tracking-widest">
                ▸ MORSE RECEIVER ACTIVE — DECODING... ◂
                <div className="text-amber-dim mt-1 animate-pulse-slow">
                  — · — · &nbsp; · — · · &nbsp; — — — &nbsp; · · · · &nbsp; — — —
                </div>
              </div>
            )}

            {morseChoice !== null && (
              <div className={`border px-4 py-2 text-xs tracking-widest ${morseChoice === "A" ? "border-electric text-electric" : "border-amber-glow text-amber-dim"}`}>
                {morseChoice === "A" ? "◈ OMAHA LINK — AC TECH ACTIVE" : "◈ RECEIVER SILENT — DC GRID ACTIVE"}
              </div>
            )}

            {victoryAchieved && (
              <div className="border border-electric px-4 py-3 text-electric text-sm text-center tracking-wide">
                ★ GRID SECURED. EDISON TRUST DEFEATED. ★
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-amber-glow border-opacity-20 text-xs text-amber-dim tracking-widest flex flex-wrap gap-x-4">
          <span>J: {joules}{morseChoice === "B" ? `/${maxJoules}` : ""}</span>
          <span>W: {wiring}</span>
          {totalPassive > 0 && <span className={underAttack ? "text-ember" : "text-electric"}>+{totalPassive}J/sec{underAttack ? " [OFF]" : ""}</span>}
          {loomBuilt && <span className={loomBroken ? "text-ember" : "text-amber"}>LOOM:{loomBroken ? "HALT" : LOOM[loomTension].label}</span>}
          {trustActivated && !victoryAchieved && <span className="text-ember">TRUST ⚠</span>}
          {totalDefenses > 0 && <span className="text-electric">DEF:{totalDefenses}/3</span>}
        </div>
      </div>
    </div>
  );
}
