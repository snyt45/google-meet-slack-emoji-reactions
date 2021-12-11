<template>
  <div class='container mx-auto my-5 w-2/4'>
    <header>
      <h1 class="text-xl text-center font-bold my-2">Emoji Reactions Settings</h1>
    </header>
    <div class="container mx-auto my-3 w-4/5">
      <form>
        <div class="mb-6">
          <div class="flex">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="slack_oauth_token">
              Slack OAuth Token
            </label>
            <span v-show="isAuthenticated" class="block ml-1"><CheckCircleIcon class="h-5 w-5 text-green-500" /></span>
          </div>
          <input v-model="slackOauthToken" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" id="slack_oauth_token" type="password" placeholder="Slack OAuth Token Here">
        </div>

        <div class="mb-2">
          <span class="text-sm font-medium tracking-wide text-red-500">
            {{ errorMessage }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <button @click="onCheckToken" class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700" type="button">
            Save
          </button>
          <button @click="onClear" class="font-bold text-blue-500 py-2 px-4 rounded hover:text-blue-700" type="button">
            Clear
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/solid'

const slackOauthToken = ref('')
const errorMessage = ref('')
const isAuthenticated = ref(false)

onBeforeMount(() => {
  getAllStorageLocalData().then(items => {
    if (items.slackOauthToken) {
      // set local cache
      slackOauthToken.value = items.slackOauthToken
      // show check mark
      isAuthenticated.value = true
    }
  })
})

// 有効なSlackOAuthTokenか確認
function onCheckToken() {
  const slackAuthTestUrl = "https://slack.com/api/auth.test/"
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + slackOauthToken.value
    },
  }

  fetch(slackAuthTestUrl, requestOptions)
    .then(async response => {
      const data = await response.json()
      // check for error response
      if (data.error) {
        return Promise.reject(data.error)
      }
      // clear error message
      errorMessage.value = ''
      // set local storage
      chrome.storage.local.set({'slackOauthToken': slackOauthToken.value}, function() {
        console.log('set local storage')
        // show check mark
        isAuthenticated.value = true
      })
    })
    .catch(error => {
      // set error message
      errorMessage.value = error
      console.error('There was an error!', error)
    })
}

function onClear() {
  // clear slack oauth token
  slackOauthToken.value = ''
  // clear error message
  errorMessage.value = ''
  // clear local storage
  chrome.storage.local.clear(function() {
    console.log('clear local storage')
    // hidden check mark
    isAuthenticated.value = false
  })
}

function getAllStorageLocalData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      resolve(items)
    })
  })
}
</script>
