// app/contact-us/page.tsx
import { Metadata } from "next";
import { MessageSquare, Phone, MapPin, Rocket, Bell } from "lucide-react";
import ContactForm from "@/components/websiteComp/shared/contact-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    metadataBase: new URL('https://www.shiksha.cloud'),
    title: 'Contact Us - Shiksha.cloud',
    description: 'Get in touch with Shiksha.cloud for demos, onboarding assistance, or product inquiries',
    keywords: [
        'school management software',
        'student information system',
        'fee management',
        'attendance tracker',
        'Shiksha cloud CRM',
        'contact support',
        'demo request',
    ],
};

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <Badge variant={"outline"} className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        SHIKSHA.CLOUD CONTACT
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                        Get in touch with us today!
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Contact our sales and support teams for demos, onboarding assistance, or any product inquiries.
                    </p>
                </div>



                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Message Us Card */}
                    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                            <MessageSquare className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Message us</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Message us using our online chat system for quick and efficient support.
                        </p>
                        <a
                            href="mailto:sameerkad2001@gmail.com"
                            className="text-gray-900 font-medium hover:text-gray-600 transition-colors inline-flex items-center group"
                        >
                            sameerkad2001@gmail.com
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>

                    {/* Call Us Card */}
                    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                            <Phone className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Call us</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Let's have a chat – there's nothing quite like talking to another person.
                        </p>
                        <a
                            href="tel:+918459324821"
                            className="text-gray-900 font-medium hover:text-gray-600 transition-colors inline-flex items-center group"
                        >
                            +91 84593 24821
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>

                    {/* Address Card */}
                    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                            <MapPin className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Address</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            We'd be delighted to welcome you to our Head Office.
                        </p>
                        <p className="text-gray-900 font-medium">
                            Nakhate Vasti, Pune, Maharashtra, PIN: 411017
                        </p>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Column - Info */}
                        <div className="p-8 md:p-12 lg:p-16 bg-gradient-to-br from-gray-50 to-white">
                            <div className="flex items-center justify-center
              h-14 w-14 rounded-full mb-8
 bg-[radial-gradient(circle_at_center,_#ffe4e4_0%,_#ffffff_65%)]
               shadow-[0_0_20px_rgba(255,137,115,0.35)]">
                                <Rocket className="text-red-300" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                Feel free to send our friendly team a message
                            </h2>

                            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                                Message us using our online chat system for quick and efficient support.
                            </p>

                            <div className="space-y-4 mb-12">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="ml-3 text-gray-700 font-medium">Go live in 24 hours</span>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="ml-3 text-gray-700 font-medium">No technical knowledge needed</span>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="ml-3 text-gray-700 font-medium">₹79/student/month pricing</span>
                                </div>
                            </div>

                            {/* Merchant Info */}
                            <div className="pt-8 border-t border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                    Merchant Legal Information
                                </p>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><span className="font-semibold text-gray-900">Entity:</span> SAMEER DNYANESHWAR KAD</p>
                                    <p><span className="font-semibold text-gray-900">Registered:</span> Nakhate Vasti, Pune, MH 411017</p>
                                    <p className="text-xs text-gray-400 mt-4">Last updated: 02-12-2025</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <div className="p-8 md:p-12 lg:p-16">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

