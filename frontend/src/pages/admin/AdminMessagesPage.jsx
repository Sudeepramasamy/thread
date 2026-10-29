import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock, Users, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [msgRes, subRes] = await Promise.all([
        api.get('/contact'),
        api.get('/newsletter/subscribers'),
      ]);
      setMessages(msgRes.data || []);
      setSubscribers(subRes.data || []);
    } catch (err) {
      console.error('Failed to load inquiries & subscribers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0DCD3] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E826C] font-semibold">
            Inbound Communications
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#101012] mt-0.5">
            Client Inquiries & Gazette
          </h1>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#EAE7E0] p-1 rounded-sm">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === 'messages' ? 'bg-[#101012] text-white' : 'text-gray-700 hover:text-black'
            }`}
          >
            Inquiries ({messages.filter((m) => !m.isRead).length} new)
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === 'subscribers' ? 'bg-[#101012] text-white' : 'text-gray-700 hover:text-black'
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-gray-500">Loading records...</div>
      ) : activeTab === 'messages' ? (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500 bg-[#FAF9F5] border border-[#E8E6E1] rounded-sm">
              No inquiries received yet.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-6 rounded-sm border transition-all ${
                  m.isRead
                    ? 'bg-[#FAF9F5] border-[#E8E6E1]'
                    : 'bg-white border-l-4 border-l-[#C5A880] border-[#E8E6E1] shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE7E0]">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-sm text-[#101012]">{m.name}</span>
                    <span className="text-xs text-gray-500 font-mono">({m.email})</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                    {!m.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(m.id)}
                        className="px-2.5 py-1 bg-[#101012] text-white text-[10px] font-semibold uppercase tracking-wider rounded hover:bg-black"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3">
                  {m.subject && (
                    <h4 className="text-xs font-semibold text-gray-900 mb-1">
                      Subject: {m.subject}
                    </h4>
                  )}
                  <p className="text-xs text-gray-700 leading-relaxed font-light whitespace-pre-wrap">
                    {m.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-[#FAF9F5] border border-[#E8E6E1] rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0EEE8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#E8E6E1]">
                <tr>
                  <th className="py-3 px-4">Subscriber Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7E0]">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">
                      {sub.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800">
                        {sub.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-right">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
