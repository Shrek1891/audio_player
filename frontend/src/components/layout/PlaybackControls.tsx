import {FaShuffle, FaRepeat} from "react-icons/fa6";
import {useEffect, useRef, useState} from "react";
import {Button} from "../ui/button.tsx";
import {CiPause1, CiVolumeHigh} from "react-icons/ci";
import {BsFillSkipBackwardCircleFill, BsFillSkipForwardCircleFill} from "react-icons/bs";
import {FaPlayCircle} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";

import {
    getCurrentSong,
    getIsPlaying,
    getIsShuffle,
    getRepeatMode,
    nextSong,
    previousSong,
    setRepeatMode,
    togglePlay,
    toggleShuffle
} from "../../features/audioPlayer.ts";
import {Slider} from "../ui/slider.tsx";
import {type Song} from "../../types/types.ts";
import {cn} from "../../lib/utils.ts";

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
    const isPlaying = useSelector(getIsPlaying);
    const currentSong = useSelector(getCurrentSong) as Song | null;
    const isShuffle = useSelector(getIsShuffle);
    const repeatMode = useSelector(getRepeatMode);
    
    const dispatch = useDispatch();

    const [volume, setVolume] = useState(75);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = document.querySelector("audio");
        if (audio) {
            audioRef.current = audio;
            audio.volume = volume / 100;
            const updateTime = () => setCurrentTime(audio.currentTime);
            const updateDuration = () => setDuration(audio.duration || 0);
            const handleEnded = () => {
                dispatch(nextSong());
            };
            audio.addEventListener("timeupdate", updateTime);
            audio.addEventListener("loadedmetadata", updateDuration);
            audio.addEventListener("ended", handleEnded);
            return () => {
                audio.removeEventListener("timeupdate", updateTime);
                audio.removeEventListener("loadedmetadata", updateDuration);
                audio.removeEventListener("ended", handleEnded);
            };
        }
    }, [currentSong, dispatch]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(console.error);
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };

    const handleToggleRepeat = () => {
        const modes: ("none" | "one" | "all")[] = ["none", "all", "one"];
        const currentIndex = modes.indexOf(repeatMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        dispatch(setRepeatMode(nextMode));
    };

    return (
        <footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4 fixed bottom-0 left-0 right-0 z-50'>
            <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
                <div className='flex items-center gap-4 min-w-[180px] w-[30%]'>
                    {currentSong && (
                        <>
                            <img
                                src={currentSong.imageUrl}
                                alt={currentSong.title}
                                className='w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md shadow-lg'
                            />
                            <div className='flex-1 min-w-0'>
                                <div className='font-medium truncate text-sm sm:text-base hover:underline cursor-pointer'>
                                    {currentSong.title}
                                </div>
                                <div className='text-xs sm:text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
                                    {currentSong.artist}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className='flex flex-col items-center gap-1 sm:gap-2 flex-1 max-w-full sm:max-w-[45%]'>
                    <div className='flex items-center gap-3 sm:gap-6'>
                        <Button
                            size='icon'
                            variant='ghost'
                            className={cn(
                                "hidden sm:inline-flex transition-colors",
                                isShuffle ? "text-blue-400" : "text-zinc-400 hover:text-white"
                            )}
                            onClick={() => dispatch(toggleShuffle())}
                        >
                            <FaShuffle className='h-4 w-4'/>
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className='hover:text-blue-400 text-zinc-400 transition-colors'
                            onClick={() => dispatch(previousSong())}
                            disabled={!currentSong}
                        >
                            <BsFillSkipBackwardCircleFill className='h-5 w-5 sm:h-6 sm:h-6'/>
                        </Button>

                        <Button
                            size='icon'
                            className='bg-white hover:scale-105 text-black rounded-full h-8 w-8 sm:h-10 sm:w-10 transition-all shadow-md'
                            onClick={() => dispatch(togglePlay())}
                            disabled={!currentSong}
                        >
                            {isPlaying ? <CiPause1 className='h-5 w-5 fill-current'/> : <FaPlayCircle className='h-5 w-5 fill-current'/>}
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className='hover:text-blue-400 text-zinc-400 transition-colors'
                            onClick={() => dispatch(nextSong())}
                            disabled={!currentSong}
                        >
                            <BsFillSkipForwardCircleFill className='h-5 w-5 sm:h-6 sm:h-6'/>
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className={cn(
                                "hidden sm:inline-flex transition-colors relative",
                                repeatMode !== "none" ? "text-blue-400" : "text-zinc-400 hover:text-white"
                            )}
                            onClick={handleToggleRepeat}
                        >
                            <FaRepeat className='h-4 w-4'/>
                            {repeatMode === "one" && (
                                <span className="absolute top-0 right-0 text-[8px] font-bold">1</span>
                            )}
                        </Button>
                    </div>

                    <div className='flex items-center gap-2 w-full px-2'>
                        <div className='text-[10px] sm:text-xs text-zinc-400 w-10 text-right'>{formatTime(currentTime)}</div>
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={0.1}
                            className='w-full cursor-pointer'
                            onValueChange={handleSeek}
                        />
                        <div className='text-[10px] sm:text-xs text-zinc-400 w-10'>{formatTime(duration)}</div>
                    </div>
                </div>

                <div className='hidden sm:flex items-center gap-3 min-w-[180px] w-[30%] justify-end'>

                    <div className='flex items-center gap-2'>
                        <Button 
                            size='icon' 
                            variant='ghost' 
                            className='hover:text-blue-400 text-zinc-400'
                            onClick={() => handleVolumeChange([volume === 0 ? 50 : 0])}
                        >
                            <CiVolumeHigh className='h-4 w-4'/>
                        </Button>
                        <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            className='w-20 md:w-24'
                            onValueChange={handleVolumeChange}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};