import {Link} from "react-router-dom";
import {cn} from "../../lib/utils.ts";
import {buttonVariants} from "./button.tsx";
import SignInOAuthButtons from "./SignInOAuthButtons.tsx";
import {LayoutDashboardIcon} from "lucide-react";
import {SignedOut, UserButton} from "@clerk/clerk-react";

import { useSelector} from "react-redux";

import {getIsAdmin} from "../../features/auth.ts";

const Topbar = () => {
    const isAdmin = useSelector(getIsAdmin)
    return (
        <div
            className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
                        backdrop-blur-md z-10'>
            <div
                className='flex gap-2 items-center cursor-pointer hover:text-blue-400 transition-all duration-300 ease-in-out text-white'>
                <img src='/logo.png' className='size-8' alt='logo'/>
                Disco Bar "Po Cimbalam"
            </div>
            <div className='flex items-center gap-4'>
                {isAdmin && (
                    <Link to={"/admin"} className={cn(buttonVariants({variant: "outline"}))}>
                        <LayoutDashboardIcon className='size-4  mr-2'/>
                        Admin Dashboard
                    </Link>
                )}

                <SignedOut>
                    <SignInOAuthButtons/>
                </SignedOut>

                <UserButton/>
            </div>
        </div>
    );
};
export default Topbar;