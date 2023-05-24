
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import '../assets/main.scss'

const prepTheme = {
  dark: false,
  colors: {
    primary: '#0B8BCC',
    secondary: '#68C9D0',
    accent: '#F15A29',
  }
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      info: 'mdi-information-outline'
    },
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: 'prepTheme',
    themes: {
      prepTheme,
    }
  }
})
