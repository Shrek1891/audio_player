import {createSlice} from "@reduxjs/toolkit";

export const authSlice = createSlice({
        name: "auth",
        initialState: {
            user: null,
            token: null,
            isAdmin: false,
            onlineUsers: [] as string[],
            activities: {} as Record<string, string> // Добавляем состояние для активностей
        },
        selectors: {
            getAuthToken: (state) => state.token,
            getUser: (state) => state.user,
            getIsAdmin: (state) => state.isAdmin,
            getOnlineUsers: (state) => state.onlineUsers,
            getActivities: (state) => state.activities // Селектор для активностей
        },
        reducers: {
            setUser: (state, action) => {
                state.user = action.payload;
            },
            setToken: (state, action) => {
                state.token = action.payload;
            },
            resetStatusAdmin: (state) => {
                state.isAdmin = false
            },
            setIsAdmin: (state) => {
                state.isAdmin = true
            },
            setOnlineUsers: (state, action) => {
                state.onlineUsers = action.payload;
            },
            addOnlineUser: (state, action) => {
                if (!state.onlineUsers.includes(action.payload)) {
                    state.onlineUsers.push(action.payload);
                }
            },
            removeOnlineUser: (state, action) => {
                state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
            },
            setActivities: (state, action) => { // Редьюсер для установки всех активностей
                state.activities = action.payload;
            },
            updateActivity: (state, action) => { // Редьюсер для обновления одной активности
                const {userId, activity} = action.payload;
                state.activities[userId] = activity;
            }
        }
    }
)

export const {
    setUser,
    setToken,
    resetStatusAdmin,
    setIsAdmin,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    setActivities,
    updateActivity
} = authSlice.actions;
export const {getAuthToken, getUser, getIsAdmin, getOnlineUsers, getActivities} = authSlice.selectors;
export default authSlice.reducer;