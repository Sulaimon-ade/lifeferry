import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface LegalPage {
  id: string;
  page_key: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function AdminLegal() {
  const { isAdmin } = useAuth();
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<LegalPage | null>(null);
  const [content, setContent] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/admin/dashboard';
      return;
    }
    loadPages();
  }, [isAdmin]);

  const loadPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .order('page_key', { ascending: true });

      if (error) throw error;
      setPages(data || []);
      if (data && data.length > 0) {
        setSelectedPage(data[0]);
        setContent(data[0].content);
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
      showNotification('error', 'Failed to load legal pages');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePageSelect = (page: LegalPage) => {
    setSelectedPage(page);
    setContent(page.content);
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('legal_pages')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', selectedPage.id);

      if (error) throw error;
      showNotification('success', 'Legal page updated successfully');
      loadPages();
    } catch (error) {
      console.error('Failed to save page:', error);
      showNotification('error', 'Failed to save legal page');
    } finally {
      setSaving(false);
    }
  };

  const pageLabels: Record<string, string> = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    disclaimer: 'Disclaimer',
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
          <h1 className="text-3xl font-bold text-gray-900">Legal Pages</h1>
          {selectedPage && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          )}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Pages
                </h2>
              </div>
              <nav className="p-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageSelect(page)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedPage?.id === page.id
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {pageLabels[page.page_key] || page.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedPage ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {pageLabels[selectedPage.page_key] || selectedPage.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(selectedPage.updated_at).toLocaleString()}
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                        placeholder="Enter content in Markdown or HTML format..."
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Supports Markdown and HTML formatting
                      </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-5 w-5" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a page to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
