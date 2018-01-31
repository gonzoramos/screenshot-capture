chrome.storage.sync.clear();

chrome.storage.sync.get(config => {
  if (!config.method) {
    chrome.storage.sync.set({ method: "view" });
  }
  if (config.dpr === undefined) {
    chrome.storage.sync.set({ dpr: true });
  }
});

// ???
function captureTab(tab) {
  setTimeout(() => {
    chrome.tabs.sendMessage(tab.id, { message: "init", tabId: tab.id }, res => {});
  }, 200);
}

// is one clicks on the extension's button / icon
chrome.browserAction.onClicked.addListener(tab => {
  captureTab(tab);
});

chrome.commands.onCommand.addListener(command => {
  // listen for keyboard shortcut
  if (command === "take-screenshot") {
    chrome.tabs.getSelected(null, tab => {
      captureTab(tab);
    });
  }
});

// handle events from client
chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === "captureEvent") {
    chrome.tabs.getSelected(null, tab => {
      chrome.tabs.captureVisibleTab({ format: "png" }, image => {
        // image is base64
        res({ message: "image", image: image });
      });
    });
  } else if (req.message === "submitEvent" ) {
    console.log("got submit");

    chrome.tabs.getSelected(null, tab => {
      captureTab(tab);
    });
  }
  return true;
});
