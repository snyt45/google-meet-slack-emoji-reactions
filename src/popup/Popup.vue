<template>
  <div class="flex justify-between items-center p-2 bg-green-500">
    <h1 class="text-lg text-bold text-white">
      Emoji Reactions &#x1F44D;
    </h1>
    <a :href="optionsIndexUrl" target="_blank" class="hover:opacity-75">
      <CogIcon class="h-6 w-6 text-gray-700"/>
    </a>
  </div>

  <div id="error_message" class="text-sm font-medium text-center tracking-wide text-red-500 mb-2">
    {{ errorMsg }}
  </div>

  <div
    v-show="canEmojiReaction"
    id="output_emoji"
    class="grid grid-cols-8 auto-cols-min auto-rows-min h-52 my-5 mx-3 p-2 border border-gray-200 overflow-y-auto"
  >
    <section v-for="(value, name) in emojiList">
      <button @click="sendMessage(value, name)" class="m-1 py-1 px-1 rounded-lg shadow-md transform transition hover:scale-110 duration-500 focus:outline-none">
        <img :src="value" :alt="name">
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { CogIcon } from '@heroicons/vue/solid'
import { supabase } from '../utils/supabase'

const optionsIndexUrl = chrome.runtime.getURL("dist/options/index.html")
const slackOauthToken = ref('')
const userName = ref('')
const meetRoomId = ref('')
const canEmojiReaction = computed(
  () => !!isSettingOK.value && !!meetRoomId.value
)
const isSettingOK = computed(
  () => !!slackOauthToken.value && !!userName.value
)
const errorMsg = ref('')
const emojiList = ref({})

onMounted(async () => {
  // local storageにキャッシュがあればキャッシュを使う
  await getAllStorageLocalData().then(data => {
    const cacheToken = data?.slackOauthToken
    if (cacheToken) {
      slackOauthToken.value = cacheToken
    }
    const cacheUserName = data?.userName
    if (cacheUserName) {
      userName.value = cacheUserName
    }
  })

  // get meet room id
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const url = new URL(tabs[0].url)
    // ホスト名がmeet.google.comの場合
    if (url.hostname == "meet.google.com") {
      console.log("hostname meet.google.com")
      meetRoomId.value = url.pathname.slice(1)
    } else {
      console.log("hostname not meet.google.com")
      meetRoomId.value = ''
    }

    // send meetRoomId to contents script
    if (meetRoomId.value) {
      chrome.tabs.sendMessage(tabs[0].id, { meetRoomId: meetRoomId.value }, function(response){
        console.log(`send meetRoomId ${meetRoomId.value} to contents script`)
      })
    }

    if (canEmojiReaction.value) {
      FetchEmojiList()
      errorMsg.value = ''
    } else if (!isSettingOK.value) {
      errorMsg.value = '歯車アイコンから設定を行ってください'
    } else if (!meetRoomId.value) {
      errorMsg.value = 'meetを開いてください'
    }
  })
})

function FetchEmojiList() {
  const slackEmojiListUrl = "https://slack.com/api/emoji.list"
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + slackOauthToken.value
    },
  }

  fetch(slackEmojiListUrl, requestOptions)
    .then(async response => {
      const jsonData = await response.json()
      const emojiData = jsonData.emoji

      Object.entries(emojiData).forEach(([imgAlt, imgSrc]) => {
        // Skip other than images
        const regexp = /^http/
        if ( !regexp.test(imgSrc) ) { return }

        emojiList.value[imgAlt] = imgSrc
      })

      // check for error response
      if (jsonData.error || !jsonData.emoji) {
        return Promise.reject(jsonData.error)
      }
      console.log('get emoji list')
    })
    .catch(error => {
      // set error message
      console.error('There was an error!', error)
    })
}

// supabaseのreactionsテーブルにinsertする
async function sendMessage(imgSrc, imgAlt) {
  console.log('sendMessage: ', meetRoomId.value, userName.value, imgSrc, imgAlt)

  if (meetRoomId.value) {
    const { data, error } = await supabase
    .from('reactions')
    .insert([
      {
        meet_room_id: meetRoomId.value,
        user_name: userName.value,
        img_src: imgSrc,
        img_alt: imgAlt
      }
    ])
  } else {
    console.log('Not meetRoomId')
  }
}

function getAllStorageLocalData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (data) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      resolve(data)
    })
  })
}
</script>
