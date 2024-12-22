document.getElementById("apply").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      function addCustomStyles() {
        const style = document.createElement("style");
        style.textContent = `
          .overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: gray;
              cursor: pointer;
              z-index: 10;
          }
          .name-element-hidden {
              position: relative;
              color: transparent;
          }
        `;
        document.head.appendChild(style);
      }

      function ensureOverlay(nameElement) {
        let overlay = nameElement.querySelector(".overlay");
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.className = "overlay";

          overlay.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            overlay.style.display = "none";
            nameElement.classList.remove("name-element-hidden");
          });

          nameElement.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
          });

          nameElement.appendChild(overlay);
        }

        if (overlay.style.display !== "none") {
          nameElement.classList.add("name-element-hidden");
        } else {
          nameElement.classList.remove("name-element-hidden");
        }
      }

      function addOverlayToNames() {
        const nodeUnmatchedPersons = document.querySelectorAll(
          '[data-test-id="node-unmatched-person"]'
        );
        const nodePersons = document.querySelectorAll(
          '[data-test-id="node-person"]'
        );

        const diagramItems = [...nodeUnmatchedPersons, ...nodePersons];

        diagramItems.forEach((item) => {
          const childDiv = item.querySelector('[data-test-id^="person-card-"]');
          if (!childDiv) return;

          const nameElement = childDiv?.children[0]?.children[1]?.children[0];
          if (!nameElement) return;

          ensureOverlay(nameElement);

          const parentItem = item?.parentElement?.children[2];
          if (parentItem) {
            const originalClickMethod = parentItem.click
              ? parentItem.click.bind(parentItem)
              : null;

            parentItem.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();

              if (originalClickMethod) {
                originalClickMethod();
              }

              setTimeout(() => {
                addOverlayToNames();
              }, 0);
            });
          }
        });
      }

      function setupObserver() {
        if (window.observer) {
          window.observer.disconnect();
        }

        window.observer = new MutationObserver(() => {
          addOverlayToNames();
        });

        window.observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }

      addCustomStyles();
      addOverlayToNames();
      setupObserver();
    },
  });
});

document.getElementById("reset").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      function resetOverlays() {
        const overlays = document.querySelectorAll(".overlay");
        overlays.forEach((overlay) => {
          overlay.remove();

          const nameElement = overlay.parentElement;
          if (nameElement) {
            nameElement.replaceWith(nameElement.cloneNode(true));
          }
        });

        const hiddenElements = document.querySelectorAll(".name-element-hidden");
        hiddenElements.forEach((el) => el.classList.remove("name-element-hidden"));

        const nodeItems = document.querySelectorAll(
          '[data-test-id="node-person"], [data-test-id="node-unmatched-person"]'
        );

        nodeItems.forEach((item) => {
          const parentItem = item?.parentElement?.children[2];
          if (parentItem) {
            parentItem.replaceWith(parentItem.cloneNode(true));
          }
        });

        if (window.observer) {
          window.observer.disconnect();
          window.observer = null;
        }
      }

      resetOverlays();
    },
  });
});
