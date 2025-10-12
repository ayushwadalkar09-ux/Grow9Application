import React, { useState, useEffect } from 'react';
import { User, Plus, Users, Phone, Mail, Calendar, Eye, UserPlus ,TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const baseURL = "http://localhost:5000";

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [earningsData, setEarningsData] = useState([]);
  const [earningsStats, setEarningsStats] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('30days');

  const [earningsPercentage, setEarningsPercentage] = useState(0);
  const [tempPercentage, setTempPercentage] = useState(earningsPercentage);
  const [showPercentageModal, setShowPercentageModal] = useState(false);

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

  useEffect(() => {
      if (isLoggedIn && activeTab === 'adminearnings') {
        fetchEarningsData();
      }
  }, [isLoggedIn, activeTab, timeRange]);


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
      const response = await fetch(baseURL+ `/api/sponser/customerlist/${sponsorId}`, {
        method: 'GET',
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

  const fetchEarningsData = async () => {    
    setLoading(true);
    try {
      // const response = await fetch(baseURL + `/api/sponser/earnings/${sponsorInfo.sponsorId}/interval=${timeRange}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${sponsorToken}`,
      //     'Content-Type': 'application/json',
      //   }
      // });
      
      if (false) {
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
          <button
            onClick={() => setActiveTab('adminearnings')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              activeTab === 'adminearnings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Earning Growth
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

        {activeTab === 'adminearnings' && (
              <div className="bg-white rounded-lg shadow">
        
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

                    {/* Percentage Configuration Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-xs font-medium">Earnings Increase Percentage</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {earningsPercentage}%
                          </p>
                        </div>
                        <button
                          onClick={() => setShowPercentageModal(true)}
                          className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Percentage Modal */}
                  {showPercentageModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Earnings Percentage</h2>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Percentage Value
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempPercentage}
                              onChange={(e) => setTempPercentage(parseFloat(e.target.value) || 0)}
                              min="0"
                              max="100"
                              step="1"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter percentage"
                            />
                            <span className="text-2xl font-bold text-gray-900">%</span>
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => setShowPercentageModal(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setEarningsPercentage(tempPercentage);
                              setShowPercentageModal(false);
                              // Call your API to save percentage here
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
    </div>
  );
};

export default AdminPage;