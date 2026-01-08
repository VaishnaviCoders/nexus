import { getUserNotifications } from "@/lib/notifications";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationList } from "@/components/dashboard-layout/notification-list";

const NotificationPanel = async () => {
    const data = await getUserNotifications();
    const unreadCount = data.filter((n) => !n.isRead).length;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <div className={`p-2 rounded-full transition-colors ${unreadCount > 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
                        <Bell className={`h-5 w-5 transition-transform ${unreadCount > 0 ? 'scale-110' : 'group-hover:scale-110'}`} />
                    </div>

                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 mr-4 mb-2 overflow-hidden" align="end" sideOffset={8}>
                <NotificationList
                    initialNotifications={data}
                    className="border-0 shadow-none rounded-none h-[calc(85vh-100px)]"
                // h-[calc(85vh-100px)]
                />
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPanel;


