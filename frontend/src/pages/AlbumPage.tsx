import { ScrollArea } from "../components/ui/scroll-area.tsx";
import { useFetchAlbumByIdQuery } from "../features/audioPlayerApi.ts";
import { useParams } from "react-router-dom";
import { GiCuckooClock } from "react-icons/gi";
import { Button } from "../components/ui/button.tsx";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { CiPause1 } from "react-icons/ci";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentSong, getIsPlaying, playAlbum, togglePlay } from "../features/audioPlayer.ts";
import { type Album, type Song } from "../types/types.ts";

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
    const { albumId } = useParams<{ albumId: string }>();
    const dispatch = useDispatch();
    
    const currentSong = useSelector(getCurrentSong) as Song | null;
    const isPlaying = useSelector(getIsPlaying);

    const { data: currentAlbum, isFetching } = useFetchAlbumByIdQuery(albumId as string, {
        skip: !albumId,
        refetchOnMountOrArgChange: true,
    }) as { data: Album | undefined; isFetching: boolean };

    const handlePlaySong = (index: number) => {
        if (!currentAlbum?.songs) return;
        const song = currentAlbum.songs[index];
        
        if (currentSong?._id === song._id) {
            dispatch(togglePlay());
        } else {
            dispatch(playAlbum({ songs: currentAlbum.songs, index: index }));
        }
    };

    const handlePlayAlbum = () => {
        if (!currentAlbum?.songs || currentAlbum.songs.length === 0) return;

        const isCurrentAlbumPlaying = currentAlbum.songs.some((song) => song._id === currentSong?._id);
        
        if (isCurrentAlbumPlaying) {
            dispatch(togglePlay());
        } else {
            dispatch(playAlbum({ songs: currentAlbum.songs, index: 0 }));
        }
    };

    if (isFetching) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <Loader className='size-8 animate-spin text-blue-500' />
            </div>
        );
    }

    if (!currentAlbum) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[400px] text-zinc-400'>
                <p className='text-lg font-medium'>Album not found</p>
            </div>
        );
    }

    return (
        <div className='h-full bg-zinc-900/50 rounded-2xl overflow-hidden'>
            <ScrollArea className='h-full'>
                <div className='relative min-h-full'>
                    {/* Gradient Overlay */}
                    <div
                        className='absolute inset-0 bg-gradient-to-b from-blue-600/20 via-zinc-900/80 to-zinc-900 pointer-events-none'
                        aria-hidden='true'
                    />

                    {/* Content */}
                    <div className='relative z-10'>
                        <div className='flex flex-col md:flex-row p-6 gap-8 pb-8 items-end'>
                            <img
                                src={currentAlbum.imageUrl}
                                alt={currentAlbum.title}
                                className='w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] shadow-2xl rounded-lg object-cover'
                            />
                            <div className='flex flex-col gap-2'>
                                <p className='text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300'>Album</p>
                                <h1 className='text-4xl sm:text-5xl md:text-7xl font-black text-white'>{currentAlbum.title}</h1>
                                <div className='flex items-center gap-2 text-sm text-zinc-300 mt-2'>
                                    <span className='font-bold text-white hover:underline cursor-pointer'>{currentAlbum.artist}</span>
                                    <span className="text-zinc-500">•</span>
                                    <span>{currentAlbum.songs?.length || 0} songs</span>
                                    <span className="text-zinc-500">•</span>
                                    <span>{currentAlbum.releaseYear}</span>
                                </div>
                            </div>
                        </div>

                        {/* Play Control Bar */}
                        <div className='px-6 pb-6 flex items-center gap-6'>
                            <Button
                                onClick={handlePlayAlbum}
                                size='icon'
                                className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all shadow-lg active:scale-95'
                            >
                                {isPlaying && currentAlbum.songs?.some((song) => song._id === currentSong?._id) ? (
                                    <CiPause1 className='h-7 w-7 text-black stroke-[1.5]' />
                                ) : (
                                    <AiOutlinePlayCircle className='h-8 w-8 text-black' />
                                )}
                            </Button>
                        </div>

                        {/* Songs Table */}
                        <div className='bg-black/20 backdrop-blur-md rounded-t-3xl'>
                            <div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5'>
                                <div>#</div>
                                <div>Title</div>
                                <div className="hidden sm:block">Date Added</div>
                                <div className="flex justify-center">
                                    <GiCuckooClock className="size-4" />
                                </div>
                            </div>

                            <div className='px-6 py-4 space-y-1'>
                                {currentAlbum.songs?.map((song: Song, index: number) => {
                                    const isCurrentSong = currentSong?._id === song._id;
                                    return (
                                        <div 
                                            key={song._id} 
                                            onClick={() => handlePlaySong(index)}
                                            className={cn(
                                                "grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-3 text-sm text-zinc-400 hover:bg-white/10 rounded-xl group cursor-pointer transition-colors",
                                                isCurrentSong && "bg-white/5"
                                            )}
                                        >
                                            <div className='flex items-center justify-center'>
                                                {isCurrentSong && isPlaying ? (
                                                    <div className="flex gap-[2px] items-end h-3">
                                                        <div className="w-[3px] bg-green-500 animate-bounce h-full" style={{animationDelay: '0ms'}}></div>
                                                        <div className="w-[3px] bg-green-500 animate-bounce h-2" style={{animationDelay: '100ms'}}></div>
                                                        <div className="w-[3px] bg-green-500 animate-bounce h-3" style={{animationDelay: '200ms'}}></div>
                                                    </div>
                                                ) : isCurrentSong ? (
                                                    <span className='text-green-500 font-bold'>{index + 1}</span>
                                                ) : (
                                                    <span className='group-hover:hidden'>{index + 1}</span>
                                                )}
                                                <AiOutlinePlayCircle className={cn(
                                                    "hidden group-hover:block size-5 text-white",
                                                    isCurrentSong && "block"
                                                )} />
                                            </div>

                                            <div className='flex items-center gap-4'>
                                                <img src={song.imageUrl} alt={song.title} className='size-10 rounded-md shadow-md object-cover' />
                                                <div className="min-w-0">
                                                    <div className={cn("font-bold truncate", isCurrentSong ? 'text-green-500' : 'text-white')}>
                                                        {song.title}
                                                    </div>
                                                    <div className="text-xs text-zinc-400 truncate group-hover:text-white/80">{song.artist}</div>
                                                </div>
                                            </div>
                                            
                                            <div className='hidden sm:flex items-center text-zinc-500 text-xs'>
                                                {song.createdAt?.split("T")[0] || "Unknown"}
                                            </div>
                                            
                                            <div className='flex items-center justify-center font-mono text-xs'>
                                                {formatDuration(song.duration)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default AlbumPage;


function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}