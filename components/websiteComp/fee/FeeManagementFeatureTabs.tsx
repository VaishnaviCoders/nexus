"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Mail,
  MessageCircle,
  Smartphone,
  Calendar,
  Send,
  CheckCheck,
  CreditCard,
  MoreVertical,
  Phone,
  ChevronLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// --- Mock Data & Config ---

type Channel = "whatsapp" | "email" | "sms"
type TemplateType = "gentle" | "overdue" | "final"

const templates: Record<TemplateType, { label: string; subject: string; content: string; action: string }> = {
  gentle: {
    label: "Gentle Reminder",
    subject: "Upcoming Fee Payment",
    content:
      "Hi [Parent Name], this is a gentle reminder that the tuition fee for [Student Name] is due on [Date]. We appreciate your timely payment.",
    action: "View Invoice",
  },
  overdue: {
    label: "Payment Overdue",
    subject: "Action Required: Overdue Fees",
    content:
      "Dear [Parent Name], we noticed that the fee payment for [Student Name] is past due. Please clear the outstanding amount of $1,200 to avoid any late charges.",
    action: "Pay Now",
  },
  final: {
    label: "Final Notice",
    subject: "Final Notice: Fee Payment",
    content:
      "Urgent: This is a final notice regarding the pending fees for [Student Name]. Please address this immediately to ensure uninterrupted access to school facilities.",
    action: "Contact Admin",
  },
}

const channels = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: Smartphone },
] as const

// --- Main Component ---

export default function FeeManagementFeatureTabs() {

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <Tabs defaultValue="reminders" className="w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Fee Management</h2>
          </div>
          <TabsList className="grid w-full sm:w-auto grid-cols-3 h-10 bg-muted/50 p-1">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="records" className="text-xs sm:text-sm">
              Records
            </TabsTrigger>
            <TabsTrigger value="reminders" className="text-xs sm:text-sm">
              Reminders
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab Placeholder */}
        <TabsContent value="dashboard" className="mt-0">
          <PlaceholderState
            icon={LayoutDashboard}
            title="Dashboard Overview"
            description="Visualize collection trends, pending dues, and financial health."
          />
        </TabsContent>

        {/* Records Tab Placeholder */}
        <TabsContent value="records" className="mt-0">
          <PlaceholderState
            icon={Users}
            title="Student Records"
            description="Manage student profiles, fee structures, and payment history."
          />
        </TabsContent>

        {/* Reminders Tab (Feature Focus) */}
        <TabsContent value="reminders" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <RemindersFeature />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// --- Sub Components ---

function PlaceholderState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-dashed border-2 border-muted-foreground/25 rounded-xl bg-muted/5"
    >
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 px-4">
        <div className="p-4 bg-background rounded-full shadow-sm ring-1 ring-border">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <Button variant="outline" className="mt-4 bg-transparent">
          Add Screen Image
        </Button>
      </div>
    </motion.div>
  )
}

function RemindersFeature() {
  const [channel, setChannel] = React.useState<Channel>("whatsapp")
  const [template, setTemplate] = React.useState<TemplateType>("gentle")

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Controls Panel */}
      <Card className="lg:col-span-5 shadow-sm border-border/60 bg-card/50 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Reminder Workflow</CardTitle>
          <CardDescription>Configure automated notifications for students.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Channel Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Select Channel
            </Label>
            <RadioGroup
              defaultValue="whatsapp"
              value={channel}
              onValueChange={(v) => setChannel(v as Channel)}
              className="grid grid-cols-3 gap-3"
            >
              {channels.map((c) => (
                <div key={c.id}>
                  <RadioGroupItem value={c.id} id={c.id} className="peer sr-only" />
                  <Label
                    htmlFor={c.id}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200",
                    )}
                  >
                    <c.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{c.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Template Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Message Template
            </Label>
            <RadioGroup
              defaultValue="gentle"
              value={template}
              onValueChange={(v) => setTemplate(v as TemplateType)}
              className="flex flex-col gap-3"
            >
              {Object.entries(templates).map(([key, t]) => (
                <div key={key}>
                  <RadioGroupItem value={key} id={key} className="peer sr-only" />
                  <Label
                    htmlFor={key}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all bg-background"
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className="h-4 w-4 rounded-full border border-primary/30 ring-offset-background peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-background scale-0 peer-data-[state=checked]:scale-100 transition-transform" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-sm leading-none">{t.label}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{t.subject}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Timing - Visual Only */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Delivery Schedule
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button className="w-full" variant="default">
                Send Immediately
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <div className="lg:col-span-7 flex items-center justify-center lg:justify-start">
        <div className="relative w-full max-w-[400px] lg:max-w-none lg:w-full perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={channel}
              initial={{ opacity: 0, x: 20, rotateY: -5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -20, rotateY: 5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full flex justify-center"
            >
              {channel === "whatsapp" && <WhatsAppPreview template={templates[template]} />}
              {channel === "email" && <EmailPreview template={templates[template]} />}
              {channel === "sms" && <SMSPreview template={templates[template]} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// --- Preview Components ---

function WhatsAppPreview({ template }: { template: (typeof templates)["gentle"] }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border-[8px] border-zinc-900 bg-[#E5DDD5] shadow-2xl h-[640px] w-full max-w-[360px] flex flex-col">
      {/* Status Bar */}
      <div className="bg-[#075E54] text-white pt-8 pb-3 px-4 flex items-center gap-3 z-10 shadow-md">
        <ChevronLeft className="h-6 w-6 -ml-2" />
        <div className="flex items-center gap-3 flex-1">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center ring-1 ring-white/30">
            <span className="text-xs font-bold">EF</span>
          </div>
          <div>
            <div className="text-sm font-bold leading-none mb-0.5">shiksha cloud</div>
            <div className="text-[10px] opacity-80 font-medium">Business Account</div>
          </div>
        </div>
        <VideoCallIcon className="h-5 w-5 opacity-90" />
        <Phone className="h-5 w-5 opacity-90 ml-3" />
        <MoreVertical className="h-5 w-5 opacity-90 ml-2" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-100">
        <div className="flex justify-center mb-6 mt-2">
          <span className="bg-[#E1F3FB] text-zinc-600 text-[11px] px-3 py-1 rounded-lg shadow-sm uppercase font-medium tracking-wide">
            Today
          </span>
        </div>

        <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] mb-4">
          <div className="text-sm text-zinc-800">Hello! Welcome to shiksha official support.</div>
          <div className="flex justify-end mt-1">
            <span className="text-[10px] text-zinc-400">9:41 AM</span>
          </div>
        </div>

        <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[90%] ml-auto relative mb-2">
          <div className="text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
            {template.content
              .replace("[Parent Name]", "Mr. Sharma")
              .replace("[Student Name]", "Rahul")
              .replace("[Date]", "Oct 15th")}
          </div>
          <div className="flex items-center justify-end gap-1 mt-1.5">
            <span className="text-[10px] text-zinc-500/80">10:42 AM</span>
            <CheckCheck className="h-3.5 w-3.5 text-[#34B7F1]" />
          </div>
        </div>

        {/* Action Button Mockup */}
        <div className="bg-white p-3.5 rounded-lg shadow-sm max-w-[90%] ml-auto text-center border-b-4 border-b-transparent active:border-b-zinc-200 transition-all">
          <div className="text-[#00A884] text-sm font-medium cursor-pointer flex items-center justify-center gap-2 hover:opacity-80">
            <CreditCard className="h-4 w-4" />
            {template.action}
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-[#F0F0F0] p-2 px-3 flex items-center gap-2 pb-6">
        <div className="bg-white flex-1 rounded-full h-10 px-4 flex items-center text-zinc-400 text-sm shadow-sm border border-zinc-100">
          Message
        </div>
        <div className="h-10 w-10 bg-[#00A884] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#008f6f] transition-colors">
          <Send className="h-5 w-5 ml-0.5" />
        </div>
      </div>
    </div>
  )
}

function EmailPreview({ template }: { template: (typeof templates)["gentle"] }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl h-[640px] w-full max-w-[440px] flex flex-col font-sans mx-auto">
      {/* Browser Chrome */}
      <div className="bg-zinc-100 border-b border-zinc-200 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400/80 border border-red-500/20" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/80 border border-yellow-500/20" />
          <div className="h-3 w-3 rounded-full bg-green-400/80 border border-green-500/20" />
        </div>
        <div className="flex-1 bg-white h-7 rounded-md border border-zinc-200 mx-2 flex items-center px-3 text-[11px] text-zinc-400 shadow-sm">
          https://mail.shiksha.cloud/compose
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="border-b pb-5 mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-medium w-10">To:</span>
            <span className="text-xs font-medium bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-700 border border-zinc-200">
              Sameer Kad (Parent)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-medium w-10">Subject:</span>
            <span className="text-sm text-zinc-900 font-semibold">{template.subject}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
              EF
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900">shiksha cloud</div>
              <div className="text-xs text-zinc-500">admin@shiksha.cloud</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-900">{template.label}</h3>
            <p className="text-sm text-zinc-600 leading-7 whitespace-pre-wrap">
              {template.content
                .replace("[Parent Name]", "Sameer")
                .replace("[Student Name]", "Rahul")
                .replace("[Date]", "Oct 15th")}
            </p>
          </div>

          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto shadow-lg shadow-indigo-200 h-11 px-8 text-sm">
            {template.action}
          </Button>

          <div className="pt-8 border-t border-zinc-100 mt-8">
            <p className="text-[10px] text-zinc-400 leading-relaxed text-center">
              Automated message sent from shiksha cloud system.
              <br />
              Please do not reply directly to this email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SMSPreview({ template }: { template: (typeof templates)["gentle"] }) {
  return (
    <div className="relative overflow-hidden rounded-[40px] border-[8px] border-zinc-900 bg-white shadow-2xl h-[640px] flex flex-col w-full max-w-[360px] mx-auto">
      {/* Notch/Status */}
      <div className="bg-[#F5F5F5] h-24 border-b flex flex-col items-center justify-end pb-3 relative pt-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-900 rounded-b-[20px]" />
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 flex items-center justify-center mb-1">
            <span className="text-xs font-bold text-zinc-400">EF</span>
          </div>
          <span className="text-xs font-medium text-zinc-900">shiksha</span>
          <ChevronLeft className="absolute left-4 bottom-3.5 h-6 w-6 text-blue-500" />
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-white">
        <div className="text-center mt-2">
          <span className="text-[10px] text-zinc-400 font-medium">Today 9:41 AM</span>
        </div>

        <div className="bg-[#E9E9EB] rounded-2xl rounded-tl-sm p-3.5 max-w-[80%] self-start">
          <p className="text-sm text-zinc-900">Hello, this is the shiksha automated system.</p>
        </div>

        <div className="bg-[#007AFF] text-white rounded-2xl rounded-br-sm p-3.5 max-w-[85%] self-end shadow-sm shadow-blue-100">
          <p className="text-sm leading-relaxed">
            {template.content
              .replace("[Parent Name]", "Parent")
              .replace("[Student Name]", "Your Ward")
              .replace("[Date]", "tomorrow")}
          </p>
        </div>

        <div className="self-end text-[10px] text-zinc-400 pr-1 font-medium -mt-2">Delivered</div>

        {template.action === "Pay Now" && (
          <div className="bg-[#E9E9EB] rounded-2xl p-3 max-w-[80%] self-start flex items-center gap-3 border border-zinc-200/50 cursor-pointer hover:bg-zinc-200 transition-colors">
            <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-sm">
              <CreditCard className="h-5 w-5 text-zinc-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-zinc-900">Secure Payment Link</div>
              <div className="text-[10px] text-zinc-500">shiksha.cloud/pay</div>
            </div>
          </div>
        )}
      </div>

      {/* SMS Input */}
      <div className="p-3 border-t bg-[#F5F5F5] flex items-center gap-3 pb-8">
        <div className="bg-zinc-300/50 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
          <CameraIcon className="h-4 w-4 text-zinc-500" />
        </div>
        <div className="flex-1 bg-white border border-zinc-200/60 rounded-full h-9 px-3.5 flex items-center text-sm text-zinc-400">
          iMessage
        </div>
        <div className="bg-[#007AFF] rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 shadow-sm">
          <ArrowUpIcon className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  )
}

// --- Icons helpers ---

function VideoCallIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.777-.416L16 10" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}
