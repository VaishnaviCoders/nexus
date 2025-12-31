"use client"

import { useState, useTransition, useMemo } from "react"
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
    Loader2,
    CreditCard,
    UserCheck,
    FileText,
    Megaphone,
    BookOpen,
    Calendar,
    Settings2,
    Gift,
    ClipboardList,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationChannel, NotificationType } from "@/generated/prisma/enums"
import { NotificationSetting } from "@/generated/prisma/client"
import { updateNotificationSetting } from "@/actions/notification-settings"
import { toast } from "sonner"
import { cn, getChannelUnitCost } from "@/lib/utils"

// Minimalist Icon Mapping (Geist Style - Mono-color mostly)
const ICON_MAP: Record<NotificationType, any> = {
    NOTICE: Megaphone,
    FEE_REMINDER: CreditCard,
    ATTENDANCE_ALERT: UserCheck,
    DOCUMENT_REQUEST: FileText,
    GENERAL_ANNOUNCEMENT: Bell,
    EXAM: BookOpen,
    LEAVE: Calendar,
    ACADEMIC_REPORT: ClipboardList,
    GREETING: Gift,
}

const CHANNELS: { key: NotificationChannel; icon: any; label: string }[] = [
    { key: "SMS", icon: Smartphone, label: "SMS" },
    { key: "WHATSAPP", icon: MessageSquare, label: "WhatsApp" },
    { key: "PUSH", icon: Bell, label: "Push" },
    { key: "EMAIL", icon: Mail, label: "Email" },
]

// --- Types for Flat Category Structure ---

type ChannelState = {
    enabled: boolean
    locked: boolean
}

type EventConfig = {
    label: string
    SMS?: ChannelState
    WHATSAPP?: ChannelState
    PUSH?: ChannelState
    EMAIL?: ChannelState
}

// Channels key can either be a direct NotificationChannel or an eventKey
type ChannelsJson = Record<string, EventConfig | ChannelState>

interface NotificationSettingsProps {
    notificationSettings: NotificationSetting[]
}

export function NotificationSettings({ notificationSettings }: NotificationSettingsProps) {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
    const [isPending, startTransition] = useTransition()
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    // Simplified: One row per Category/Setting in DB. 
    // We visually expand them in the UI.
    const sortedSettings = useMemo(() => {
        return [...(notificationSettings || [])].sort((a, b) => {
            const orderA = (a as any).displayOrder || 0
            const orderB = (b as any).displayOrder || 0
            return orderA - orderB
        })
    }, [notificationSettings])

    const estimatedMonthlyCost = useMemo(() => {
        let total = 0
        const studentCount = 1

        notificationSettings?.forEach(setting => {
            const channels = setting.channels as ChannelsJson

            const sumConfig = (config: any) => {
                if (!config) return
                if (config.SMS?.enabled) total += getChannelUnitCost("SMS")
                if (config.WHATSAPP?.enabled) total += getChannelUnitCost("WHATSAPP")
                if (config.PUSH?.enabled) total += getChannelUnitCost("PUSH")
                if (config.EMAIL?.enabled) total += getChannelUnitCost("EMAIL")
            }

            // Detect if this is a category with sub-events
            const firstVal = Object.values(channels || {})[0]
            const isCategory = firstVal && typeof firstVal === 'object' && 'label' in firstVal

            if (isCategory) {
                Object.values(channels).forEach((event) => {
                    sumConfig(event)
                })
            } else {
                sumConfig(channels)
            }
        })
        return total * studentCount
    }, [notificationSettings])

    const getChannelConfig = (setting: NotificationSetting, channel: NotificationChannel, eventKey?: string): ChannelState => {
        const channels = setting.channels as ChannelsJson
        if (eventKey) {
            const event = channels?.[eventKey] as EventConfig
            return event?.[channel] || { enabled: false, locked: false }
        }
        const config = channels?.[channel] as ChannelState
        return config || { enabled: false, locked: false }
    }

    const toggleChannel = async (settingId: string, channel: NotificationChannel, enabled: boolean, eventKey?: string) => {
        const targetId = eventKey ? `${settingId}-${eventKey}-${channel}` : `${settingId}-${channel}`
        setUpdatingId(targetId)

        startTransition(async () => {
            const result = await updateNotificationSetting(settingId, channel, enabled, eventKey)
            if (result.success) {
                toast.success("Successfully updated settings.", {
                    description: `${channel} is now ${enabled ? 'enabled' : 'disabled'}.`
                })
            } else {
                toast.error(result.error || "Failed to update setting")
            }
            setUpdatingId(null)
        })
    }

    const toggleExpanded = (id: string) => {
        const next = new Set(expandedGroups)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setExpandedGroups(next)
    }

    const isChannelLocked = (setting: NotificationSetting, channel: NotificationChannel) => {
        return getChannelConfig(setting, channel).locked || false
    }

    return (
        <Card className="border-b border-border shadow-sm">
            <CardHeader className="mx-auto max-w-7xl px-4 bg-muted/20 border-b border-border/40">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 py-2">
                    <div>
                        <CardTitle className="text-balance tracking-tight text-xl">Notification Settings</CardTitle>
                        <CardDescription className="mt-2 text-pretty text-muted-foreground leading-relaxed max-w-3xl">
                            Manage notification delivery across channels. Keep only essential notifications enabled to reduce costs.
                        </CardDescription>
                    </div>
                    <div className="shrink-0">
                        <div className="rounded-lg border border-border bg-background px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IndianRupee className="h-4 w-4" />
                                <span className="font-medium">Est. Monthly</span>
                            </div>
                            <div className="mt-1 text-2xl font-bold tabular-nums tracking-tight">₹{estimatedMonthlyCost.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="mb-8 rounded-lg border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">Cost Optimization Tip</h3>
                            <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-300 leading-relaxed font-medium">
                                Enabling all notification channels can significantly increase costs. We recommend keeping most
                                notifications on <strong>Push (₹{getChannelUnitCost("PUSH")}/event)</strong> and <strong>Email (₹{getChannelUnitCost("EMAIL")}/event)</strong> only.
                                Use <strong>SMS (₹{getChannelUnitCost("SMS")}/event)</strong> and <strong>WhatsApp (₹{getChannelUnitCost("WHATSAPP")}/event)</strong> for critical
                                alerts like payment failures and urgent notices.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-4 hidden rounded-lg border border-border bg-muted/40 px-6 py-3 lg:block">
                    <div className="grid grid-cols-[1fr_100px_100px_100px_100px] items-center gap-6">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notification Type</div>
                        {CHANNELS.map(({ key, icon: Icon, label }) => (
                            <div key={key} className="flex flex-col items-center justify-center gap-1 text-center">
                                <div className="flex items-center gap-1.5">
                                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                                </div>
                                <span className="flex items-center text-xs font-mono text-muted-foreground/70 tabular-nums">
                                    <IndianRupee className="h-2.5 w-2.5" />
                                    {getChannelUnitCost(key).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {sortedSettings.map((notification) => {
                        const isExpanded = expandedGroups.has(notification.id)
                        const channels = notification.channels as ChannelsJson

                        // Extract events from JSON
                        const events = Object.entries(channels || {})
                            .filter(([_, v]) => typeof v === 'object' && v !== null && 'label' in v)
                            .map(([key, value]) => ({
                                key,
                                ...(value as EventConfig)
                            }))

                        const isCategory = events.length > 0
                        const Icon = ICON_MAP[notification.notificationType]

                        return (
                            <div key={notification.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className={cn(
                                    "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-md",
                                    isExpanded && "border-primary/20 ring-1 ring-primary/5 bg-muted/5"
                                )}>
                                    {/* Accent line for category */}
                                    {isCategory && (
                                        <div className="absolute inset-y-0 left-0 w-1 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}

                                    <div className="grid grid-cols-1 gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_100px_100px_100px_100px] lg:items-center lg:gap-6">
                                        <div
                                            className={cn(
                                                "flex items-center gap-4 min-w-0 flex-1",
                                                isCategory && "cursor-pointer group/header select-none"
                                            )}
                                            onClick={isCategory ? () => toggleExpanded(notification.id) : undefined}
                                        >
                                            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-muted/50 border border-transparent group-hover:border-border group-hover:bg-background text-muted-foreground shrink-0 transition-all duration-300">
                                                {Icon && <Icon className="h-5 w-5" />}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-semibold leading-none text-foreground sm:text-base tracking-tight">
                                                        {notification.label}
                                                    </h3>
                                                    {isCategory && (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="px-1.5 py-0 h-4.5 text-[9px] font-bold bg-primary/5 text-primary border-primary/10">
                                                                {events.length} types
                                                            </Badge>
                                                            <div className={cn(
                                                                "transition-transform duration-300 text-muted-foreground/40 group-hover/header:text-primary/60",
                                                                isExpanded ? "rotate-90" : ""
                                                            )}>
                                                                <ChevronRight className="h-3.5 w-3.5" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {notification.description && (
                                                    <p className="mt-1.5 text-xs text-muted-foreground leading-normal line-clamp-1 group-hover:block transition-all">
                                                        {notification.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 lg:contents select-none">
                                            {isCategory ? (
                                                /* Visual placeholder for category header */
                                                CHANNELS.map(({ key }) => (
                                                    <div key={key} className="hidden lg:flex items-center justify-center">
                                                        <div className="h-1 w-6 rounded-full bg-muted/30 group-hover:bg-muted/60 transition-colors" />
                                                    </div>
                                                ))
                                            ) : (
                                                CHANNELS.map(({ key, icon: Icon, label }) => {
                                                    const config = getChannelConfig(notification, key)
                                                    const isUpdating = updatingId === `${notification.id}-${key}`

                                                    return (
                                                        <div key={key} className="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
                                                            <div className="flex items-center gap-1.5 lg:hidden">
                                                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                                <span className="text-xs text-muted-foreground font-medium">{label}</span>
                                                            </div>
                                                            {config.locked ? (
                                                                <div className="flex h-7 w-9 items-center justify-center cursor-not-allowed rounded-md bg-muted/30 border border-dashed border-border/50">
                                                                    <Lock className="h-3 w-3 text-muted-foreground/30" />
                                                                </div>
                                                            ) : (
                                                                <div className="relative flex items-center justify-center group/switch">
                                                                    <Switch
                                                                        checked={config.enabled}
                                                                        disabled={isUpdating}
                                                                        onCheckedChange={(checked) => toggleChannel(notification.id, key, checked)}
                                                                        className="data-[state=checked]:bg-primary"
                                                                    />
                                                                    {isUpdating && (
                                                                        <div className="absolute -inset-1 flex items-center justify-center bg-background/50 rounded-full">
                                                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isCategory && isExpanded && (
                                    <div className="ml-5 mt-2 space-y-2 border-l-[1.5px] border-primary/10 pl-5 sm:ml-5 sm:pl-9 animate-in slide-in-from-top-2 fade-in duration-300">
                                        {events.map((event) => (
                                            <div
                                                key={event.key}
                                                className="group/item relative overflow-hidden rounded-xl border border-border/50 bg-background/50 transition-all hover:bg-background hover:border-border hover:shadow-sm"
                                            >
                                                <div className="grid grid-cols-1 gap-6 px-4 py-3 sm:px-6 lg:grid-cols-[1fr_100px_100px_100px_100px] lg:items-center lg:gap-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/20 group-hover/item:bg-primary/60 transition-colors shrink-0" />
                                                        <h4 className="text-sm font-medium text-foreground/80 group-hover/item:text-foreground line-clamp-1">{event.label}</h4>
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-4 lg:contents select-none">
                                                        {CHANNELS.map(({ key, icon: Icon, label }) => {
                                                            const config = getChannelConfig(notification, key, event.key)
                                                            const isUpdating = updatingId === `${notification.id}-${event.key}-${key}`

                                                            return (
                                                                <div key={key} className="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
                                                                    <div className="flex items-center gap-1.5 lg:hidden">
                                                                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        <span className="text-[10px] text-muted-foreground">{label}</span>
                                                                    </div>
                                                                    {config.locked ? (
                                                                        <Lock className="h-3 w-3 text-muted-foreground/20" />
                                                                    ) : (
                                                                        <div className="relative">
                                                                            <Switch
                                                                                checked={config.enabled}
                                                                                disabled={isUpdating}
                                                                                onCheckedChange={(checked) => toggleChannel(notification.id, key, checked, event.key)}
                                                                            />
                                                                            {isUpdating && (
                                                                                <div className="absolute -inset-1.5 flex items-center justify-center bg-background/50 rounded-full">
                                                                                    <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
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

                <div className="mt-8 rounded-lg border border-border bg-muted/20 p-6">
                    <div className="flex gap-4">
                        <div className="p-2 rounded-full bg-background border shadow-sm h-fit">
                            <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">About Locked Channels</h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-4xl">
                                Some notification types have restricted channels due to technical or regulatory limitations. For
                                example, <strong>Monthly Reports</strong> are too large for SMS/WhatsApp, and some notifications work better with
                                specific delivery methods to ensure deliverability and compliance.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
