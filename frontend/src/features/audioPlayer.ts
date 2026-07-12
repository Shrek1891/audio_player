import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Song} from "../types/types.ts";

export type RepeatMode = "none" | "one" | "all";

export interface AudioPlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    repeatMode: RepeatMode;
    isShuffle: boolean;
    originalQueue: Song[];
}

const initialState: AudioPlayerState = {
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    repeatMode: "none",
    isShuffle: false,
    originalQueue: [],
};

const audioPlayerSlice = createSlice({
    name: "audioPlayer",
    initialState,
    selectors: {
        getCurrentSong: (state) => state.currentSong,
        getIsPlaying: (state) => state.isPlaying,
        getQueue: (state) => state.queue,
        getCurrentIndex: (state) => state.currentIndex,
        getRepeatMode: (state) => state.repeatMode,
        getIsShuffle: (state) => state.isShuffle,
    },
    reducers: {
        initializeQueue: (state, action: PayloadAction<Song[]>) => {
            state.originalQueue = action.payload;
            state.queue = state.isShuffle
                ? [...action.payload].sort(() => Math.random() - 0.5)
                : action.payload;

            if (state.queue.length > 0) {
                if (state.currentIndex === -1 || state.currentIndex >= state.queue.length) {
                    state.currentIndex = 0;
                }
                state.currentSong = state.queue[state.currentIndex];
            }
        },
        setCurrentSong: (state, action: PayloadAction<Song | null>) => {
            if (!action.payload) {
                state.currentSong = null;
                state.isPlaying = false;
                return;
            }

            const songIndex = state.queue.findIndex(song => song._id === action.payload?._id);
            if (songIndex !== -1) {
                state.currentIndex = songIndex;
            } else {
                state.queue.push(action.payload);
                state.originalQueue.push(action.payload);
                state.currentIndex = state.queue.length - 1;
            }
            state.currentSong = action.payload;
            state.isPlaying = true;
        },
        togglePlay: (state) => {
            if (state.currentSong) {
                state.isPlaying = !state.isPlaying;
            }
        },
        nextSong: (state) => {
            if (state.queue.length === 0) return;
            if (state.repeatMode === "one") {
                state.isPlaying = true;
                return;
            }
            const isLastSong = state.currentIndex === state.queue.length - 1;
            if (isLastSong && state.repeatMode === "none") {
                state.isPlaying = false;
                return;
            }

            const nextIndex = (state.currentIndex + 1) % state.queue.length;
            state.currentIndex = nextIndex;
            state.currentSong = state.queue[nextIndex];
            state.isPlaying = true;
        },
        previousSong: (state) => {
            if (state.queue.length === 0) return;
            const previousIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
            state.currentIndex = previousIndex;
            state.currentSong = state.queue[previousIndex];
            state.isPlaying = true;
        },
        setRepeatMode: (state, action: PayloadAction<RepeatMode>) => {
            state.repeatMode = action.payload;
        },
        toggleShuffle: (state) => {
            state.isShuffle = !state.isShuffle;
            if (state.isShuffle && state.queue.length > 0) {
                const current = state.currentSong;
                state.queue = [...state.queue].sort(() => Math.random() - 0.5);
                if (current) {
                    state.currentIndex = state.queue.findIndex(s => s._id === current._id);
                }
            } else {
                state.queue = state.originalQueue;
                if (state.currentSong) {
                    state.currentIndex = state.queue.findIndex(s => s._id === state.currentSong?._id);
                }
            }
        },
        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
        clearQueue: (state) => {
            state.queue = [];
            state.originalQueue = [];
            state.currentIndex = -1;
            state.currentSong = null;
            state.isPlaying = false;
        },
        playAlbum: (state, action: PayloadAction<{ songs: Song[], index: number }>) => {
            const {songs, index} = action.payload;
            state.queue = songs;
            state.originalQueue = songs;
            state.currentIndex = index;
            state.currentSong = songs[index];
            state.isPlaying = true;

        }
    }
});

export default audioPlayerSlice.reducer;
export const {
    getCurrentSong,
    getIsPlaying,
    getQueue,
    getCurrentIndex,
    getRepeatMode,
    getIsShuffle
} = audioPlayerSlice.selectors;

export const {
    setCurrentSong,
    initializeQueue,
    togglePlay,
    nextSong,
    previousSong,
    setIsPlaying,
    clearQueue,
    setRepeatMode,
    toggleShuffle,
    playAlbum
} = audioPlayerSlice.actions;