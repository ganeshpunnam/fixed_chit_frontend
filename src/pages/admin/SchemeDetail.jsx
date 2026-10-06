import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import Loading from '../../components/Loading';

export default function SchemeDetail() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [activating, setActivating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [schemeRes, membersRes] = await Promise.all([
        api.get(`/schemes/${id}`),
        api.get(`/schememembers/${id}/members`),
      ]);
      setScheme(schemeRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    api.get('/users').then((res) => setAllUsers(res.data.filter((u) => u.role === 'member')));
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (!selectedUserId) {
      setAddError('Please select a member.');
      return;
    }
    try {
      await api.post(`/schememembers/${id}/members`, { userId: selectedUserId });
      setAddSuccess('Member added!');
      setSelectedUserId('');
      const membersRes = await api.get(`/schememembers/${id}/members`);
      setMembers(membersRes.data);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      await api.put(`/schemes/${id}/activate`);
      setScheme({ ...scheme, status: 'active' });
      alert('Scheme activated!');
    } catch (err) {
      alert(err.response?.data?.message || 'Activation failed');
    } finally {
      setActivating(false);
    }
  };

  if (loading) return <Loading />;
  if (!scheme) return <p className="text-center text-red-500">Scheme not found.</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-2">{scheme.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <p><span className="font-semibold">Status:</span> {scheme.status}</p>
          <p><span className="font-semibold">Duration:</span> {scheme.durationMonths} months</p>
          <p><span className="font-semibold">Monthly:</span> ₹{scheme.monthlyAmount}</p>
          <p><span className="font-semibold">Late Fee:</span> ₹{scheme.lateFeePerMonth}</p>
          <p><span className="font-semibold">Max Members:</span> {scheme.maxMembers}</p>
          <p><span className="font-semibold">Start Date:</span> {new Date(scheme.startDate).toLocaleDateString()}</p>
        </div>
        {scheme.status === 'draft' && (
          <button onClick={handleActivate} disabled={activating}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {activating ? 'Activating...' : 'Activate Scheme'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Add Member</h3>
        {members.length >= scheme.maxMembers ? (
          <p className="text-yellow-600 font-medium">Maximum members reached.</p>
        ) : scheme.status === 'completed' ? (
          <p className="text-gray-500">Scheme is completed.</p>
        ) : (
          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3 sm:items-end w-full max-w-md">
            <div className="flex-1 w-full">
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}
                className="rounded border-gray-300 w-full" required>
                <option value="">Select a member</option>
                {allUsers.filter(u => !members.some(m => m.user?._id === u._id)).map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.mobile})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-black text-yellow-400 px-4 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto font-bold h-[42px]">Add</button>
          </form>
        )}
        {addError && <p className="text-red-600 mt-2">{addError}</p>}
        {addSuccess && <p className="text-green-600 mt-2">{addSuccess}</p>}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Members ({members.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Name</th>
                <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Mobile</th>
                <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Prize Status</th>
                <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Prize Month</th>
                <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Prize Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-yellow-50">
                  <td className="px-4 py-2 text-sm font-medium whitespace-nowrap">{m.user?.name}</td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">{m.user?.mobile}</td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">{m.prizedMonth ? '✅ Received' : '⏳ Not yet'}</td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">{m.prizedMonth || '-'}</td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">{m.prizedAmount ? `₹${m.prizedAmount}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Prize Schedule</h3>
        <div className="max-h-64 overflow-y-auto overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-2 whitespace-nowrap">Month</th>
                <th className="text-left px-2 whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody>
              {scheme.prizeSchedule.map((p) => (
                <tr key={p.monthNumber} className="border-t">
                  <td className="px-2 py-1 whitespace-nowrap">Month {p.monthNumber}</td>
                  <td className="px-2 py-1 whitespace-nowrap">₹{p.prizeAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}