import {Pause, Play} from "lucide-react";
import {Button} from "./ui/button.tsx";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentSong, getIsPlaying, setCurrentSong, togglePlay} from "../features/audioPlayer.ts";
import type {Song} from "../types/types.ts";

const PlayButton = ({song}: { song: Song }) => {
    const dispatch = useDispatch();
    const currentSong = useSelector(getCurrentSong);
    const isPlaying = useSelector(getIsPlaying);
    const isCurrentSong = currentSong?._id === song._id;
    const handlePlay = () => {
        if (isCurrentSong) dispatch(togglePlay());
        else dispatch(setCurrentSong(song));
    };

    return (
        <Button
            size={"icon"}
            onClick={handlePlay}
            className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
                isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
        >
            {isCurrentSong && isPlaying ? (
                <Pause className='size-5 text-black'/>
            ) : (
                <Play className='size-5 text-black'/>
            )}
        </Button>
    );
};
export default PlayButton;
