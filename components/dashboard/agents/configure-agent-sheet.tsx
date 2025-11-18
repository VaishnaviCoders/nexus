'use client';

import { useState } from 'react';
import { Save, Loader2, Clock, Bell, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FeeSenseAgent } from '@/generated/prisma/client';

// Schema matching your Prisma model exactly
export const feeSenseConfigSchema = z.object({
  // Scheduling
  runFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND']),
  scheduleTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

  // Risk Score Thresholds
  riskScoreLowThreshold: z.number().min(0).max(100),
  riskScoreMediumThreshold: z.number().min(0).max(100),
  riskScoreHighThreshold: z.number().min(0).max(100),

  // Notification Settings
  maxNotificationAttempts: z.number().min(1).max(10),
  voiceCallThreshold: z.number().min(1).max(30),

  // Notification Channels
  enableEmailReminders: z.boolean(),
  enableSMSReminders: z.boolean(),
  enableVoiceCalls: z.boolean(),
  enableWhatsApp: z.boolean(),
});

export type FeeSenseConfig = z.infer<typeof feeSenseConfigSchema>;

interface ConfigureAgentSheetProps {
  agent: FeeSenseAgent;
}

export default function ConfigureAgentSheet({
  agent,
}: ConfigureAgentSheetProps) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FeeSenseConfig>({
    resolver: zodResolver(feeSenseConfigSchema),
    defaultValues: {
      runFrequency: agent.runFrequency || 'DAILY',
      scheduleTime: agent.scheduleTime || '23:00',
      riskScoreLowThreshold: agent.riskScoreLowThreshold,
      riskScoreMediumThreshold: agent.riskScoreMediumThreshold,
      riskScoreHighThreshold: agent.riskScoreHighThreshold,
      maxNotificationAttempts: agent.maxNotificationAttempts,
      voiceCallThreshold: agent.voiceCallThreshold,
      enableEmailReminders: agent.enableEmailReminders,
      enableSMSReminders: agent.enableSMSReminders,
      enableVoiceCalls: agent.enableVoiceCalls,
      enableWhatsApp: agent.enableWhatsApp,
    },
  });

  const onSubmit = async (data: FeeSenseConfig) => {
    setIsPending(true);
    try {
      const response = await fetch(`/api/agents/${agent.id}/configure`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      toast.success('Configuration saved', {
        description: `${agent.name} has been configured successfully.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save configuration';
      toast.error('Error saving configuration', {
        description: message,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
        {/* Execution Schedule */}
        <Card className="border-0 bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Execution Schedule
            </CardTitle>
            <CardDescription>
              Define when this agent runs for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="runFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Run Frequency
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ON_DEMAND">
                        On Demand - Manual trigger only
                      </SelectItem>
                      <SelectItem value="DAILY">
                        Daily - Runs once per day
                      </SelectItem>
                      <SelectItem value="WEEKLY">
                        Weekly - Runs once per week
                      </SelectItem>
                      <SelectItem value="MONTHLY">
                        Monthly - Runs once per month
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Choose how frequently the agent should execute
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduleTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Scheduled Time
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="h-9" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Time of day when the agent executes (in HH:MM format)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Risk Score Thresholds */}
        <Card className="border-0 bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Risk Score Thresholds
            </CardTitle>
            <CardDescription>
              Configure risk levels for student fee payment behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="riskScoreLowThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Low Risk Threshold (0-{field.value})
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-9 w-24"
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">
                      / 100 points
                    </span>
                  </div>
                  <FormDescription className="text-xs">
                    Students below this score need gentle reminders
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskScoreMediumThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Medium Risk Threshold
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-9 w-24"
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">
                      / 100 points
                    </span>
                  </div>
                  <FormDescription className="text-xs">
                    Students in this range need firm reminders
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskScoreHighThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    High Risk Threshold
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-9 w-24"
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">
                      / 100 points
                    </span>
                  </div>
                  <FormDescription className="text-xs">
                    Students above this score need urgent intervention
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Notification Channels */}
        <Card className="border-0 bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notification Channels
            </CardTitle>
            <CardDescription>
              Enable or disable communication channels for reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enableEmailReminders"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">
                      Email Reminders
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Send payment reminders via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableSMSReminders"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">
                      SMS Reminders
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Send payment reminders via SMS
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableWhatsApp"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">
                      WhatsApp Messages
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Send payment reminders via WhatsApp
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableVoiceCalls"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">
                      Voice Calls
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Schedule voice calls for high-priority cases
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Notification Behavior */}
        <Card className="border-0 bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Notification Behavior
            </CardTitle>
            <CardDescription>
              Control how aggressively reminders are sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="maxNotificationAttempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Max Notification Attempts
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-9 w-24"
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">
                      attempts per student
                    </span>
                  </div>
                  <FormDescription className="text-xs">
                    Maximum number of reminders to send before stopping
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="voiceCallThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Voice Call Threshold
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-9 w-24"
                      />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">
                      days overdue
                    </span>
                  </div>
                  <FormDescription className="text-xs">
                    Schedule voice call after fees are overdue by this many days
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Submit */}
        <Button type="submit" disabled={isPending} className="w-full gap-2 h-9">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Configuration
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
