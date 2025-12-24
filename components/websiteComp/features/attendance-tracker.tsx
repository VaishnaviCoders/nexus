"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Database, Bell, GraduationCap, CheckCircle2, ShieldCheck, Activity, Sun, Moon } from 'lucide-react';

const AttendanceTracker = () => {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'completed'>('idle');
    const [logs, setLogs] = useState<string[]>(["System initialized...", "Awaiting teacher input..."]);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const styles = {
        bg: theme === 'dark' ? 'bg-[#050505]' : 'bg-[#f8fafc]',
        cardBg: theme === 'dark' ? 'bg-black/40' : 'bg-white/60',
        borderColor: theme === 'dark' ? 'border-white/10' : 'border-slate-200',
        textMain: theme === 'dark' ? 'text-white' : 'text-slate-900',
        textMuted: theme === 'dark' ? 'text-zinc-500' : 'text-slate-500',
        gridColor: theme === 'dark' ? '#334155' : '#cbd5e1',
        nodeBase: theme === 'dark' ? 'bg-zinc-900/50' : 'bg-white',
        beamBase: theme === 'dark' ? 'bg-zinc-800/50' : 'bg-slate-200',
        terminalBg: theme === 'dark' ? 'bg-black/40' : 'bg-slate-100',
        terminalBorder: theme === 'dark' ? 'border-white/5' : 'border-slate-200',
        terminalText: theme === 'dark' ? 'text-zinc-400' : 'text-slate-600',
    };

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    const startSync = () => {
        setStatus('syncing');
        addLog("Teacher signed: Grade 10-A");

        setTimeout(() => addLog("Encrypting attendance packet..."), 800);
        setTimeout(() => addLog("Pushing to School Records DB..."), 1600);

        setTimeout(() => {
            setStatus('completed');
            addLog("Success: 28 Parents notified via SMS/Push.");
        }, 2800);
    };

    // Helper to get consistent inactive icon color
    const getInactiveIconColor = () => theme === 'dark' ? "text-zinc-600" : "text-slate-300";

    return (
        <div className={`relative min-h-[650px] w-full ${styles.bg} p-6 md:p-12 overflow-hidden rounded-[2.5rem] border ${styles.borderColor} shadow-2xl transition-colors duration-500`}>

            {/* 1. Background Visuals */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `radial-gradient(${styles.gridColor} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
            {/* Ambient Orbs - Colored based on theme */}
            <div className={`absolute top-0 left-1/4 w-96 h-96 ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-400/20'} blur-[120px] rounded-full transition-colors duration-500`} />
            <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-400/20'} blur-[120px] rounded-full transition-colors duration-500`} />

            {/* 2. OS Controls (Theme Switcher) */}
            <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0 mb-12">
                <div className="w-full md:w-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500 font-bold">Attendance System v2.0</span>
                    </div>
                    <h2 className={`text-3xl font-bold tracking-tight ${styles.textMain} transition-colors duration-500`}>Automated Attendance Flow</h2>
                    <p className={`text-sm mt-1 ${styles.textMuted} transition-colors duration-500`}>From classroom entry to parent notification in seconds.</p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`p-3 rounded-xl border ${styles.borderColor} ${styles.cardBg} backdrop-blur-md hover:scale-110 transition-all shadow-sm`}
                    >
                        {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
                    </button>
                    <StudentIDCard theme={theme} />
                </div>
            </div>


            {/* 3. The Main Flow Orchestration */}
            <div className="relative z-10 flex flex-col items-center justify-center py-12">
                <div className="flex w-full justify-between items-center max-w-4xl">
                    <Node
                        theme={theme}
                        icon={<UserCheck size={28} className={status !== 'idle' ? "text-emerald-500" : getInactiveIconColor()} />}
                        label="Admin/Teacher Entry"
                        sub="Present/Absent/Late"
                        isActive={status !== 'idle'}
                        isDone={status === 'completed'}
                    />

                    <Beam status={status} delay={0} theme={theme} />

                    <Node
                        theme={theme}
                        icon={<Database size={28} className={status === 'completed' ? "text-blue-500" : getInactiveIconColor()} />}
                        label="Central DB"
                        sub="Notes & History Sync"
                        isActive={status === 'syncing'}
                        isDone={status === 'completed'}
                    />

                    <Beam status={status} delay={1} theme={theme} />

                    <Node
                        theme={theme}
                        icon={<Bell size={28} className={status === 'completed' ? "text-amber-500" : getInactiveIconColor()} />}
                        label="Instant Alerts"
                        sub="Push to Parent/Student"
                        isActive={status === 'completed'}
                        isDone={status === 'completed'}
                    />
                </div>


            </div>

            {/* 4. Bottom Section: Controls & Terminal */}
            <div className="relative z-10 mt-16 flex flex-col md:flex-row gap-8 items-center md:items-end justify-between">
                {/* System Logs (Terminal Aesthetic) */}
                <div className={`w-full max-w-sm font-mono text-[11px] ${styles.terminalBg} border ${styles.terminalBorder} rounded-xl p-4 backdrop-blur-md transition-colors duration-500`}>
                    <div className={`flex gap-2 mb-3 border-b ${styles.terminalBorder} pb-2`}>
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    </div>
                    {logs.map((log, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className={`mb-1 ${styles.terminalText}`}>
                            <span className="text-emerald-500/50 mr-2">{'>'}</span> {log}
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={startSync}
                        disabled={status === 'syncing'}
                        className={`group relative w-full md:w-auto px-10 max-sm:px-4 max-sm:py-3 py-4 ${theme === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white'} rounded-full font-bold overflow-hidden transition-all hover:pr-14 active:scale-95 disabled:opacity-50 shadow-lg`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {status === 'idle' ? 'Simulate Real Submission' : status === 'syncing' ? 'Processing...' : 'Submission Complete'}
                            {status === 'completed' && <CheckCircle2 size={18} />}
                        </span>
                    </button>
                    {status === 'completed' && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-xs ${styles.textMuted} flex items-center gap-2`}>
                            <ShieldCheck size={14} className="text-emerald-500" /> Securely stored in cloud
                        </motion.span>
                    )}
                </div>
            </div>
            {/* <ParentNotification show={status === 'completed'} theme={theme} /> */}
        </div>
    );
};

// --- Improved Components ---

const LivePulse = () => (
    <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
    </span>
);

const ParentNotification = ({ show, theme }: { show: boolean, theme: 'dark' | 'light' }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ x: 300, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-12 right-12 z-50 w-72 h-auto"
            >
                {/* Mobile Notification Glass */}
                <div className={`relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-colors duration-500
                    ${theme === 'dark'
                        ? 'border-white/20 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                        : 'border-slate-200 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
                    }`}>
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-blue-500" />

                    <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-500
                            ${theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                            <GraduationCap className={theme === 'dark' ? "text-emerald-400" : "text-emerald-600"} size={20} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>School ecords</span>
                                <span className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>Just now</span>
                            </div>
                            <h4 className={`text-sm font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Attendance Verified</h4>
                            <p className={`text-xs leading-relaxed mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                                Priyanka Patil has been marked **Present** for 1st Period (Mathematics).
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 4 }}
                                className="h-full bg-emerald-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Subtle glow behind the phone notification */}
                <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl -z-10" />
            </motion.div>
        )}
    </AnimatePresence>
);
const StudentIDCard = ({ theme }: { theme: 'dark' | 'light' }) => (
    <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`w-48 h-24 rounded-2xl border p-3 flex flex-col justify-between backdrop-blur-md shadow-xl transition-colors duration-500
            ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-slate-200'}`}
    >
        <div className="flex justify-between items-start">
            <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-600'}`}>
                <GraduationCap size={16} />
            </div>
            <div className={`h-1.5 w-8 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>
        <div>
            <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-600' : 'text-slate-400'} uppercase tracking-tighter`}>Priyanka Patil</p>
            <div className="flex justify-between items-center mt-0.5">
                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Grade 10-A</span>
                <Activity size={12} className={theme === 'dark' ? "text-emerald-500" : "text-emerald-600"} />
            </div>
        </div>
    </motion.div>
);

const Node = ({ icon, label, isActive, isDone, theme, sub }: { icon: React.ReactNode, label: string, sub: string, isActive: boolean, isDone: boolean, theme: 'dark' | 'light' }) => (
    <div className="flex flex-col items-center gap-3">
        <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Animated Outer Rings */}
            {isActive && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl border border-emerald-500/30"
                />
            )}

            <div className={`relative z-10 h-full w-full rounded-3xl border flex items-center justify-center transition-all duration-700 
                ${isDone
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : isActive
                        ? `${theme === 'dark' ? 'bg-white/10 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'bg-white border-slate-300 shadow-[0_0_30px_rgba(0,0,0,0.05)]'} scale-110`
                        : `${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'}`
                }`}>
                {icon}
            </div>
        </div>
        <span className={`text-[11px] font-mono uppercase tracking-[0.15em] transition-colors duration-500 
            ${isDone || isActive
                ? (theme === 'dark' ? 'text-white' : 'text-slate-900')
                : (theme === 'dark' ? 'text-zinc-600' : 'text-slate-300')
            }`}>
            {label}
        </span>
        <span className="text-[9px] text-zinc-500">{sub}</span>

    </div>
);

const Beam = ({ status, delay, theme }: { status: string, delay: number, theme: 'dark' | 'light' }) => (
    <div className="flex-1 px-4 relative h-[2px]">
        <div className={`absolute inset-0 transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-800/50' : 'bg-slate-200'}`} />
        <AnimatePresence>
            {status === 'syncing' && (
                <motion.div
                    initial={{ left: '-10%', opacity: 0 }}
                    animate={{ left: '110%', opacity: [0, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: delay, ease: "circIn" }}
                    className="absolute top-1/2 -translate-y-1/2 h-full w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                />
            )}
        </AnimatePresence>
    </div>
);



export default AttendanceTracker;