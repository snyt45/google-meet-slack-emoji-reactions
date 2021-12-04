<template>
  <div class="flex justify-between m-2">
    <p>Google Meet Slack Emoji Reactions &#x1F44D;</p>
    <a :href="optionsIndexUrl" target="_blank" class="hover:opacity-75">
      <CogIcon class="h-5 w-5 text-gray-500"/>
    </a>
  </div>
</template>

<script setup lang="ts">
import { CogIcon } from '@heroicons/vue/solid'

const optionsIndexUrl = chrome.runtime.getURL("dist/options/index.html")
</script>
