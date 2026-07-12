import Topbar from "../components/ui/TopBar.tsx";
import {
    useFetchFeaturesSongsQuery, 
    useFetchMadeForYouSongsQuery,
    useFetchTrendingSongsQuery
} from "../features/audioPlayerApi.ts";
import {ScrollArea} from "../components/ui/scroll-area.tsx";
import FeaturedSection from "../components/FeaturedSection.tsx";
import SectionGrid from "../components/SectionGrid.tsx";
import {useDispatch, useSelector} from "react-redux";
import {initializeQueue} from "../features/audioPlayer.ts";
import {useEffect} from "react";
import {getUser} from "../features/auth.ts";
import {type User} from "../types/types.ts";

const HomePage = () => {
    const {data: fetchedSongs} = useFetchFeaturesSongsQuery(undefined);
    const {data: trendingSongs, isLoading: isFetchingTrendingSongs} = useFetchTrendingSongsQuery(undefined);
    const {data: madeForYouSongs, isLoading: isFetchingMadeForYouSongs} = useFetchMadeForYouSongsQuery(undefined);
    
    const currentUser = useSelector(getUser) as User | null;
    const dispatch = useDispatch();

    useEffect(() => {
        if (fetchedSongs && trendingSongs && madeForYouSongs) {
            const allSongs = [...fetchedSongs, ...trendingSongs, ...madeForYouSongs];
            dispatch(initializeQueue(allSongs));
        }
    }, [dispatch, fetchedSongs, trendingSongs, madeForYouSongs]);

    return (
        <main className='h-full bg-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex flex-col'>
            <Topbar/>
            <ScrollArea className='flex-1'>
                <div className='p-4 sm:p-8'>
                    <div className="mb-8">
                        <h1 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>
                            {currentUser ? `Welcome back, ${currentUser.firstName || currentUser.fullName.split(' ')[0] || 'Friend'}!` : "Explore Music"}
                        </h1>
                        <p className="text-zinc-400 mt-2">Discover the latest hits and personalized picks.</p>
                    </div>

                    <FeaturedSection />

                    <div className='space-y-12 mt-8'>
                        <SectionGrid 
                            title='Made For You' 
                            songs={madeForYouSongs || []} 
                            isLoading={isFetchingMadeForYouSongs}
                        />
                        <SectionGrid 
                            title='Trending' 
                            songs={trendingSongs || []} 
                            isLoading={isFetchingTrendingSongs}
                        />
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
};

export default HomePage;