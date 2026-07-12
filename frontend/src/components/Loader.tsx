import {useEffect, useState} from "react";


const Loader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(() => setIsVisible(false), 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-500 ease-out ${
                isFading ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <div className="flex flex-col items-center space-y-4 animate-pulse">
                <div
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white font-medium text-lg">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;