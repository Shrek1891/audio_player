import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../components/ui/card.tsx";
import {MdOutlineLibraryMusic} from "react-icons/md";
import SongsTable from "./SongsTable.tsx";
import AddSongDialog from "./AdSongDialog.tsx";

const SongsTabContent = () => {
    return (
        <Card className='bg-zinc-800/50 border-zinc-700/50'>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle className='flex items-center gap-2'>
                            <MdOutlineLibraryMusic className='size-5 text-emerald-500'/>
                            Songs Library
                        </CardTitle>
                        <CardDescription>Manage your music tracks</CardDescription>
                    </div>
                    <AddSongDialog/>
                </div>
            </CardHeader>
            <CardContent>
                <SongsTable/>
            </CardContent>
        </Card>
    );
};
export default SongsTabContent;