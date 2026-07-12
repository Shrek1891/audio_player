import { useUser } from "@clerk/clerk-react";
import { useFetchMessagesQuery } from "../../features/chatApi.ts";
import Topbar from "../../components/ui/TopBar.tsx";
import { ScrollArea } from "../../components/ui/scroll-area.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.tsx";
import UsersList from "./UserList.tsx";
import ChatHeader from "./ChatHeader.tsx";
import MessageInput from "./MessageInput.tsx";
import { useSelector } from "react-redux";
import { getSelectedUser } from "../../features/chat.ts";
import { useEffect, useRef } from "react";
import { type Message, type User } from "../../types/types.ts";
import Loader from "../../components/Loader.tsx";

const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const ChatPage = () => {
    const { user } = useUser();
    const selectedUser = useSelector(getSelectedUser) as User | null;
    const scrollRef = useRef<HTMLDivElement>(null);

    const {
        data: messages,
        isLoading: isFetchingMessages,
    } = useFetchMessagesQuery(selectedUser?.clerkId || "", {
        skip: !selectedUser,
    });

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [selectedUser]);

    return (
        <main className='h-full rounded-2xl bg-zinc-950 border border-zinc-800/50 overflow-hidden flex flex-col'>
            <Topbar />
            <div className='flex-1 grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] overflow-hidden'>
                <UsersList />
                <div className='flex flex-col h-full bg-zinc-900/30 min-w-0 overflow-y-scroll no-scrollbar'>
                    {selectedUser ? (
                        <>
                            <ChatHeader />

                            <ScrollArea className='flex-1'>
                                <div className='p-4 min-h-full flex flex-col justify-end'>
                                    <div className='space-y-4'>
                                        {isFetchingMessages ? (
                                            <div className="flex h-full items-center justify-center py-20">
                                                <Loader />
                                            </div>
                                        ) : (
                                            messages?.map((message: Message) => {
                                                const isMyMessage = message.senderId === user?.id;
                                                return (
                                                    <div
                                                        key={message._id}
                                                        className={`flex items-end gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}
                                                    >
                                                        <Avatar className='size-8 border border-zinc-800 flex-shrink-0'>
                                                            <AvatarImage
                                                                src={isMyMessage ? user?.imageUrl : selectedUser.imageUrl}
                                                            />
                                                            <AvatarFallback>{isMyMessage ? 'ME' : selectedUser.fullName[0]}</AvatarFallback>
                                                        </Avatar>

                                                        <div
                                                            className={`rounded-2xl px-4 py-2.5 max-w-[75%] shadow-sm
                                                                ${isMyMessage ? "bg-blue-600 text-white rounded-br-none" : "bg-zinc-800 text-zinc-100 rounded-bl-none"}
                                                            `}
                                                        >
                                                            <p className='text-sm leading-relaxed break-words'>{message.content}</p>
                                                            <span className={`text-[10px] mt-1 block opacity-60 ${isMyMessage ? "text-right" : "text-left"}`}>
                                                                {formatTime(message.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        {/* Якорь для скролла */}
                                        <div ref={scrollRef} className="h-px w-px" />
                                    </div>
                                </div>
                            </ScrollArea>
                            <MessageInput />
                        </>
                    ) : (
                        <NoConversationPlaceholder />
                    )}
                </div>
            </div>
        </main>
    );
};

const NoConversationPlaceholder = () => (
    <div className='flex flex-col items-center justify-center h-full space-y-6 bg-zinc-900/20'>
        <div className='relative'>
            <div className='absolute -inset-4 bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
            <img src='/logo.png' alt='Logo' className='size-20 relative' />
        </div>
        <div className='text-center relative'>
            <h3 className='text-zinc-200 text-xl font-bold mb-2'>Select a conversation</h3>
            <p className='text-zinc-500 text-sm max-w-[240px]'>
                Pick a friend from the left to start sharing music and messages.
            </p>
        </div>
    </div>
);

export default ChatPage;