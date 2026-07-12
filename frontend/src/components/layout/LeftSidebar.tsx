import {NavLink} from "react-router-dom";
import {FcHome} from "react-icons/fc";
import {buttonVariants} from "../ui/button.tsx";
import {cn} from "../../lib/utils.ts";
import {TbMessages} from "react-icons/tb";
import {PiPlaylistDuotone} from "react-icons/pi";
import {ScrollArea} from "../ui/scroll-area.tsx";
import PlaylistSkeleton from "../skeletons/PlaylistSkeleton.tsx";
import {useFetchAlbumsQuery} from "../../features/audioPlayerApi.ts";
import {type Album} from "../../types/types.ts";

const LeftSidebar = () => {
    const {data: albums, isLoading, error} = useFetchAlbumsQuery(undefined);

    return (
        <div className="h-full bg-blue-500/30 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
            {/* Navigation */}
            <div className="space-y-2">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => cn(
                        buttonVariants({
                            variant: "ghost",
                            className: cn("w-full justify-start text-white transition-all hover:bg-blue-500", 
                                isActive && "bg-blue-600/50 border border-white/20")
                        })
                    )}
                >
                    <FcHome className="size-5" />
                    <span className="font-medium">Home</span>
                </NavLink>

                <NavLink 
                    to="/chat" 
                    className={({ isActive }) => cn(
                        buttonVariants({
                            variant: "ghost",
                            className: cn("w-full justify-start text-white transition-all hover:bg-blue-500",
                                isActive && "bg-blue-600/50 border border-white/20")
                        })
                    )}
                >
                    <TbMessages className="size-5" />
                    <span className="font-medium">Messages</span>
                </NavLink>
            </div>

            {/* Playlists Section */}
            <div className='flex-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner flex flex-col overflow-hidden'>
                <div className='p-4 flex items-center gap-2 text-white/90 border-b border-white/5'>
                    <PiPlaylistDuotone className="size-5" />
                    <span className='font-semibold tracking-wide'>Playlists</span>
                </div>

                <ScrollArea className='flex-1'>
                    <div className='p-2 space-y-1'>
                        {isLoading ? (
                            <PlaylistSkeleton />
                        ) : error ? (
                            <div className="p-4 text-xs text-red-200 text-center bg-red-500/10 rounded-lg">
                                Failed to load albums
                            </div>
                        ) : (
                            albums?.map((album: Album) => (
                                <NavLink
                                    to={`/albums/${album._id}`}
                                    key={album._id}
                                    className={({ isActive }) => cn(
                                        "p-2 rounded-xl flex items-center gap-3 group transition-all cursor-pointer hover:bg-blue-500/40",
                                        isActive ? "bg-blue-500/60 text-white" : "text-black/80 hover:text-white"
                                    )}
                                >
                                    <img
                                        src={album.imageUrl}
                                        alt={album.title}
                                        className='size-12 rounded-lg flex-shrink-0 object-cover shadow-sm group-hover:scale-105 transition-transform'
                                    />

                                    <div className='flex-1 min-w-0 hidden md:block'>
                                        <p className='font-semibold truncate text-sm'>{album.title}</p>
                                        <p className='text-[11px] opacity-70 truncate'>Album • {album.artist}</p>
                                    </div>
                                </NavLink>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

export default LeftSidebar;