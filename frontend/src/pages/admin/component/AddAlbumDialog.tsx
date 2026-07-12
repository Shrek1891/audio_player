import toast from "react-hot-toast";
import {useRef, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription, 
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../components/ui/dialog.tsx";
import {Button} from "../../../components/ui/button.tsx";
import {FaFolderPlus} from "react-icons/fa";
import {Input} from "../../../components/ui/input.tsx";
import {FaUpload} from "react-icons/fa6";
import { useAddAlbumMutation } from "../../../features/audioPlayerApi.ts";

const AddAlbumDialog = () => {
    const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [addAlbum, { isLoading: isAddingAlbum }] = useAddAlbumMutation();
    const [newAlbum, setNewAlbum] = useState({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!imageFile) {
                return toast.error("Please upload an image");
            }

            const formData = new FormData();
            formData.append("title", newAlbum.title);
            formData.append("artist", newAlbum.artist);
            formData.append("releaseYear", newAlbum.releaseYear.toString());
            formData.append("imageFile", imageFile);

            await addAlbum(formData).unwrap();
            setNewAlbum({
                title: "",
                artist: "",
                releaseYear: new Date().getFullYear(),
            });
            setImageFile(null);
            setImagePreview(null);
            setAlbumDialogOpen(false);
            
            toast.success("Album created successfully");
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to create album");
        }
    };

    return (
        <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 transition-all shadow-lg'>
                    <FaFolderPlus className='h-4 w-4'/>
                    Add Album
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-800 sm:max-w-[425px] text-zinc-100'>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Album</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Create a new album collection in your library.
                    </DialogDescription>
                </DialogHeader>
                
                <div className='space-y-6 py-4'>
                    <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept='image/*'
                        className='hidden'
                    />

                    <div
                        className='relative group flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-700 hover:border-violet-500 rounded-2xl cursor-pointer transition-all bg-zinc-800/50 overflow-hidden min-h-[160px]'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaUpload className="size-8 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className='text-center space-y-2'>
                                <div className='p-4 bg-zinc-800 rounded-full inline-block border border-zinc-700 shadow-inner'>
                                    <FaUpload className='h-6 w-6 text-zinc-400'/>
                                </div>
                                <p className='text-sm text-zinc-400'>Upload artwork</p>
                            </div>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Album Title</label>
                            <Input
                                value={newAlbum.title}
                                onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                                className='bg-zinc-800 border-zinc-700 focus:ring-violet-500'
                                placeholder='e.g. Midnight Memories'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Artist</label>
                            <Input
                                value={newAlbum.artist}
                                onChange={(e) => setNewAlbum({...newAlbum, artist: e.target.value})}
                                className='bg-zinc-800 border-zinc-700 focus:ring-violet-500'
                                placeholder='Artist name'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Release Year</label>
                            <Input
                                type='number'
                                value={newAlbum.releaseYear}
                                onChange={(e) => setNewAlbum({...newAlbum, releaseYear: parseInt(e.target.value) || new Date().getFullYear()})}
                                className='bg-zinc-800 border-zinc-700 focus:ring-violet-500'
                                min={1900}
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 bg-black">
                    <Button 
                        variant='ghost' 
                        onClick={() => setAlbumDialogOpen(false)} 
                        disabled={isAddingAlbum}
                        className="text-zinc-400 hover:text-black"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className='bg-violet-600 hover:bg-violet-700 px-8'
                        disabled={isAddingAlbum || !imageFile || !newAlbum.title || !newAlbum.artist}
                    >
                        {isAddingAlbum ? "Creating..." : "Create Album"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddAlbumDialog;