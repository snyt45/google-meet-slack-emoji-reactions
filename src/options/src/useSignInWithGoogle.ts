import { ref } from 'vue'

export const useSignInWithGoogle = () => {
  const userName = ref('')

  // ChromeアプリからGoogleログインしてトークン取得
  async function signInWithGoogle() {
    chrome.identity.getAuthToken(
      {interactive: true},
      (token: string) => {
        const userInfoUrl = "https://www.googleapis.com/oauth2/v1/userinfo"
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
          },
        }

        fetch(userInfoUrl, requestOptions)
          .then(async response => {
            const jsonData = await response.json()

            // check for error response
            if (jsonData.error) {
              return Promise.reject(jsonData.error)
            }
            // set user name
            userName.value = jsonData.name
            // set local storage
            chrome.storage.local.set({'userName': jsonData.name})

            console.log('get userInfo')
          })
          .catch(error => {
            console.error('There was an error!', error)
          })
      }
    )
  }

  // chrome.identity.getAuthTokenで得たアクセストークンをrevokeする
  // https://zentoo.hatenablog.com/entry/2014/12/08/083617
  async function revokeAuthToken() {
    chrome.identity.getAuthToken(
      {interactive: false},
      (token: string) => {
        chrome.identity.removeCachedAuthToken({ token: token }, function() {})

        const revokeUrl = "https://accounts.google.com/o/oauth2/revoke?token=" + token
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
          },
        }

        fetch(revokeUrl, requestOptions)
          .then(async response => {
            const jsonData = await response.json()

            // check for error response
            if (jsonData.error) {
              return Promise.reject(jsonData.error)
            }
            // clear user name
            userName.value = ''
            // remove cache userName
            chrome.storage.local.remove('userName', function() {
              console.log('remove cache userName')
            })
            console.log('revoke auth tokne')
          })
          .catch(error => {
            console.error('There was an error!', error)
          })
      }
    )
  }

  return {
    userName,
    signInWithGoogle,
    revokeAuthToken
  }
}
