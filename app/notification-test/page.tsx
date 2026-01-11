"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import useFcmToken from "@/hooks/use-fcm-token"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
    testPushNotification,
    testPushWithToken,
    testEmailNotification,
    testSMSNotification,
    testWhatsAppNotification,
    testAllChannels,
    getNotificationTestInfo,
    getUserTokens,
    deleteDeviceToken,
} from "./actions"
import {
    Bell,
    Mail,
    MessageSquare,
    Smartphone,
    Loader2,
    CheckCircle2,
    XCircle,
    Activity,
    Send,
    RefreshCw,
    Copy,
    Check,
    Search,
    Trash2,
    User,
    ChevronDown,
} from "lucide-react"

interface TestResult {
    channel: string
    success: boolean
    message: string
    error?: string
    timestamp: Date
}

interface TokenInfo {
    id: string
    token: string
    platform: string
    lastUsedAt: string | Date
    createdAt: string | Date
}

interface UserTokenInfo {
    id: string
    name: string
    email: string | null
}

export default function NotificationTestPage() {
    const { token, notificationPermissionStatus } = useFcmToken()

    const [loading, setLoading] = useState<string | null>(null)
    const [results, setResults] = useState<TestResult[]>([])
    const [customEmail, setCustomEmail] = useState("")
    const [customPhone, setCustomPhone] = useState("")
    const [customFcmToken, setCustomFcmToken] = useState("")
    const [copied, setCopied] = useState(false)
    const [userInfo, setUserInfo] = useState<{
        email?: string
        phone?: string
        whatsapp?: string
        deviceCount?: number
    }>({})

    // Token lookup state
    const [lookupUserId, setLookupUserId] = useState("")
    const [lookupLoading, setLookupLoading] = useState(false)
    const [lookupUser, setLookupUser] = useState<UserTokenInfo | null>(null)
    const [lookupTokens, setLookupTokens] = useState<TokenInfo[]>([])
    const [deletingToken, setDeletingToken] = useState<string | null>(null)

    useEffect(() => {
        loadUserInfo()
    }, [])

    useEffect(() => {
        if (token && !customFcmToken) {
            setCustomFcmToken(token)
        }
    }, [token])

    const loadUserInfo = async () => {
        const info = await getNotificationTestInfo()
        if (info.success) {
            setUserInfo({
                email: info.email || undefined,
                phone: info.phone,
                whatsapp: info.whatsapp,
                deviceCount: info.deviceCount,
            })
            setCustomEmail(info.email || "")
            setCustomPhone(info.phone || "")

            // Auto-load current user's tokens
            if (info.userId) {
                setLookupUserId(info.userId)
                loadTokensForUser(info.userId)
            }
        }
    }

    const loadTokensForUser = async (userId: string) => {
        if (!userId) return
        setLookupLoading(true)
        try {
            const result = await getUserTokens(userId)
            if (result.success && result.user) {
                setLookupUser(result.user)
                setLookupTokens(result.tokens)
            } else {
                setLookupUser(null)
                setLookupTokens([])
            }
        } catch (error) {
            console.error("Failed to load tokens:", error)
        } finally {
            setLookupLoading(false)
        }
    }

    const addResult = (result: Omit<TestResult, "timestamp">) => {
        setResults((prev) => [{ ...result, timestamp: new Date() }, ...prev].slice(0, 8))
    }

    const copyToken = async () => {
        if (token) {
            await navigator.clipboard.writeText(token)
            setCopied(true)
            toast.success("Token copied")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const copyLookupToken = async (tokenValue: string) => {
        await navigator.clipboard.writeText(tokenValue)
        toast.success("Token copied")
    }

    const handleLookupTokens = async () => {
        if (!lookupUserId.trim()) {
            toast.error("Please enter a User ID")
            return
        }
        await loadTokensForUser(lookupUserId.trim())
    }

    const handleDeleteToken = async (tokenId: string) => {
        setDeletingToken(tokenId)
        try {
            const result = await deleteDeviceToken(tokenId)
            if (result.success) {
                setLookupTokens((prev) => prev.filter((t) => t.id !== tokenId))
                toast.success("Token deleted")
            } else {
                toast.error(result.error || result.message || "Failed to delete token")
            }
        } catch (error) {
            toast.error("Failed to delete token")
        } finally {
            setDeletingToken(null)
        }
    }

    const handleUseToken = (tokenValue: string) => {
        setCustomFcmToken(tokenValue)
        toast.success("Token copied to test input")
    }

    const handleTestPush = async () => {
        setLoading("push")
        try {
            const result = customFcmToken && customFcmToken !== token
                ? await testPushWithToken(customFcmToken)
                : await testPushNotification()

            addResult({
                channel: "PUSH",
                success: result.success,
                message: result.message,
                error: result.error,
            })
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.error || result.message)
            }
        } catch (error) {
            toast.error("Failed to test push notification")
        } finally {
            setLoading(null)
        }
    }

    const handleTestEmail = async () => {
        if (!customEmail) {
            toast.error("Please enter an email address")
            return
        }
        setLoading("email")
        try {
            const result = await testEmailNotification(customEmail)
            addResult({
                channel: "EMAIL",
                success: result.success,
                message: result.message,
                error: result.error,
            })
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.error || result.message)
            }
        } catch (error) {
            toast.error("Failed to test email")
        } finally {
            setLoading(null)
        }
    }

    const handleTestSMS = async () => {
        if (!customPhone) {
            toast.error("Please enter a phone number")
            return
        }
        setLoading("sms")
        try {
            const result = await testSMSNotification(customPhone)
            addResult({
                channel: "SMS",
                success: result.success,
                message: result.message,
                error: result.error,
            })
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.error || result.message)
            }
        } catch (error) {
            toast.error("Failed to test SMS")
        } finally {
            setLoading(null)
        }
    }

    const handleTestWhatsApp = async () => {
        if (!customPhone) {
            toast.error("Please enter a phone number")
            return
        }
        setLoading("whatsapp")
        try {
            const result = await testWhatsAppNotification(customPhone)
            addResult({
                channel: "WHATSAPP",
                success: result.success,
                message: result.message,
                error: result.error,
            })
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.error || result.message)
            }
        } catch (error) {
            toast.error("Failed to test WhatsApp")
        } finally {
            setLoading(null)
        }
    }

    const handleTestAll = async () => {
        setLoading("all")
        try {
            const result = await testAllChannels(customEmail || undefined, customPhone || undefined)
            if (result.success) {
                result.results.forEach((r) =>
                    addResult({
                        channel: r.channel,
                        success: r.success,
                        message: r.message,
                        error: r.error,
                    })
                )
                toast.success(`Tested ${result.summary.success}/${result.summary.total} channels`)
            } else {
                toast.error(result.error || "Test all failed")
            }
        } catch (error) {
            toast.error("Failed to test all channels")
        } finally {
            setLoading(null)
        }
    }

    const formatDate = (date: string | Date) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">Notification Testing</h1>
                    <p className="text-slate-500 text-sm">Verify all notification delivery channels</p>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/30">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Browser Permission</span>
                            <div className={`w-2.5 h-2.5 rounded-full ${notificationPermissionStatus === "granted" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-slate-300"}`} />
                        </div>
                        <p className="text-lg font-semibold text-slate-900 capitalize">{notificationPermissionStatus || "Unknown"}</p>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/30">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User Devices</span>
                            <Button variant="ghost" size="sm" onClick={loadUserInfo} className="h-6 w-6 p-0 hover:bg-slate-200">
                                <RefreshCw className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">{userInfo.deviceCount ?? 0} <span className="text-sm font-normal text-slate-500 ml-1">registered</span></p>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/30">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Token</span>
                            {token && (
                                <Button variant="ghost" size="sm" onClick={copyToken} className="h-6 w-6 p-0 hover:bg-slate-200">
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </Button>
                            )}
                        </div>
                        <p className="text-sm font-mono text-slate-900 truncate">
                            {token ? `${token.substring(0, 24)}...` : "None"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
                    {/* Configuration */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Configuration
                            </h2>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block ml-1">FCM Push Token</label>
                                    <Input
                                        placeholder="Paste token to test specific device..."
                                        value={customFcmToken}
                                        onChange={(e) => setCustomFcmToken(e.target.value)}
                                        className="text-xs font-mono h-10 border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors"
                                    />
                                    <p className="text-[10px] text-slate-400 ml-1 italic">Leave empty to use all your registered devices</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block ml-1">Email Address</label>
                                    <Input
                                        placeholder="your@email.com"
                                        value={customEmail}
                                        onChange={(e) => setCustomEmail(e.target.value)}
                                        className="text-sm h-10 border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block ml-1">Phone Number</label>
                                    <Input
                                        placeholder="9876543210"
                                        value={customPhone}
                                        onChange={(e) => setCustomPhone(e.target.value)}
                                        className="text-sm h-10 border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={handleTestPush}
                                    disabled={loading !== null || (!token && !customFcmToken)}
                                    variant="outline"
                                    className="justify-start h-10 border-slate-200 hover:bg-slate-50 text-xs font-medium"
                                >
                                    {loading === "push" ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Bell className="w-3.5 h-3.5 mr-2" />}
                                    Test Push
                                </Button>

                                <Button
                                    onClick={handleTestEmail}
                                    disabled={loading !== null || !customEmail}
                                    variant="outline"
                                    className="justify-start h-10 border-slate-200 hover:bg-slate-50 text-xs font-medium"
                                >
                                    {loading === "email" ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Mail className="w-3.5 h-3.5 mr-2" />}
                                    Test Email
                                </Button>

                                <Button
                                    onClick={handleTestSMS}
                                    disabled={loading !== null || !customPhone}
                                    variant="outline"
                                    className="justify-start h-10 border-slate-200 hover:bg-slate-50 text-xs font-medium"
                                >
                                    {loading === "sms" ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Smartphone className="w-3.5 h-3.5 mr-2" />}
                                    Test SMS
                                </Button>

                                <Button
                                    onClick={handleTestWhatsApp}
                                    disabled={loading !== null || !customPhone}
                                    variant="outline"
                                    className="justify-start h-10 border-slate-200 hover:bg-slate-50 text-xs font-medium"
                                >
                                    {loading === "whatsapp" ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5 mr-2" />}
                                    Test WhatsApp
                                </Button>
                            </div>

                            <Button
                                onClick={handleTestAll}
                                disabled={loading !== null}
                                className="w-full mt-4 h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all active:scale-[0.98]"
                            >
                                {loading === "all" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                Run Full Test Suite
                            </Button>
                        </section>
                    </div>

                    {/* Results Feed */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Activity Log
                            </h2>
                            {results.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={() => setResults([])} className="h-7 text-[10px] text-slate-400 hover:text-red-500 uppercase tracking-widest font-bold">
                                    Clear Log
                                </Button>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className="border border-dashed border-slate-200 rounded-xl p-16 text-center bg-slate-50/50">
                                <Activity className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-sm text-slate-400 font-medium tracking-tight">Listening for test results...</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {results.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`border rounded-xl p-4 flex items-start gap-4 transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${result.success
                                            ? "border-green-100 bg-green-50/30"
                                            : "border-red-100 bg-red-50/30"
                                            }`}
                                    >
                                        <div className={`mt-0.5 p-1.5 rounded-full ${result.success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                            {result.success ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <XCircle className="w-3.5 h-3.5" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md ${result.success ? "bg-white text-green-700" : "bg-white text-red-700"
                                                    } shadow-sm border border-slate-100`}>
                                                    {result.channel}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    {result.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium leading-relaxed">{result.message}</p>
                                            {result.error && (
                                                <p className="text-xs text-red-500/80 mt-1.5 font-medium italic">Err: {result.error}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative py-8">
                    <Separator />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                        <ChevronDown className="w-5 h-5 text-slate-200" />
                    </div>
                </div>

                {/* Token Lookup Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 mb-1">Database Token Lookup</h2>
                            <p className="text-xs text-slate-500">Inspect and manage registered device tokens for any user</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Enter User ID (clerk_xxx...)"
                                value={lookupUserId}
                                onChange={(e) => setLookupUserId(e.target.value)}
                                className="pl-10 text-sm h-10 border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors bg-white font-mono"
                                onKeyDown={(e) => e.key === "Enter" && handleLookupTokens()}
                            />
                        </div>
                        <Button
                            onClick={handleLookupTokens}
                            disabled={lookupLoading || !lookupUserId.trim()}
                            className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                        >
                            {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup Tokens"}
                        </Button>
                    </div>

                    {lookupUser && (
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-400 bg-white">
                            {/* User Info Header */}
                            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-900 block">{lookupUser.name}</span>
                                        {lookupUser.email && (
                                            <span className="text-[11px] text-slate-500 font-medium">{lookupUser.email}</span>
                                        )}
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-white text-[10px] border-slate-200 font-mono py-1">
                                    {lookupUser.id}
                                </Badge>
                            </div>

                            {/* Token Table */}
                            {lookupTokens.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50/30 text-left">
                                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Device Platform</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Activity</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {lookupTokens.map((tokenInfo) => (
                                                <tr key={tokenInfo.id} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-1.5 rounded-md ${tokenInfo.platform === "android" ? "bg-green-50 text-green-600" : tokenInfo.platform === "ios" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                                                                <Smartphone className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-semibold text-slate-900 capitalize">{tokenInfo.platform}</span>
                                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">
                                                                    {tokenInfo.token.substring(0, 32)}...
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[13px] text-slate-600 font-medium">{formatDate(tokenInfo.lastUsedAt)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => copyLookupToken(tokenInfo.token)}
                                                                className="h-8 w-8 p-0 hover:bg-slate-100"
                                                                title="Copy full token"
                                                            >
                                                                <Copy className="w-4 h-4 text-slate-500" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleUseToken(tokenInfo.token)}
                                                                className="h-8 w-8 p-0 hover:bg-slate-100"
                                                                title="Test this device"
                                                            >
                                                                <Send className="w-4 h-4 text-slate-500" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteToken(tokenInfo.id)}
                                                                disabled={deletingToken === tokenInfo.id}
                                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                                                title="Revoke session"
                                                            >
                                                                {deletingToken === tokenInfo.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <Smartphone className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                    <p className="text-sm text-slate-400 font-medium">No active device sessions found for this user.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={`px-2 py-1 rounded inline-flex items-center text-xs font-semibold ${variant === 'secondary' ? 'bg-slate-100 text-slate-800' : 'bg-slate-900 text-white'} ${className}`}>
            {children}
        </span>
    )
}
