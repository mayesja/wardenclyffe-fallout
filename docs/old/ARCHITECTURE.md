# Wardenclyffe Field Station — 3-File Architecture

## 1. File Responsibilities
* **index.html**: The bones. Contains the layouts for the resource cards, the text logs, and the tactical action buttons.
* **style.css**: The atmosphere. Defines the "Vault" theme, amber terminal glows, monospace typewriter text, and the flashing alert banner layout.
* **script.js**: The brain. Holds the numeric variables (Joules, Wiring, Coils) and executes the math when buttons are pressed or timers tick.

## 2. Core Game Loop Mapping
* **Tick Rate**: A central 1-second interval loop (1000ms) will replace all fragmented React `useEffect` timers. 
* **Passive Generation**: Every tick, the loop checks if an Edison attack is active. If not, it adds power based on your active Coils and AC Generators.
* **Loom Automation**: Every tick, the loop monitors your Pneumatic Loom tension to drain Joules and track the separate production intervals for creating Wire lengths.

## 3. Screen Layout Strategy (Mobile-First)
* To keep your preferred single-screen layout while minimizing vertical scroll fatigue on your phone, we will design a compact vertical layout. Important resource readouts will stick securely near the top, and dynamic text logs will stay locked into an auto-scrolling terminal window.