import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'jotai'
import { Theme } from '@radix-ui/themes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Theme hasBackground={false} appearance="dark">
        <App />
      </Theme>
    </Provider>
  </StrictMode>
)
