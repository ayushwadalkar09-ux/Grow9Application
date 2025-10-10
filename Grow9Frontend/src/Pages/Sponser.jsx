import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, UserCheck, Users } from 'lucide-react';

const baseURL = "http://localhost:5000";
const SponsorPage = () => {
  const [sponsorToken, setSponsorToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sponsorInfo, setSponsorInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    sponsorId: '',
    mobileNumber: '',
    email: '',
    name: '',
    dateOfBirth: ''
  });
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check for sponsor token and login status on component mount
  useEffect(() => {
    // Check for sponsor token in cache/memory
    const token = sessionStorage?.getItem?.('sponsorToken') || 'demo-sponsor-token';
    // const loginStatus = sessionStorage?.getItem?.('sponsorLoggedIn') || 'false'; // Demo value
    let sponsorData = sessionStorage?.getItem?.('sponsorInfo') || JSON.stringify({
      sponsorId: 'SP001',
      username: 'John Sponsor',
      email: 'john@sponsor.com'
    });
    sponsorData = JSON.parse(sponsorData);
    sponsorData = JSON.parse(sponsorData.sponsorInfo);

    if (token) {
      setSponsorToken(token);
      setIsLoggedIn(true);
      setSponsorInfo(sponsorData);
    }
  }, []);

  // Fetch customer list when sponsor token is available and user is logged in
  useEffect(() => {
    if (sponsorToken && isLoggedIn && activeTab==='customers' && sponsorInfo?.sponsorId) {
      fetchCustomerList();
    }
  }, [sponsorToken, isLoggedIn ,sponsorInfo]);

  const fetchCustomerList = async () => {
    if (!sponsorInfo.sponsorId) return;
    
    setLoading(true);
    try {
      console.log("ENter");
      // Simulate API call to /api/admin/sponserlist/sponserID
      const response = await fetch(baseURL +`/api/sponser/customerlist/${sponsorInfo.sponsorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sponsorToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomerList(data.customers || []);
      } else {
        // Simulate customer data for demo
        setCustomerList([
          { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91-9876543210', joinDate: '2024-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91-9876543211', joinDate: '2024-02-10' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+91-9876543212', joinDate: '2024-02-28' }
        ]);
      }
    } catch (err) {
      setError('Failed to fetch customer list');
      // Fallback demo data
      setCustomerList([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91-9876543210', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91-9876543211', joinDate: '2024-02-10' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData(prev => ({
      ...prev,
      sponsorId: sponsorInfo.sponsorId,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.sponsorId || !formData.name || !formData.mobileNumber || 
      !formData.email || !formData.dateOfBirth) {
    setError('Please fill in all required fields');
    return;
  }
  
  // Validate mobile number
  const mobileRegex = /^[6-9]\d{9}$/;
  const cleanMobile = formData.mobileNumber.replace(/[^\d]/g, '');
  if (!mobileRegex.test(cleanMobile)) {
    setError('Please enter a valid 10-digit mobile number');
    return;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setError('Please enter a valid email address');
    return;
  }
  
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    const response = await fetch(baseURL+`/api/sponser/customerRegister`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sponsorId: formData.sponsorId,
        name: formData.name,
        mobileNumber: cleanMobile,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setSuccess(data.message || 'Registration successful!');
      // Reset form
      setFormData({
        sponsorId: '',
        name: '',
        mobileNumber: '',
        email: '',
        dateOfBirth: ''
      });
      setSponsorInfo(null);
      
      // Optional: Redirect or show customer ID
      if (data.customerId) {
        setSuccess(`Registration successful! Your Customer ID is: ${data.customerId}`);
      }
    } else {
      setError(data.message || 'Registration failed. Please try again.');
    }
  } catch (err) {
    console.error('Registration error:', err);
    setError('An error occurred. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    setSponsorToken(null);
    setIsLoggedIn(false);
    setSponsorInfo(null);
    
      sessionStorage.removeItem('sponsorToken');
    
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <UserCheck className="h-8 w-8 mr-3 text-blue-600" />
                Sponsor Portal
              </h1>
              {sponsorInfo && (
                <p className="text-sm text-gray-600 mt-1">
                  Welcome, {sponsorInfo.username} ({sponsorInfo.sponsorId})
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('register')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'register'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registration
            </button>
            <button
              onClick={() => {
                setActiveTab('customers');
                fetchCustomerList();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer List
            </button>
          </nav>
        </div>

        {/* Registration Form Tab */}
        {activeTab === 'register' && (
          <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Sponsor Registration</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in your details to register as a sponsor</p>
                {sponsorInfo && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      Current Sponsor: {sponsorInfo.username} (ID: {sponsorInfo.sponsorId})
                    </p>
                  </div>
                )}
              </div>
            
            <div className="px-6 py-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sponsor ID */}
                <div>
                  <label htmlFor="sponsorId" className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor ID *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="sponsorId"
                      name="sponsorId"
                      value={sponsorInfo?.sponsorId || ''}
                      readOnly
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91-9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Email ID */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="md:col-span-1">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer List Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Customer List
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Customers added by Sponsor: {sponsorInfo?.username || 'Unknown'} (ID: {sponsorInfo.sponsorId|| 'Please enter Sponsor ID'})
              </p>
            </div>

            <div className="px-6 py-6">
              {!sponsorInfo?.sponsorId  ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">Please enter your Sponsor ID in the registration form to view customers</p>
                </div>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading customers...</p>
                </div>
              ) : customerList.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No customers found for this sponsor</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          DOB
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerList.map((customer) => (
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.dateOfBirth}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.joinDate}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorPage;