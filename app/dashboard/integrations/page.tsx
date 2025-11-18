'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Mail, Lock, MessageCircle, ArrowRight } from 'lucide-react';
import IntegrationDialog from '@/components/dashboard/integration/integration-dialog';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WhatsAppIcon } from '@/public/icons/WhatsAppIcon';

interface Integration {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  connected: boolean;
  comingSoon?: boolean;
}

const integrations: Integration[] = [
  {
    id: 'facebook-ads',
    name: 'Facebook Ads',
    description: 'Sync campaigns and track performance',
    longDescription:
      'Connect your Facebook Ads account to sync campaigns, track performance metrics, and manage lead generation directly from your CRM.',
    icon: <Zap className="w-8 h-8" />,
    connected: true,
    comingSoon: false,
  },
  {
    id: 'google-forms',
    name: 'Google Forms',
    description: 'Import form responses automatically',
    longDescription:
      'Automatically import responses from your Google Forms into your CRM to streamline lead collection and data management.',
    icon: <Mail className="w-8 h-8" />,
    connected: false,
    comingSoon: false,
  },
  {
    id: 'smtp',
    name: 'SMTP',
    description: 'Send emails directly from your CRM',
    longDescription:
      'Configure your SMTP server to send emails, automate communications, and enable email tracking for better lead engagement.',
    icon: <Lock className="w-8 h-8" />,
    connected: true,
    comingSoon: false,
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    description: 'Message leads directly on WhatsApp',
    longDescription:
      'Reach out to your leads on WhatsApp with direct messaging, notifications, and customer support integration.',
    icon: <WhatsAppIcon />,
    connected: false,
    comingSoon: true,
  },
];

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConnect = (integration: Integration) => {
    if (!integration.comingSoon) {
      setSelectedIntegration(integration);
      setDialogOpen(true);
    }
  };

  const connectedCount = integrations.filter(
    (i) => i.connected && !i.comingSoon
  ).length;

  return (
    <div className="px-2">
      <div className="space-y-5">
        {/* Header */}

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect your favorite tools and services to streamline your lead
              management workflow. Sync data seamlessly and automate your
              processes.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Bar */}
        <div className="mb-12 flex items-center gap-8 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-foreground">
              {connectedCount} Connected
            </span>
          </div>
          <div className="w-px h-5 bg-border" />
          <span className="text-sm text-muted-foreground">
            {integrations.length} Total Integrations
          </span>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={`group relative rounded-xl border transition-all duration-300 p-6 ${
                integration.comingSoon
                  ? 'border-border bg-card/50 opacity-60 cursor-not-allowed'
                  : 'border-border bg-card hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5'
              }`}
            >
              {/* Coming Soon Badge */}
              {integration.comingSoon && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`mb-4 inline-flex p-3 rounded-lg ${
                  integration.comingSoon
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors'
                }`}
              >
                {integration.icon}
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {integration.description}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {integration.longDescription}
                </p>
              </div>

              {/* Status & Action */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  {integration.connected && !integration.comingSoon ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                      Connected
                    </div>
                  ) : integration.comingSoon ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      Unavailable
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      Not Connected
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleConnect(integration)}
                  disabled={integration.comingSoon}
                  variant={integration.connected ? 'outline' : 'default'}
                  size="sm"
                  className={`gap-2 ${integration.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {integration.comingSoon ? (
                    'Coming Soon'
                  ) : integration.connected ? (
                    <>
                      Manage
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Connect
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Dialog */}
      {selectedIntegration && (
        <IntegrationDialog
          integration={selectedIntegration}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
