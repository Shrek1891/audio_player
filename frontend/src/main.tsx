import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {ClerkProvider} from "@clerk/clerk-react";
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store/store.ts";
import AuthProvider from "./providers/AuthProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
            <Provider store={store}>
                <AuthProvider>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </AuthProvider>
            </Provider>
        </ClerkProvider>
    </StrictMode>,
)
