import {useAuth, useUser} from "@clerk/clerk-react";
import {type ReactNode, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
    resetStatusAdmin,
    setIsAdmin,
    setToken,
    setUser,
} from "../features/auth.ts";
import Loader from "../components/Loader.tsx";
import {useConnectSocketQuery} from "../features/chatApi.ts";


const AuthProvider = ({children}: { children: ReactNode }) => {
    const {getToken, userId} = useAuth();
    const {isLoaded, user} = useUser();
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();


    useConnectSocketQuery(userId as string, { skip: !userId });

    useEffect(() => {
        if (isLoaded && user) {
            dispatch(setUser({
                id: user.id,
                fullName: user.fullName,
                imageUrl: user.imageUrl,
            }));
            if (user.publicMetadata.role === "admin") {
                dispatch(setIsAdmin());
            } else {
                dispatch(resetStatusAdmin());
            }
        } else if (isLoaded && !user) {
            dispatch(setUser(null));
        }
    }, [isLoaded, user, dispatch]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                if (token) {
                    dispatch(setToken(token))
                } else {
                    dispatch(setToken(null))
                }
            } catch (e) {
                dispatch(setToken(null))
                console.log("Error in auth provider", e)
            } finally {
                setLoading(false)
            }
        }
        initAuth();

        if (userId) {
            const interval = setInterval(async () => {
                try {
                    const token = await getToken();
                    dispatch(setToken(token));
                } catch (e) {
                    console.log("Error refreshing token", e);
                }
            }, 45 * 1000);

            return () => clearInterval(interval);
        }
    }, [getToken, dispatch, userId])

    return (
        loading ? <Loader/> : <div>{children}</div>
    )
}

export default AuthProvider;