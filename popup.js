const toggle = document.getElementById("toggle");
const dot = document.getElementById("dot");

browser.storage.local.get("enabled").then(({ enabled }) => {
  toggle.checked = !!enabled;
  dot.classList.toggle("active", !!enabled);
});

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  browser.storage.local.set({ enabled });
  dot.classList.toggle("active", enabled);
});
