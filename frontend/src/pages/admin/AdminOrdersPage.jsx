import React, { useState, useEffect } from 'react';
import { Eye, ChevronDown, Check, AlertCircle, X, MapPin, Package } from 'lucide-react';
import api from '../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = ['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders', {
        params: {
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          limit: 50,
        },
      });
      setOrders(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === 'CANCELLED') {
      const confirmCancel = window.confirm(
        'Cancelling this order will automatically restore stock for all line items back into the database. Proceed?',
      );
      if (!confirmCancel) return;
    }

    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
      const msg = err.response?.data?.message || 'Failed to update order status.';
      alert(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'CONFIRMED':
        return 'bg-amber-100 text-amber-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0DCD3] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E826C] font-semibold">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#101012] mt-0.5">
            Client Orders ({filteredOrders.length})
          </h1>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-[#FAF9F5] p-4 border border-[#E8E6E1] rounded-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors flex-shrink-0 ${
                statusFilter === st
                  ? 'bg-[#101012] text-white'
                  : 'bg-[#F0EEE8] text-gray-700 hover:bg-[#E5E1D8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search order # or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D5CEC0] px-3 py-1.5 text-xs rounded-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#FAF9F5] border border-[#E8E6E1] rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No orders match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0EEE8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#E8E6E1]">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Client Name & Email</th>
                  <th className="py-3 px-4">Shipping Destination</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status & Transition</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7E0]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-gray-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 block">{ord.customerName}</span>
                      <span className="text-[10px] text-gray-500">{ord.customerEmail}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <span>{ord.shippingCity}, {ord.shippingCountry}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {ord.items?.length || 0} pieces
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      ${Number(ord.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        disabled={updatingId === ord.id || ord.status === 'CANCELLED' || ord.status === 'DELIVERED'}
                        className={`px-2 py-1 text-[10px] uppercase font-semibold rounded-sm border cursor-pointer focus:outline-none ${getStatusBadge(
                          ord.status,
                        )}`}
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED (Restore Stock)</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded inline-flex items-center gap-1 font-semibold uppercase text-[10px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-[#FAF9F5] rounded-sm border border-[#E8E6E1] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">Order Overview</span>
                <h2 className="font-serif text-xl font-semibold text-gray-900">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-white p-4 border border-[#E8E6E1] rounded-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Customer</h4>
                <p>{selectedOrder.customerName}</p>
                <p className="text-gray-500">{selectedOrder.customerEmail}</p>
                <p className="text-gray-500">{selectedOrder.customerPhone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Shipping Destination</h4>
                <p>{selectedOrder.shippingAddress}</p>
                <p>{selectedOrder.shippingCity}, {selectedOrder.shippingPostalCode}</p>
                <p>{selectedOrder.shippingCountry}</p>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="text-xs bg-[#F3F1EC] p-3 rounded-sm border border-[#E5E1D8]">
                <strong>Courier Notes:</strong> {selectedOrder.notes}
              </div>
            )}

            {/* Line items list */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
                Purchased Pieces
              </h4>
              <div className="divide-y divide-[#EAE7E0] border border-[#E8E6E1] bg-white rounded-sm">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-gray-900 block">{it.productName}</span>
                      <span className="text-gray-500 text-[11px]">{it.variantDetails}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 mr-3">Qty: {it.quantity}</span>
                      <span className="font-semibold text-gray-900">${Number(it.subtotal).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="text-xs space-y-1.5 border-t border-[#EAE7E0] pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{Number(selectedOrder.shippingFee) === 0 ? 'Complimentary' : `$${Number(selectedOrder.shippingFee).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${Number(selectedOrder.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-[#EAE7E0]">
                <span>Total:</span>
                <span>${Number(selectedOrder.total).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#101012] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
