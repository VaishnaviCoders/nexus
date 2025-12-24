"use client"

import { useState, useMemo } from "react"
import { Switch } from "@/components/ui/switch"
import {
    Bell,
    Mail,
    MessageSquare,
    Smartphone,
    ChevronDown,
    ChevronRight,
    IndianRupee,
    Info,
    AlertTriangle,
    Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationChannel } from "@/generated/prisma/enums"


type NotificationConfig = {
    [key in NotificationChannel]: boolean
}

const CHANNEL_COST_MAP: Record<NotificationChannel, number> = {
    EMAIL: 0.36,
    SMS: 0.9,
    WHATSAPP: 0.75,
    PUSH: 0.2,
}

// Define which channel combinations are locked (not available) for specific notification types
const LOCKED_CHANNELS: Record<string, NotificationChannel[]> = {
    exam_reminder: ["EMAIL"],
    document_rejected: ["PUSH"],
    leave_approved: ["PUSH"],
    leave_rejected: ["PUSH"],
    general_notice: ["SMS", "WHATSAPP"],
    monthly_report: ["SMS", "WHATSAPP", "PUSH"],
    birthday_wishes: ["SMS", "EMAIL"],
}

type NotificationType = {
    id: string
    label: string
    description?: string
    channels: NotificationConfig
    subTypes?: {
        id: string
        label: string
        channels: NotificationConfig
    }[]
}

const INITIAL_NOTIFICATIONS: NotificationType[] = [
    {
        id: "attendance",
        label: "Attendance Absent/Late",
        description: "Notify parents when student is absent or arrives late",
        channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: false },
    },
    {
        id: "fees",
        label: "Fees",
        description: "Payment reminders and receipts",
        channels: { SMS: false, WHATSAPP: false, PUSH: false, EMAIL: false },
        subTypes: [
            {
                id: "friendly_reminder",
                label: "Friendly Reminder",
                channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: true },
            },
            {
                id: "overdue_notice",
                label: "Overdue Notice",
                channels: { SMS: true, WHATSAPP: true, PUSH: true, EMAIL: true },
            },
            {
                id: "payment_due_today",
                label: "Payment Due Today",
                channels: { SMS: true, WHATSAPP: true, PUSH: true, EMAIL: false },
            },
            {
                id: "payment_success",
                label: "Payment Success",
                channels: { SMS: false, WHATSAPP: false, PUSH: true, EMAIL: true },
            },
            {
                id: "payment_failed",
                label: "Payment Failed",
                channels: { SMS: true, WHATSAPP: true, PUSH: true, EMAIL: true },
            },
        ],
    },
    {
        id: "notice",
        label: "Notice",
        description: "School announcements and notices",
        channels: { SMS: false, WHATSAPP: false, PUSH: false, EMAIL: false },
        subTypes: [
            {
                id: "urgent_notice",
                label: "Urgent Notice",
                channels: { SMS: true, WHATSAPP: true, PUSH: true, EMAIL: true },
            },
        ],
    },
    {
        id: "exam_created",
        label: "Exam Created",
        description: "New exam scheduled notification",
        channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: true },
    },
    {
        id: "exam_reminder",
        label: "Exam Reminder (1 Day Before)",
        description: "24 hours before exam reminder",
        channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: false },
    },
    {
        id: "exam_enroll",
        label: "Exam Enrollment",
        description: "Student enrollment confirmation",
        channels: { SMS: false, WHATSAPP: false, PUSH: true, EMAIL: true },
    },
    {
        id: "exam_hall_ticket",
        label: "Hall Ticket Available",
        description: "Download hall ticket notification",
        channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: true },
    },
    {
        id: "exam_result",
        label: "Exam Result Published",
        description: "Results announcement",
        channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: true },
    },
    {
        id: "document_missing",
        label: "Document Missing",
        description: "Required documents pending",
        channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: false },
    },
    {
        id: "document_verified",
        label: "Document Verified",
        description: "Document approval confirmation",
        channels: { SMS: false, WHATSAPP: false, PUSH: true, EMAIL: true },
    },
    {
        id: "document_rejected",
        label: "Document Rejected",
        description: "Document rejection with reasons",
        channels: { SMS: false, WHATSAPP: true, PUSH: false, EMAIL: true },
    },
    {
        id: "leave_approved",
        label: "Leave Approved",
        description: "Leave request accepted",
        channels: { SMS: false, WHATSAPP: false, PUSH: false, EMAIL: true },
    },
    {
        id: "leave_rejected",
        label: "Leave Rejected",
        description: "Leave request declined",
        channels: { SMS: false, WHATSAPP: false, PUSH: false, EMAIL: true },
    },
    {
        id: "general_notice",
        label: "General Notice",
        description: "School-wide announcements",
        channels: { SMS: false, WHATSAPP: false, PUSH: true, EMAIL: true },
    },
    {
        id: "monthly_report",
        label: "Monthly Report",
        description: "Student performance summary",
        channels: { SMS: false, WHATSAPP: false, PUSH: false, EMAIL: true },
    },
    {
        id: "birthday_wishes",
        label: "Birthday Wishes",
        description: "Student birthday greetings",
        channels: { SMS: false, WHATSAPP: true, PUSH: true, EMAIL: false },
    },
]

export function NotificationSettings() {
    const [notifications, setNotifications] = useState<NotificationType[]>(INITIAL_NOTIFICATIONS)
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["fees"]))

    const estimatedMonthlyCost = useMemo(() => {
        let totalCost = 0
        notifications.forEach((notification) => {
            Object.entries(notification.channels).forEach(([channel, enabled]) => {
                if (enabled) {
                    totalCost += CHANNEL_COST_MAP[channel as NotificationChannel]
                }
            })
            notification.subTypes?.forEach((subType) => {
                Object.entries(subType.channels).forEach(([channel, enabled]) => {
                    if (enabled) {
                        totalCost += CHANNEL_COST_MAP[channel as NotificationChannel]
                    }
                })
            })
        })
        return totalCost
    }, [notifications])

    const toggleChannel = (notificationId: string, channel: NotificationChannel, subTypeId?: string) => {
        setNotifications((prev) =>
            prev.map((notification) => {
                if (notification.id !== notificationId) return notification

                if (subTypeId && notification.subTypes) {
                    return {
                        ...notification,
                        subTypes: notification.subTypes.map((subType) =>
                            subType.id === subTypeId
                                ? {
                                    ...subType,
                                    channels: {
                                        ...subType.channels,
                                        [channel]: !subType.channels[channel],
                                    },
                                }
                                : subType,
                        ),
                    }
                }

                return {
                    ...notification,
                    channels: {
                        ...notification.channels,
                        [channel]: !notification.channels[channel],
                    },
                }
            }),
        )
    }

    const toggleExpanded = (id: string) => {
        setExpandedGroups((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const isChannelLocked = (notificationId: string, channel: NotificationChannel): boolean => {
        return LOCKED_CHANNELS[notificationId]?.includes(channel) || false
    }

    const channels: { key: NotificationChannel; icon: typeof Smartphone; label: string }[] = [
        { key: "SMS", icon: Smartphone, label: "SMS" },
        { key: "WHATSAPP", icon: MessageSquare, label: "WhatsApp" },
        { key: "PUSH", icon: Bell, label: "Push" },
        { key: "EMAIL", icon: Mail, label: "Email" },
    ]

    return (
        <Card className="border-b border-border ">
            <CardHeader className="mx-auto max-w-7xl px-4 bg-gray-50">
                <div className="flex items-start justify-between ">
                    <div>
                        <CardTitle className="text-balance tracking-tight">Notification Settings</CardTitle>
                        <CardDescription className="mt-2 text-pretty text-muted-foreground leading-relaxed">
                            Manage notification delivery across channels. Keep only essential notifications enabled to reduce costs.
                        </CardDescription>
                    </div>
                    <div className="hidden shrink-0 sm:block">
                        <div className="rounded-lg border border-border bg-card px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IndianRupee className="h-4 w-4" />
                                <span className="font-medium">Est. Monthly</span>
                            </div>
                            <div className="mt-1 text-2xl font-semibold tabular-nums">₹{estimatedMonthlyCost.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="mb-6 rounded-lg border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-amber-900 dark:text-amber-200">Cost Optimization Tip</h3>
                            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                Enabling all notification channels can significantly increase costs. We recommend keeping most
                                notifications on Push (₹{CHANNEL_COST_MAP.PUSH}/event) and Email (₹{CHANNEL_COST_MAP.EMAIL}/event) only.
                                Use SMS (₹{CHANNEL_COST_MAP.SMS}/event) and WhatsApp (₹{CHANNEL_COST_MAP.WHATSAPP}/event) for critical
                                alerts like payment failures and urgent notices.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-4 hidden rounded-lg border border-border bg-muted/40 px-6 py-3 lg:block">
                    <div className="grid grid-cols-[1fr_100px_100px_100px_100px] items-center gap-6">
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notification Type</div>
                        {channels.map(({ key, icon: Icon, label }) => (
                            <div key={key} className="flex flex-col items-center justify-center gap-1 text-center">
                                <div className="flex items-center gap-1.5">
                                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
                                </div>
                                <span className="flex items-center text-[10px] text-muted-foreground/70 tabular-nums">
                                    <IndianRupee className="h-2.5 w-2.5" />
                                    {CHANNEL_COST_MAP[key].toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-1.5">
                    {notifications.map((notification) => {
                        const isExpanded = expandedGroups.has(notification.id)
                        const hasSubTypes = notification.subTypes && notification.subTypes.length > 0

                        return (
                            <div key={notification.id}>
                                <div className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-foreground/10">
                                    <div className="grid grid-cols-1 gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_100px_100px_100px_100px] lg:items-center lg:gap-6">
                                        <div className="flex items-start gap-2">
                                            {hasSubTypes && (
                                                <button
                                                    onClick={() => toggleExpanded(notification.id)}
                                                    className="mt-0.5 rounded p-1 transition-colors hover:bg-accent"
                                                    aria-label={isExpanded ? "Collapse" : "Expand"}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            )}
                                            <div className={!hasSubTypes ? "ml-8" : ""}>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-balance text-sm font-medium leading-none sm:text-base">
                                                        {notification.label}
                                                    </h3>
                                                    {hasSubTypes && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {notification.subTypes?.length} types
                                                        </Badge>
                                                    )}
                                                </div>
                                                {notification.description && (
                                                    <p className="mt-1.5 text-pretty text-xs text-muted-foreground leading-relaxed sm:text-sm">
                                                        {notification.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 lg:contents">
                                            {channels.map(({ key, icon: Icon, label }) => {
                                                const locked = isChannelLocked(notification.id, key)
                                                return (
                                                    <div key={key} className="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
                                                        <div className="flex items-center gap-1.5 lg:hidden">
                                                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">{label}</span>
                                                        </div>
                                                        {locked ? (
                                                            <div
                                                                className="flex h-6 w-11 items-center justify-center rounded-full bg-muted"
                                                                title="Not available for this notification type"
                                                            >
                                                                <Lock className="h-3 w-3 text-muted-foreground/50" />
                                                            </div>
                                                        ) : (
                                                            <Switch
                                                                checked={notification.channels[key]}
                                                                onCheckedChange={() => toggleChannel(notification.id, key)}
                                                                aria-label={`Toggle ${key} for ${notification.label}`}
                                                            />
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {hasSubTypes && isExpanded && (
                                    <div className="ml-6 mt-1.5 space-y-1.5 border-l-2 border-border pl-4 sm:ml-8 sm:pl-6">
                                        {notification.subTypes!.map((subType) => (
                                            <div
                                                key={subType.id}
                                                className="group overflow-hidden rounded-lg border border-border/60 bg-muted/30 transition-all hover:border-foreground/10"
                                            >
                                                <div className="grid grid-cols-1 gap-6 px-4 py-3 sm:px-6 lg:grid-cols-[1fr_100px_100px_100px_100px] lg:items-center lg:gap-6">
                                                    <div className="ml-6">
                                                        <h4 className="text-balance text-sm font-medium leading-none">{subType.label}</h4>
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-4 lg:contents">
                                                        {channels.map(({ key, icon: Icon, label }) => (
                                                            <div key={key} className="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
                                                                <div className="flex items-center gap-1.5 lg:hidden">
                                                                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                                    <span className="text-xs text-muted-foreground">{label}</span>
                                                                </div>
                                                                <Switch
                                                                    checked={subType.channels[key]}
                                                                    onCheckedChange={() => toggleChannel(notification.id, key, subType.id)}
                                                                    aria-label={`Toggle ${key} for ${subType.label}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
                    <div className="flex gap-3">
                        <Info className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div>
                            <h3 className="text-sm font-medium">About Locked Channels</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                Some notification types have restricted channels due to technical or regulatory limitations. For
                                example, Monthly Reports are too large for SMS/WhatsApp, and some notifications work better with
                                specific delivery methods.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}
