const toggle = document.getElementById("toggle");
const dot = document.getElementById("dot");
const hueSlider = document.getElementById("hueSlider");
const hueWrap = document.getElementById("hueWrap");
const themeDots = document.querySelectorAll(".theme-dot");
const customDot = document.querySelector(".custom-dot");

const RAINBOW = `conic-gradient(
  hsl(0, 45%, 32%), hsl(45, 45%, 32%), hsl(90, 45%, 32%),
  hsl(135, 45%, 32%), hsl(180, 45%, 32%), hsl(225, 45%, 32%),
  hsl(270, 45%, 32%), hsl(315, 45%, 32%), hsl(360, 45%, 32%)
)`;

const SHARE_URL = (() => {
  const text = encodeURIComponent("If you miss X's dark blue theme, X Dim Mode brings it back \u2014 free extension:");
  const url = encodeURIComponent("https://xdim.app");
  return `https://x.com/intent/tweet?text=${text}&url=${url}`;
})();

const RATE_URL = "https://addons.mozilla.org/en-US/firefox/addon/x-dim-mode/reviews/";

// i18n
document.getElementById("title").textContent = chrome.i18n.getMessage("extName");
document.getElementById("enableLabel").textContent = chrome.i18n.getMessage("enableDim");
document.getElementById("hint").textContent = chrome.i18n.getMessage("settingsHint");
document.getElementById("credit").textContent = chrome.i18n.getMessage("credit");

// Share link in footer
const shareLink = document.getElementById("shareLink");
shareLink.textContent = chrome.i18n.getMessage("popupShareLink");
shareLink.href = SHARE_URL;

// ── Theme selection ────────────────────────────────────────────────

function setActiveTheme(themeName) {
  themeDots.forEach(d => d.classList.toggle("active", d.dataset.theme === themeName));

  // Custom dot: show chosen color when active, rainbow when not
  if (themeName === "custom") {
    const hue = +hueSlider.value;
    customDot.style.background = `hsl(${hue}, 34%, 28%)`;
  } else {
    customDot.style.background = RAINBOW;
  }

  // Show/hide hue slider
  hueWrap.classList.toggle("open", themeName === "custom");
}

// Load initial state
chrome.storage.local.get(["enabled", "theme", "customHue"], ({ enabled, theme, customHue }) => {
  toggle.checked = !!enabled;
  dot.classList.toggle("active", !!enabled);

  if (customHue !== undefined) {
    hueSlider.value = customHue;
  }

  setActiveTheme(theme || "dim");
});

// Toggle handler
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  dot.classList.toggle("active", enabled);
});

// Preset theme clicks
themeDots.forEach(d => {
  if (d.dataset.theme === "custom") return;
  d.addEventListener("click", () => {
    chrome.storage.local.set({ theme: d.dataset.theme });
    setActiveTheme(d.dataset.theme);
  });
});

// Custom dot click — activate custom mode
customDot.addEventListener("click", () => {
  chrome.storage.local.set({ theme: "custom", customHue: +hueSlider.value });
  setActiveTheme("custom");
});

// Hue slider — dragging auto-switches to custom mode
hueSlider.addEventListener("input", () => {
  const hue = +hueSlider.value;
  chrome.storage.local.set({ theme: "custom", customHue: hue });
  setActiveTheme("custom");
});

// ── Engagement prompt (one-time, after ~7 days) ────────────────────

const ONE_DAY = 24 * 60 * 60 * 1000;

function showEngagePrompt() {
  const prompt = document.getElementById("engagePrompt");
  prompt.style.display = "block";

  document.getElementById("engageText").textContent = chrome.i18n.getMessage("engageQuestion");

  const engageShare = document.getElementById("engageShare");
  engageShare.textContent = chrome.i18n.getMessage("shareOnX");
  engageShare.href = SHARE_URL;

  const engageRate = document.getElementById("engageRate");
  engageRate.textContent = chrome.i18n.getMessage("engageRate");
  engageRate.href = RATE_URL;

  function dismiss() {
    chrome.storage.local.set({ engageDismissed: true });
    prompt.style.display = "none";
  }

  document.getElementById("engageClose").addEventListener("click", dismiss);
  engageShare.addEventListener("click", dismiss);
  engageRate.addEventListener("click", dismiss);
}

chrome.storage.local.get(["installTimestamp", "engageDismissed"], ({ installTimestamp, engageDismissed }) => {
  if (engageDismissed || !installTimestamp) return;
  if (Date.now() - installTimestamp < ONE_DAY) return;
  showEngagePrompt();
});

// ── Test button (remove before release) ────────────────────────────
document.getElementById("testEngage").addEventListener("click", () => {
  chrome.storage.local.set({ engageDismissed: false });
  showEngagePrompt();
});
