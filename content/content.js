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
    " - " +
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
  var done = data => {
    saveImage(data.image, filename("png"));
    saveText(
      JSON.stringify({
        id: "user id",
        feedback: "this is (not) awesome",
        score: 0
      }),
      filename("json")
    );
  };

  if (req.message === "init") {
    console.log("got init");
    res({}); // prevent re-injecting
    capture(done);
  } else if (req.message === "submitEvent") {
    console.log("got submit");
    capture(done);
  }
  return true;
});
