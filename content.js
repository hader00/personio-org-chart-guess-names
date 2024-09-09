function addOverlayToNames() {
    const diagramItems = document.querySelectorAll('.dhx_shape-container .dhx_diagram_flow_item');

    diagramItems.forEach((item) => {
        const nameElement = item.querySelector('.EmployeeCard-module__name___etdj3');
        const directReportsElement = item.querySelector('.EmployeeCard-module__directReportsCountTag___OaAYV');
        const hideIconElement = item.querySelector('.dhx_hide_icon');
        const expandIconElement = item.querySelector('.dhx_expand_icon');

        if (nameElement && !nameElement.querySelector('.overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay';

            nameElement.classList.add('name-element-hidden');
            nameElement.appendChild(overlay);

            overlay.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                overlay.style.display = 'none';
                nameElement.classList.remove('name-element-hidden');
            });

            nameElement.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        }

        if (directReportsElement) {
            directReportsElement.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        }

        if (hideIconElement) {
            hideIconElement.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        }

        if (expandIconElement) {
            expandIconElement.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        }
    });
}

function resetOverlays() {
    const overlays = document.querySelectorAll('.overlay');
    overlays.forEach((overlay) => overlay.remove());

    const nameElements = document.querySelectorAll('.EmployeeCard-module__name___etdj3');
    nameElements.forEach((nameElement) => {
        nameElement.classList.remove('name-element-hidden');
    });

    if (observer) {
        observer.disconnect();
    }
}

let observer;

function setupObserver() {
    if (observer) {
        observer.disconnect();
    }

    observer = new MutationObserver(() => {
        addOverlayToNames();
    });

    const container = document.querySelector('.dhx_shape-container');
    if (container) {
        observer.observe(container, {childList: true, subtree: true});
    }
}

window.addOverlayToNames = addOverlayToNames;
window.setupObserver = setupObserver;
window.resetOverlays = resetOverlays;