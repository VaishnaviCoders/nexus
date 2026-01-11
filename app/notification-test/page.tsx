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
    lastUsedAt: Date
    createdAt: Date
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
                email: info.email,
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
        setLookupLoading(true)
        try {
            const result = await getUserTokens(userId)
            if (result.success && result.user) {
                setLookupUser(result.user)
                setLookupTokens(result.tokens)
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
        setLookupLoading(true)
        try {
            const result = await getUserTokens(lookupUserId)
            if (result.success && result.user) {
                setLookupUser(result.user)
                setLookupTokens(result.tokens)
                if (result.tokens.length === 0) {
                    toast.info("No tokens found for this user")
                }
            } else {
                toast.error(result.error || "Failed to lookup tokens")
                setLookupUser(null)
                setLookupTokens([])
            }
        } catch (error) {
            toast.error("Failed to lookup tokens")
        } finally {
            setLookupLoading(false)
        }
    }

    const handleDeleteToken = async (tokenId: string) => {
        setDeletingToken(tokenId)
        try {
            const result = await deleteDeviceToken(tokenId)
            if (result.success) {
                setLookupTokens((prev) => prev.filter((t) => t.id !== tokenId))
                toast.success("Token deleted")
            } else {
                toast.error(result.error || "Failed to delete token")
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
                message: result.message || (result.success ? "Push sent" : "Push failed"),
                error: result.error,
            })
            if (result.success) {
                toast.success("Push notification sent!")
            } else {
                toast.error(result.error || "Push notification failed")
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
                message: result.message || (result.success ? "Email sent" : "Email failed"),
                error: result.error,
            })
            if (result.success) {
                toast.success("Test email sent!")
            } else {
                toast.error(result.error || "Email sending failed")
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
                message: result.message || (result.success ? "SMS sent" : "SMS failed"),
                error: result.error,
            })
            if (result.success) {
                toast.success("Test SMS sent!")
            } else {
                toast.error("SMS sending failed")
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
                message: result.message || (result.success ? "WhatsApp sent" : "WhatsApp failed"),
                error: result.error,
            })
            if (result.success) {
                toast.success("Test WhatsApp sent!")
            } else {
                toast.error(result.error || "WhatsApp sending failed")
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
            result.results.forEach((r) =>
                addResult({
                    channel: r.channel,
                    success: r.success,
                    message: r.message,
                    error: r.error,
                })
            )
            toast.success(`Tested ${result.summary.success}/${result.summary.total} channels`)
        } catch (error) {
            toast.error("Failed to test all channels")
        } finally {
            setLoading(null)
        }
    }

    const formatDate = (date: Date) => {
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
                    <p className="text-slate-500 text-sm">Test all notification channels</p>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Permission</span>
                            <div className={`w-2 h-2 rounded-full ${notificationPermissionStatus === "granted" ? "bg-green-500" : "bg-slate-300"}`} />
                        </div>
                        <p className="text-sm font-medium text-slate-900">{notificationPermissionStatus || "Unknown"}</p>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Devices</span>
                            <Button variant="ghost" size="sm" onClick={loadUserInfo} className="h-5 w-5 p-0">
                                <RefreshCw className="w-3 h-3" />
                            </Button>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{userInfo.deviceCount || 0} registered</p>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current Token</span>
                            {token && (
                                <Button variant="ghost" size="sm" onClick={copyToken} className="h-5 w-5 p-0">
                                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            )}
                        </div>
                        <p className="text-sm font-medium text-slate-900 font-mono truncate">
                            {token ? `${token.substring(0, 20)}...` : "No token"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                    {/* Configuration */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-sm font-medium text-slate-900 mb-4">Configuration</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">FCM Token</label>
                                    <Input
                                        placeholder="Enter FCM token to test..."
                                        value={customFcmToken}
                                        onChange={(e) => setCustomFcmToken(e.target.value)}
                                        className="text-sm font-mono h-9 border-slate-200"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Leave empty to use your registered devices</p>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email</label>
                                    <Input
                                        placeholder="your@email.com"
                                        value={customEmail}
                                        onChange={(e) => setCustomEmail(e.target.value)}
                                        className="text-sm h-9 border-slate-200"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Phone</label>
                                    <Input
                                        placeholder="9876543210"
                                        value={customPhone}
                                        onChange={(e) => setCustomPhone(e.target.value)}
                                        className="text-sm h-9 border-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Button
                                onClick={handleTestPush}
                                disabled={loading !== null || (!token && !customFcmToken)}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start h-9 border-slate-200"
                            >
                                {loading === "push" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bell className="w-4 h-4 mr-2" />}
                                Test Push
                            </Button>

                            <Button
                                onClick={handleTestEmail}
                                disabled={loading !== null || !customEmail}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start h-9 border-slate-200"
                            >
                                {loading === "email" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                                Test Email
                            </Button>

                            <Button
                                onClick={handleTestSMS}
                                disabled={loading !== null || !customPhone}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start h-9 border-slate-200"
                            >
                                {loading === "sms" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Smartphone className="w-4 h-4 mr-2" />}
                                Test SMS
                            </Button>

                            <Button
                                onClick={handleTestWhatsApp}
                                disabled={loading !== null || !customPhone}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start h-9 border-slate-200"
                            >
                                {loading === "whatsapp" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                                Test WhatsApp
                            </Button>

                            <Separator className="my-3" />

                            <Button
                                onClick={handleTestAll}
                                disabled={loading !== null}
                                size="sm"
                                className="w-full h-9 bg-slate-900 hover:bg-slate-800"
                            >
                                {loading === "all" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                Test All Channels
                            </Button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3">
                        <h2 className="text-sm font-medium text-slate-900 mb-4">
                            Results {results.length > 0 && <span className="text-slate-400">({results.length})</span>}
                        </h2>

                        {results.length === 0 ? (
                            <div className="border border-dashed border-slate-200 rounded-lg p-12 text-center">
                                <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">No tests run yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {results.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`border rounded-lg p-3 flex items-start gap-3 ${result.success
                                            ? "border-green-200 bg-green-50/50"
                                            : "border-red-200 bg-red-50/50"
                                            }`}
                                    >
                                        {result.success ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {result.channel}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {result.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700">{result.message}</p>
                                            {result.error && (
                                                <p className="text-xs text-slate-500 mt-0.5">{result.error}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Token Lookup Section */}
                <div>
                    <h2 className="text-sm font-medium text-slate-900 mb-4">Token Lookup</h2>
                    <p className="text-xs text-slate-500 mb-4">Look up registered device tokens by User ID</p>

                    <div className="flex gap-2 mb-6">
                        <Input
                            placeholder="Enter User ID..."
                            value={lookupUserId}
                            onChange={(e) => setLookupUserId(e.target.value)}
                            className="text-sm h-9 border-slate-200 max-w-md font-mono"
                            onKeyDown={(e) => e.key === "Enter" && handleLookupTokens()}
                        />
                        <Button
                            onClick={handleLookupTokens}
                            disabled={lookupLoading || !lookupUserId.trim()}
                            size="sm"
                            className="h-9"
                        >
                            {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </Button>
                    </div>

                    {lookupUser && (
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            {/* User Info Header */}
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-900">{lookupUser.name}</span>
                                    {lookupUser.email && (
                                        <span className="text-xs text-slate-500">({lookupUser.email})</span>
                                    )}
                                </div>
                            </div>

                            {/* Token Table */}
                            {lookupTokens.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left">
                                            <th className="px-4 py-2 text-xs font-medium text-slate-500 uppercase">Device</th>
                                            <th className="px-4 py-2 text-xs font-medium text-slate-500 uppercase">Last Used</th>
                                            <th className="px-4 py-2 text-xs font-medium text-slate-500 uppercase text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lookupTokens.map((tokenInfo) => (
                                            <tr key={tokenInfo.id} className="border-b border-slate-100 last:border-0">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-900 capitalize">{tokenInfo.platform}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">
                                                        {tokenInfo.token.substring(0, 24)}...
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {formatDate(tokenInfo.lastUsedAt)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => copyLookupToken(tokenInfo.token)}
                                                            className="h-7 w-7 p-0"
                                                            title="Copy token"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleUseToken(tokenInfo.token)}
                                                            className="h-7 w-7 p-0"
                                                            title="Use for testing"
                                                        >
                                                            <Send className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteToken(tokenInfo.id)}
                                                            disabled={deletingToken === tokenInfo.id}
                                                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            title="Delete token"
                                                        >
                                                            {deletingToken === tokenInfo.id ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center">
                                    <Smartphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">No device tokens registered</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
