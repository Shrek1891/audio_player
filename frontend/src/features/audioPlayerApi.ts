import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const audioPlayerApi = createApi({
    reducerPath: "audioPlayerApi",
    tagTypes: ["audioPlayer"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
        credentials: "include",
        prepareHeaders: (headers: Headers, {getState}) => {
            const state = getState() as any;
            const token = state.auth?.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            } else {
                console.log("RTK Query: No token found in Redux state");
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        callbackAuthByClerk: builder.mutation({
            query: (user) => ({
                url: "/auth/callback",
                method: "POST",
                body: user,
                credentials: "include",
            })
        }),
        fetchAlbums: builder.query({
            query: () => ({
                url: "/albums",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["audioPlayer"],
        }),
        fetchAlbumById: builder.query({
            query: (albumId) => ({
                url: `/albums/${albumId}`,
                method: "GET",
            }),
            providesTags: ["audioPlayer"],

        }),
        fetchSongs: builder.query({
            query: () => ({
                url: "/songs",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["audioPlayer"],
        }),
        fetchAllUsers: builder.query({
            query: () => ({
                url: "/users",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["audioPlayer"],
        }),
        checkIsAdmin: builder.query({
            query: () => ({
                url: "/admin/check",
                method: "GET",
                credentials: "include",
            }),
        }),
        fetchFeaturesSongs: builder.query({
            query: () => ({
                url: "/songs/featured",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["audioPlayer"],
        }),
        fetchMadeForYouSongs: builder.query({
            query: () => ({
                url: "/songs/made-for-you",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["audioPlayer"],
        }),
        fetchTrendingSongs: builder.query({
            query: () => ({
                url: "/songs/trending",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["audioPlayer"],
        }),
        fetchStats: builder.query({
            query: () => ({
                url: "/statistics",
                method: "GET",
                credentials: "include",
            }),
        }),
        deleteSong: builder.mutation({
            query: (songId) => ({
                url: `admin/songs/${songId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["audioPlayer"],
        }),
        deleteAlbum: builder.mutation({
            query: (albumId) => ({
                url: `admin/albums/${albumId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["audioPlayer"],
        }),
        addSong: builder.mutation({
            query: (formData) => ({
                url: "/admin/songs",
                method: "POST",
                body: formData,
                credentials: "include",
            }),
            invalidatesTags: ["audioPlayer"],
        }),
        addAlbum: builder.mutation({
            query: (formData) => ({
                url: "/admin/albums",
                method: "POST",
                body: formData,
                credentials: "include",
            }),
            invalidatesTags: ["audioPlayer"],
        })
    })
});

export const {
    useFetchFeaturesSongsQuery,
    useFetchMadeForYouSongsQuery,
    useFetchTrendingSongsQuery,
    useCallbackAuthByClerkMutation,
    useFetchAlbumsQuery,
    useFetchAlbumByIdQuery,
    useFetchSongsQuery,
    useFetchAllUsersQuery,
    useCheckIsAdminQuery,
    useFetchStatsQuery,
    useDeleteSongMutation,
    useDeleteAlbumMutation,
    useAddSongMutation,
    useAddAlbumMutation
} = audioPlayerApi;