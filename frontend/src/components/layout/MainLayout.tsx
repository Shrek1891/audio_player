import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "../ui/resizable.tsx";
import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import LeftSidebar from "./LeftSidebar.tsx";
import FriendsActivity from "../FriendsActivity.tsx";
import AudioPlayer from "./AudioPlayer.tsx";
import {PlaybackControls} from "./PlaybackControls.tsx";

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return (
        <div className='h-screen bg-black text-white flex flex-col'>
            <ResizablePanelGroup className='flex-1 flex h-full overflow-hidden p-2' orientation="horizontal">
                <ResizablePanel defaultSize="25%" minSize="0%" maxSize="25%" className="overflow-hidden no-scrollbar">
                    <AudioPlayer/>
                    <LeftSidebar/>
                </ResizablePanel>
                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors'/>

                {/* Main content */}
                <ResizablePanel defaultSize={isMobile ? 80 : 60} className="backdrop-blur">
                    <Outlet/>
                </ResizablePanel>

                {!isMobile && (
                    <>
                        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors'/>

                        {/* right sidebar */}
                        <ResizablePanel defaultSize="25%" minSize="0%" maxSize="25%"
                                        className="overflow-hidden no-scrollbar">
                            <FriendsActivity/>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
            <PlaybackControls/>
        </div>
    );


}

export default MainLayout
