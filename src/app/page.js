'use client';

import { useState } from 'react';

export default function TestCaseGenerator() {
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(5);
  const [includePositive, setIncludePositive] = useState(true);
  const [includeNegative, setIncludeNegative] = useState(true);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTestCases = async () => {
    if (!prompt.trim()) {
      setError('Please enter a functionality description');
      return;
    }

    setLoading(true);
    setError('');
    setTestCases([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          count,
          includePositive,
          includeNegative
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate test cases');
      }

      setTestCases(data.result || []);
    } catch (err) {
      setError(`Error generating test cases: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportAsCSV = () => {
    if (testCases.length === 0) return;

    const headers = ['id', 'type', 'case', 'expected'];
    const rows = testCases.map(tc =>
      [tc.id, tc.type, tc.case, tc.expected].map(val => `"${val}"`).join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'test-cases.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Test Case Generator</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Functionality Description:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 h-24 resize-none"
            placeholder="Describe the functionality (e.g., 'User login with email and password')"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Test Cases:
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border border-gray-300 rounded-md p-2"
              min="1"
              max="20"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="positive"
              checked={includePositive}
              onChange={(e) => setIncludePositive(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="positive" className="text-sm font-medium">
              Include Positive Tests
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="negative"
              checked={includeNegative}
              onChange={(e) => setIncludeNegative(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="negative" className="text-sm font-medium">
              Include Negative Tests
            </label>
          </div>
        </div>

        <button
          onClick={generateTestCases}
          disabled={loading || (!includePositive && !includeNegative)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Test Cases'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {testCases.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Test Cases</h2>
            <button
              onClick={exportAsCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Export as CSV
            </button>
          </div>
          <div className="space-y-4">
            {testCases.map((tc, index) => (
              <div
                key={index}
                className={`p-4 rounded-md border-l-4 ${
                  tc.type === 'Positive'
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="text-sm text-gray-500 mb-1">{tc.id}</div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      tc.type === 'Positive'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {tc.type}
                  </span>
                </div>
                <p className="text-gray-700 mb-1"><strong>Case:</strong> {tc.case}</p>
                <p className="text-gray-700"><strong>Expected:</strong> {tc.expected}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
