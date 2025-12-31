"use client";

import { markAllAsRead, markAsRead } from "@/app/actions/notifications";
import { NotificationChannel, NotificationStatus, NotificationType } from "@/generated/prisma/enums";
import { Bell, CheckCircle2, Clock, FileText, GraduationCap, Mail, MessageSquare, Smartphone, Trash2, User, UserX, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationEmptyState from "./notification-empty-state";
import { NotificationLog } from "@/generated/prisma/client"

interface NotificationListProps {
    initialNotifications: NotificationLog[]; // Replace 'any' with proper type from Prisma if available
    className?: string;
}

export const NotificationList = ({ initialNotifications, className }: NotificationListProps) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isMarkingAll, setIsMarkingAll] = useState(false);

    // Derived state
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = async (id: string, currentReadStatus: boolean) => {
        if (currentReadStatus) return; // Already read

        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );

        try {
            await markAsRead(id);
        } catch (error) {
            console.error("Failed to mark as read", error);
            toast.error("Failed to update notification");
            // Revert on failure
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        setIsMarkingAll(true);
        // Optimistic
        const previousState = [...notifications];
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

        try {
            await markAllAsRead();
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Failed to mark all as read", error);
            toast.error("Failed to update notifications");
            setNotifications(previousState);
        } finally {
            setIsMarkingAll(false);
        }
    };

    const getChannelIcon = (channel: NotificationChannel) => {
        switch (channel) {
            case "EMAIL":
                return <Mail className="w-4 h-4" />;
            case "SMS":
                return <MessageSquare className="w-4 h-4" />;
            case "WHATSAPP":
                return <MessageSquare className="w-4 h-4" />;
            case "PUSH":
                return <Smartphone className="w-4 h-4" />;
            default:
                return <Bell className="w-4 h-4" />;
        }
    };

    const getStatusIcon = (status: NotificationStatus) => {
        switch (status) {
            case "SENT":
            case "DELIVERED":
                return <CheckCircle2 className="w-3 h-3 text-green-600" />;
            case "FAILED":
                return <XCircle className="w-3 h-3 text-red-600" />;
            case "PENDING":
                return <Clock className="w-3 h-3 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getNotificationTypeColor = (type: NotificationType) => {
        switch (type) {
            case "NOTICE":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "FEE_REMINDER":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "ATTENDANCE_ALERT":
                return "bg-red-100 text-red-800 border-red-200";
            case "DOCUMENT_REQUEST":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "GENERAL_ANNOUNCEMENT":
                return "bg-green-100 text-green-800 border-green-200";
            case "EXAM":
                return "bg-indigo-100 text-indigo-800 border-indigo-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case "NOTICE":
                return <Bell className="w-5 h-5 text-blue-600" />;
            case "FEE_REMINDER":
                return <FileText className="w-5 h-5 text-orange-600" />;
            case "ATTENDANCE_ALERT":
                return <UserX className="w-5 h-5 text-red-600" />;
            case "DOCUMENT_REQUEST":
                return <FileText className="w-5 h-5 text-purple-600" />;
            case "GENERAL_ANNOUNCEMENT":
                return <Bell className="w-5 h-5 text-green-600" />;
            case "EXAM":
                return <GraduationCap className="w-5 h-5 text-indigo-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    }

    const formatNotificationType = (type: NotificationType) => {
        return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    };
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };


    return (
        <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full", className)}>
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-md px-5 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </div>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-gray-900">Notifications</h1>
                        <p className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'Up to date'}
                        </p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={isMarkingAll}
                        className="text-[10px] h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                    >
                        Mark all read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <AnimatePresence initial={false} mode="popLayout">
                    {notifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full min-h-[350px]"
                        >
                            <NotificationEmptyState />
                        </motion.div>
                    ) : (
                        notifications.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => handleMarkAsRead(item.id, item.isRead)}
                                className={cn(
                                    "group relative p-4 border-b border-gray-50/50 cursor-pointer transition-all duration-200 hover:bg-gray-50/80",
                                    !item.isRead ? "bg-blue-50/30" : "bg-white"
                                )}
                            >
                                <div className="flex gap-3.5 items-start">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-colors",
                                            !item.isRead ? "bg-white border-blue-100 shadow-blue-50" : "bg-gray-50 border-gray-100"
                                        )}>
                                            {getNotificationIcon(item.notificationType)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={cn(
                                                "text-sm leading-snug pr-4 transition-colors",
                                                !item.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700 group-hover:text-gray-900"
                                            )}>
                                                {item.title || "Notification"}
                                            </h3>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                                                {item.sentAt ? formatTime(new Date(item.sentAt)) : ''}
                                            </span>
                                        </div>

                                        {item.message && (
                                            <p className={cn(
                                                "text-xs leading-relaxed line-clamp-2",
                                                !item.isRead ? "text-gray-600" : "text-gray-500"
                                            )}>
                                                {item.message}
                                            </p>
                                        )}

                                        {/* Meta Information Tags */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1.5">
                                            {/* Type Badge */}
                                            <span className={cn(
                                                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border",
                                                getNotificationTypeColor(item.notificationType)
                                            )}>
                                                {formatNotificationType(item.notificationType)}
                                            </span>

                                            {/* Channel Badge */}
                                            <div className="flex items-center gap-1 text-[9px] text-gray-500 bg-gray-100/80 px-1.5 py-0.5 rounded border border-gray-200/60">
                                                {getChannelIcon(item.channel)}
                                                <span className="uppercase tracking-wider">{item.channel}</span>
                                            </div>

                                            {/* Status Badge (if issue) */}
                                            {item.status !== "DELIVERED" && (
                                                <div className="flex items-center gap-1 text-[9px] text-gray-500" title={`Status: ${item.status}`}>
                                                    {getStatusIcon(item.status)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Read Indicator (Blue Dot) */}
                                    {!item.isRead && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200 ring-2 ring-white"></div>
                                        </div>
                                    )}
                                    {/* Constant indicator for unread (corner) */}
                                    {!item.isRead && (
                                        <div className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:opacity-0 transition-opacity"></div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
