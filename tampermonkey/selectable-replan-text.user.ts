(() => {
  GM_addStyle(`
    .selectable-text {
      user-select: all !important;
    }
  `);

  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.target) {
        const routingReplanText = document.querySelectorAll(
          "[mdn-alert-message] > div > p:nth-child(2)"
        );

        routingReplanText.forEach((textEl) => {
          textEl.classList.add("selectable-text");
        });
      }
    });
  });

  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
})();
