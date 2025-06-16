import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

interface MarketSummary {
  total_markets: number;
  by_type: {
    stock: number;
    etf: number;
    index: number;
    forex: number;
    commodity: number;
  };
}

interface ScreeningSummary {
  total_screens: number;
  recent_results: number;
  active_screens: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: marketSummary } = useQuery<MarketSummary>({
    queryKey: ['market-summary'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/markets/summary');
      return response.data;
    },
  });

  const { data: screeningSummary } = useQuery<ScreeningSummary>({
    queryKey: ['screening-summary'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/markets/screening-summary');
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Welcome back, {user?.full_name || user?.email}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your subscription status: {user?.subscription_status}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Market Summary Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Markets
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {marketSummary?.total_markets || 0}
            </dd>
            <div className="mt-4 space-y-2">
              {marketSummary?.by_type && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Stocks</span>
                    <span className="text-sm font-medium text-gray-900">
                      {marketSummary.by_type.stock}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ETFs</span>
                    <span className="text-sm font-medium text-gray-900">
                      {marketSummary.by_type.etf}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Indices</span>
                    <span className="text-sm font-medium text-gray-900">
                      {marketSummary.by_type.index}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Screening Summary Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Screening Activity
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {screeningSummary?.total_screens || 0}
            </dd>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Recent Results</span>
                <span className="text-sm font-medium text-gray-900">
                  {screeningSummary?.recent_results || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Screens</span>
                <span className="text-sm font-medium text-gray-900">
                  {screeningSummary?.active_screens || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-4 space-y-4">
              <Link
                to="/screener"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Run New Screen
              </Link>
              <Link
                to="/screens"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View Saved Screens
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 