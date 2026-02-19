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

// i18n
document.getElementById("title").textContent = chrome.i18n.getMessage("extName");
document.getElementById("enableLabel").textContent = chrome.i18n.getMessage("enableDim");
document.getElementById("hint").textContent = chrome.i18n.getMessage("settingsHint");
document.getElementById("credit").textContent = chrome.i18n.getMessage("credit");

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
