"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useState } from "react";


function SettingsCard({
    title,
    description,
    children,
    footer,
}: {
    title: string
    description?: string
    children: React.ReactNode
    footer?: React.ReactNode
}) {
    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="p-6">
                <h3 className="text-base font-medium text-foreground">{title}</h3>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                <div className="mt-6">{children}</div>
            </div>
            {footer && <div className="border-t border-border bg-muted/30 px-6 py-4">{footer}</div>}
        </div>
    )
}

// Toggle Row component
function ToggleRow({
    icon: Icon,
    label,
    description,
    defaultChecked = false,
}: {
    icon?: React.ComponentType<{ className?: string }>
    label: string
    description?: string
    defaultChecked?: boolean
}) {
    const [checked, setChecked] = useState(defaultChecked)
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={setChecked} />
        </div>
    )
}


export function NotificationsSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Configure notification channels and preferences.</p>
            </div>

            <SettingsCard title="Notification Channels" description="Enable or disable notification methods">
                <div className="space-y-1">
                    <ToggleRow icon={Mail} label="Email Notifications" description="Send updates via email" defaultChecked />
                    <ToggleRow icon={Smartphone} label="SMS Notifications" description="Send updates via SMS" defaultChecked />
                    <ToggleRow icon={MessageSquare} label="WhatsApp Notifications" description="Send updates via WhatsApp" />
                    <ToggleRow icon={Bell} label="Push Notifications" description="In-app push notifications" defaultChecked />
                </div>
            </SettingsCard>

            <SettingsCard title="Notification Events" description="Choose which events trigger notifications">
                <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                    <ToggleRow label="Fee Due Reminders" description="Before payment deadline" defaultChecked />
                    <ToggleRow label="Fee Payment Confirmation" description="After successful payment" defaultChecked />
                    <ToggleRow label="Attendance Alerts" description="When marked absent" defaultChecked />
                    <ToggleRow label="Exam Schedules" description="Upcoming exam notifications" defaultChecked />
                    <ToggleRow label="Result Published" description="When results are declared" defaultChecked />
                    <ToggleRow label="Leave Status Updates" description="Approval/rejection updates" defaultChecked />
                </div>
            </SettingsCard>

            <SettingsCard title="Recipient Preferences" description="Control who receives which notifications">
                <div className="rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        <span className="col-span-1">Event</span>
                        <span className="text-center">Admin</span>
                        <span className="text-center">Teacher</span>
                        <span className="text-center">Student</span>
                        <span className="text-center">Parent</span>
                    </div>
                    {[
                        { event: "Fee Reminders", admin: true, teacher: false, student: true, parent: true },
                        { event: "Attendance Alerts", admin: true, teacher: true, student: false, parent: true },
                        { event: "Exam Results", admin: true, teacher: true, student: true, parent: true },
                        { event: "Announcements", admin: true, teacher: true, student: true, parent: true },
                    ].map((row, i) => (
                        <div
                            key={row.event}
                            className={cn(
                                "grid grid-cols-5 gap-4 px-4 py-3 text-sm items-center",
                                i !== 3 && "border-t border-border",
                            )}
                        >
                            <span className="font-medium">{row.event}</span>
                            <div className="flex justify-center">
                                <Checkbox defaultChecked={row.admin} />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox defaultChecked={row.teacher} />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox defaultChecked={row.student} />
                            </div>
                            <div className="flex justify-center">
                                <Checkbox defaultChecked={row.parent} />
                            </div>
                        </div>
                    ))}
                </div>
            </SettingsCard>

            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}