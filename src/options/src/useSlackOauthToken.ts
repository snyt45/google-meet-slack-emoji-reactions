import { ref, watch } from 'vue'

export const useSlackOauthToken = () => {
  const slackOauthToken = ref('')
  const slackOauthTokenErrorMsg = ref('')
  const isValidSlackOauthToken = ref(false)

  // 有効なSlackOAuthTokenか確認
  const validSlackOAuthTokenConfirm = (token: string) => {
    const slackAuthTestUrl = "https://slack.com/api/auth.test/"
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + token
      },
    }

    fetch(slackAuthTestUrl, requestOptions)
      .then(async response => {
        const data = await response.json()
        // check for error response
        if (data.error) {
          return Promise.reject(data.error)
        }

        slackOauthTokenErrorMsg.value = ''  // clear error message
        isValidSlackOauthToken.value = true // show check mark
        // set cache slackOauthToken
        chrome.storage.local.set({'slackOauthToken': token}, function() {
          console.log('set cache slackOauthToken')
        })
      })
      .catch(error => {
        slackOauthTokenErrorMsg.value = error // set error message
        isValidSlackOauthToken.value = false  // hidden check mark
        // remove cache slackOauthToken
        chrome.storage.local.remove('slackOauthToken', function() {
          console.log('remove cache slackOauthToken')
        })
      })
  }

  const getCacheSlackOauthToken = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('slackOauthToken', (data) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError)
        }
        resolve(data)
      })
    })
  }

  watch(
    () => slackOauthToken.value,
    (token, _prevTokne) => {
      validSlackOAuthTokenConfirm(token)
    }
  )

  return {
    slackOauthToken,
    slackOauthTokenErrorMsg,
    isValidSlackOauthToken,
    validSlackOAuthTokenConfirm,
    getCacheSlackOauthToken
  }
}
