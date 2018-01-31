// take snapshot
var capture = done => {
  chrome.storage.sync.get(config => {
    if (config.method === "view") {
      chrome.runtime.sendMessage(
        {
          message: "captureEvent",
          area: { x: 0, y: 0, w: innerWidth, h: innerHeight },
          dpr: devicePixelRatio
        },
        res => {
          done(res);
        }
      );
    }
  });
};

// generate filename
var filename = suffix => {
  var pad = n => (n = n + "") && (n.length >= 2 ? n : "0" + n);
  var timestamp = (now =>
    [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join(
      "-"
    ) +
    "-" +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(
      "-"
    ))(new Date());
  return "UXSnap-" + timestamp + "." + suffix;
};

// save data (simulate user's click on link)
var saveImage = (image, filename) => {
  var link = document.createElement("a");
  link.download = filename;
  link.href = image;
  link.click();
};

var saveText = (text, filename) => {
  var blob = new Blob([text], { type: "text/plain" });
  var url = window.URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.download = filename;
  link.innerHTML = "filename";
  link.href = url;

  link.click();
};

var metadata = {};

var port = chrome.runtime.connect({ name: "uxsnap" });
port.onMessage.addListener(function(msg) {
  if (msg.message == "image") {
    done(metadata)(msg);
    chrome.runtime.sendMessage({ message: "thumbnail", image: msg.image });
  }
});

// this helper function saves the image + data into a datastore. it should be adapted for a moere generic one
var done = meta => data => {
  saveImage(data.image, filename("png"));
  saveText(JSON.stringify(meta), filename("json"));
};

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === "submitEvent") {
    console.log("got submit");
    res({}); // prevent re-injecting
    metadata = req.metadata;
    port.postMessage({
      msg: "submit",
      area: { x: 0, y: 0, w: innerWidth, h: innerHeight }
    });
  }
  return true;
});
