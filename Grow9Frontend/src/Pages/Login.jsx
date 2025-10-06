import React, { useState, useEffect } from 'react';

const baseURL = "http://localhost:5000";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [sponsorCredentials, setSponsorCredentials] = useState({
    sponsorId: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check for existing valid tokens on component mount
  useEffect(() => {
    checkExistingTokens();
  }, []);

  const checkExistingTokens = () => {
    const adminToken = getTokenFromCache('adminToken');
    const sponsorToken = getTokenFromCache('sponsorToken');

    if (adminToken && isValidToken(adminToken)) {
      redirectToAdminConsole();
    } else if (sponsorToken && isValidToken(sponsorToken)) {
      redirectToSponsorConsole();
    }
  };

  const getTokenFromCache = (tokenKey) => {
    try {
      const cachedToken = sessionStorage.getItem(tokenKey);
      return cachedToken ? JSON.parse(cachedToken) : null;
    } catch (error) {
      console.error('Error retrieving token from cache:', error);
      return null;
    }
  };

  const storeTokenInCache = (tokenKey, token) => {
    try {
      const tokenData = {
        token: token,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      sessionStorage.setItem(tokenKey, JSON.stringify(tokenData));
    } catch (error) {
      console.error('Error storing token in cache:', error);
    }
  };

  const isValidToken = (tokenData) => {
    if (!tokenData || !tokenData.expiresAt) return false;
    return Date.now() < tokenData.expiresAt;
  };

  const redirectToAdminConsole = () => {
    window.location.href = '/admin';
  };

  const redirectToSponsorConsole = () => {
    window.location.href = '/sponser';
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
  };

  const handleSponsorInputChange = (e) => {
    const { name, value } = e.target;
    setSponsorCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
  };

  const handleAdminLogin = async () => {
    if (!adminCredentials.username || !adminCredentials.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(baseURL + '/api/Admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: adminCredentials.username,
          password: adminCredentials.password
        })
      });

      const responseData = await response.json();

      if (response.ok && responseData.token) {
        storeTokenInCache('adminToken', responseData.token);
        redirectToAdminConsole();
      } else {
        setErrorMessage(responseData.message || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSponsorLogin = async () => {
    if (!sponsorCredentials.sponsorId || !sponsorCredentials.username || !sponsorCredentials.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(baseURL + '/api/sponser/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sponsorId: sponsorCredentials.sponsorId,
          username: sponsorCredentials.username,
          password: sponsorCredentials.password
        })
      });
      
      const responseData = await response.json();

      if (response.ok && responseData.token) {
        storeTokenInCache('sponsorToken', responseData.token);
        redirectToSponsorConsole();
      } else {
        setErrorMessage(responseData.message || 'Invalid sponsor credentials');
      }
    } catch (error) {
      console.error('Sponsor login error:', error);
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setAdminCredentials({ username: '', password: '' });
    setSponsorCredentials({ sponsorId: '', username: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Login Portal</h1>
          <p className="text-gray-600">Choose your account type to continue</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleTabSwitch('admin')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => handleTabSwitch('sponsor')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'sponsor'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sponsor Login
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Admin Login Section */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={adminCredentials.username}
                onChange={handleAdminInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter admin username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={adminCredentials.password}
                onChange={handleAdminInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter admin password"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleAdminLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login as Admin'
              )}
            </button>
          </div>
        )}

        {/* Sponsor Login Section */}
        {activeTab === 'sponsor' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sponsor ID
              </label>
              <input
                type="text"
                name="sponsorId"
                value={sponsorCredentials.sponsorId}
                onChange={handleSponsorInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter sponsor ID"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={sponsorCredentials.username}
                onChange={handleSponsorInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter sponsor username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={sponsorCredentials.password}
                onChange={handleSponsorInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter sponsor password"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSponsorLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login as Sponsor'
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Secure login protected by encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;