import {useUser} from "@clerk/clerk-react";
import {PiUserSwitchDuotone} from "react-icons/pi";
import {useFetchAllUsersQuery} from "../features/audioPlayerApi.ts";
import {ScrollArea} from "./ui/scroll-area.tsx";
import {FaHeadphones} from "react-icons/fa6";
import Loader from "./Loader.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar.tsx";
import {useSelector, useDispatch} from "react-redux";
import {getActivities, getAuthToken, getOnlineUsers} from "../features/auth.ts";
import {setSelectedUser} from "../features/chat.ts";
import {Button} from "./ui/button.tsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {type User} from "../types/types.ts";

const FriendsActivity = () => {
    const {user, isLoaded, isSignedIn} = useUser();
    const token = useSelector(getAuthToken);
    const local = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onlineUsersList = useSelector(getOnlineUsers);
    const activities = useSelector(getActivities);
    const onlineUsersSet = new Set(onlineUsersList);
    const {data: users, isFetching} = useFetchAllUsersQuery(undefined, {
        skip: !isLoaded || !isSignedIn || !token
    });

    const userHandler = (u: User) => {
        dispatch(setSelectedUser(u));
        if (local.pathname !== "/chat") {
            navigate("/chat");
        }
    };
    if (isFetching) {
        return <Loader/>;
    }
    return (
        <div
            className='h-full bg-blue-500/30 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6  flex flex-col'>
            <div className='p-4 flex justify-between items-center border-b border-zinc-800'>
                <div className='flex items-center gap-2'>
                    <PiUserSwitchDuotone className='size-5 shrink-0'/>
                    <h2 className='font-semibold'>What they're listening to</h2>
                </div>
            </div>
            {!user && <LoginPrompt/>}
            <ScrollArea
                className='flex-1 bg-blue-500/30 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 mt-4'>
                <div className='p-4 space-y-4'>
                    {users?.filter((u: User) => u.clerkId !== user?.id).map((u: User) => {
                        const isOnline = onlineUsersSet.has(u.clerkId);
                        const activity = activities[u.clerkId] || "Idle";
                        return (
                            <div
                                key={u._id}
                                className='cursor-pointer hover:bg-blue-500/40 p-3 rounded-xl transition-all group active:scale-95'
                                onClick={() => userHandler(u)}
                            >
                                <div className='flex items-start gap-3'>
                                    <div className='relative'>
                                        <Avatar className='size-10 border border-zinc-800 shadow-sm'>
                                            <AvatarImage src={u.imageUrl} alt={u.fullName}/>
                                            <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                                            <div
                                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
												${isOnline ? "bg-green-500" : "bg-zinc-500"}
												`}
                                                aria-hidden='true'
                                            />
                                        </Avatar>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <span
                                                className='font-medium text-sm text-white truncate'>{u.fullName}</span>
                                            {isOnline && activity !== "Idle" &&
                                                <FaHeadphones className='size-3.5 text-emerald-400 shrink-0'/>}
                                        </div>
                                        <div className='mt-1 text-[11px] text-white/60 truncate'>
                                            {isOnline ? activity : "Offline"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                            ;
                    })}
                    {users?.filter((u: User) => u.clerkId !== user?.id).length === 0 && !isFetching && (
                        <p className="text-center text-sm text-zinc-400 py-10">No friends found</p>
                    )}
                </div>
                <Link to='/chat' className='w-full'>
                    <Button className='w-full mt-4 bg-white/10 hover:bg-white/20 text-white border-white/10'
                            variant='outline' size='sm'
                            disabled={!user || local.pathname === "/chat"}>
                        Open Messenger
                    </Button>
                </Link>
            </ScrollArea>
        </div>
    );
};
export default FriendsActivity;

const LoginPrompt = () => (
    <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
        <div className='relative'>
            <div
                className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse'
                aria-hidden='true'
            />
            <div className='relative bg-zinc-900 rounded-full p-4'>
                <FaHeadphones className='size-8 text-emerald-400'/>
            </div>
        </div>

        <div className='space-y-2 max-w-[250px]'>
            <h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
            <p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
        </div>
    </div>
);