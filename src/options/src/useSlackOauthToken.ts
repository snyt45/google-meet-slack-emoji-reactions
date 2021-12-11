import { reactive, computed } from 'vue'

type slackOauthToken = {
    token: string,
    errorMessage: string,
    isValid: boolean
}

export const useSlackOauthToken = () => {
  const slackOauthToken = reactive({
    token: '',
    errorMessage: '',
    isValid: false
  })

  const setSlackOauthToken = (inputData: slackOauthToken) => {
    slackOauthToken.token = inputData?.token || ''
    slackOauthToken.errorMessage = inputData?.errorMessage || ''
    slackOauthToken.isValid = inputData?.isValid || false
  }

  // 有効なSlackOAuthTokenか確認
  const validSlackOAuthTokenConfirm = () => {
    const slackAuthTestUrl = "https://slack.com/api/auth.test/"
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + slackOauthToken.token
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
        slackOauthToken.errorMessage = ''
        // set local storage
        chrome.storage.local.set({'slackOauthToken': slackOauthToken.token}, function() {
          console.log('set local storage')
          // show check mark
          slackOauthToken.isValid = true
        })
      })
      .catch(error => {
        // set error message
        slackOauthToken.errorMessage = error
        console.error('There was an error!', error)
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

  const clearCacheSlackOauthToken = () => {
    const inputData = {
      token: '',        // clear slack oauth token
      errorMessage: '', // clear error message
      isValid: false,   // hidden check mark
    }
    setSlackOauthToken(inputData)

    // clear local storage
    chrome.storage.local.clear(function() {
      console.log('clear local storage')
    })
  }

  return {
    slackOauthToken,
    setSlackOauthToken,
    validSlackOAuthTokenConfirm,
    getCacheSlackOauthToken,
    clearCacheSlackOauthToken
  }
}
