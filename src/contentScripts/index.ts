import { notyf } from '../utils/notyf'
import { supabase } from '../utils/supabase'

// reactionsテーブルの変更をサブスクライブ
supabase
  .from('reactions')
  .on('*', payload => {
    console.log('Change received!', payload)

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
  })
  .subscribe()
