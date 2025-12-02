import { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://www.shiksha.cloud'),

    title: 'Terms and Conditions - Shiksha.cloud',
    description: 'Terms and Conditions for Shiksha.cloud school management platform.',
    keywords: [
        'school management software',
        'student information system',
        'fee management',
        'attendance tracker',
        'Shiksha cloud CRM',
    ],
};
export default function TermsAndConditions() {
    return (

        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>

            <p className="text-sm text-gray-600 mb-8">Last Updated: December 2, 2025</p>

            <div className="space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Service Description</h2>
                    <p>Shiksha.cloud provides a cloud-based school management platform that enables schools to manage student attendance, fee collection, parent communication, and administrative tasks. The service is available in English only.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Subscription and Payment</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Subscription fee is ₹79 per student per month</li>
                        <li>Payment is processed through PhonePe payment gateway</li>
                        <li>Schools pay based on actual student count enrolled</li>
                        <li>Payment gateway charges (1-2%) apply on transactions</li>
                        <li>No setup fees or hidden charges</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Schools must provide accurate student and staff information</li>
                        <li>Users must maintain confidentiality of login credentials</li>
                        <li>Schools are responsible for data accuracy entered into the system</li>
                        <li>Users must comply with applicable data protection laws</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Service Availability</h2>
                    <p>While we strive for 99.9% uptime, Shiksha.cloud does not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance. The platform works on basic 3G/4G connectivity with offline functionality for attendance marking.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Ownership and Security</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Schools retain ownership of all data entered into the platform</li>
                        <li>We implement industry-standard security measures to protect data</li>
                        <li>Data is stored on secure cloud servers</li>
                        <li>We do not share school data with third parties without consent</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Termination</h2>
                    <p>Either party may terminate the subscription with 30 days written notice. Upon termination, schools can export their data. No refunds will be provided for partial months.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
                    <p>Shiksha.cloud shall not be liable for indirect, incidental, or consequential damages arising from use of the platform. Our total liability is limited to the subscription fees paid in the preceding 3 months.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Modifications to Terms</h2>
                    <p>We reserve the right to modify these terms with 30 days notice to subscribed schools. Continued use of the service constitutes acceptance of modified terms.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
                    <p>For questions regarding these terms, please contact us through the support channels provided in your school dashboard or via email.</p>
                </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    By using Shiksha.cloud, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
            </div>
        </div>
    );
}