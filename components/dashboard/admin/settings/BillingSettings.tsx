'use client';

import BillingSummary from './BillingSummary';
import APIVoiceCallQuota from './APIVoiceCallQuota';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Organization {
    id: string;
    name: string | null;
    plan: string | null;
    planStartedAt: Date | null;
    planExpiresAt: Date | null;
    maxStudents: number | null;
}

interface BillingSettingsProps {
    organization: Organization | null;
    billingSummary: {
        channelSummary: {
            email: { units: number; cost: number };
            sms: { units: number; cost: number };
            whatsapp: { units: number; cost: number };
            push: { units: number; cost: number };
        };
        totalStorageMB: number | string;
        totalCost: number;
    };
}

export default function BillingSettings({ organization, billingSummary }: BillingSettingsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium">Billing & Usage</h2>
                <p className="text-sm text-muted-foreground">
                    Monitor your usage, billing information, and API quotas.
                </p>
            </div>

            {organization && (
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Information</CardTitle>
                        <CardDescription>Your current subscription details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium">Current Plan</p>
                                <p className="text-sm text-muted-foreground">{organization.plan || 'Free'}</p>
                            </div>
                            {organization.planStartedAt && (
                                <div>
                                    <p className="text-sm font-medium">Plan Started</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(organization.planStartedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            {organization.planExpiresAt && (
                                <div>
                                    <p className="text-sm font-medium">Plan Expires</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(organization.planExpiresAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}


            <BillingSummary data={billingSummary} />
            <APIVoiceCallQuota />

        </div>
    );
}
