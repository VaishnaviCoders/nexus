import { CallToAction } from "@/components/websiteComp/cta";
import AttendanceTracker from "@/components/websiteComp/features/attendance-tracker";
import { CheckCircle2, Clock, Smartphone, Zap, ShieldCheck, Users } from "lucide-react";

export default function AttendanceFeaturePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* 1. Hero Section */}
            <section className="pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                        <Zap size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Go Live in 24 Hours</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                        The <span className="text-emerald-600">2-Tap</span> Attendance Revolution
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                        Stop wasting 20 minutes on paper registers. Save 2.5 hours daily per teacher with real-time sync to parents and automated school records.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg">
                            Book a 10-Min Demo
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all">
                            View Pricing — ₹79/student
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Interactive Component Section */}
            <section className="py-12 px-4 md:px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Interactive Preview</span>
                        <h2 className="text-2xl font-bold text-slate-900">Experience the Workflow</h2>
                    </div>
                    <AttendanceTracker />
                </div>
            </section>

            {/* 3. Core Benefits Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">The Frictionless Digital Upgrade</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <BenefitCard
                            icon={<Clock className="text-amber-600" size={28} />}
                            title="Lightning-Fast Log"
                            description="Tap. Tap. Done. Mark attendance for 60 students in under 10 seconds."
                            colorClass="bg-amber-50"
                        />
                        <BenefitCard
                            icon={<Smartphone className="text-blue-600" size={28} />}
                            title="Instant Trust Loop"
                            description="Parents know instantly via WhatsApp. Eliminate confusion and build 100% transparency."
                            colorClass="bg-blue-50"
                        />
                        <BenefitCard
                            icon={<ShieldCheck className="text-emerald-600" size={28} />}
                            title="Audit-Proof Data"
                            description="Govt-compliant reports on demand. No more end-of-month tallying nightmares."
                            colorClass="bg-emerald-50"
                        />
                        <BenefitCard
                            icon={<Zap className="text-rose-600" size={28} />}
                            title="Hardware-Free Start"
                            description="Forget expensive biometric machines. Works beautifully on any teacher's phone."
                            colorClass="bg-rose-50"
                        />
                    </div>
                </div>
            </section>

            {/* 4. The "Why Shiksha.cloud" Section */}
            <section className="py-20 bg-slate-900 text-white rounded-[3rem] mx-4 mb-20 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed for the Indian Classroom</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                                We know your teachers aren't IT experts. That's why we built Shiksha.cloud to be as easy as WhatsApp. If they can send a message, they can use this system.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Works on basic 3G/4G connections",
                                    "No hardware investment required",
                                    "Support for 50+ year old teachers",
                                    "99% Parent Satisfaction rate"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 size={20} className="text-emerald-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-bold mb-4">Real Impact in Numbers</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-3xl font-bold text-emerald-400">92%</div>
                                    <div className="text-sm text-slate-400">Faster data access</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-emerald-400">20+ min</div>
                                    <div className="text-sm text-slate-400">Saved daily per teacher</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-emerald-400">80%</div>
                                    <div className="text-sm text-slate-400">Fewer parent queries</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-emerald-400">₹0</div>
                                    <div className="text-sm text-slate-400">Setup fees</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CallToAction />
        </div>
    );
}

function BenefitCard({ icon, title, description, colorClass }: { icon: React.ReactNode, title: string, description: string, colorClass: string }) {
    return (
        <div className={`flex flex-col items-center text-center p-8 rounded-[2rem] ${colorClass} transition-transform hover:scale-105 duration-300`}>
            <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center mb-6 shadow-sm backdrop-blur-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
        </div>
    );
}