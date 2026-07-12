import { configureStore, type Middleware } from "@reduxjs/toolkit";
import auth from "../features/auth.ts";
import { audioPlayerApi } from "../features/audioPlayerApi.ts";
import audioPlayer from "../features/audioPlayer.ts";
import chatApi, { getSocket } from "../features/chatApi.ts";
import chat from "../features/chat.ts";

let lastEmittedActivity: string | null = null;
let lastUserId: string | null = null;


const activityMiddleware: Middleware = (storeApi) => (next) => (action) => {
    const result = next(action);
    const state = storeApi.getState() as any; 
    const user = state.auth?.user;
    const isPlaying = state.audioPlayer?.isPlaying;
    const currentSong = state.audioPlayer?.currentSong;

    if (user) {
        const userId = user._id || user.id;
        
        const activity = (isPlaying && currentSong)
            ? `Listening to ${currentSong.title} by ${currentSong.artist}`
            : "Idle";

        if (activity !== lastEmittedActivity || userId !== lastUserId) {
            const s = getSocket();
            s.emit("update_activity", { userId, activity });
            lastEmittedActivity = activity;
            lastUserId = userId;
        }
    } else {
        lastEmittedActivity = null;
        lastUserId = null;
    }

    return result;
};

export const store = configureStore({
    reducer: {
        auth: auth,
        audioPlayer: audioPlayer,
        chat: chat,
        [audioPlayerApi.reducerPath]: audioPlayerApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(audioPlayerApi.middleware, chatApi.middleware, activityMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;