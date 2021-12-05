<template>
  <div class="flex justify-between items-center p-2 bg-green-500">
    <h1 class="text-lg text-bold text-white">
      Google Meet Slack Emoji Reactions &#x1F44D;
    </h1>
    <a :href="optionsIndexUrl" target="_blank" class="hover:opacity-75">
      <CogIcon class="h-6 w-6 text-gray-700"/>
    </a>
  </div>

  <div id="error_message" class="mb-2">
  </div>

  <div id="output_emoji" class="grid grid-cols-8 auto-cols-min auto-rows-min h-52 my-5 mx-3 p-2 border border-gray-200 overflow-y-auto">
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { CogIcon } from '@heroicons/vue/solid'

const optionsIndexUrl = chrome.runtime.getURL("dist/options/index.html")

onMounted(() => {
  // TODO: Popupを開くたびにfetchを実行しているためオーバーヘッドがある。cacheがあればcacheから表示するように書き換える
  FetchEmojiList()
})

async function FetchEmojiList() {
  clearElements()

  let token = ''
  await getSlackOauthToken().then(items => {
    if (items.slackOauthToken) {
      token = items.slackOauthToken
    }
  })

  if (!token) {
    createErrorElement()
    return
  } else {
    clearErrorElement()
  }

  const slackEmojiListUrl = "https://slack.com/api/emoji.list"
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + token
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

        createElements(imgSrc, imgAlt)
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

function getSlackOauthToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["slackOauthToken"], (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      resolve(items)
    })
  })
}

function createElements(imgSrc, imgAlt) {
  const outputElement = document.getElementById('output_emoji')
  outputElement.insertAdjacentHTML('beforeend', `
  <button class="m-1 py-1 px-1 rounded-lg shadow-md transform transition hover:scale-110 duration-500 focus:outline-none">
    <img
      src=${imgSrc}
      alt=${imgAlt}
    />
  </button>
  `)
}

function createErrorElement() {
  const outputElement = document.getElementById('error_message')
  outputElement.insertAdjacentHTML('beforeend', `
  <span class="block text-sm font-medium text-center tracking-wide text-red-500">
    歯車アイコンからSlack OAuth Tokenを保存してください。
  </span>
  `)
}

function clearElements() {
  const outputElement = document.getElementById('output_emoji')
  outputElement.innerHTML = ""
}

function clearErrorElement() {
  const errorElement = document.getElementById('error_message')
  errorElement.innerHTML = ""
}
</script>
