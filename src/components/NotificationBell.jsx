
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import api from '@/api/client';
import coinImage from '@/assets/reward-coin.png';
import "./coin.css";

export const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            const unread = data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every minute
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const handleClearAll = async () => {
        // Optimistic UI update
        setNotifications([]);
        setUnreadCount(0);

        try {
            await api.delete('/notifications/clear-all');
        } catch (error) {
            console.error("Failed to clear notifications", error);
            // If failed, we might want to revert or just let the next poll fix it.
            // For now, let's just log it. The next poll will bring them back if backend failed.
        }
    };

    return (
        <DropdownMenu onOpenChange={(open) => {
            setIsOpen(open);
            if (open && unreadCount > 0) {
                handleMarkAllRead();
            }
        }}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] hover:text-black dark:hover:text-white transition-colors duration-200">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden bg-white dark:bg-[#1a1a1a] border-border shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
                    <span className="font-semibold text-sm">Notifications</span>
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                        Clear
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground text-sm">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <DropdownMenuItem
                                key={item._id}
                                className={`flex items-start gap-4 p-4 cursor-default focus:bg-muted/50 border-b border-border/10 last:border-0 ${!item.isRead ? 'bg-muted/10' : ''}`}
                            >
                                {/* Icon / Visual */}
                                <div className="shrink-0 mt-1">
                                    {item.type === 'coin_reward' ? (
                                        // No info icon passed, just coin logic if any, but user said "no need of info/circle icon"
                                        // User said: "coins count not always 10... if solved easy 10... change it"
                                        // User said "Display title is problem title... subtitle is practice problem..."
                                        // User said "in coin reward... no need of that info/circle icon... dont need that"
                                        // So for coin reward we might just show nothing or maybe the coin image itself?
                                        // Use the coin image from assets for the visual?
                                        <div className="relative w-8 h-8" style={{ perspective: "1000px" }}>
                                            <div className="coin-3d-container">
                                                {[...Array(6)].map((_, index) => ( // Reduced layers for smaller size
                                                    <img
                                                        key={index}
                                                        src={coinImage}
                                                        alt="Reward Coin"
                                                        className="coin-layer"
                                                        style={{
                                                            transform: `translateZ(-${index}px)`,
                                                            pointerEvents: 'none'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // Default for challenges or others
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <span className="text-xs font-bold">i</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-start justify-between">
                                        <p className="font-medium text-sm leading-none text-foreground">
                                            {item.title}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }).replace("about ", "")}
                                        </span>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {item.message}
                                    </p>

                                    {/* Coins Metadata Badge */}
                                    {item.type === 'coin_reward' && item.metadata?.coins && (
                                        <div className="flex items-center gap-1 mt-1 text-yellow-500 font-bold text-xs">
                                            {/* Small coin text or icon */}
                                            <span>🪙 +{item.metadata.coins}</span>
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
