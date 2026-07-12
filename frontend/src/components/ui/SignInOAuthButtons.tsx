import {Button} from "./button.tsx";
import {useSignIn} from "@clerk/clerk-react";

const SignInOAuthButtons = () => {
    const {signIn, isLoaded} = useSignIn()
    if (!isLoaded) {
        return null;
    }

    const signInWithGoogle = () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback",
        });
    };
    return (
        <Button onClick={signInWithGoogle} variant={"secondary"}
                className="flex items-center gap-2 justify-center dark:text-white text-white bg-black hover:scale-110 cursor-pointer hover:bg-blue-500 transition-all duration-300 ease-in-out">
            <img src='/goggle.svg' alt='Google' className='size-5'/>
            Continue with Google
        </Button>
    );
};
export default SignInOAuthButtons;
