import { notyf } from '../utils/notyf'
import { supabase } from '../utils/supabase'
import { ref } from 'vue'

const meetRoomId = ref('')

// meetRoomIdを取得する
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('messageを受信しました', request)
    meetRoomId.value = request.meetRoomId
  }
)


// reactionsテーブルの変更をサブスクライブ
supabase
  .from('reactions')
  .on('*', payload => {
    console.log('Change received!', payload)
    console.log('meetRoomId.value', meetRoomId.value)
    console.log('payload.new.meet_room_id', payload.new.meet_room_id)

    if (meetRoomId.value == payload.new.meet_room_id) {
      notyf.open({
        type: 'info',
        message: `
          <div style="align-items: center;display: flex;">
            ${payload.new.user_name}
            <img
              src="${payload.new.img_src}"
              alt="${payload.new.img_alt}"
              style="width: 2.5rem; margin-left: 0.5rem"
            >
          </div>
        `
      })
    } else {
      console.log('meetRoomIdが違います')
    }
  })
  .subscribe()
