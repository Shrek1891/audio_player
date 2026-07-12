import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
    _id: string;
    clerkId: string;
    fullName: string;
    imageUrl: string;
}

interface ChatState {
    selectedUser: User | null;
}

const initialState: ChatState = {
    selectedUser: null
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    selectors: {
        getSelectedUser: (state) => state.selectedUser
    },
    reducers: {
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        }
    }
});

export const { setSelectedUser } = chatSlice.actions;
export const { getSelectedUser } = chatSlice.selectors;
export default chatSlice.reducer;