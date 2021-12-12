<template>
  <div class='container mx-auto my-5 w-2/4'>
    <header>
      <h1 class="text-2xl text-center font-bold mb-5">Emoji Reactions Settings</h1>
    </header>
    <div class="container mx-auto my-3 w-4/5">
      <h2 class="text-base font-bold my-2">Slackワークスペースのカスタム絵文字を表示する</h2>
      <form>
        <div class="mb-6">
          <div class="flex">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="slack_oauth_token">
              Slack OAuth Token
            </label>
            <span v-show="isValidSlackOauthToken" class="block ml-1">
              <CheckCircleIcon class="h-5 w-5 text-green-500" />
            </span>
          </div>
          <input
            :value="slackOauthToken"
            @input="slackOauthToken = $event.target.value"
            class="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight"
            id="slack_oauth_token"
            type="password"
            placeholder="Slack OAuth Token Here"
          >

          <span class="text-sm font-medium tracking-wide text-red-500">
            {{ slackOauthTokenErrorMsg }}
          </span>

          <p class="indent-4 text-gray-400 mb-2">
            emoji:read権限を持ったSlackアプリを作成し、Slackワークスペースにインストールしてください。
            作成したSlackアプリのOAuth Tokenを設定することで絵文字リストを取得することができます。
          </p>
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
  slackOauthTokenErrorMsg,
  isValidSlackOauthToken,
  validSlackOAuthTokenConfirm,
  getCacheSlackOauthToken
} = useSlackOauthToken()

onBeforeMount(() => {
  // local storageにキャッシュがあればキャッシュを使う
  getCacheSlackOauthToken().then(data => {
    const token = data?.slackOauthToken
    if (token) {
      slackOauthToken.value = token       // set local cache
      slackOauthTokenErrorMsg.value =  '' // clear error message
      isValidSlackOauthToken.value = true // show check mark
    }
  })
})
</script>
