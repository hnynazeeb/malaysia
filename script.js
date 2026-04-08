const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const sampleTabButtons = document.querySelectorAll(".sample-tab-button");
const sampleTabPanels = document.querySelectorAll(".sample-tab-panel");

tabButtons.forEach((button) => {
  if (button.classList.contains("sample-tab-button")) {
    return;
  }
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
});

sampleTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.sampleTab;

    sampleTabButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    sampleTabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.samplePanel === target);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});
