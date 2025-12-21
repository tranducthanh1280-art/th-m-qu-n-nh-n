
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { VisitRequest, VisitStatus, Account } from './types';
import { 
  Users, Calendar, CheckCircle, Clock, UserPlus, 
  ShieldCheck, Trash2, LayoutDashboard, UserCog, 
  Eye, EyeOff, ShieldAlert, AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  requests: VisitRequest[];
  currentUser: Account;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ requests, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'USERS'>('STATS');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const MASTER_ADMIN_USERNAME = '0353991356';

  const [newAcc, setNewAcc] = useState({
    username: '',
    password: '',
    fullName: '',
    unit: '',
    role: 'OFFICER' as 'OFFICER' | 'ADMIN'
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('military_accounts') || '[]');
    setAccounts(saved);
  }, []);

  const notify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(newAcc.username)) {
      notify('Tên đăng nhập chỉ được chứa chữ cái và chữ số, không khoảng trắng hoặc ký tự đặc biệt!', 'error');
      return;
    }
    if (accounts.some(a => a.username === newAcc.username) || newAcc.username === MASTER_ADMIN_USERNAME || newAcc.username === 'admin') {
      notify('Tên đăng nhập đã tồn tại!', 'error');
      return;
    }
    if (newAcc.password.length < 3) {
      notify('Mật khẩu quá ngắn!', 'error');
      return;
    }
    const updated = [...accounts, { ...newAcc }];
    setAccounts(updated);
    localStorage.setItem('military_accounts', JSON.stringify(updated));
    setShowAddForm(false);
    setNewAcc({ username: '', password: '', fullName: '', unit: '', role: 'OFFICER' });
    notify('Tạo tài khoản thành công!', 'success');
  };

  const handleDeleteAccount = (username: string) => {
    if (username === MASTER_ADMIN_USERNAME || username === 'admin') return;
    if (confirm(`Xác nhận xóa tài khoản ${username}? Hành động này không thể hoàn tác.`)) {
      const updated = accounts.filter(a => a.username !== username);
      setAccounts(updated);
      localStorage.setItem('military_accounts', JSON.stringify(updated));
      notify('Đã xóa tài khoản.', 'success');
    }
  };

  const togglePassword = (username: string) => {
    setShowPasswords(prev => ({ ...prev, [username]: !prev[username] }));
  };

  const total = requests.length;
  const approved = requests.filter(r => r.status === VisitStatus.APPROVED).length;
  const pending = requests.filter(r => r.status === VisitStatus.PENDING).length;
  
  const statusData = [
    { name: 'Đã duyệt', value: approved, color: '#10b981' },
    { name: 'Chờ duyệt', value: pending, color: '#f59e0b' },
    { name: 'Khác', value: total - approved - pending, color: '#6b7280' },
  ];

  const unitData = requests.reduce((acc: any[], curr) => {
    const unit = curr.parentUnit;
    const existing = acc.find(a => a.name === unit);
    if (existing) existing.count++;
    else acc.push({ name: unit, count: 1 });
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 5);

  const isMasterAdmin = currentUser.username === MASTER_ADMIN_USERNAME;

  return (
    <div className="space-y-6">
      <div className="flex border-b bg-white rounded-t-xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setActiveTab('STATS')}
          className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'STATS' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={18} /> TỔNG QUAN HỆ THỐNG
        </button>
        <button 
          onClick={() => setActiveTab('USERS')}
          className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'USERS' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <UserCog size={18} /> QUẢN LÝ TÀI KHOẢN
        </button>
      </div>

      {notification && (
        <div className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-2xl z-[200] animate-in slide-in-from-bottom-4 flex items-center gap-3 border ${notification.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 'bg-red-600 border-red-500 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle /> : <AlertCircle />}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}

      {activeTab === 'STATS' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Tổng đăng ký', value: total, icon: <Users />, color: 'bg-blue-50 text-blue-600' },
              { label: 'Đã phê duyệt', value: approved, icon: <CheckCircle />, color: 'bg-green-50 text-green-600' },
              { label: 'Đang chờ xử lý', value: pending, icon: <Clock />, color: 'bg-yellow-50 text-yellow-600' },
              { label: 'Trạm QR Online', value: 1, icon: <Calendar />, color: 'bg-emerald-50 text-emerald-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border lg:col-span-1">
              <h3 className="text-lg font-bold mb-6 text-emerald-900">Trạng thái Phê duyệt</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                    <span className="text-xs text-gray-600 font-medium">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 text-emerald-900">Mật độ Đăng ký theo Đơn vị</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={unitData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#065f46" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {!isMasterAdmin && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800">
              <ShieldAlert size={24} />
              <div>
                <p className="font-bold">Quyền hạn hạn chế</p>
                <p className="text-sm">Chỉ Tài khoản Chủ ({MASTER_ADMIN_USERNAME}) mới có quyền khởi tạo hoặc xóa các tài khoản cán bộ khác.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="text-yellow-500" /> Hệ thống Tài khoản Cán bộ
                </h3>
                <p className="text-sm text-gray-500 mt-1">Quản lý danh tính số của các cán bộ phê duyệt trong đơn vị.</p>
              </div>
              {isMasterAdmin && (
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 shadow-sm ${showAddForm ? 'bg-gray-200 text-gray-700' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}
                >
                  <UserPlus size={18} /> {showAddForm ? 'Đóng Form' : 'Cấp tài khoản mới'}
                </button>
              )}
            </div>

            {showAddForm && isMasterAdmin && (
              <div className="p-6 bg-emerald-50 border-b animate-in slide-in-from-top duration-300">
                <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Username (Chỉ chữ & số)</label>
                    <input 
                      required 
                      className="w-full p-2.5 border rounded-xl text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-emerald-500" 
                      placeholder="VD: canbo123" 
                      value={newAcc.username} 
                      onChange={e => setNewAcc({...newAcc, username: e.target.value.toLowerCase().replace(/\s/g, '')})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Mật khẩu</label>
                    <input required className="w-full p-2.5 border rounded-xl text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-emerald-500" type="password" placeholder="Tối thiểu 3 ký tự" value={newAcc.password} onChange={e => setNewAcc({...newAcc, password: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Họ tên Cán bộ</label>
                    <input required className="w-full p-2.5 border rounded-xl text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-emerald-500" placeholder="VD: Nguyễn Văn A" value={newAcc.fullName} onChange={e => setNewAcc({...newAcc, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Đơn vị quản lý</label>
                    <input required className="w-full p-2.5 border rounded-xl text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-emerald-500" placeholder="VD: Đại đội 1" value={newAcc.unit} onChange={e => setNewAcc({...newAcc, unit: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Vai trò hệ thống</label>
                    <select className="w-full p-2.5 border rounded-xl text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-emerald-500" value={newAcc.role} onChange={e => setNewAcc({...newAcc, role: e.target.value as any})}>
                      <option value="OFFICER">Cán bộ Phê duyệt</option>
                      <option value="ADMIN">Quản trị viên (Admin)</option>
                    </select>
                  </div>
                  <div className="lg:pt-5">
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-900 transition shadow-lg flex items-center justify-center gap-2">
                      XÁC NHẬN CẤP PHÉP
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-500 text-[10px] uppercase tracking-[0.2em]">
                    <th className="px-6 py-4 font-black">Nhân sự</th>
                    <th className="px-6 py-4 font-black">Username</th>
                    <th className="px-6 py-4 font-black">Mật khẩu</th>
                    <th className="px-6 py-4 font-black">Phân quyền</th>
                    <th className="px-6 py-4 font-black text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-900">
                  <tr className="bg-emerald-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-white"><ShieldCheck size={16} /></div>
                        <div>
                          <p className="font-bold text-emerald-900">Quản trị viên {MASTER_ADMIN_USERNAME}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase">Tài khoản chủ hệ thống</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{MASTER_ADMIN_USERNAME}</td>
                    <td className="px-6 py-4 text-gray-400 italic text-xs">Bảo mật hệ thống</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-black uppercase">MASTER</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-300 italic text-xs">Mặc định</span>
                    </td>
                  </tr>
                  
                  {accounts.filter(a => a.username !== MASTER_ADMIN_USERNAME).map((acc) => (
                    <tr key={acc.username} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold">{acc.fullName}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-medium">{acc.unit}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">{acc.username}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">
                            {showPasswords[acc.username] ? acc.password : '••••••'}
                          </span>
                          <button onClick={() => togglePassword(acc.username)} className="text-gray-400 hover:text-emerald-600 transition">
                            {showPasswords[acc.username] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${acc.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {acc.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isMasterAdmin && (
                          <button 
                            onClick={() => handleDeleteAccount(acc.username)}
                            className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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

export default AdminDashboard;
