document.getElementById('apply').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id}, func: () => {
            window.addOverlayToNames();
            window.setupObserver();
        }
    });
});

document.getElementById('reset').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id}, func: () => window.resetOverlays()
    });
});