# X Dim Mode (Firefox)

Firefox extension that restores the Dim (dark blue) background option to X/Twitter display settings.

![X Dim Mode icon](icons/icon128.png)

## What it does

X removed the Dim background option from Display settings. This extension brings it back.

- Adds a **Dim** button to Settings → Display → Background
- Quick toggle from the extension popup
- Pure CSS — lightweight and fast

## Install

### Firefox Add-ons
Coming soon.

### Manual install (takes 30 seconds)
1. [Download this repo as a ZIP](https://github.com/juanbuis/x-dim-mode-firefox/archive/refs/heads/main.zip) and unzip it
2. Go to `about:debugging#/runtime/this-firefox` in Firefox
3. Click **Load Temporary Add-on...**
4. Select the `manifest.json` file inside the unzipped `x-dim-mode-firefox-main` folder
5. Go to [x.com/settings/display](https://x.com/settings/display) — you'll see **Dim** is back as a background option

## How it works

The extension layers the original Dim theme colors on top of Lights Out mode using CSS overrides. It also injects a "Dim" radio button into X's Display settings page so you can switch themes natively.

## Credits

Made by [@juanbuis](https://x.com/juanbuis)
