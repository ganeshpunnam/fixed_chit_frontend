import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Installments() {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [installments, setInstallments] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/schemes').then((r) => setSchemes(r.data));
  }, []);

  const loadInstallments = async () => {
    if (!selectedScheme) return;
    const scheme = schemes.find(s => s._id === selectedScheme);
    if (scheme?.status !== 'active') {
      setMsg('This scheme is not active. Please activate it first.');
      setInstallments([]);
      return;
    }
    setMsg('');
    const res = await api.get(`/installments/scheme/${selectedScheme}?month=${selectedMonth}`);
    setInstallments(res.data);
  };

  const pay = async (schemememberId, month) => {
    try {
      await api.post('/installments/pay', { schemememberId, monthNumber: month, amount: 16000, paymentMode: 'cash' });
      setMsg('Paid successfully');
      loadInstallments();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Installments</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-2xl">
        <select
          value={selectedScheme}
          onChange={(e) => setSelectedScheme(e.target.value)}
          className="rounded border-gray-300 w-full sm:w-auto flex-1 h-[42px]"
        >
          <option value="">Select Scheme</option>
          {schemes.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.status})
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={25}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-24 rounded border-gray-300 h-[42px]"
            placeholder="Month"
          />
          <button
            onClick={loadInstallments}
            className="bg-black text-yellow-400 px-6 py-2 rounded font-bold hover:bg-gray-800 transition-colors h-[42px] whitespace-nowrap"
          >
            Load
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-3 mb-4 rounded-lg font-medium text-sm ${msg.includes('not active') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {msg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="border-b text-gray-900 font-semibold">
                <th className="p-3 whitespace-nowrap">Member</th>
                <th className="p-3 whitespace-nowrap">Month</th>
                <th className="p-3 whitespace-nowrap">Due</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {installments.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 whitespace-nowrap font-medium text-gray-900">{inv.schememember?.user?.name}</td>
                  <td className="p-3 whitespace-nowrap">{inv.monthNumber}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap text-right">
                    {inv.status === 'pending' && (
                      <button
                        onClick={() => pay(inv.schememember._id, inv.monthNumber)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors font-medium text-xs"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {installments.length === 0 && !msg && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No installments to display. Load a scheme and month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}