import { ScrollArea } from "../../components/ui/scroll-area.tsx";
import UsersListSkeleton from "../../components/skeletons/UsersListSkeleton.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.tsx";
import { useFetchOnlineUserQuery } from "../../features/chatApi.ts";
import { useUser } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { setSelectedUser, getSelectedUser } from "../../features/chat.ts";
import { useDispatch } from "react-redux";
import { getOnlineUsers, getActivities } from "../../features/auth.ts";
import { FaHeadphones } from "react-icons/fa6";
import { type User } from "../../types/types.ts";
import { cn } from "../../lib/utils.ts";

const UsersList = () => {
    const { user: currentUserClerk } = useUser();
    const onlineUsersList = useSelector(getOnlineUsers);
    const activities = useSelector(getActivities);
    const onlineUsers = new Set(onlineUsersList);
    const { data: users, isLoading } = useFetchOnlineUserQuery();
    const selectedUser = useSelector(getSelectedUser) as User | null;
    const dispatch = useDispatch();

    const handleUserClick = (u: User) => {
        dispatch(setSelectedUser(u));
    };

    if (isLoading) {
        return <UsersListSkeleton />;
    }

    const filteredUsers = users?.filter((u: User) => u.clerkId !== currentUserClerk?.id) || [];

    return (
        <div className='border-r border-zinc-800 bg-zinc-900/50 rounded-l-2xl overflow-hidden'>
            <div className='flex flex-col h-full'>
                <ScrollArea className='h-full'>
                    <div className='space-y-2 p-4'>
                        {filteredUsers.length === 0 ? (
                            <div className="py-10 text-center text-zinc-500">
                                No other users found.
                            </div>
                        ) : (
                            filteredUsers.map((u: User) => {
                                const isOnline = onlineUsers.has(u.clerkId);
                                const activity = activities[u.clerkId] || "Idle";

                                return (
                                    <div
                                        key={u._id}
                                        onClick={() => handleUserClick(u)}
                                        className={cn(
                                            `flex items-center justify-center lg:justify-start gap-3 p-3 
											rounded-lg cursor-pointer transition-colors active:scale-[0.98]`,
                                            selectedUser?.clerkId === u.clerkId ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                                        )}
                                    >
                                        <div className='relative'>
                                            <Avatar className='size-8 md:size-12 border border-zinc-700'>
                                                <AvatarImage src={u.imageUrl} />
                                                <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                                            </Avatar>
                                            {/* online indicator */}
                                            <div
                                                className={cn(
                                                    `absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900`,
                                                    isOnline ? "bg-green-500" : "bg-zinc-500"
                                                )}
                                            />
                                        </div>

                                        <div className='flex-1 min-w-0 lg:block hidden'>
                                            <div className='flex items-center gap-1.5'>
                                                <span className='font-medium truncate text-white'>{u.fullName}</span>
                                                {isOnline && activity !== "Idle" && (
                                                    <FaHeadphones className='size-3.5 text-emerald-400 shrink-0' />
                                                )}
                                            </div>
                                            <div className='text-xs text-zinc-400 truncate'>
                                                {isOnline ? activity : "Offline"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default UsersList;