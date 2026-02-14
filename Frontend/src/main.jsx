import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/clerk-react"
import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// add the clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Add the Clerk Publishable Key to the .env file.")
}

// instantiating the new query client
const query_client = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <QueryClientProvider client={query_client}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
