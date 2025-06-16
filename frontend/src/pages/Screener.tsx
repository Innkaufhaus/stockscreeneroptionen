import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Market {
  id: number;
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

interface ScreeningResult {
  id: number;
  market_id: number;
  screening_type: string;
  result_data: {
    passes: boolean;
    criteria_met: string[];
    details: Record<string, string>;
  };
  market: Market;
}

const Screener: React.FC = () => {
  const [selectedMarketType, setSelectedMarketType] = useState<string>('stock');
  const [selectedScreeningType, setSelectedScreeningType] = useState<string>('minervini');

  const { data: markets, isLoading: marketsLoading } = useQuery<Market[]>({
    queryKey: ['markets', selectedMarketType],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/markets?market_type=${selectedMarketType}`);
      return response.data;
    },
  });

  const { data: screeningResults, isLoading: screeningLoading, refetch: runScreening } = useQuery<ScreeningResult[]>({
    queryKey: ['screening', selectedMarketType, selectedScreeningType],
    queryFn: async () => {
      const response = await axios.post('/api/v1/markets/screen', {
        type: selectedScreeningType,
        parameters: {
          market_type: selectedMarketType,
        },
      });
      return response.data;
    },
    enabled: false, // Don't run automatically
  });

  const handleRunScreening = () => {
    runScreening();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Market Screener</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Market Type</label>
            <select
              value={selectedMarketType}
              onChange={(e) => setSelectedMarketType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="stock">Stocks</option>
              <option value="etf">ETFs</option>
              <option value="index">Indices</option>
              <option value="forex">Forex</option>
              <option value="commodity">Commodities</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Screening Type</label>
            <select
              value={selectedScreeningType}
              onChange={(e) => setSelectedScreeningType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="minervini">Minervini</option>
              <option value="adx_golden_cross">ADX Golden Cross</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleRunScreening}
            disabled={marketsLoading || screeningLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {screeningLoading ? 'Running...' : 'Run Screening'}
          </button>
        </div>
      </div>

      {screeningResults && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Screening Results
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criteria Met
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {screeningResults.map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.market.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.market.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.result_data.criteria_met.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Object.entries(result.result_data.details)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screener; 