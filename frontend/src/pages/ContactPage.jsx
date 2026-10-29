import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ loading: false, success: false, error: 'Please complete all required fields.' });
      return;
    }

    setStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/contact', formData);
      setStatus({
        loading: false,
        success: true,
        error: '',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact inquiry failed', err);
      const msg = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      setStatus({ loading: false, success: false, error: msg });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
          Client Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#101012] mt-1">
          Inquire with the Atelier
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          From private styling consultations to wholesale inquiries, our team responds within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FAF9F5] p-8 sm:p-10 rounded-sm border border-[#E8E6E1] shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-[#101012] mb-6">
            Send an Atelier Note
          </h2>

          {status.success && (
            <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Thank you. Your message has been safely received by our concierge desk.</span>
            </div>
          )}

          {status.error && (
            <div className="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Julian Hayes"
                  required
                  className="w-full bg-white border border-[#D5CEC0] px-3.5 py-2.5 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="julian@example.com"
                  required
                  className="w-full bg-white border border-[#D5CEC0] px-3.5 py-2.5 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Subject (Optional)
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Styling consultation, sizing inquiry, or wholesale"
                className="w-full bg-white border border-[#D5CEC0] px-3.5 py-2.5 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Your Message *
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share your inquiry or custom tailoring dimensions..."
                required
                className="w-full bg-white border border-[#D5CEC0] px-3.5 py-2.5 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="px-8 py-3.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors rounded-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status.loading ? 'Transmitting...' : 'Send Inquiry'}</span>
            </button>
          </form>
        </div>

        {/* Showrooms & Concierge Info */}
        <div className="lg:col-span-5 space-y-8">
          {/* Showroom Addresses */}
          <div className="bg-[#FAF9F5] p-8 rounded-sm border border-[#E8E6E1] space-y-6">
            <h3 className="font-serif text-xl font-semibold text-[#101012] border-b border-[#EAE7E0] pb-3">
              Private Showrooms
            </h3>

            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block font-semibold">New York Atelier</strong>
                  <span>450 Lexington Avenue, Suite 1400</span><br />
                  <span>New York, NY 10017</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block font-semibold">Paris Showroom</strong>
                  <span>28 Rue du Faubourg Saint-Honoré</span><br />
                  <span>75008 Paris, France</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block font-semibold">London Concierge</strong>
                  <span>14 Savile Row, Mayfair</span><br />
                  <span>London W1S 3JN, United Kingdom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-[#FAF9F5] p-8 rounded-sm border border-[#E8E6E1] space-y-4 text-xs text-gray-600">
            <div className="flex items-center space-x-2 font-semibold text-[#101012] text-sm">
              <Clock className="w-4 h-4" />
              <span>Concierge Hours</span>
            </div>
            <p>Monday – Friday: 9:00 AM – 7:00 PM EST</p>
            <p>Saturday: 10:00 AM – 5:00 PM EST (By Appointment)</p>
            <p className="pt-2 text-gray-500 border-t border-[#EAE7E0]">
              Direct line: +1 (800) 555-THRD • concierge@threadandco.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
