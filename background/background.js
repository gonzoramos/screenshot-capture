chrome.storage.sync.clear();

chrome.storage.sync.get(config => {
  if (!config.method) {
    chrome.storage.sync.set({ method: "view" });
  }
  if (config.dpr === undefined) {
    chrome.storage.sync.set({ dpr: true });
  }
});

chrome.commands.onCommand.addListener(command => {
  // listen for keyboard shortcut
  if (command === "take-screenshot") {
    chrome.tabs.getSelected(null, tab => {
      captureTab(tab);
    });
  }
});

//for background or content - https://developer.chrome.com/extensions/messaging
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "uxsnap");
  port.onMessage.addListener(function(msg) {
    if (msg.msg === "submit") {
      //console.log(msg);
      chrome.tabs.getSelected(null, tab => {
        chrome.tabs.captureVisibleTab({ format: "png" }, image => {
          // image is base64
          port.postMessage({ message: "image", image: image });
        });
      });
    }
  });
});
