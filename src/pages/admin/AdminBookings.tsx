import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Search,
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

interface BookingRequest {
  id: string;
  service_id: string | null;
  name: string;
  email: string;
  phone: string;
  preferred_datetime: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'CONFIRMED' | 'CLOSED';
  disclaimer_accepted: boolean;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: string;
  title: string;
}

export default function AdminBookings() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/admin/dashboard';
      return;
    }
    loadData();
  }, [isAdmin]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsResult, servicesResult] = await Promise.all([
        supabase
          .from('booking_requests')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('services').select('id, title'),
      ]);

      if (bookingsResult.error) throw bookingsResult.error;
      if (servicesResult.error) throw servicesResult.error;

      setBookings(bookingsResult.data || []);
      setServices(servicesResult.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      showNotification('error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (filterStatus) {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.phone.includes(searchTerm)
      );
    }

    setFilteredBookings(filtered);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewBooking = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;
      showNotification('success', 'Status updated successfully');
      loadData();
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as any });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      showNotification('error', 'Failed to update status');
    }
  };

  const getServiceTitle = (serviceId: string | null): string => {
    if (!serviceId) return 'General Inquiry';
    const service = services.find((s) => s.id === serviceId);
    return service?.title || 'Unknown Service';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
        </div>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getServiceTitle(booking.service_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.preferred_datetime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-teal-500 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          <option value="NEW">New</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-teal-600 hover:text-teal-900"
                          title="View Details"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleUpdateStatus(selectedBooking.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium focus:ring-2 focus:ring-teal-500 ${getStatusColor(
                    selectedBooking.status
                  )}`}
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Service Requested</h3>
                <p className="text-gray-900">{getServiceTitle(selectedBooking.service_id)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Client Name</h3>
                  <p className="text-gray-900">{selectedBooking.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Preferred Date/Time
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{selectedBooking.preferred_datetime}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${selectedBooking.email}`}
                      className="text-teal-600 hover:underline"
                    >
                      {selectedBooking.email}
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${selectedBooking.phone}`}
                      className="text-teal-600 hover:underline"
                    >
                      {selectedBooking.phone}
                    </a>
                  </div>
                </div>
              </div>

              {selectedBooking.message && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Message</span>
                  </h3>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedBooking.message}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Submitted:</span>{' '}
                    {new Date(selectedBooking.created_at).toLocaleString()}
                  </div>
                  {selectedBooking.disclaimer_accepted && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Disclaimer Accepted</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
