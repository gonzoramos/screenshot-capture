var state = {
  shortcut: {},
  methods: [
    { id: "view", icon: "⬒", title: "Capture Viewport" }
  ],
  dpr: [
    { id: true, title: "Preserve original DPI size" },
    { id: false, title: "Adjust to actual size" }
  ]
};

chrome.commands.getAll((commands) => {
    var command = commands.filter((command) => command.name === 'take-screenshot')[0]
    state.shortcut = command.shortcut
  })  

// read (previously) stored state
chrome.storage.sync.get(config => {
  state.methods.forEach(item => {
    // add member to item marking it as selected or not
    item.checked = item.id === config.method;
  });
  state.dpr.forEach(item => {
    // add member to item marking it as selected or not
    item.checked = item.id === config.dpr;
  });
});

// set event handlers for changing state
var events = {
  method: item => e => {
    state.methods.forEach(item => (item.checked = false));
    item.checked = true;
    // set state
    chrome.storage.sync.set({ method: item.id });
  },
  dpr: item => e => {
    state.dpr.forEach(item => (item.checked = false));
    item.checked = true;
    chrome.storage.sync.set({ dpr: item.id });
  }
};
