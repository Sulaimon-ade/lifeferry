import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  X,
  Save,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'PHOTO' | 'VIDEO';
  title: string;
  url: string;
  thumbnail_url: string;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminMedia() {
  const { isAdmin } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'PHOTO' as 'PHOTO' | 'VIDEO',
    title: '',
    url: '',
    thumbnail_url: '',
    order_num: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/admin/dashboard';
      return;
    }
    loadMedia();
  }, [isAdmin]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('order_num', { ascending: true });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Failed to load media:', error);
      showNotification('error', 'Failed to load media items');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenModal = (item?: MediaItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        type: item.type,
        title: item.title,
        url: item.url,
        thumbnail_url: item.thumbnail_url,
        order_num: item.order_num,
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({
        type: 'PHOTO',
        title: '',
        url: '',
        thumbnail_url: '',
        order_num: 0,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'url' | 'thumbnail_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);

      setFormData({ ...formData, [field]: data.publicUrl });
      showNotification('success', 'File uploaded successfully');
    } catch (error) {
      console.error('Failed to upload:', error);
      showNotification('error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('media_items')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        showNotification('success', 'Media item updated successfully');
      } else {
        const { error } = await supabase.from('media_items').insert([formData]);

        if (error) throw error;
        showNotification('success', 'Media item created successfully');
      }

      setShowModal(false);
      loadMedia();
    } catch (error) {
      console.error('Failed to save media item:', error);
      showNotification('error', 'Failed to save media item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const { error } = await supabase.from('media_items').delete().eq('id', id);

      if (error) throw error;
      showNotification('success', 'Media item deleted successfully');
      loadMedia();
    } catch (error) {
      console.error('Failed to delete:', error);
      showNotification('error', 'Failed to delete media item');
    }
  };

  const toggleActive = async (item: MediaItem) => {
    try {
      const { error } = await supabase
        .from('media_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      loadMedia();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const updateOrder = async (item: MediaItem, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? item.order_num - 1 : item.order_num + 1;

    try {
      const { error } = await supabase
        .from('media_items')
        .update({ order_num: newOrder })
        .eq('id', item.id);

      if (error) throw error;
      loadMedia();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const filteredMedia = filterType
    ? mediaItems.filter((m) => m.type === filterType)
    : mediaItems;

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
          <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Media</span>
          </button>
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
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="PHOTO">Photos</option>
              <option value="VIDEO">Videos</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative">
                  {item.type === 'PHOTO' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Video className="h-12 w-12 text-white" />
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleActive(item)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100"
                      >
                        {item.is_active ? (
                          <Eye className="h-5 w-5 text-gray-700" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-700" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title || 'Untitled'}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {item.type === 'PHOTO' ? (
                          <ImageIcon className="h-3 w-3" />
                        ) : (
                          <Video className="h-3 w-3" />
                        )}
                        <span>{item.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-col ml-2">
                      <button
                        onClick={() => updateOrder(item, 'up')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => updateOrder(item, 'down')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit Media' : 'Add Media'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as 'PHOTO' | 'VIDEO' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="PHOTO">Photo</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'PHOTO' ? 'Photo' : 'Video'} URL
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder={formData.type === 'VIDEO' ? 'https://youtube.com/...' : ''}
                  />
                  {formData.type === 'PHOTO' && (
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Upload File'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'url')}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {formData.type === 'VIDEO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL (Optional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Upload Thumbnail'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <input
                    type="number"
                    value={formData.order_num}
                    onChange={(e) =>
                      setFormData({ ...formData, order_num: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingItem ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
