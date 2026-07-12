import {useAddSongMutation, useFetchAlbumsQuery} from "../../../features/audioPlayerApi.ts";
import {useState, useRef} from "react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription, 
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../components/ui/dialog.tsx";
import {PiMusicNotesPlusFill} from "react-icons/pi";
import {Button} from "../../../components/ui/button.tsx";
import {GiCloudUpload} from "react-icons/gi";
import {Input} from "../../../components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../components/ui/select.tsx";
import {type Album} from "../../../types/types.ts";

type NewSong = {
    title: string;
    artist: string;
    album: string;
    duration: number;
}

const AddSongDialog = () => {
    const [songDialogOpen, setSongDialogOpen] = useState(false);
    const [addSong, {isLoading: isAddingSong}] = useAddSongMutation();
    const {data: albums} = useFetchAlbumsQuery(undefined);

    const [newSong, setNewSong] = useState<NewSong>({
        title: "",
        artist: "",
        album: "",
        duration: 0,
    });

    const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
        audio: null,
        image: null,
    });
    
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, audio: file }));
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                setNewSong(prev => ({ ...prev, duration: Math.floor(audio.duration) }));
            };
        }
    };

    const handleSubmit = async () => {
        try {
            if (!files.audio || !files.image) {
                return toast.error("Please upload both audio and image files");
            }

            const formData = new FormData();
            formData.append("title", newSong.title);
            formData.append("artist", newSong.artist);
            formData.append("duration", newSong.duration.toString());
            
            if (newSong.album && newSong.album !== "none") {
                formData.append("albumId", newSong.album);
            }

            formData.append("audioFile", files.audio);
            formData.append("imageFile", files.image);

            await addSong(formData).unwrap();
            
            setSongDialogOpen(false);
            setNewSong({ title: "", artist: "", album: "", duration: 0 });
            setFiles({ audio: null, image: null });
            setImagePreview(null);
            
            toast.success("Song added successfully");
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to add song");
        }
    };

    return (
        <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-all shadow-md'>
                    <PiMusicNotesPlusFill className='h-4 w-4'/>
                    Add Song
                </Button>
            </DialogTrigger>
            
            <DialogContent className='bg-zinc-900 border-zinc-800 max-w-md max-h-[90vh] overflow-y-auto text-zinc-100 scrollbar-hide'>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Song</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Upload a new track to your music collection.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-6 py-4'>
                    <input type='file' accept='audio/*' ref={audioInputRef} className='hidden' onChange={handleAudioSelect} />
                    <input type='file' accept='image/*' ref={imageInputRef} className='hidden' onChange={handleImageSelect} />

                    {/* Artwork Upload */}
                    <div
                        className='relative group flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-2xl cursor-pointer transition-all bg-zinc-800/40 min-h-[140px]'
                        onClick={() => imageInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={imagePreview} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GiCloudUpload className="size-8 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className='text-center space-y-2'>
                                <div className='p-3 bg-zinc-800 rounded-full inline-block border border-zinc-700 shadow-inner'>
                                    <GiCloudUpload className='h-6 w-6 text-zinc-400'/>
                                </div>
                                <p className='text-sm text-zinc-400'>Upload Artwork</p>
                            </div>
                        )}
                    </div>

                    {/* Audio File Selection */}
                    <div className='space-y-2'>
                        <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Audio File</label>
                        <Button 
                            variant='outline' 
                            onClick={() => audioInputRef.current?.click()} 
                            className={cn('w-full bg-zinc-800/50 border-zinc-700 transition-all', files.audio && 'border-emerald-500/50 text-emerald-400')}
                        >
                            {files.audio ? `Selected: ${files.audio.name.slice(0, 20)}...` : "Select Audio Track"}
                        </Button>
                    </div>

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Title</label>
                            <Input
                                value={newSong.title}
                                onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                                className='bg-zinc-800 border-zinc-700 focus:ring-emerald-500'
                                placeholder="Song title"
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Artist</label>
                            <Input
                                value={newSong.artist}
                                onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                                className='bg-zinc-800 border-zinc-700 focus:ring-emerald-500'
                                placeholder="Artist name"
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Album (Optional)</label>
                            <Select
                                value={newSong.album}
                                onValueChange={(value) => setNewSong({...newSong, album: value})}
                            >
                                <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                                    <SelectValue placeholder='Select an album'/>
                                </SelectTrigger>
                                <SelectContent className='bg-zinc-800 border-zinc-700 text-zinc-100'>
                                    <SelectItem value='none'>Single (No Album)</SelectItem>
                                    {albums?.map((album: Album) => (
                                        <SelectItem key={album._id} value={album._id}>
                                            {album.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className='pt-4 gap-2 sm:gap-0 bg-black'>
                    <Button variant='ghost' onClick={() => setSongDialogOpen(false)} disabled={isAddingSong} className="text-zinc-400 hover:text-white">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isAddingSong || !files.audio || !files.image || !newSong.title || !newSong.artist}
                        className='bg-emerald-600 hover:bg-emerald-700 px-8 shadow-lg active:scale-95 transition-all'
                    >
                        {isAddingSong ? "Uploading..." : "Add Song"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddSongDialog;


function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}