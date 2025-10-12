import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, UserCheck, Users ,TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updateAmountValue, setUpdateAmountValue] = useState('');
  const [updatingAmount, setUpdatingAmount] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [earningsData, setEarningsData] = useState([]);
  const [earningsStats, setEarningsStats] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('30days');

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

  useEffect(() => {
    if (sponsorToken && isLoggedIn && activeTab === 'earnings' && sponsorInfo?.sponsorId) {
      fetchEarningsData();
    }
  }, [sponsorToken, isLoggedIn, sponsorInfo, activeTab, timeRange]);

  const fetchCustomerList = async () => {
    if (!sponsorInfo.sponsorId) return;
    
    setLoading(true);
    try {
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

  const fetchEarningsData = async () => {
    if (!sponsorInfo.sponsorId) return;
    
    setLoading(true);
    try {
      const response = await fetch(baseURL + `/api/sponser/earnings/${sponsorInfo.sponsorId}/interval=${timeRange}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sponsorToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data.dailyEarnings);
        console.log(data.stats);
        console.log(data.totalinvestment);
        setEarningsData(data.dailyEarnings || []);
        setEarningsStats(data.stats || {});
      } else {
        const mockData = generateMockEarningsData(timeRange);
        setEarningsData(mockData);
        calculateStats(mockData);
      }
    } catch (err) {
      console.error('Error fetching earnings:', err);
      const mockData = generateMockEarningsData(timeRange);
      setEarningsData(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockEarningsData = (range) => {
    const data = [];
    const daysToShow = range === '7days' ? 7 : range === '30days' ? 30 : 90;
    const today = new Date();

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const earnings = Math.floor(Math.random() * 8000) + 2000;
      data.push({
        date: dateStr,
        earnings: earnings,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return data;
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setEarningsStats({ totalEarnings: 0, averageDaily: 0, maxDaily: 0, minDaily: 0 });
      return;
    }

    const totalEarnings = data.reduce((sum, item) => sum + item.earnings, 0);
    const averageDaily = Math.round(totalEarnings / data.length);
    const maxDaily = Math.max(...data.map(item => item.earnings));
    const minDaily = Math.min(...data.map(item => item.earnings));

    setEarningsStats({
      totalEarnings,
      averageDaily,
      maxDaily,
      minDaily
    });
  };

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-300">
          <p className="text-sm font-semibold text-gray-800">
            {payload[0].payload.displayDate}
          </p>
          <p className="text-sm text-blue-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleEditAmount = (customer) => {
    setEditingCustomer(customer);
    setUpdateAmountValue(customer.amount || '');
    setUpdateError('');
  };

  const handleUpdateAmount = async () => {
    if (!updateAmountValue || updateAmountValue <= 0) {
      setUpdateError('Please enter a valid amount');
      return;
    }

    setUpdatingAmount(true);
    setUpdateError('');

    try {
      const response = await fetch(baseURL + `/api/sponser/updateCustomerAmount`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sponsorToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(updateAmountValue),
          sponsorId: sponsorInfo.sponsorId,
          email : editingCustomer.email,
          mobileNumber:editingCustomer.phone
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update customer list with new amount
        setCustomerList(customerList.map(customer =>
          customer.email === editingCustomer.email
            ? { ...customer, AmountInvested: parseFloat(updateAmountValue) }
            : customer
        ));
        setEditingCustomer(null);
        setUpdateAmountValue('');
      } else {
        const data = await response.json();
        setUpdateError(data.message || 'Failed to update amount');
      }
    } catch (err) {
      console.error('Error updating amount:', err);
      setUpdateError('An error occurred. Please try again later.');
    } finally {
      setUpdatingAmount(false);
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
        'Authorization': `Bearer ${sponsorToken}`,
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
            <button
              onClick={() => {
                setActiveTab('earnings');
                // fetchEarningsData();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'earnings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Earning
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerList.map((customer) => (
                        <tr key={customer.email || customer.mobileNumber} className="hover:bg-gray-50">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600">
                              ₹{customer.AmountInvested || '0'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => handleEditAmount(customer)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* Edit Amount Modal */}
            {editingCustomer && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Update Amount for {editingCustomer.name}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="updateAmount" className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="updateAmount"
                      value={updateAmountValue}
                      onChange={(e) => setUpdateAmountValue(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {updateError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {updateError}
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditingCustomer(null);
                        setUpdateAmountValue('');
                        setUpdateError('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateAmount}
                      disabled={updatingAmount}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingAmount ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {activeTab === 'earnings' && (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Daily Earnings Report
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Earnings for Sponsor: {sponsorInfo?.username || 'Unknown'} (ID: {sponsorInfo?.sponsorId || 'N/A'})
          </p>
        </div>

        <div className="px-6 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium">Total Amount Invested</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(earningsStats?.totalinvestment || 0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500 opacity-30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium">Total Earning</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(earningsStats?.totalEarnings || 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 opacity-30" />
              </div>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Earnings Trend</h3>
            <div className="flex flex-wrap gap-3">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>

          {/* Chart */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading earnings data...</p>
              </div>
            </div>
          ) : earningsData.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500">No earnings data available</p>
              </div>
            </div>
          ) : (
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={earningsData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="displayDate"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="earnings"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      name="Daily Earnings"
                    />
                  </BarChart>
                ) : (
                  <LineChart data={earningsData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="displayDate"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 6 }}
                      activeDot={{ r: 8 }}
                      name="Daily Earnings"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          {/* Data Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earningsData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.displayDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {formatCurrency(item.earnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )};
    </div>
  );
};

export default SponsorPage;