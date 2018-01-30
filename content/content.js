var selection;

var overlay = (active => state => {
  active =
    typeof state === "boolean" ? state : state === null ? active : !active;
  chrome.runtime.sendMessage({ message: "active", active });
})(false);

var image = done => {
  var image = new Image();
  image.id = "fake-image";
  image.src = chrome.runtime.getURL("/images/pixel.png");
  image.onload = () => {
    $("body").append(image);
    done();
  };
};

var init = done => {
  // $("#fake-image").Jcrop(
  //   {
  //     bgColor: "none",
  //     onSelect: e => {
  //       selection = e;
  //       capture();
  //     },
  //     onChange: e => {
  //       selection = e;
  //     },
  //     onRelease: e => {
  //       setTimeout(() => {
  //         selection = null;
  //       }, 100);
  //     }
  //   },
  //   function ready() {
  //     jcrop = this;
  //     $(".jcrop-hline, .jcrop-vline").css({
  //       backgroundImage:
  //         "url(" + chrome.runtime.getURL("/images/Jcrop.gif") + ")"
  //     });
  //     if (selection) {
  //       jcrop.setSelect([selection.x, selection.y, selection.x2, selection.y2]);
  //     }
  //     done && done();
  //   }
  // );
};

var capture = force => {
  chrome.storage.sync.get(config => {
    if (config.method === "view") {
      chrome.runtime.sendMessage(
        {
          message: "capture",
          area: { x: 0, y: 0, w: innerWidth, h: innerHeight },
          dpr: devicePixelRatio
        },
        res => {
          overlay(false);
          save(res.image);
        }
      );
    }
  });
};

var filename = () => {
  var pad = n => (n = n + "") && (n.length >= 2 ? n : "0" + n);
  var timestamp = (now =>
    [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join(
      "-"
    ) +
    " - " +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(
      "-"
    ))(new Date());
  return "Full Screenshot Capture - " + timestamp + ".png";
};

// simulate user's click on link
var save = image => {
  var link = document.createElement("a");
  link.download = filename();
  link.href = image;
  link.click();
};

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === "init") {
    res({}); // prevent re-injecting

    overlay();
    capture(true);

    console.log("init received");
  }
  return true;
});
