import {useDeleteAlbumMutation, useFetchAlbumsQuery} from "../../../features/audioPlayerApi.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../components/ui/table.tsx";
import {FaCalendarAlt, FaTrash} from "react-icons/fa";
import {CiMusicNote1} from "react-icons/ci";
import {Button} from "../../../components/ui/button.tsx";
import toast from "react-hot-toast";
import {type Album } from "../../../types/types.ts";
import Loader from "../../../components/Loader.tsx";

const AlbumsTable = () => {
    const { data: albums, isLoading: isFetchingAlbums, error: albumsError } = useFetchAlbumsQuery(undefined);
    const [deleteAlbum, { isLoading: isDeletingAlbum }] = useDeleteAlbumMutation();

    const handleDeleteAlbum = async (albumId: string) => {
        if (!window.confirm("Are you sure you want to delete this album? All songs in this album will also be deleted.")) return;
        
        try {
            await deleteAlbum(albumId).unwrap();
            toast.success("Album deleted successfully");
        } catch (error: any) {
            toast.error("Failed to delete album: " + (error.data?.message || error.message));
        }
    };

    if (isFetchingAlbums) {
        return (
            <div className='flex items-center justify-center py-12'>
                <Loader />
            </div>
        );
    }

    if (albumsError) {
        return (
            <div className='flex items-center justify-center py-12 text-red-400'>
                <p>Error loading albums. Please try again later.</p>
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
                        <TableHead className="font-bold text-zinc-300">Release Year</TableHead>
                        <TableHead className="font-bold text-zinc-300">Songs Count</TableHead>
                        <TableHead className='text-right font-bold text-zinc-300'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {albums?.map((album: Album) => (
                        <TableRow key={album._id} className='hover:bg-zinc-800/50 border-zinc-800 transition-colors'>
                            <TableCell className="py-3">
                                <img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded-lg object-cover shadow-sm'/>
                            </TableCell>
                            <TableCell className='font-semibold text-white'>{album.title}</TableCell>
                            <TableCell className="text-zinc-400">{album.artist}</TableCell>
                            <TableCell>
                                <span className='inline-flex items-center gap-2 text-zinc-500 text-xs'>
                                    <FaCalendarAlt className='size-3'/>
                                    {album.releaseYear}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className='inline-flex items-center gap-2 text-zinc-500 text-xs'>
                                    <CiMusicNote1 className='size-4'/>
                                    {album.songs?.length || 0} songs
                                </span>
                            </TableCell>
                            <TableCell className='text-right'>
                                <div className='flex gap-2 justify-end'>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => handleDeleteAlbum(album._id)}
                                        className='text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all'
                                        disabled={isDeletingAlbum}
                                    >
                                        {isDeletingAlbum ? (
                                            <div className="size-4 border-2 border-red-500/30 border-t-red-500 animate-spin rounded-full" />
                                        ) : (
                                            <FaTrash className='size-4'/>
                                        )}
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {albums?.length === 0 && (
                <div className="py-20 text-center text-zinc-500">
                    No albums found in the library.
                </div>
            )}
        </div>
    );
};

export default AlbumsTable;