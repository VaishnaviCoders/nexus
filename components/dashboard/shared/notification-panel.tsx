import { getUserNotifications } from "@/app/actions/notifications";
import { NotificationChannel, NotificationStatus, NotificationType } from "@/generated/prisma/enums";
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle2, XCircle, Clock, User, GraduationCap } from "lucide-react";

const NotificationPanel = async () => {
    const data = await getUserNotifications();

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
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case "FAILED":
                return <XCircle className="w-4 h-4 text-red-600" />;
            case "PENDING":
                return <Clock className="w-4 h-4 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getNotificationTypeColor = (type: NotificationType) => {
        switch (type) {
            case "NOTICE":
                return "bg-blue-100 text-blue-800";
            case "FEE_REMINDER":
                return "bg-orange-100 text-orange-800";
            case "ATTENDANCE_ALERT":
                return "bg-red-100 text-red-800";
            case "DOCUMENT_REQUEST":
                return "bg-purple-100 text-purple-800";
            case "GENERAL_ANNOUNCEMENT":
                return "bg-green-100 text-green-800";
            case "EXAM":
                return "bg-indigo-100 text-indigo-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatNotificationType = (type: NotificationType) => {
        return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Bell className="w-6 h-6 text-white" />
                            <h1 className="text-2xl font-bold text-white">Notifications</h1>
                        </div>
                        <p className="text-blue-100 text-sm mt-1">Stay updated with all your notifications</p>
                    </div>

                    {/* Notifications List */}
                    <div className="divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No notifications yet</p>
                                <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            data.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-6 hover:bg-gray-50 transition-colors ${!item.isRead ? "bg-blue-50/50" : ""
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!item.isRead ? "bg-blue-100" : "bg-gray-100"
                                                }`}>
                                                {getChannelIcon(item.channel)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className={`font-semibold text-gray-900 ${!item.isRead ? "font-bold" : ""
                                                    }`}>
                                                    {item.title || "Notification"}
                                                </h3>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {getStatusIcon(item.status)}
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationTypeColor(item.notificationType)
                                                        }`}>
                                                        {formatNotificationType(item.notificationType)}
                                                    </span>
                                                </div>
                                            </div>

                                            {item.message && (
                                                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                                    {item.message}
                                                </p>
                                            )}

                                            {/* Meta Information */}
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    {getChannelIcon(item.channel)}
                                                    <span className="uppercase font-medium">{item.channel}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    {getStatusIcon(item.status)}
                                                    <span className="capitalize">{item.status.toLowerCase()}</span>
                                                </div>

                                                {item.sentAt && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{new Date(item.sentAt).toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Student/Parent Info */}
                                            {(item.student || item.parent) && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex flex-wrap gap-4 text-xs">
                                                        {item.student && (
                                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
                                                                <GraduationCap className="w-4 h-4 text-gray-600" />
                                                                <span className="font-medium text-gray-700">Student:</span>
                                                                <span className="text-gray-600">{item.student.firstName + " " + item.student.lastName || item.student.id}</span>
                                                            </div>
                                                        )}

                                                        {item.parent && (
                                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
                                                                <User className="w-4 h-4 text-gray-600" />
                                                                <span className="font-medium text-gray-700">Parent:</span>
                                                                <span className="text-gray-600">{item.parent.firstName + " " + item.parent.lastName || item.parent.id}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;