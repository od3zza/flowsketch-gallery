# Privacy Policy - FlowSketch

**Last updated:** July 2026

The privacy of our users is an absolute priority. **FlowSketch** was designed to transform your mouse movements into artistic and visual expressions, ensuring full transparency and control over your data.

---

### 1. What information do we collect?
FlowSketch exclusively collects technical and anonymous data related to your physical browsing interactions:
* **Cursor coordinates (X and Y):** Only the relative positions of your cursor within the browser window.
* **Movement speed:** Used to determine brush thickness and dynamics.
* **Click events (Left and Right):** Used exclusively to randomly change brush colors and styles (`circle`, `square`, `glitch`, etc.).

### 2. What do we NOT collect? (Strict Privacy)
Since the extension requires broad execution permissions, we explicitly guarantee that we **DO NOT**:
* Read or access the content of the web pages you visit.
* Collect personal data, credentials, passwords, emails, or financial information.
* Access your browsing history or cookies.
* Use any third-party analytics tools (trackers).

### 3. Where is the data stored?
By default, 100% of the captured data is stored **locally on your device**, using the isolated `chrome.storage.local` API. No data leaves your computer automatically.

### 4. Public Sharing (Voluntary User Action)
The only situation in which data is transmitted to our external server (`https://letmeflowsketching.vercel.app/`) occurs when you voluntarily click the **"Share in gallery"** button. 

By performing this action, the following information is sent:
* The generated image in PNG format (converted into a Base64 string).
* The artwork title and the pseudonym (nickname) you enter in the form.
* The total number of processed movement points.

### 5. Manifest Permissions Justification (Manifest V3)
* **`<all_urls>` / Content Scripts:** Necessary for the extension to fluidly capture mouse movements while you freely browse the web, fulfilling the application's core artistic purpose.
* **`storage`:** Necessary to temporarily save your drawing points so they are not lost when you close the pop-up or the browser.
* **`alarms`:** Used to run automatic local memory cleanup routines, preventing any slowdowns in your browser.

### 6. User Control and Data Deletion
You can permanently clear all saved tracking data at any time by clicking the **"Reset" (🗑️)** button in the extension menu.

If you wish to remove an artwork that has already been published in our online gallery, please contact us through the extension's support page on the Chrome Web Store.
