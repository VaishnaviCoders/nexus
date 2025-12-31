"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { fetchToken, messaging } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveDeviceToken } from "@/app/actions/device-token";

/**
 * Detect the platform for FCM token storage
 */
function detectPlatform(): 'web' | 'android' | 'ios' {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';

    if (/android/i.test(userAgent)) {
        return 'android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        return 'ios';
    }

    return 'web';
}

/**
 * Wait for service worker to be ready
 */
async function waitForServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return undefined;
    }

    // First try to get existing registration
    let registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
        return registration;
    }

    // Wait for service worker to be ready (max 5 seconds)
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.warn('Service Worker registration timeout');
            resolve(undefined);
        }, 5000);

        navigator.serviceWorker.ready.then((reg) => {
            clearTimeout(timeout);
            resolve(reg);
        }).catch(() => {
            clearTimeout(timeout);
            resolve(undefined);
        });
    });
}

const useFcmToken = () => {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();

    const [notificationPermissionStatus, setNotificationPermissionStatus] =
        useState<NotificationPermission | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const retryCount = useRef(0);
    const isLoading = useRef(false);
    const tokenSavedToServer = useRef(false);
    const lastSavedToken = useRef<string | null>(null);

    /**
     * Save token to server (with duplicate check)
     */
    const saveTokenToServer = useCallback(async (fcmToken: string) => {
        // Skip if not signed in or already saved this token
        if (!isSignedIn || lastSavedToken.current === fcmToken) {
            return;
        }

        try {
            const platform = detectPlatform();
            const result = await saveDeviceToken(fcmToken, platform);

            if (result.success) {
                console.log(`✅ FCM token saved: ${fcmToken.substring(0, 20)}... (${platform})`);
                lastSavedToken.current = fcmToken;
                tokenSavedToServer.current = true;
            } else {
                console.error(`❌ Failed to save FCM token: ${result.error}`);
            }
        } catch (error) {
            console.error('❌ Error saving FCM token:', error);
        }
    }, [isSignedIn]);

    /**
     * Request notification permission and get token
     */
    const requestPermissionAndGetToken = useCallback(async (): Promise<string | null> => {
        // Check if notifications are supported
        if (!("Notification" in window)) {
            console.info("This browser does not support notifications");
            return null;
        }

        // Request permission if not already granted
        if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                console.log("Notification permission denied");
                setNotificationPermissionStatus("denied");
                return null;
            }
        }

        if (Notification.permission === "denied") {
            setNotificationPermissionStatus("denied");
            return null;
        }

        setNotificationPermissionStatus("granted");

        // Wait for service worker to be ready
        await waitForServiceWorker();

        // Fetch the token
        const fcmToken = await fetchToken();
        return fcmToken;
    }, []);

    /**
     * Main token loading function
     */
    const loadToken = useCallback(async () => {
        // Prevent concurrent loading
        if (isLoading.current) {
            console.log('Token loading already in progress...');
            return;
        }

        isLoading.current = true;

        try {
            const fcmToken = await requestPermissionAndGetToken();

            if (!fcmToken) {
                // Retry logic (up to 3 times)
                if (retryCount.current < 3) {
                    retryCount.current += 1;
                    console.log(`Retrying token fetch (${retryCount.current}/3)...`);
                    isLoading.current = false;

                    // Wait a bit before retrying
                    setTimeout(() => loadToken(), 1000 * retryCount.current);
                    return;
                }

                console.error("Failed to get FCM token after 3 retries");
                isLoading.current = false;
                return;
            }

            // Token fetched successfully
            setToken(fcmToken);
            retryCount.current = 0;

            // Save to server if signed in
            if (isSignedIn) {
                await saveTokenToServer(fcmToken);
            }

        } catch (error) {
            console.error("Error loading FCM token:", error);
        } finally {
            isLoading.current = false;
        }
    }, [isSignedIn, requestPermissionAndGetToken, saveTokenToServer]);

    /**
     * Effect: Initialize token when user auth state is loaded
     */
    useEffect(() => {
        // Wait for auth to be loaded
        if (!isLoaded) return;

        // Reset state on logout
        if (!isSignedIn) {
            tokenSavedToServer.current = false;
            lastSavedToken.current = null;
            return;
        }

        // Load token when signed in
        if ("Notification" in window) {
            loadToken();
        }
    }, [isLoaded, isSignedIn, loadToken]);

    /**
     * Effect: Save token to server when user signs in (if token already exists)
     */
    useEffect(() => {
        if (isSignedIn && token && !tokenSavedToServer.current) {
            saveTokenToServer(token);
        }
    }, [isSignedIn, token, saveTokenToServer]);

    /**
     * Effect: Set up foreground message listener
     */
    useEffect(() => {
        if (!token) return;

        let unsubscribe: Unsubscribe | null = null;

        const setupListener = async () => {
            console.log(`Setting up FCM message listener (token: ${token.substring(0, 20)}...)`);

            const m = await messaging();
            if (!m) return null;

            return onMessage(m, (payload) => {
                if (Notification.permission !== "granted") return;

                console.log("Foreground push notification:", payload);
                const link = payload.fcmOptions?.link || payload.data?.link;

                // Show toast notification
                if (link) {
                    toast.info(
                        `${payload.notification?.title}: ${payload.notification?.body}`,
                        {
                            action: {
                                label: "Visit",
                                onClick: () => router.push(link),
                            },
                        }
                    );
                } else {
                    toast.info(
                        `${payload.notification?.title}: ${payload.notification?.body}`
                    );
                }

                // Also show browser notification
                const n = new Notification(
                    payload.notification?.title || "New message",
                    {
                        body: payload.notification?.body || "This is a new message",
                        data: link ? { url: link } : undefined,
                    }
                );

                n.onclick = (event) => {
                    event.preventDefault();
                    const url = (event.target as any)?.data?.url;
                    if (url) {
                        router.push(url);
                    }
                };
            });
        };

        setupListener().then((unsub) => {
            if (unsub) unsubscribe = unsub;
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [token, router]);

    return {
        token,
        notificationPermissionStatus,
        refreshToken: loadToken, // Exposed for manual refresh if needed
    };
};

export default useFcmToken;

