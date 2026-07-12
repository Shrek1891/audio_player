import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { io, Socket } from "socket.io-client";
import {
    addOnlineUser,
    removeOnlineUser,
    setActivities,
    setOnlineUsers,
    updateActivity
} from "./auth.ts";
import { type Message, type User } from "../types/types.ts";

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        socket = io("", {
            withCredentials: true,
            autoConnect: false,
        });
    }
    return socket;
};

const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
        credentials: "include",
        prepareHeaders: (headers: Headers, { getState }) => {
            const state = getState() as any;
            const token = state.auth?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["chat", "messages"],
    endpoints: (builder) => ({
        connectSocket: builder.query<void, string>({
            queryFn: () => ({ data: undefined }),
            async onCacheEntryAdded(userId, { dispatch, cacheDataLoaded, cacheEntryRemoved }) {
                const s = getSocket();

                try {
                    await cacheDataLoaded;

                    if (!s.connected) s.connect();

                    s.emit("user_connected", userId);

                    s.on("users_online", (users: string[]) => dispatch(setOnlineUsers(users)));
                    s.on("user_connected", (id: string) => dispatch(addOnlineUser(id)));
                    s.on("user_disconnected", (id: string) => dispatch(removeOnlineUser(id)));
                    s.on("activities", (activities: [string, string][]) => dispatch(setActivities(Object.fromEntries(activities))));
                    s.on("activity_updated", (data: { userId: string, activity: string }) => dispatch(updateActivity(data)));

                } catch (e) {
                    console.error("Socket initialization error:", e);
                }

                await cacheEntryRemoved;
                s.off("users_online");
                s.off("user_connected");
                s.off("user_disconnected");
                s.off("activities");
                s.off("activity_updated");
                s.disconnect();
            },
        }),
        fetchOnlineUser: builder.query<User[], void>({
            query: () => "/users",
            providesTags: ["chat"],
        }),
        fetchMessages: builder.query<Message[], string>({
            query: (userId) => `/users/messages/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: "messages", id: userId }],
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                const s = getSocket();
                try {
                    await cacheDataLoaded;
                    const handleReceiveMessage = (message: Message) => {
                        if (message.senderId === arg || message.receiverId === arg) {
                            updateCachedData((draft) => {
                                draft.push(message);
                            });
                        }
                    };
                    s.on("receive_message", handleReceiveMessage);
                } catch (e) {
                    console.error("Socket error in fetchMessages:", e);
                }
                await cacheEntryRemoved;
                s.off("receive_message");
            },
        }),
        sendMessage: builder.mutation<void, { receiverId: string, senderId: string, content: string }>({
            async queryFn({ receiverId, senderId, content }) {
                const s = getSocket();
                if (!s.connected) s.connect();
                return new Promise((resolve) => {
                    s.emit("send_message", { senderId, receiverId, content });
                    resolve({ data: undefined });
                });
            },
        }),
    }),
});

export const {
    useFetchOnlineUserQuery,
    useFetchMessagesQuery,
    useSendMessageMutation,
    useConnectSocketQuery,
} = chatApi;
export default chatApi;