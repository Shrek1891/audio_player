import {useDeleteSongMutation, useFetchSongsQuery} from "../../../features/audioPlayerApi.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../components/ui/table.tsx";
import {GiCalendar} from "react-icons/gi";
import {Button} from "../../../components/ui/button.tsx";
import {CiTrash} from "react-icons/ci";
import toast from "react-hot-toast";
import {type Song } from "../../../types/types.ts";
import Loader from "../../../components/Loader.tsx";

const SongsTable = () => {
    const {data: songs, isLoading: isFetchingSongs, error: songsError} = useFetchSongsQuery(undefined);
    const [deleteSong, {isLoading: isDeletingSong}] = useDeleteSongMutation();

    const deleteSongHandler = async (songId: string) => {
        if (!window.confirm("Are you sure you want to delete this song?")) return;
        
        try {
            await deleteSong(songId).unwrap();
            toast.success("Song deleted successfully");
        } catch (error: any) {
            toast.error("Failed to delete song: " + (error.data?.message || error.message));
        }
    };

    if (isFetchingSongs) {
        return (
            <div className='flex items-center justify-center py-12'>
                <Loader />
            </div>
        );
    }

    if (songsError) {
        return (
            <div className='flex items-center justify-center py-12 text-red-400'>
                <p>Error loading songs. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <Table>
                <TableHeader className="bg-zinc-800/50">
                    <TableRow className='hover:bg-transparent border-zinc-800'>
                        <TableHead className='w-[60px] py-4'></TableHead>
                        <TableHead className="font-bold text-zinc-300">Title</TableHead>
                        <TableHead className="font-bold text-zinc-300">Artist</TableHead>
                        <TableHead className="font-bold text-zinc-300">Added Date</TableHead>
                        <TableHead className='text-right font-bold text-zinc-300'>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {songs?.map((song: Song) => (
                        <TableRow key={song._id} className='hover:bg-zinc-800/50 border-zinc-800 transition-colors'>
                            <TableCell className="py-3">
                                <img src={song.imageUrl} alt={song.title} className='size-10 rounded-lg object-cover shadow-sm'/>
                            </TableCell>
                            <TableCell className='font-semibold text-white'>{song.title}</TableCell>
                            <TableCell className="text-zinc-400">{song.artist}</TableCell>
                            <TableCell>
                                <span className='inline-flex items-center gap-2 text-zinc-500 text-xs'>
                                    <GiCalendar className='size-3'/>
                                    {song.createdAt?.split("T")[0]}
                                </span>
                            </TableCell>

                            <TableCell className='text-right'>
                                <div className='flex gap-2 justify-end'>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className='text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all'
                                        onClick={() => deleteSongHandler(song._id)}
                                        disabled={isDeletingSong}
                                    >
                                        {isDeletingSong ? (
                                            <div className="size-4 border-2 border-red-500/30 border-t-red-500 animate-spin rounded-full" />
                                        ) : (
                                            <CiTrash className='size-5'/>
                                        )}
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {songs?.length === 0 && (
                <div className="py-20 text-center text-zinc-500">
                    No songs found in the library.
                </div>
            )}
        </div>
    );
};

export default SongsTable;