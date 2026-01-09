'use client';

// Automated Contact Manager
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  Upload,
  Filter,
  Mail,
  Phone,
  MapPin,
  Building,
} from 'lucide-react';
import type { Contact } from '@/types/outreach';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchContacts();
  }, [statusFilter, businessTypeFilter]);

  async function fetchContacts() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (businessTypeFilter !== 'all') params.append('business_type', businessTypeFilter);

      const response = await fetch(`/api/contacts?${params.toString()}`);
      const data = await response.json();
      setContacts(data.contacts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  }

  async function handleDiscoverBusinesses() {
    try {
      const location = prompt('Enter location (e.g., "SoHo, NYC"):');
      if (!location) return;

      const businessType = prompt('Business type (salon/barbershop/both):', 'both');
      
      setLoading(true);
      const response = await fetch('/api/businesses/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          businessType: businessType || 'both',
          maxResults: 50,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Discovered ${data.count} businesses!`);
        fetchContacts();
      }
    } catch (error) {
      console.error('Error discovering businesses:', error);
      alert('Failed to discover businesses');
    } finally {
      setLoading(false);
    }
  }

  async function handleScrapeContacts() {
    try {
      const urlsInput = prompt('Enter URLs (comma-separated):');
      if (!urlsInput) return;

      const urls = urlsInput.split(',').map(url => url.trim()).filter(Boolean);
      
      setLoading(true);
      const response = await fetch('/api/contacts/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Scraped ${data.count} contacts!`);
        fetchContacts();
      }
    } catch (error) {
      console.error('Error scraping contacts:', error);
      alert('Failed to scrape contacts');
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedPremiumSalons() {
    if (!confirm('添加10个高端NYC沙龙到数据库？这将跳过已存在的联系人。')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/contacts/seed-premium-salons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overwrite: false }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`成功！添加了 ${data.stats.inserted} 个新联系人，跳过了 ${data.stats.skipped} 个已存在的联系人。`);
        fetchContacts();
      } else {
        alert(`错误: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('Error seeding premium salons:', error);
      alert('Failed to seed premium salons');
    } finally {
      setLoading(false);
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.includes(searchTerm);
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Management</h1>
          <p className="text-gray-600">Automated contact discovery and management</p>
        </div>

        {/* Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDiscoverBusinesses}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              disabled={loading}
            >
              <Search className="w-4 h-4" />
              Discover Businesses
            </button>
            <button
              onClick={handleScrapeContacts}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              disabled={loading}
            >
              <Download className="w-4 h-4" />
              Scrape URLs
            </button>
            <button
              onClick={handleSeedPremiumSalons}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
              disabled={loading}
              title="Add 10 premium NYC salons to database"
            >
              <Plus className="w-4 h-4" />
              Add 10 Premium Salons
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2" disabled={loading}>
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="responded">Responded</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="interviewed">Interviewed</option>
            </select>
            <select
              value={businessTypeFilter}
              onChange={(e) => setBusinessTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="salon">Salon</option>
              <option value="barbershop">Barbershop</option>
            </select>
          </div>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{contact.business_name}</div>
                            {contact.address && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {contact.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.business_type === 'salon' 
                            ? 'bg-pink-100 text-pink-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {contact.business_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {contact.email && (
                            <div className="text-sm flex items-center gap-1 text-gray-600">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="text-sm flex items-center gap-1 text-gray-600">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.status === 'new' ? 'bg-gray-100 text-gray-800' :
                          contact.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          contact.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                          contact.status === 'interview_scheduled' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredContacts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No contacts found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


