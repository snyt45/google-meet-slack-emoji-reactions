<template>
  <div class="flex justify-between m-2">
    <p>Hello World!!</p>
    <a :href="optionsIndexUrl" target="_blank" class="hover:opacity-75">
      <CogIcon class="h-5 w-5 text-gray-500"/>
    </a>
  </div>
</template>

<script lang="ts">
import { CogIcon } from '@heroicons/vue/solid'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Popup',
  components: { CogIcon },
  setup() {
    const optionsIndexUrl = chrome.runtime.getURL("dist/options/index.html")

    return {
      optionsIndexUrl
    }
  },
})
</script>
