import PlayButton from "./PlayButton.tsx";
import FeaturedGridSkeleton from "./skeletons/FeaturedGridSkeleton.tsx";
import {useFetchFeaturesSongsQuery} from "../features/audioPlayerApi.ts";
import {type Song} from "../types/types.ts";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentSong, setCurrentSong, togglePlay} from "../features/audioPlayer.ts";


const FeaturedSection = () => {
    const {data: featuredSongs, isLoading, error} = useFetchFeaturesSongsQuery(undefined);
    const dispatch = useDispatch();
    const currentSong = useSelector(getCurrentSong);
    if (isLoading) return <FeaturedGridSkeleton/>;
    if (error) {
        return (
            <div className='p-6 text-center bg-red-500/10 rounded-lg mb-8'>
                <p className='text-red-400 text-sm'>Failed to load featured songs</p>
            </div>
        );
    }

    const handlePlaySong = (song: Song) => {
        const isCurrentSong = currentSong?._id === song._id;
        if (isCurrentSong) {
            dispatch(togglePlay());
        } else {
            dispatch(setCurrentSong(song));
        }
    };

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            {featuredSongs?.map((song: Song) => (
                <div
                    key={song._id}
                    onClick={() => handlePlaySong(song)}
                    className='flex items-center bg-zinc-800/40 rounded-xl overflow-hidden
                         hover:bg-zinc-700/60 transition-all group cursor-pointer relative shadow-sm hover:shadow-md'
                >
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300'
                    />
                    <div className='flex-1 p-4 min-w-0'>
                        <p className='font-semibold truncate text-white'>{song.title}</p>
                        <p className='text-xs sm:text-sm text-zinc-400 truncate'>{song.artist}</p>
                    </div>
                    <div className="pr-4" onClick={(e) => e.stopPropagation()}>
                        <PlayButton song={song}/>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default FeaturedSection;