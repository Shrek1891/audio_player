export interface Song {
    _id: string;
    title: string;
    artist: string;
    albumId: string | null;
    imageUrl: string;
    audioUrl: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
}

export interface Album {
    _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    releaseYear: number;
    songs: Song[];
}

export interface User {
    _id: string;
    clerkId: string;
    fullName: string;
    firstName?: string; // Добавляем необязательное поле
    lastName?: string;  // Добавляем необязательное поле
    imageUrl: string;
    email: string;
}

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
