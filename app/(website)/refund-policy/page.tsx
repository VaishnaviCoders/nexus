import { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://www.shiksha.cloud'),

    title: 'Refund Policy - Shiksha.cloud',
    description: 'Refund policy for Shiksha.cloud subscription and payment services',
    keywords: [
        'school management software',
        'student information system',
        'fee management',
        'attendance tracker',
        'Shiksha cloud CRM',
        'refund policy',
        'payment refund',
    ],
};

export default function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>

            <p className="text-sm text-gray-600 mb-8">Last Updated: December 2, 2025</p>

            <div className="space-y-6 text-gray-700">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Subscription Fees</h2>
                    <p>Shiksha.cloud charges ₹79 per student per month on a pay-as-you-scale model. Subscription fees are non-refundable once the billing period has commenced.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Fee Payment Transactions</h2>
                    <p>For fee payments processed through the platform:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Parents paying school fees via PhonePe gateway - refunds are subject to individual school policies</li>
                        <li>Failed or duplicate transactions will be automatically refunded within 5-7 business days</li>
                        <li>Payment gateway charges are non-refundable</li>
                        <li>Refund requests must be initiated within 48 hours of transaction</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Service Cancellation</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>No refunds for partial month usage if subscription is cancelled mid-month</li>
                        <li>Schools must provide 30 days notice for cancellation</li>
                        <li>Access continues until end of paid billing period</li>
                        <li>Data export facilities available before service termination</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Technical Issues</h2>
                    <p>In case of prolonged service downtime exceeding 48 continuous hours due to platform issues:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Pro-rated credit may be issued to school account</li>
                        <li>Downtime must be reported within 7 days</li>
                        <li>Credits are non-transferable and must be used within subscription period</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Process</h2>
                    <p>Eligible refunds will be processed as follows:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Refund request submitted through support channels</li>
                        <li>Review and approval within 7 business days</li>
                        <li>Refund credited to original payment method within 10-14 business days</li>
                        <li>Confirmation sent via email and WhatsApp</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Disputes</h2>
                    <p>For payment disputes or refund clarifications, schools can contact support through:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Email support from school admin dashboard</li>
                        <li>WhatsApp support channel</li>
                        <li>All disputes will be resolved within 15 business days</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Exceptions</h2>
                    <p className="mb-2">No refunds will be provided for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Change of mind after subscription payment</li>
                        <li>Lack of usage or adoption by school staff</li>
                        <li>Connectivity issues on user end</li>
                        <li>Device compatibility issues</li>
                        <li>Violation of terms of service leading to account suspension</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact for Refunds</h2>
                    <p>To request a refund or clarify our refund policy, please contact our support team through the channels provided in your school admin dashboard. Include transaction details and reason for refund request.</p>
                </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    This refund policy is part of our Terms and Conditions. By using Shiksha.cloud services, you agree to this refund policy.
                </p>
            </div>
        </div>
    );
}