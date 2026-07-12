import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.tsx";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./components/layout/MainLayout.tsx";
import ChatPage from "./pages/chat/ChatPage.tsx";
import AlbumPage from "./pages/AlbumPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";


function App() {
    return (
        <Routes>
            <Route path="/sso-callback"
                element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />} />
            <Route path="/auth-callback" element={<AuthCallbackPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path='/' element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/albums/:albumId" element={<AlbumPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default App
