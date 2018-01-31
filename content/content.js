// take snapshot
var capture = (tabId, done) => {
  chrome.storage.sync.get(config => {
    if (config.method === "view") {
      chrome.runtime.sendMessage(
        {
          message: "captureEvent",
          tabId: tabId,
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
  return "ScreenshotCapture-" + timestamp + "." + suffix;
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

chrome.runtime.onMessage.addListener((req, sender, res) => {
  var done = metadata => data => {
    saveImage(data.image, filename("png"));
    saveText(JSON.stringify(metadata), filename("json"));
  };

  if (req.message === "init") {
    console.log("got init");
    res({}); // prevent re-injecting
    capture(req.tabId, done({ trigger: "", response: "", id: -1 }));
  } else if (req.message === "submitEvent") {
    console.log("got submit");
    res({}); // prevent re-injecting
    setTimeout(() => {
      chrome.runtime.sendMessage(
        { message: "submitEvent" }, // for the background page
        res => {}
      );
    }, 200);
    //capture(req.tabId, done(req.metadata));
  }
  return true;
});


// var port = chrome.runtime.connect({name: "knockknock"});
// port.postMessage({joke: "Knock knock"});
// port.onMessage.addListener(function(msg) {
//   if (msg.question == "Who's there?")
//     port.postMessage({answer: "Madame"});
//   else if (msg.question == "Madame who?")
//     port.postMessage({answer: "Madame... Bovary"});
// });

// for background or content - https://developer.chrome.com/extensions/messaging
// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "knockknock");
//   port.onMessage.addListener(function(msg) {
//     if (msg.joke == "Knock knock")
//       port.postMessage({question: "Who's there?"});
//     else if (msg.answer == "Madame")
//       port.postMessage({question: "Madame who?"});
//     else if (msg.answer == "Madame... Bovary")
//       port.postMessage({question: "I don't get it."});
//   });
// });