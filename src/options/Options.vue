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
            <span v-show="slackOauthToken.isValid" class="block ml-1">
              <CheckCircleIcon class="h-5 w-5 text-green-500" />
            </span>
          </div>
          <input
            :value="slackOauthToken.token"
            @input="setSlackOauthToken({token: $event.target.value})"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="slack_oauth_token"
            type="password"
            placeholder="Slack OAuth Token Here"
          >
        </div>

        <div class="mb-2">
          <span class="text-sm font-medium tracking-wide text-red-500">
            {{ slackOauthToken.errorMessage }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <button
            @click="validSlackOAuthTokenConfirm"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            type="button"
          >
            Save
          </button>
          <button
            @click="clearCacheSlackOauthToken"
            class="font-bold text-blue-500 py-2 px-4 rounded hover:text-blue-700"
            type="button"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/solid'
import { useSlackOauthToken } from './src/useSlackOauthToken'

const {
  slackOauthToken,
  setSlackOauthToken,
  validSlackOAuthTokenConfirm,
  getCacheSlackOauthToken,
  clearCacheSlackOauthToken
} = useSlackOauthToken()

onBeforeMount(() => {
  // local storageにキャッシュがあればキャッシュを使う
  getCacheSlackOauthToken().then(data => {
    const token = data?.slackOauthToken
    if (token) {
      const inputData = {
        token: token, // set local cache
        isValid: true // show check mark
      }
      setSlackOauthToken(inputData)
    }
  })
})
</script>
