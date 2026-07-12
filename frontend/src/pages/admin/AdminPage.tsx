import {useSelector} from "react-redux";
import {getIsAdmin} from "../../features/auth.ts";
import Header from "./component/Header.tsx";
import DashboardStats from "./component/DashboardStats.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";
import {MdOutlineQueueMusic} from "react-icons/md";
import {IoAlbums} from "react-icons/io5";
import SongsTabContent from "./component/SongsTabContent.tsx";
import AlbumsTabContent from "./component/AlbumsTabContent.tsx";
import {useFetchStatsQuery} from "../../features/audioPlayerApi.ts";
import Loader from "../../components/Loader.tsx";
import {Navigate} from "react-router-dom";

const AdminPage = () => {
    const isAdmin = useSelector(getIsAdmin);
    const {data: stats, isLoading: isFetchingStats, error: statsError} = useFetchStatsQuery(undefined, {
        skip: !isAdmin
    });

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    if (isFetchingStats) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
                <Loader />
            </div>
        );
    }

    if (statsError) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-red-400">
                <p>Failed to load dashboard statistics.</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm underline text-zinc-400 hover:text-white"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-blue-400 text-zinc-100 p-4 sm:p-8 '>
            <div className="max-w-7xl mx-auto space-y-8">
                <Header/>
                <DashboardStats stats={stats}/>
                <Tabs defaultValue="songs" className="w-full">
                    <TabsList variant='line' className="mb-6  p-1 rounded-lg border-zinc-800">
                        <TabsTrigger 
                            value="songs" 
                            className='flex items-center gap-2 px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-black  text-black'
                        >
                            <MdOutlineQueueMusic className='h-4 w-4'/>
                            Songs
                        </TabsTrigger>
                        <TabsTrigger 
                            value="albums" 
                            className='flex items-center gap-2 px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-black '
                        >
                            <IoAlbums className='h-4 w-4'/>
                            Albums
                        </TabsTrigger>
                    </TabsList>

                    <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm">
                        <TabsContent value="songs" className="mt-0 outline-none">
                            <SongsTabContent/>
                        </TabsContent>
                        <TabsContent value="albums" className="mt-0 outline-none">
                            <AlbumsTabContent/>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminPage;