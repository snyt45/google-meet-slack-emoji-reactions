import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({
  duration: 10000,
  position: {
    x: 'left',
    y: 'bottom',
  },
  types: [
    {
      type: 'info',
      background: 'linear-gradient(45deg, rgb(239, 253, 33), rgb(255, 0, 0))',
      dismissible: true
    }
  ]
})

export { notyf }
