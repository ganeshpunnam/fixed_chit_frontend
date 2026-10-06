import { useState } from 'react';
import api from '../../utils/api';
import Modal from '../../components/Modal';
import { CurrencyRupeeIcon, UsersIcon, TrophyIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('');

  const fetchReport = async (endpoint, title, type) => {
    setLoading(true);
    setReportTitle(title);
    setReportType(type);
    try {
      const res = await api.get(endpoint);
      setReportData(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    { title: 'Collection Report', endpoint: '/reports/collection', type: 'collection', icon: CurrencyRupeeIcon, color: 'from-green-500 to-emerald-600' },
    { title: 'Defaulters List', endpoint: '/reports/defaulters', type: 'defaulters', icon: UsersIcon, color: 'from-red-500 to-rose-600' },
    { title: 'Prizes Paid', endpoint: '/reports/prize-payouts', type: 'payouts', icon: TrophyIcon, color: 'from-yellow-500 to-amber-600' }
  ];

  const renderReportContent = () => {
    if (!reportData || !Array.isArray(reportData)) {
      return <p className="text-gray-500 text-center py-4">No data available.</p>;
    }
    if (reportData.length === 0) {
      return <p className="text-gray-500 text-center py-4 font-semibold">No records found for this report.</p>;
    }

    if (reportType === 'collection') {
      return (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Member Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Mobile</th>
                <th className="px-4 py-3 whitespace-nowrap">Month</th>
                <th className="px-4 py-3 whitespace-nowrap">Amount Paid</th>
                <th className="px-4 py-3 whitespace-nowrap">Late Fee</th>
                <th className="px-4 py-3 whitespace-nowrap">Paid Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reportData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{item.schememember?.user?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.schememember?.user?.mobile || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-medium">Month {item.monthNumber}</td>
                  <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">₹{item.paidAmount}</td>
                  <td className="px-4 py-3 text-red-500 font-medium whitespace-nowrap">₹{item.lateFeeAdded || 0}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.paidDate ? new Date(item.paidDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap capitalize">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs border font-medium">
                      {item.paymentMode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportType === 'defaulters') {
      return (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Member Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Mobile</th>
                <th className="px-4 py-3 whitespace-nowrap">Month</th>
                <th className="px-4 py-3 whitespace-nowrap">Amount Due</th>
                <th className="px-4 py-3 whitespace-nowrap">Late Fee</th>
                <th className="px-4 py-3 whitespace-nowrap">Due Date</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reportData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{item.schememember?.user?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.schememember?.user?.mobile || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-medium">Month {item.monthNumber}</td>
                  <td className="px-4 py-3 font-bold text-red-600 whitespace-nowrap">₹{item.amountDue}</td>
                  <td className="px-4 py-3 text-red-500 font-medium whitespace-nowrap">₹{item.lateFeeAdded || 0}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 uppercase">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportType === 'payouts') {
      return (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Member Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Mobile</th>
                <th className="px-4 py-3 whitespace-nowrap">Month</th>
                <th className="px-4 py-3 whitespace-nowrap">Prize Amount</th>
                <th className="px-4 py-3 whitespace-nowrap">Payout Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Method</th>
                <th className="px-4 py-3 whitespace-nowrap">Ref / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reportData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{item.schememember?.user?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.schememember?.user?.mobile || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-medium">Month {item.monthNumber}</td>
                  <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">₹{item.prizeAmount}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.payoutDate ? new Date(item.payoutDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap capitalize">
                    <span className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-xs font-semibold text-indigo-700">
                      {item.payoutMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs font-mono">{item.transactionRef || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
        <pre className="max-h-[60vh] overflow-auto text-sm text-gray-800 font-mono">
          {JSON.stringify(reportData, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-8">
        <DocumentChartBarIcon className="h-8 w-8 text-indigo-600" />
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <button
              key={idx}
              onClick={() => fetchReport(report.endpoint, report.title, report.type)}
              disabled={loading}
              className={`relative overflow-hidden bg-gradient-to-br ${report.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left group disabled:opacity-70`}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{report.title}</h3>
                  <p className="text-white/80 text-sm font-medium">Click to view data</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={reportTitle || "Report"} size="xxl">
        <div className="mt-2">
          {renderReportContent()}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={() => setModalOpen(false)} className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}