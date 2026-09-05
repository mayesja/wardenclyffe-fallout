# Wardenclyffe Field Station — Mobile Development Guide

This reference document outlines the exact sequence required to restart your cross-device testing environment after a Chromebook reboot, power cycle, or network change.

---

## 🔁 Step-by-Step Environment Wakeup

### 1. Initialize the Local Live Server
1. Launch **VS Code** on your Chromebook.
2. Open the `Wardenclyffe-fallout` project workspace folder.
3. Look at the bottom-right corner of the VS Code status bar and click **`Go Live`**.
   * *Verification*: A small notification will pop up saying `Server is started at port 5500`. 
   * *Note*: If it says `Port 5500 is busy`, it means an old process is still hanging on; clicking it to turn it off and back on will clear it.

### 2. Establish the Secure Network Tunnel
Because your phone and Chromebook live on separate local security profiles, we use Microsoft Dev Tunnels inside VS Code to bridge the gap safely.

1. Inside VS Code, press **`Ctrl + Shift + P`** (or `Cmd + Shift + P` on Mac layout) to open the Command Palette.
2. Type **`Dev Tunnels: Show Active Tunnels`** and select it from the dropdown list.
3. A panel named **Tunnels** will slide open at the bottom of your screen. 
4. **Ports** --> Port forwarding 5500
5. Look under the **Url** column. You will see a web address that looks like this:
   `https://0mzk9rbn-5500.use.devtunnels.ms/`

### 3. Connect via Your Mobile Device
1. Open your phone's internet browser.
2. Enter the exact **Url** string copied from your VS Code Tunnels panel.
3. ⚠️ **Important URL Structure Rule**:
   * Our repository structure hosts our clean 3-file bundle inside a subfolder.
   * Because of how our Live Server configuration handles folder paths, **do not** include `/prototype/` at the end of the address.
   * **Correct Mobile Address**: `https://[your-unique-id]-5500.use.devtunnels.ms/`
4. If the browser prompts you with a security warning page from Microsoft stating you are connecting to a developer tunnel, simply click **"Continue"** to bypass it and launch the amber interface!

---

## 🛑 Troubleshooting Checklist

* **Symptom: Phone shows "This site can’t be reached" or a timeout error.**
  * *Fix*: Ensure your Chromebook is completely awake and that you didn't close the VS Code window. Closing VS Code immediately severs the tunnel connection.
* **Symptom: Phone displays "Cannot GET /" or a blank page.**
  * *Fix*: Append `/prototype/index.html` to the very end of your phone's address bar to explicitly force the server to look inside the subfolder structure.
* **Symptom: Red error codes appear in the Chromebook browser console.**
  * *Fix*: Open your Linux terminal, run `git status` to ensure no files were corrupted during the system reboot, and verify your variable bindings in `script.js`.


---

GitHub updating from terminal

# 1. Fetch the latest metadata from your remote GitHub repository
git fetch origin

# 2. Stash your uncommitted local code edits in a safe temporary stack
git stash

# 3. Pull down and merge the updated Markdown docs from GitHub (main branch)
git pull origin main

# 4. Re-apply your uncommitted local edits back on top of the updated files
git stash pop

# 1. Stage all modified prototype files and docs
git add .

# 2. Commit the updates with a clear message
git commit -m "Desc of changes"

# 3. Push everything to GitHub
git push origin main
