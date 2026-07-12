import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentSong, getIsPlaying, getRepeatMode, nextSong} from "../../features/audioPlayer.ts";
import type {Song} from "../../types/types.ts";

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);
    const currentSong = useSelector(getCurrentSong) as Song | null;
    const isPlaying = useSelector(getIsPlaying);
    const repeatMode = useSelector(getRepeatMode);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => {
            if (repeatMode === "one" && audio) {
                audio.currentTime = 0;
                audio.play();
            } else {
                dispatch(nextSong());
            }
        };

        audio?.addEventListener("ended", handleEnded);
        return () => {
            audio?.removeEventListener("ended", handleEnded);
        };
    }, [dispatch, repeatMode]);

    useEffect(() => {
        if (!currentSong || !audioRef.current) return;

        const audio = audioRef.current;
        const isSongChange = prevSongRef.current !== currentSong.audioUrl;

        if (isSongChange) {
            audio.src = currentSong.audioUrl;
            audio.currentTime = 0;
            prevSongRef.current = currentSong.audioUrl;
            
            if (isPlaying) audio.play();
        }
    }, [currentSong, isPlaying]);

    return (
        <audio ref={audioRef}/>
    )
}

export default AudioPlayer;