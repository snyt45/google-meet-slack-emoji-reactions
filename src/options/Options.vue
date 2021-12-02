<template>
  <div class='container mx-auto my-5 w-2/4'>
    <header>
      <h1 class="text-xl text-center font-bold my-2">Google Meet Slack Emoji Reactions Settings</h1>
    </header>
    <div class="container mx-auto my-3 w-4/5">
      <form>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="slack_oauth_token">
            Slack OAuth Token
          </label>
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
          <button class="font-bold text-blue-500 py-2 px-4 rounded hover:text-blue-700" type="button">
            Clear
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slackOauthToken = ref('')
const errorMessage = ref('')

const onCheckToken = () => {
  console.log('call onCheckToken')

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
      // TODO: save local storage
    })
    .catch(error => {
      // set error message
      errorMessage.value = error
      console.error('There was an error!', error)
    })
}
</script>
