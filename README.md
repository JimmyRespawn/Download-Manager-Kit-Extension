# Download-Manager-Kit-Extension
Integrate Download Manager Kit with Google Chrome, Chromium and Edge.

# Installation
1. Intsall Download Manager Kit
2. Install download-manager-kit-extension and enable download intercept in extension popup

# Basic idea
1. Intercept browser's download event.
2. Use Uri protocol to launch UWP app. (Due to uwp restriction, currently there is no way to use SendMessage api from browser)
3. User manually accept launching Uri from browser tab.
4. Start downloading.

# Future plans
1. Use native messaging to replace the Uri protocol in order to drop the step 3.
2. Add url sniffing within browser like other download manager extension does.
