var state = {
  shortcut: {},
  methods: [{ id: "view", icon: "⬒", title: "Capture Viewport" }],
  dpr: [
    { id: true, title: "Preserve original DPI size" },
    { id: false, title: "Adjust to actual size" }
  ]
};

chrome.commands.getAll(commands => {
  var command = commands.filter(
    command => command.name === "take-screenshot"
  )[0];
  state.shortcut = command.shortcut;
});

console.log("hello popup");

$("#btn_submit").click(e => {
  //console.log("submit clicked");
  // collect metadata
  var trigger = $("#input_trigger").val();
  var diary = $("#input_response").val();

  chrome.tabs.getSelected(null, tab => {
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tab.id,
        {
          message: "submitEvent",
          tabId: tab.id,
          metadata: { trigger: trigger, response: diary, id: 0 }
        },
        res => {}
      );
    }, 200);
  });
});

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === "thumbnail") {
    console.log("got thumb");
    window.close();
  }
});
