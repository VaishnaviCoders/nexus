'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export interface IntegrationField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'email' | 'number';
  required: boolean;
  helpText: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  fields: IntegrationField[];
  setupGuide: {
    title: string;
    steps: string[];
    learnMoreUrl?: string;
  };
}

export const INTEGRATION_CONFIGS: Record<string, IntegrationConfig> = {
  'facebook-ads': {
    id: 'facebook-ads',
    name: 'Facebook Ads',
    fields: [
      {
        id: 'access_token',
        label: 'Access Token',
        placeholder: 'Enter your Facebook access token',
        type: 'password',
        required: true,
        helpText: 'Find this in your Facebook App Settings under Access Tokens',
      },
      {
        id: 'business_account_id',
        label: 'Business Account ID',
        placeholder: 'e.g., 123456789',
        type: 'text',
        required: true,
        helpText: 'Located in your Facebook Business Manager settings',
      },
      {
        id: 'pixel_id',
        label: 'Pixel ID (Optional)',
        placeholder: 'Your Facebook Pixel ID',
        type: 'text',
        required: false,
        helpText: 'Optional: Track conversions with your Pixel',
      },
    ],
    setupGuide: {
      title: 'Connect Facebook Ads',
      steps: [
        'Go to Facebook App Dashboard',
        'Navigate to Settings > Basic',
        'Find your Access Token under Tools',
        'Copy your Business Account ID from Business Manager',
        'Paste the credentials below',
      ],
      learnMoreUrl: 'https://facebook.com/help',
    },
  },
  'google-forms': {
    id: 'google-forms',
    name: 'Google Forms',
    fields: [
      {
        id: 'api_key',
        label: 'API Key',
        placeholder: 'Enter your Google API Key',
        type: 'password',
        required: true,
        helpText: 'Get this from Google Cloud Console > Credentials',
      },
      {
        id: 'form_id',
        label: 'Form ID',
        placeholder: 'e.g., 1FAIpQLSf_xyz...',
        type: 'text',
        required: true,
        helpText: 'Found in your Google Form URL after /forms/d/',
      },
    ],
    setupGuide: {
      title: 'Connect Google Forms',
      steps: [
        'Go to Google Cloud Console',
        'Create or select a project',
        'Enable Google Forms API',
        'Create an API key in Credentials section',
        'Get your Form ID from the form URL',
      ],
      learnMoreUrl: 'https://support.google.com/docs/answer/1218477',
    },
  },
  smtp: {
    id: 'smtp',
    name: 'SMTP',
    fields: [
      {
        id: 'smtp_host',
        label: 'SMTP Host',
        placeholder: 'e.g., smtp.gmail.com',
        type: 'text',
        required: true,
        helpText: 'Your email provider SMTP server address',
      },
      {
        id: 'smtp_port',
        label: 'SMTP Port',
        placeholder: '587 or 465',
        type: 'number',
        required: true,
        helpText: 'Usually 587 (TLS) or 465 (SSL)',
      },
      {
        id: 'email',
        label: 'Email Address',
        placeholder: 'your-email@example.com',
        type: 'email',
        required: true,
        helpText: 'The email address to send from',
      },
      {
        id: 'password',
        label: 'Email Password / App Password',
        placeholder: 'Enter your email password',
        type: 'password',
        required: true,
        helpText:
          'For Gmail, use an App Password instead of your regular password',
      },
      {
        id: 'from_name',
        label: 'From Name (Optional)',
        placeholder: 'e.g., Sales Team',
        type: 'text',
        required: false,
        helpText: 'Display name for sent emails',
      },
      {
        id: 'encryption',
        label: 'Encryption Type (Optional)',
        placeholder: 'TLS or SSL',
        type: 'text',
        required: false,
        helpText: 'Usually TLS (recommended) or SSL',
      },
    ],
    setupGuide: {
      title: 'Connect SMTP',
      steps: [
        'Get your SMTP server details from your email provider',
        'For Gmail: Enable 2-Step Verification, then create an App Password',
        'Enter your SMTP host and port',
        'Test the connection',
      ],
      learnMoreUrl: 'https://support.google.com/accounts/answer/185833',
    },
  },
  'whatsapp-business': {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    fields: [
      {
        id: 'whatsapp_business_id',
        label: 'WhatsApp Business ID',
        placeholder: 'Enter your WhatsApp Business ID',
        type: 'password',
        required: true,
        helpText: 'Find this in your Facebook App Settings under Access Tokens',
      },
      {
        id: 'whatsapp-api-key',
        label: 'WhatsApp API Key',
        placeholder: 'Enter your WhatsApp API Key',
        type: 'password',
        required: true,
        helpText: 'Find this in your Facebook App Settings under Access Tokens',
      },
    ],
    setupGuide: {
      title: 'Connect WhatsApp Business',
      steps: [
        'Go to WhatsApp Business (Meta) App Dashboard',
        'Navigate to Settings > Basic',
        'Find your Access Token under Tools',
        'Copy your Business Account ID from Business Manager',
        'Paste the credentials below',
      ],
      learnMoreUrl: 'https://meta.com/help',
    },
  },
};

interface Integration {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  icon: React.ReactNode | string;
  connected: boolean;
}

interface IntegrationDialogProps {
  integration: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ConnectionStep =
  | 'initial'
  | 'credentials'
  | 'connecting'
  | 'success'
  | 'error';

// Helper function for type-safe step comparison
const isStep = (step: ConnectionStep, compareTo: ConnectionStep) =>
  step === compareTo;

export default function IntegrationDialog({
  integration,
  open,
  onOpenChange,
}: IntegrationDialogProps) {
  const [step, setStep] = useState<ConnectionStep>(
    integration.connected ? 'success' : 'initial'
  );
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const config = INTEGRATION_CONFIGS[integration.id];

  const handleConnect = () => {
    setStep('credentials' as ConnectionStep);
    setError(null);
  };

  const handleSubmit = async () => {
    const requiredFields = config.fields.filter((f) => f.required);
    const missingFields = requiredFields.filter(
      (f) => !credentials[f.id]?.trim()
    );

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.map((f) => f.label).join(', ')}`
      );
      return;
    }

    setStep('connecting' as ConnectionStep);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setStep('success' as ConnectionStep);
    }, 1500);
  };

  const handleDisconnect = () => {
    setStep(
      integration.connected
        ? ('success' as ConnectionStep)
        : ('initial' as ConnectionStep)
    );
    setCredentials({});
    setError(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(
      integration.connected
        ? ('success' as ConnectionStep)
        : ('initial' as ConnectionStep)
    );
    setCredentials({});
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{integration.icon}</div>
            <div>
              <DialogTitle className="text-xl">{integration.name}</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                {integration.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Initial Step */}
          {isStep(step, 'initial') && (
            <div className="space-y-4">
              <p className="text-sm text-foreground">
                Ready to connect {integration.name}? We'll guide you through the
                setup process.
              </p>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 space-y-3">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                  {config.setupGuide.title}
                </p>
                <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  {config.setupGuide.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <Button onClick={handleConnect} className="w-full">
                Get Started
              </Button>
            </div>
          )}

          {/* Credentials Step */}
          {isStep(step, 'credentials') && (
            <div className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                    {field.required ? ' *' : ' (Optional)'}
                  </Label>
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    type={field.type}
                    value={credentials[field.id] || ''}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        [field.id]: e.target.value,
                      })
                    }
                    disabled={isStep(step, 'connecting')}
                  />
                  <p className="text-xs text-muted-foreground">
                    {field.helpText}
                  </p>
                </div>
              ))}

              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 flex gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('initial' as ConnectionStep)}
                  className="flex-1"
                  disabled={isStep(step, 'connecting')}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={isStep(step, 'connecting')}
                >
                  {isStep(step, 'connecting') ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Connecting Step */}
          {isStep(step, 'connecting') && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-foreground">
                Connecting {integration.name}...
              </p>
              <p className="text-xs text-muted-foreground">
                This may take a few seconds
              </p>
            </div>
          )}

          {/* Success Step */}
          {isStep(step, 'success') && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    Connection Successful!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {integration.name} is now connected to your account
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-green-800 dark:text-green-300">
                  Setup Details:
                </p>
                <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                  <p>• Connected at: {new Date().toLocaleString()}</p>
                  <p>• Status: Active</p>
                  <p>• Auto-sync: Enabled</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="flex-1 bg-transparent"
                >
                  Disconnect
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Error Step */}
          {isStep(step, 'error') && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    Connection Failed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please check your credentials and try again
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setStep('credentials' as ConnectionStep)}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
