import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PolicyPage() {
  const { type } = useParams();

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Client Confidentiality & Data Stewardship',
      content: `At THREAD & CO., we hold the privacy of our clientele in the highest regard. This Privacy Policy details our practices concerning the collection, storage, and protection of your personal information.

1. Information We Collect
We collect personal credentials necessary to process and fulfill your bespoke and ready-to-wear orders, including full name, shipping destination, contact telephone, and email address. When you subscribe to our Private Gazette, we securely preserve your email address.

2. Purpose of Data Processing
Your data is exclusively utilized to:
• Validate and dispatch your orders via insured luxury courier partners.
• Communicate order status, tracking updates, and delivery confirmations.
• Provide tailored styling recommendations and invitations upon your explicit request.

3. Data Security & Storage
We never sell, rent, or lease client data to third-party marketing entities. All database transactions are encrypted using industry-standard cryptographic protocols in strict compliance with global data protection frameworks (GDPR and CCPA).

4. Contact Our Data Protection Officer
For inquiries regarding the retention or deletion of your personal records, contact us directly at privacy@threadandco.com.`,
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Atelier Commercial Agreement',
      content: `Welcome to THREAD & CO. By perusing or acquiring pieces from our digital atelier, you agree to adhere to the following contractual terms.

1. Garment Availability & Sizing
All ready-to-wear garments are cut in limited batches. We endeavor to reflect real-time inventory precision on each piece's product display. In the rare event of inventory exhaustion during simultaneous transactions, orders will be prioritized sequentially and any oversubscribed items promptly cancelled and refunded.

2. Pricing & Currency
All prices listed on THREAD & CO. are presented in US Dollars ($ USD) unless explicitly converted. We reserve the prerogative to adjust catalog valuations without prior notice, provided that accepted and confirmed orders retain their snapshot price.

3. Intellectual Property
All campaign photography, editorial copy, architectural garment patterns, and trademarks displayed on this portal remain the exclusive property of THREAD & CO. Unauthorized reproduction or commercial derivation is strictly prohibited.`,
    },
    shipping: {
      title: 'Delivery & Shipping Policy',
      subtitle: 'Insured Global Transit Standards',
      content: `Every garment is placed in an organic unbleached linen dust bag and dispatched inside reinforced recyclable presentation boxes.

1. Complimentary Shipping
THREAD & CO. provides complimentary worldwide express delivery on all orders exceeding $300 USD. For orders under this benchmark, a flat delivery fee of $15 USD applies.

2. Dispatch Timelines
Orders placed prior to 2:00 PM EST on standard business days are packaged and transferred to our luxury courier services on the same day. Domestic delivery is typically completed within 2 to 4 business days. International delivery ranges between 3 to 7 business days depending on customs clearance.

3. Import Duties & Taxes
All orders shipped internationally include pre-calculated customs duties where applicable to ensure seamless doorstep arrival with zero unanticipated courier fees.`,
    },
    returns: {
      title: 'Returns & Exchange Policy',
      subtitle: '30-Day Effortless Satisfaction Guarantee',
      content: `We want every piece in your permanent wardrobe to feel transformative. If a garment does not meet your exacting standards, we welcome returns and exchanges.

1. Return Window
Unworn, unwashed pieces with all original atelier tags attached may be returned within 30 calendar days of documented delivery.

2. Condition Requirements
Garments must remain in their pristine original state, free from fragrances, cosmetics, or alterations. Footwear must be tried solely on carpeted surfaces to prevent outsole scuffing.

3. Initiating a Return
Contact our concierge team at returns@threadandco.com or submit a note via our Contact page with your order reference number to generate a complimentary prepaid return courier label.`,
    },
  };

  const currentPolicy = policies[type] || policies.privacy;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="border-b border-[#E8E6E1] pb-8 mb-10 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
          THREAD & CO. Policies
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
          {currentPolicy.title}
        </h1>
        <p className="text-xs text-gray-500 mt-1">{currentPolicy.subtitle}</p>
      </div>

      <div className="prose prose-sm max-w-none text-xs text-gray-700 leading-relaxed space-y-6 whitespace-pre-line font-light">
        {currentPolicy.content}
      </div>

      <div className="mt-14 pt-8 border-t border-[#E8E6E1] flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <Link to="/policy/privacy" className="hover:text-black">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link to="/policy/terms" className="hover:text-black">
          Terms of Service
        </Link>
        <span>•</span>
        <Link to="/policy/shipping" className="hover:text-black">
          Shipping & Duties
        </Link>
        <span>•</span>
        <Link to="/policy/returns" className="hover:text-black">
          Returns & Exchanges
        </Link>
      </div>
    </div>
  );
}
