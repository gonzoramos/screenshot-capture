chrome.storage.sync.clear()

chrome.storage.sync.get(config => {
  if (!config.method) {
    chrome.storage.sync.set({ method: "view" });
  }
  if (config.dpr === undefined) {
    chrome.storage.sync.set({ dpr: true });
  }
});

// ???
function inject(tab) {
  setTimeout(() => {
    chrome.tabs.sendMessage(tab.id, { message: "init" }, res => {});
  }, 200);
}

// is one clicks on the extension's button / icon
chrome.browserAction.onClicked.addListener(tab => {
  inject(tab);
});

chrome.commands.onCommand.addListener(command => {
  // listen for keyboard shortcut
  if (command === "take-screenshot") {
    chrome.tabs.getSelected(null, tab => {
      inject(tab);
    });
  }
});

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === "capture") {
    chrome.tabs.getSelected(null, tab => {
      chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, image => {
        // image is base64

        chrome.storage.sync.get(config => {
          if (config.method === "view") {
            if (req.dpr !== 1 && !config.dpr) {
              crop(image, req.area, req.dpr, config.dpr, cropped => {
                res({ message: "image", image: cropped });
              });
            } else {
              res({ message: "image", image: image });
            }
          } 
        });
      });
    });
  } else if (req.message === "active") {
    if (req.active) {
      chrome.storage.sync.get(config => {
        if (config.method === "view") {
          chrome.browserAction.setTitle({
            tabId: sender.tab.id,
            title: "Capture Viewport"
          });
          chrome.browserAction.setBadgeText({
            tabId: sender.tab.id,
            text: "⬒"
          });
        }
      });
    } else {
      chrome.browserAction.setTitle({
        tabId: sender.tab.id,
        title: "Full Screenshot Capture"
      });
      chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "" });
    }
  }
  return true;
});

function crop(image, area, dpr, preserve, done) {
  var top = area.y * dpr;
  var left = area.x * dpr;
  var width = area.w * dpr;
  var height = area.h * dpr;
  var w = dpr !== 1 && preserve ? width : area.w;
  var h = dpr !== 1 && preserve ? height : area.h;

  var canvas = null;
  if (!canvas) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }
  canvas.width = w;
  canvas.height = h;

  var img = new Image();
  img.onload = () => {
    var context = canvas.getContext("2d");
    context.drawImage(img, left, top, width, height, 0, 0, w, h);

    var cropped = canvas.toDataURL("image/png");
    done(cropped);
  };
  img.src = image;
}
