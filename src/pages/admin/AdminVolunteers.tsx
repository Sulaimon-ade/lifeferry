import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Search,
  Mail,
  Phone,
  X,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest_area: string;
  message: string;
  status: 'NEW' | 'REVIEWING' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
}

export default function AdminVolunteers() {
  const { isAdmin } = useAuth();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/admin/dashboard';
      return;
    }
    loadApplications();
  }, [isAdmin]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, filterStatus]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteer_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
      showNotification('error', 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (filterStatus) {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.interest_area.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewApplication = (app: VolunteerApplication) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      showNotification('success', 'Status updated successfully');
      loadApplications();
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus as any });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      showNotification('error', 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEWING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Applications</h1>
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
                    placeholder="Search applications..."
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
                <option value="REVIEWING">Reviewing</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{app.name}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                        <div className="text-sm text-gray-500">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.interest_area || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-teal-500 ${getStatusColor(
                            app.status
                          )}`}
                        >
                          <option value="NEW">New</option>
                          <option value="REVIEWING">Reviewing</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="DECLINED">Declined</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewApplication(app)}
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

      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium focus:ring-2 focus:ring-teal-500 ${getStatusColor(
                    selectedApp.status
                  )}`}
                >
                  <option value="NEW">New</option>
                  <option value="REVIEWING">Reviewing</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="DECLINED">Declined</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Applicant Name</h3>
                <p className="text-gray-900">{selectedApp.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="text-teal-600 hover:underline"
                    >
                      {selectedApp.email}
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${selectedApp.phone}`}
                      className="text-teal-600 hover:underline"
                    >
                      {selectedApp.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Interest Area</h3>
                <p className="text-gray-900">{selectedApp.interest_area || '-'}</p>
              </div>

              {selectedApp.message && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedApp.message}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Applied:</span>{' '}
                  {new Date(selectedApp.created_at).toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
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
