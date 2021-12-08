import fs from 'fs-extra'
import { r } from '../scripts/utils'

const getManifest = () => {
  return {
    manifest_version: 3,
    name: 'Google Meet Slack Emoji Reactions',
    description: 'Google MeetにSlackの絵文字資産を使ったリアクション機能を提供します。',
    version: '0.1',
    content_scripts: [
      {
        matches: ['http://meet.google.com/*', 'https://meet.google.com/*'],
        js: ['dist/contentScripts/index.js'],
      },
    ],
    options_page: 'dist/options/index.html',
    background: {
      service_worker: 'background.js'
    },
    action: {
      default_popup: 'dist/popup/index.html'
    },
    permissions: [
      'identity',
      'storage'
    ],
    host_permissions: [
      'https://slack.com/api/*'
    ],
    oauth2: {
      client_id: '193910923857-psarj8ct1c9ui0f4e9glmfehg5mcdhlt.apps.googleusercontent.com',
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ]
    }
  }
}

function writeManifest() {
  fs.writeJSON(r('extension/manifest.json'), getManifest(), { spaces: 2 })
}

writeManifest()
