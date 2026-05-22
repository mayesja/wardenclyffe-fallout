# Wardenclyffe Field Station — Gameplay Design Log

## Milestone 1: Core Engine Porting & Mobile Validation (May 2026)
* Successfully migrated game logic from React/Vite ecosystem down to a streamlined 3-file vanilla asset bundle (HTML5/CSS3/JS).
* Verified cross-device rendering via local network tunnels; UI functions seamlessly on standard Android viewports.

### Observations on Initial Balance Math:
* **The Manual Phase:** Requires 10 manual cranks to secure 1 Wire unit. Unlocking the Loom demands 50 Joules (50 manual inputs minimum). Pacing feels appropriately restrictive for a historical laboratory setup.
* **The Automation Cliff:** Once the Loom activates, it induces a flat -2J/sec energy drain on Low settings. Because passive power generation structures (Tesla Coils / AC Generators) are gated behind the Morse Choice encounter, the player must manually out-crank the machine's consumption rate to produce automation progress.

### Proposed Experiments for Next Iteration:
1. *UI Scroll Tuning:* Evaluate if adding custom touch button padding is needed for modern thumb shapes.
2. *Resource Cap Cushioning:* Review if a small, primitive storage capacitor buffer (e.g., max 20 Joules storage before Morse code triggers) prevents early loom brownouts from feeling too punishing.

## Balance Pass: Returning to the Original Sequence (May 2026)
* Re-aligning progression to match the early Replit pipeline concept: Coils are unlocked *before* the deep narrative choices to provide early automatic relief from manual clicking.

### The New Early Progression Tuning:
1. **Manual Action**: 1 Click = +1 Joule.
2. **First Conversion (Wire)**: Cost: 10 Joules $\rightarrow$ +1 Wiring unit. 
3. **First Automation (Tesla Coil)**: Cost: 10 Wiring units $\rightarrow$ +1 Coil.
4. **Automation Yield**: Each Coil automatically ticks out **+1 Joule every single second** (1J/s).
5. **The Wall (Storage Limits)**: 
   * **Initial Max Joules**: Hard cap at **100 Joules**. (Coils stop adding power if you don't spend it).
   * **Initial Max Wire**: Hard cap at **20 Spools**. (You cannot forge or automate more until you spend them on Coils).
   

   ## Feature Sandbox: Future Mechanics Brainstorm (May 2026)
*A working testbed for exploring advanced incremental game loops, UX enhancements, and narrative structures within a lightweight 3-file vanilla architecture.*

### 1. Proposed Core Mechanics
#### A. Schematic Assembly (Item Combination)
* **Concept**: Fusing legacy infrastructure with modern components to create high-tier, specialized systems.
* **Blueprint Example**: 2 Legacy Tesla Coils + 1 AC Generator + 20 Wiring Spools $\rightarrow$ **[ 1 Resonant Alternator ]**.
* **Impact**: Instead of a flat generation increase, it introduces a global multiplier (e.g., doubling the efficiency of all remaining standard coils by stabilizing field frequencies).

#### B. Component Optimization (Item Upgrades)
* **Concept**: Allowing resource investment to upgrade existing assets rather than cluttering the panel with redundant buttons.
* **Upgrade Example**: **AC Generator (Tier 2)**
    * *Cost*: 50 Joules, 2 Wire.
    * *Effect*: Shifts base output from +5J/sec to +10J/sec per unit. Increments an internal variable (`acGenLevel = 2`) factored into the master tick loop math.

#### C. Logistic Deployment (Build Timers)
* **Concept**: Shifting asset construction from instantaneous clicks to real-time deployment windows, forcing tactical planning during Edison Trust raids.
* **Execution**: Clicking `[ ASSEMBLE TESLA COIL ]` instantly consumes resources and disables the button, switching its label to a active countdown: `[ ASSEMBLING... 10s ]`. The asset is only added to global counts when the countdown reaches zero.

### 2. User Experience (UX) Extensions
#### A. Acoustic Landscape (HTML5 Audio API)
* **Concept**: Integrating low-overhead, vintage audio cues directly into user interactions without external framework libraries.
* **Trigger Mapping**:
    * *Manual Crank*: Heavy mechanical *clunk-thud*.
    * *Wire Forge*: High-voltage electrical *zap/sizzle*.
    * *Security Breach*: Fragmented Morse audio or emergency klaxon during saboteur blackouts.

#### B. Breakthrough Modals (Unlock Splash Screens)
* **Concept**: Pausing high-speed clicking to grant major technological milestones visual weight and historical context.
* **Design**: A high-contrast amber overlay container (`.modal-overlay`) that dims the laboratory panel layout when a major tech milestone (like the Pneumatic Loom or Morse Decoder) is finalized. Cleared immediately via a `[ RETURN TO LABORATORY ]` button response handler.

### 3. Narrative Anchors & Branching
* **Context**: The current engine functions as an evolutionary testing platform for AI capabilities rather than a traditional narrative game. However, embedding atmospheric flavor text shapes UX design.
* **The A/B Split Ideology**:
    * **Path A (Alternating Current)**: Corporate espionage, high-yield public distribution systems, scaling grid hazards, and aggressive legal/physical pushback from the Edison Trust.
    * **Path B (Direct Current)**: Local isolationism, highly optimized energy storage matrices (Leyden arrays), defensive shielding protocols, and stealth operations operating completely off the established grid.