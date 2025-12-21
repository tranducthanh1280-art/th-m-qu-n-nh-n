
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { VisitRequest, VisitStatus, Account } from '../types';
import { ORGANIZATION_STRUCTURE } from '../constants';
import { 
  Users, CheckCircle, Clock, UserPlus, 
  ShieldCheck, Trash2, LayoutDashboard, UserCog, 
  ShieldAlert, AlertCircle, MapPin, Building2, Eye, EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  requests: VisitRequest[];
  currentUser: Account;
  accounts: Account[];
  onAddAccount: (acc: Account) => void;
  onDeleteAccount: (username: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ requests, currentUser, accounts, onAddAccount, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'USERS'>('STATS');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const MASTER_PHONE = '0353991356';

  const [newAcc, setNewAcc] = useState({
    username: '',
    password: '',
    fullName: '',
    cat: 'BATTALION' as keyof typeof ORGANIZATION_STRUCTURE,
    parentUnit: 'Tiểu đoàn 1',
    specificUnit: 'TOÀN TIỂU ĐOÀN',
    role: 'OFFICER' as 'OFFICER' | 'ADMIN'
  });

  const notify = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accounts.some(a => a.username === newAcc.username)) {
      notify('Tên đăng nhập đã tồn tại!', 'error');
      return;
    }
    
    const finalUnit = newAcc.specificUnit === 'TOÀN TIỂU ĐOÀN' 
      ? newAcc.parentUnit 
      : `${newAcc.specificUnit} - ${newAcc.parentUnit}`;

    const newAccount: Account = {
      username: newAcc.username,
      password: newAcc.password,
      fullName: newAcc.fullName,
      unit: finalUnit,
      parentUnit: newAcc.parentUnit,
      role: newAcc.role
    };

    onAddAccount(newAccount);
    setShowAddForm(false);
    setNewAcc({ ...newAcc, username: '', password: '', fullName: '' });
    notify('Đã cấp quyền truy cập!', 'success');
  };

  const isMaster = currentUser.username === MASTER_PHONE;

  const visibleRequests = isMaster 
    ? requests 
    : requests.filter(r => r.parentUnit === currentUser.unit || `${r.specificUnit} - ${r.parentUnit}` === currentUser.unit);
  
  const total = visibleRequests.length;
  const approved = visibleRequests.filter(r => r.status === VisitStatus.APPROVED).length;
  const pending = visibleRequests.filter(r => r.status === VisitStatus.PENDING).length;
  const arrived = visibleRequests.filter(r => r.status === VisitStatus.ARRIVED).length;

  const statusData = [
    { name: 'Đã duyệt', value: approved, color: '#10b981' },
    { name: 'Chờ xử lý', value: pending, color: '#f59e0b' },
    { name: 'Hoàn tất', value: arrived, color: '#8b5cf6' },
  ];

  const currentCategoryUnits = ORGANIZATION_STRUCTURE[newAcc.cat].units;
  const currentParentData = currentCategoryUnits.find(u => u.name === newAcc.parentUnit) || currentCategoryUnits[0];

  return (
    <div className="space-y-6">
      <div className="flex border-b bg-white rounded-t-xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setActiveTab('STATS')}
          className={`flex-1 py-4 px-6 text-sm font-black flex items-center justify-center gap-2 transition ${activeTab === 'STATS' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-700' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={18} /> THỐNG KÊ CHI TIẾT
        </button>
        <button 
          onClick={() => setActiveTab('USERS')}
          className={`flex-1 py-4 px-6 text-sm font-black flex items-center justify-center gap-2 transition ${activeTab === 'USERS' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-700' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <UserCog size={18} /> QUẢN TRỊ CÁN BỘ
        </button>
      </div>

      {notification && (
        <div className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-2xl z-[200] border bg-slate-900 text-white flex items-center gap-3 animate-in slide-in-from-bottom-4`}>
          {notification.type === 'success' ? <CheckCircle className="text-green-400" /> : <AlertCircle className="text-red-400" />}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}

      {activeTab === 'STATS' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-emerald-900 text-white p-8 rounded-2xl flex justify-between items-center shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em]">Hệ thống giám sát</p>
               <h3 className="text-2xl font-black tracking-tight">{isMaster ? 'TRUNG ĐOÀN TRƯỞNG' : currentUser.unit.toUpperCase()}</h3>
             </div>
             <Building2 size={80} className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Tổng số hồ sơ', value: total, icon: <Users />, color: 'bg-blue-50 text-blue-600' },
              { label: 'Đã duyệt', value: approved, icon: <CheckCircle />, color: 'bg-green-50 text-green-600' },
              { label: 'Chờ xử lý', value: pending, icon: <Clock />, color: 'bg-yellow-50 text-yellow-600' },
              { label: 'Vào cổng', value: arrived, icon: <MapPin />, color: 'bg-purple-50 text-purple-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-2xl shadow border">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-10 text-center">Biểu đồ hiệu quả phê duyệt</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value">
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-6">
              {statusData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: d.color}}></div>
                  <span className="text-xs font-black text-gray-600 uppercase tracking-tight">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {!isMaster && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 shadow-sm">
              <ShieldAlert size={24} />
              <div>
                <p className="font-black uppercase text-[10px]">Cảnh báo phân quyền</p>
                <p className="text-sm font-medium italic">Bạn chỉ có quyền quản lý cán bộ trực thuộc <span className="font-bold underline">{currentUser.unit}</span>.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 uppercase tracking-tight">
                <ShieldCheck className="text-yellow-500" /> Hệ thống Nhân sự Quản lý
              </h3>
              {isMaster && (
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-black uppercase text-xs hover:bg-emerald-800 transition flex items-center gap-2 shadow-lg"
                >
                  <UserPlus size={16} /> CẤP TÀI KHOẢN MỚI
                </button>
              )}
            </div>

            {showAddForm && isMaster && (
              <div className="p-6 bg-emerald-50/50 border-b animate-in slide-in-from-top duration-300">
                <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-1 tracking-widest">Username</label>
                    <input required className="w-full p-2.5 border rounded-xl text-sm" placeholder="VD: canbo_d1" value={newAcc.username} onChange={e => setNewAcc({...newAcc, username: e.target.value.toLowerCase().replace(/\s/g, '')})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-1 tracking-widest">Mật khẩu</label>
                    <input required className="w-full p-2.5 border rounded-xl text-sm" type="password" placeholder="••••••••" value={newAcc.password} onChange={e => setNewAcc({...newAcc, password: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-1 tracking-widest">Họ tên Cán bộ</label>
                    <input required className="w-full p-2.5 border rounded-xl text-sm" placeholder="Nguyễn Văn A" value={newAcc.fullName} onChange={e => setNewAcc({...newAcc, fullName: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Cấp quản lý</label>
                    <select className="w-full p-2.5 border rounded-xl text-sm font-bold" value={newAcc.cat} onChange={e => setNewAcc({...newAcc, cat: e.target.value as any, parentUnit: ORGANIZATION_STRUCTURE[e.target.value as keyof typeof ORGANIZATION_STRUCTURE].units[0].name})}>
                      {Object.entries(ORGANIZATION_STRUCTURE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Đơn vị quản lý</label>
                    <select className="w-full p-2.5 border rounded-xl text-sm font-bold" value={newAcc.parentUnit} onChange={e => setNewAcc({...newAcc, parentUnit: e.target.value})}>
                      {currentCategoryUnits.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-800 uppercase ml-1">Chi tiết Đại đội/Trung đội</label>
                    <select className="w-full p-2.5 border-2 border-emerald-300 rounded-xl text-sm font-black text-emerald-900" value={newAcc.specificUnit} onChange={e => setNewAcc({...newAcc, specificUnit: e.target.value})}>
                      <option value="TOÀN TIỂU ĐOÀN">QUẢN LÝ TOÀN TIỂU ĐOÀN</option>
                      {currentParentData.subUnits.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>

                  <div className="lg:col-span-3 flex justify-end">
                    <button type="submit" className="bg-emerald-900 text-white font-black py-3 px-10 rounded-xl uppercase tracking-[0.2em] shadow-xl hover:bg-black transition">XÁC NHẬN CẤP QUYỀN</button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-500 text-[10px] uppercase tracking-widest font-black">
                    <th className="px-6 py-4">Nhân sự / Chức vụ</th>
                    <th className="px-6 py-4">Phạm vi Quản lý</th>
                    <th className="px-6 py-4">Tài khoản</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-900">
                  {accounts.map((acc) => (
                    <tr key={acc.username} className={`hover:bg-gray-50 group ${acc.username === MASTER_PHONE ? 'bg-emerald-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-800">{acc.fullName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          {acc.username === MASTER_PHONE ? 'Master Admin' : (acc.role === 'ADMIN' ? 'Quản trị đơn vị' : 'Cán bộ phê duyệt')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md inline-flex">
                          <Building2 size={12} /> {acc.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-mono text-sm">
                          {acc.username}
                          <button 
                            onClick={() => setShowPasswords(prev => ({...prev, [acc.username]: !prev[acc.username]}))}
                            className="text-gray-300 hover:text-emerald-600 transition"
                          >
                            {showPasswords[acc.username] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          {showPasswords[acc.username] && <span className="text-emerald-700 font-bold ml-1">({acc.password})</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isMaster && acc.username !== MASTER_PHONE && (
                          <button 
                            onClick={() => onDeleteAccount(acc.username)} 
                            className="text-red-400 hover:text-red-700 p-2 transition-opacity opacity-0 group-hover:opacity-100"
                            title="Thu hồi quyền"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {acc.username === MASTER_PHONE && <span className="text-gray-300 italic text-xs">Mặc định</span>}
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
