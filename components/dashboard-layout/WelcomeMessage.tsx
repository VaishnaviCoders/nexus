'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WelcomeMessageProps {
  userName: string;
  lastVisit: Date | null;
}

export function WelcomeMessage({ userName, lastVisit }: WelcomeMessageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const now = new Date();
    const storedVisibility = localStorage.getItem('welcomeMessageSeen');

    // If the welcome message has already been seen (stored in localStorage), don't show it again
    if (storedVisibility === 'true') {
      setIsVisible(false);
      return;
    }

    // Set the appropriate message based on the user's last visit
    if (!lastVisit) {
      setMessage(
        `Welcome to our school dashboard, ${userName}! We're excited to have you here.`
      );
    } else {
      const daysSinceLastVisit = Math.floor(
        (now.getTime() - lastVisit.getTime()) / (1000 * 3600 * 24)
      );
      if (daysSinceLastVisit > 30) {
        setMessage(
          `Welcome back, ${userName}! It's been a while. We've missed you!`
        );
      } else {
        setMessage(
          `Welcome back, ${userName}! Ready for another productive day?`
        );
      }
    }

    // Set the message visibility to false after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('welcomeMessageSeen', 'true'); // Mark the message as seen
    }, 5000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [userName, lastVisit]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg"
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 text-white hover:text-gray-200"
          aria-label="Close welcome message"
        >
          <X size={20} />
        </button>
        <h2 className="mb-2 text-xl font-bold">{message}</h2>
        <p className="text-sm">
          Explore your dashboard to stay updated with the latest school
          activities and announcements.
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
