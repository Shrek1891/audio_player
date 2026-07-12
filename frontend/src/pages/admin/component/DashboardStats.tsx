import StatsCard from "./StatsCard.tsx";
import {LuListMusic, LuUsers} from "react-icons/lu";
import {IoAlbums} from "react-icons/io5";
import {FaRegPlayCircle} from "react-icons/fa";

type DashboardStatsProps = {
    stats: {
        totalSongs: number;
        totalAlbums: number;
        totalArtists: number;
        totalUsers: number;
    };
};

const DashboardStats = ({stats}: DashboardStatsProps) => {
    const statsData = [
        {
            icon: LuListMusic,
            label: "Total Songs",
            value: stats?.totalSongs.toString(),
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
        },
        {
            icon: IoAlbums,
            label: "Total Albums",
            value: stats?.totalAlbums.toString(),
            bgColor: "bg-violet-500/10",
            iconColor: "text-violet-500",
        },
        {
            icon: LuUsers,
            label: "Total Artists",
            value: stats?.totalArtists.toString(),
            bgColor: "bg-orange-500/10",
            iconColor: "text-orange-500",
        },
        {
            icon: FaRegPlayCircle,
            label: "Total Users",
            value: stats?.totalUsers.toLocaleString(),
            bgColor: "bg-sky-500/10",
            iconColor: "text-sky-500",
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 '>

            {statsData.map((stat) => (
                <StatsCard
                    key={stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    bgColor={stat.bgColor}
                    iconColor={stat.iconColor}
                />
            ))}
        </div>
    );
};
export default DashboardStats;