import { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://shiksha.cloud'),

    title: 'Privacy Policy - Shiksha.cloud',
    description: 'Privacy policy for Shiksha.cloud - how we collect, use, and protect your data',
    keywords: [
        'school management software',
        'student information system',
        'fee management',
        'attendance tracker',
        'Shiksha cloud CRM',
    ],
};
export default function PrivacyPolicy() {
    return (

        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

            <p className="text-sm text-gray-600 mb-8">Last Updated: December 2, 2025</p>

            <div className="space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                    <p className="mb-2">Shiksha.cloud collects the following information to provide school management services:</p>

                    <h3 className="font-semibold mt-4 mb-2">School Administrative Data:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>School name, address, contact information</li>
                        <li>Teacher names, contact details, assigned subjects</li>
                        <li>Grade, section, and subject configurations</li>
                        <li>Holiday calendars and school notices</li>
                    </ul>

                    <h3 className="font-semibold mt-4 mb-2">Student Information:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Student name, date of birth, enrollment details</li>
                        <li>Attendance records (daily tracking)</li>
                        <li>Fee payment history and transaction details</li>
                        <li>Uploaded documents (Aadhaar, Transfer Certificate, Birth Certificate)</li>
                    </ul>

                    <h3 className="font-semibold mt-4 mb-2">Parent Information:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Parent name, phone number, email address</li>
                        <li>Relationship to student</li>
                        <li>Communication preferences</li>
                    </ul>

                    <h3 className="font-semibold mt-4 mb-2">Payment Information:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Transaction IDs and payment status</li>
                        <li>Payment method used (UPI, cards, net banking)</li>
                        <li>Payment gateway handles sensitive financial data - we do not store card details</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide school management services (attendance tracking, fee management)</li>
                        <li>Send notifications via SMS, WhatsApp, and Email for attendance alerts and announcements</li>
                        <li>Process fee payments securely through PhonePe payment gateway</li>
                        <li>Generate attendance reports and analytics for school administrators</li>
                        <li>Provide parent portal access for real-time information</li>
                        <li>Facilitate anonymous complaint submissions</li>
                        <li>Improve platform functionality and user experience</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage and Security</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All data is stored on secure cloud servers with encryption</li>
                        <li>Industry-standard security measures protect against unauthorized access</li>
                        <li>Regular security audits and updates are performed</li>
                        <li>Access is restricted through role-based permissions (admin, teacher, parent, student)</li>
                        <li>Data backups are maintained to prevent loss</li>
                        <li>Offline data is cached locally and synced when connectivity is restored</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing and Disclosure</h2>
                    <p className="mb-2">We do NOT sell or rent your personal information. We may share data only in these circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>With payment gateway (PhonePe) to process fee transactions</li>
                        <li>With communication service providers (SMS, WhatsApp, Email) to deliver notifications</li>
                        <li>When required by law or legal process</li>
                        <li>To protect rights, property, or safety of Shiksha.cloud, users, or public</li>
                        <li>With school administrators who have legitimate access rights</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Student and school data is retained for the duration of active subscription</li>
                        <li>After subscription cancellation, schools can export their data</li>
                        <li>Data is permanently deleted 90 days after subscription termination</li>
                        <li>Transaction records are retained as per financial compliance requirements</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
                    <p className="mb-2">Schools and users have the following rights:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access: View all data stored about students, teachers, and parents</li>
                        <li>Correction: Update or correct inaccurate information</li>
                        <li>Deletion: Request deletion of specific data (subject to legal requirements)</li>
                        <li>Export: Download complete data in CSV format before termination</li>
                        <li>Opt-out: Parents can opt-out of non-essential communications</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Children's Privacy</h2>
                    <p>Shiksha.cloud is designed for use by schools managing student data. We collect student information only through authorized school administrators and with parental awareness. We do not knowingly collect information directly from children without school and parental involvement.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Anonymous Complaints</h2>
                    <p>Our anonymous complaint system allows students and parents to submit feedback without revealing identity. These complaints are accessible only to authorized school administrators and are used solely for improving school operations.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Cookies and Tracking</h2>
                    <p>We use essential cookies for:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Maintaining user login sessions</li>
                        <li>Remembering user preferences</li>
                        <li>Analyzing platform usage to improve services</li>
                    </ul>
                    <p className="mt-2">We do not use third-party advertising cookies.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to Privacy Policy</h2>
                    <p>We may update this privacy policy periodically. Schools will be notified of significant changes via email and dashboard notifications at least 30 days in advance. Continued use of the platform constitutes acceptance of updated policy.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
                    <p>For privacy-related questions, data access requests, or concerns, please contact us through:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Email support from school admin dashboard</li>
                        <li>WhatsApp support channel</li>
                        <li>Support chat feature within the platform</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Compliance</h2>
                    <p>Shiksha.cloud complies with applicable Indian data protection laws and regulations. Schools using our platform are responsible for ensuring their own compliance with local data protection requirements when collecting and managing student data.</p>
                </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    By using Shiksha.cloud, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your information as described herein.
                </p>
            </div>
        </div>

    );
}