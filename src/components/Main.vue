<template>
  <div class="w3-container w3-center">
    <h2>
      Remind Me to Drink 🥤
    </h2>
    <h3>Every</h3>

    <div class="w3-row">
      <div class="w3-col s4">&#8203;</div>
      <div class="w3-col s4">
        <input
          class="w3-input w3-center"
          v-model="Minutes"
          min="1"
          max="60"
          type="number"
        />

        <small><label>Minutes</label></small>
      </div>
      <div class="w3-col s4">&#8203;</div>
    </div>

    <div class="w3-col s2">&#8203;</div>
    <a
      v-if="Minutes"
      @click="savePref"
      class="w3-col s8 w3-margin-top water-button"
    >
      No More Dehydration
    </a>
    <div class="w3-col s2">&#8203;</div>
    <audio id="audio" v-if="playAudio" autoplay>
      <source autoplay :src="'sounds/' + Audiofile" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
const browser = require("webextension-polyfill")
export default {
  data() {
    return {
      Minutes: null,
      notificationOpts: {
        type: "basic",
        title: "Take A Drink",
        message: "It's time to take a sip!",
        iconUrl: "icons/128.png",
        requireInteraction: false
      },
      Audiofile: "default.mp3",
      playAudio: false,
      notID: null
    }
  },
  name: "Main",
  mounted() {
    browser.runtime.sendMessage({})
  },
  created() {
    chrome.storage.sync.get(["time"], result => {
      this.Minutes = parseInt(result.time / 60000)
    })
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage("extName")
    }
  },
  methods: {
    savePref() {
      chrome.storage.sync.set({ time: this.Minutes * 60000 })
      this.Notify()
    },
    Notify() {
      const self = this
      self.playAudio = true
      if (self.notID != null) {
        chrome.notifications.clear(self.notID)
      }
      chrome.notifications.create(self.notificationOpts, id => {
        self.notID = id
      })

      var audio = document.getElementById("audio")
      if (audio && audio.currentTime) {
        audio.currentTime = 0
        audio.play()
      }
      chrome.runtime.reload()
    }
  }
}
</script>

<style scoped>
.water-button {
  cursor: pointer;
  position: relative;
  text-decoration: none;
  color: #00abfd;
  border: 1px solid #00abfd;
  padding: 1.3em;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: flex-end stretch;
  align-items: flex-end stretch;
  letter-spacing: 2px;
  z-index: 1;
  -webkit-transition: all 1s ease;
  transition: all 1s ease;
}
.water-button:before,
.water-button:after {
  content: "";
  height: 300px;
  width: 300px;
  position: absolute;
  z-index: -1;
  top: 150%;
  -webkit-transition: all 1.4s ease;
  transition: all 1.4s ease;
}
.water-button:before {
  border-radius: 60% 70% 20% 40%;
  background: #00abfd;
  opacity: 0.2;
  -webkit-animation: water 13s ease-in-out infinite both alternate;
  animation: water 13s ease-in-out infinite both alternate;
}
.water-button:after {
  border-radius: 60% 70% 20% 40%;
  background: #00abfd;
  opacity: 0.5;
  -webkit-animation: water 14s ease-in-out infinite both alternate;
  animation: water 14s ease-in-out infinite both alternate;
}
.water-button:hover {
  background: #00abfd;
  color: white;
}
.water-button:hover:before,
.water-button:hover:after {
  opacity: 1;
  top: -100%;
}

@-webkit-keyframes water {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  20% {
    border-radius: 50% 63% 80% 49%;
  }
  40% {
    border-radius: 60% 64% 64% 48%;
  }
  60% {
    border-radius: 80% 63% 51% 49%;
  }
  80% {
    border-radius: 40% 60% 42% 58%;
  }
  100% {
    border-radius: 62% 67% 70% 53%;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
}

@keyframes water {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  20% {
    border-radius: 50% 63% 80% 49%;
  }
  40% {
    border-radius: 60% 64% 64% 48%;
  }
  60% {
    border-radius: 80% 63% 51% 49%;
  }
  80% {
    border-radius: 40% 60% 42% 58%;
  }
  100% {
    border-radius: 62% 67% 70% 53%;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
}
</style>
