import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.tsx";
import { useSelector } from "react-redux";
import { getSelectedUser } from "../../features/chat.ts";
import { getOnlineUsers, getActivities } from "../../features/auth.ts";
import { FaHeadphones } from "react-icons/fa6";

const ChatHeader = () => {
    const selectedUser = useSelector(getSelectedUser);
    const onlineUsersList = useSelector(getOnlineUsers);
    const activities = useSelector(getActivities);

    if (!selectedUser) return null;

    const isOnline = onlineUsersList.includes(selectedUser.clerkId);
    const activity = activities[selectedUser.clerkId] || "Idle";

    return (
        <div className='p-4 border-b border-zinc-800 sticky top-0 z-9999 bg-opacity-100 bg-zinc-900/30'>
            <div className='flex items-center gap-3'>
                <Avatar>
                    <AvatarImage src={selectedUser.imageUrl} />
                    <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className='font-medium'>{selectedUser.fullName}</h2>
                    <div className='flex items-center gap-1.5 text-sm text-zinc-400'>
                        {isOnline ? (
                            <>
                                <span className='text-green-500 font-medium'>Online</span>
                                <span className='text-zinc-600'>•</span>
                                <span className='truncate max-w-[200px] sm:max-w-md'>{activity}</span>
                                {activity !== "Idle" && <FaHeadphones className='size-3 text-emerald-400 shrink-0 ml-1' />}
                            </>
                        ) : (
                            <span>Offline</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;