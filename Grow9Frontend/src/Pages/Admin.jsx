import React, { useState, useEffect } from 'react';
import { User, Plus, Users, Phone, Mail, Calendar, Eye, UserPlus } from 'lucide-react';

const baseURL = "http://localhost:5000";

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobNumber: '',
    dob: '',
    password: ''
  });

  // Registration response state
  const [registrationResponse, setRegistrationResponse] = useState(null);

  // Check if admin is logged in (simulate login check)
  useEffect(() => {
    // In real app, check token/session
    const adminToken = sessionStorage.getItem('adminToken');
    setIsLoggedIn(!!adminToken);
  }, []);


  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle sponsor registration
  const handleSponsorRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch( baseURL+'/api/Admin/sponserregisteration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      console.log(response);
      const data = await response.json();
      
      if (response.ok) {
        setRegistrationResponse(data.sponsor);
        setMessage('Sponsor registered successfully!');
        setFormData({ name: '', email: '', mobNumber: '', dob: ''});
        // Refresh sponsor list
        fetchSponsors();
      } else {
        setMessage(`Error: ${data.message || 'Registration failed'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sponsors list
  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseURL+'/api/admin/sponserlist', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setSponsors(data.sponsors || []);
      } else {
        setMessage(`Error: ${data.message || 'Failed to fetch sponsors'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers for a specific sponsor
  const fetchSponsorCustomers = async (sponsorId) => {
    setLoading(true);
    try {
      const response = await fetch(baseURL+ `/api/sponser/customerlist?sponsorId=${sponsorId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setCustomers(data.customers || []);
        setSelectedSponsor(sponsorId);
      } else {
        setMessage(`Error: ${data.message || 'Failed to fetch customers'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load sponsors when switching to sponsors tab
  useEffect(() => {
    if (activeTab === 'sponsors' && isLoggedIn) {
      fetchSponsors();
    }
  }, [activeTab, isLoggedIn]);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem('adminToken');
                setIsLoggedIn(false);
                window.location.href = '/login';
              }}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register Sponsor
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              activeTab === 'sponsors'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Sponsors List
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Register Sponsor Tab */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Sponsor Registration</h2>
            
            <form onSubmit={handleSponsorRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobNumber"
                  value={formData.mobNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  // disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Sponsor'}
              </button>
            </form>

            {/* Registration Response */}
            {registrationResponse && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Registration Successful!</h3>
                <div className="space-y-2 text-green-700">
                  <p><strong>Sponsor ID (UUID):</strong> {registrationResponse.sponsorId || registrationResponse.uuid}</p>
                  <p><strong>User Name:</strong> {registrationResponse.userName || registrationResponse.name}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sponsors List Tab */}
        {activeTab === 'sponsors' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Sponsors List</h2>
              <p className="text-gray-600">Total Sponsors: {sponsors.length}</p>
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sponsor ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sponsor Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sponsors.map((sponsor) => (
                      <tr key={sponsor.sponsorId || sponsor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sponsor.sponsorId || sponsor.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sponsor.name || sponsor.sponsorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sponsor.phoneNumber || sponsor.mobNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => fetchSponsorCustomers(sponsor.sponsorId || sponsor.id)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Customers
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Customer List Modal/Section */}
            {selectedSponsor && (
              <div className="border-t bg-gray-50 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Customers for Sponsor ID: {selectedSponsor}
                </h3>
                
                {customers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone Number
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {customers.map((customer, index) => (
                          <tr key={customer.id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {customer.name || customer.customerName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {customer.phoneNumber || customer.phone}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {customer.email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No customers found for this sponsor.</p>
                )}

                <button
                  onClick={() => {
                    setSelectedSponsor(null);
                    setCustomers([]);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Close Customer List
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;