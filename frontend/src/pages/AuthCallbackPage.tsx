import Loader from "../components/Loader.tsx";
import {Card, CardContent} from "../components/ui/card.tsx";
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useUser} from "@clerk/clerk-react";
import {useCallbackAuthByClerkMutation} from "../features/audioPlayerApi.ts";
import {useDispatch} from "react-redux";
import {setIsAdmin} from "../features/auth.ts";


const AuthCallbackPage = () => {
    const dispatch = useDispatch();
    const {isLoaded, user} = useUser();
    const navigate = useNavigate();
    const syncAttempted = useRef(false);
    const [callbackAuthByClerk] = useCallbackAuthByClerkMutation();


    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !user || syncAttempted.current) return;
            try {
                syncAttempted.current = true;
                await callbackAuthByClerk({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.emailAddresses[0].emailAddress,
                        imageUrl: user.imageUrl
                    }
                )
            } catch (error) {
                console.log("Error in auth callback", error);
            } finally {
                navigate("/");
            }
        };
        if (user?.publicMetadata.role === "admin") {
            dispatch(setIsAdmin());
        }
        syncUser();
    }, [isLoaded, user, navigate, callbackAuthByClerk, dispatch]);

    return (
        <div className='h-screen w-full bg-black flex items-center justify-center'>
            <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
                <CardContent className='flex flex-col items-center gap-4 pt-6'>
                    <Loader/>
                    <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
                    <p className='text-zinc-400 text-sm'>Redirecting...</p>
                </CardContent>
            </Card>
        </div>
    );

}

export default AuthCallbackPage;

