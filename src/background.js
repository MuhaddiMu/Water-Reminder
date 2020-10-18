global.browser = require("webextension-polyfill")
browser.runtime.onMessage.addListener(function(
  request,
  sender,
  sendResponse
) {})

let notificationOpts = {
  type: "basic",
  title: "Take A Drink",
  message: "It's time to take a sip!",
  iconUrl: "icons/128.png",
  requireInteraction: false
}
let Audiofile = "default.mp3"
let notID
var Minutes

let notificationSound = new Audio("sounds/" + Audiofile)

chrome.notifications.create(notificationOpts, id => {
  notID = id
})
notificationSound.play()

function start() {
  setInterval(() => {
    notificationSound.play()
    if (notID != null) {
      chrome.notifications.clear(notID)
    }
    chrome.notifications.create(notificationOpts, id => {
      notID = id
    })
  }, Minutes)
}

chrome.storage.sync.get(["time"], function(result) {
  Minutes = result.time
  if (Number.isInteger(Minutes)) {
    start()
  }
})
