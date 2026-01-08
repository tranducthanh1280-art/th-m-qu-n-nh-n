
import React, { useState, useEffect, useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/Layout';
import VisitorForm from './components/VisitorForm';
import OfficerDashboard from './components/OfficerDashboard';
import TrackingView from './components/TrackingView';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ProfileSettings from './components/ProfileSettings';
import { VisitRequest, VisitStatus, Account } from './types';
import { QrCode, Search, ClipboardList, User as UserIcon, Crown } from 'lucide-react';

const App: React.FC = () => {
  const MASTER_PHONE = '0353991356';

  // Quản lý tài khoản tập trung
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = JSON.parse(localStorage.getItem('military_accounts') || '[]');
    // Đảm bảo luôn có Master Admin
    if (!saved.some((a: Account) => a.username === MASTER_PHONE)) {
      const master: Account = {
        username: MASTER_PHONE,
        fullName: 'BCH TRUNG ĐOÀN',
        role: 'ADMIN',
        unit: 'Ban Chỉ huy Đơn vị',
        password: '123',
        phone: MASTER_PHONE
      };
      const initial = [...saved, master];
      localStorage.setItem('military_accounts', JSON.stringify(initial));
      return initial;
    }
    return saved;
  });

  const [user, setUser] = useState<Account | null>(() => {
    const saved = localStorage.getItem('military_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [visitorMode, setVisitorMode] = useState<'REGISTER' | 'TRACK'>('REGISTER');
  const [requests, setRequests] = useState<VisitRequest[]>(() => {
    const saved = localStorage.getItem('military_visits');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastSubmitId, setLastSubmitId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('military_visits', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('military_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('military_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('military_auth_user');
    }
  }, [user]);

  const handleAddAccount = (newAcc: Account) => {
    setAccounts(prev => {
      if (prev.some(a => a.username === newAcc.username)) return prev;
      return [...prev, newAcc];
    });
  };

  const handleDeleteAccount = (username: string) => {
    if (username === MASTER_PHONE) return;
    setAccounts(prev => prev.filter(a => a.username !== username));
  };

  const handleCreateRequest = (data: any) => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newRequest: VisitRequest = {
      ...data,
      id: newId,
      status: VisitStatus.PENDING,
      createdAt: Date.now()
    };
    setRequests([newRequest, ...requests]);
    setLastSubmitId(newId);
  };

  const handleUpdateStatus = (id: string, status: VisitStatus, feedback?: string, proposedTime?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status, feedback, proposedTime, arrivedAt: status === VisitStatus.ARRIVED ? Date.now() : req.arrivedAt } : req
    ));
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfile(false);
  };

  const renderVisitorContent = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {!lastSubmitId && (
          <div className="flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-emerald-50 inline-flex flex-wrap justify-center gap-1">
              <button 
                onClick={() => setVisitorMode('REGISTER')}
                className={`px-6 sm:px-10 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${visitorMode === 'REGISTER' ? 'bg-emerald-700 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <QrCode size={18} /> Đăng ký Thăm
              </button>
              <button 
                onClick={() => setVisitorMode('TRACK')}
                className={`px-6 sm:px-10 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${visitorMode === 'TRACK' ? 'bg-emerald-700 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Search size={18} /> Tra cứu Trạng thái
              </button>
            </div>
          </div>
        )}

        {visitorMode === 'REGISTER' ? (
          <VisitorForm 
            onSubmit={handleCreateRequest} 
            lastSubmitId={lastSubmitId}
            onReset={() => setLastSubmitId(null)}
            onTrack={() => { setLastSubmitId(null); setVisitorMode('TRACK'); }}
          />
        ) : (
          <TrackingView requests={requests} onConfirmArrival={(id) => handleUpdateStatus(id, VisitStatus.ARRIVED)} />
        )}
      </div>
    );
  };

  return (
    <>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        onShowLogin={() => setShowLogin(true)} 
        onShowProfile={() => setShowProfile(true)}
        activeRole={user?.role || 'VISITOR'}
      >
        {showLogin && (
        <Login 
          accounts={accounts}
          onLogin={(acc) => { setUser(acc); setShowLogin(false); }} 
          onClose={() => setShowLogin(false)} 
        />
      )}
      
      {showProfile && user && (
        <ProfileSettings 
          user={user} 
          onUpdate={(updatedUser) => {
            setUser(updatedUser);
            setAccounts(prev => prev.map(a => a.username === updatedUser.username ? updatedUser : a));
          }} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      {!user || user.role === 'VISITOR' ? (
        <div className="space-y-6">
          {user && user.role === 'VISITOR' && !lastSubmitId && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-300 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-md"><UserIcon size={20} /></div>
                <div>
                  <p className="text-sm font-black text-emerald-900">Thân nhân: {user.fullName}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Tài khoản đã định danh</p>
                </div>
              </div>
            </div>
          )}
          {renderVisitorContent()}
        </div>
      ) : (
        <div className="space-y-6">
          {user.role === 'OFFICER' ? (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-50 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                 <div className="relative z-10">
                   <h2 className="text-2xl font-black text-emerald-900 flex items-center gap-3 uppercase">
                     <ClipboardList className="text-emerald-700" /> Cổng Phê duyệt: {user.unit}
                   </h2>
                   <p className="text-gray-500 mt-1 font-medium italic">Trách nhiệm - Chính xác - Kịp thời</p>
                 </div>
                 <div className="bg-emerald-900 text-white px-4 py-2 rounded-xl text-center relative z-10 shadow-lg">
                    <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Trạng thái trực</p>
                    <p className="text-xs font-bold uppercase">Sẵn sàng xử lý</p>
                 </div>
              </div>
              <OfficerDashboard requests={requests} onUpdateStatus={handleUpdateStatus} currentUser={user} />
            </div>
          ) : (
            <div className="space-y-6">
               <div className={`p-8 rounded-2xl shadow-2xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${user.username === MASTER_PHONE ? 'bg-gradient-to-br from-emerald-950 to-emerald-800 text-white border-emerald-700' : 'bg-white border-emerald-50'}`}>
                   {user.username === MASTER_PHONE && <Crown className="absolute top-4 right-4 text-yellow-400 opacity-20" size={40} />}
                   <div className="relative z-10">
                       <h2 className="text-3xl font-black uppercase tracking-tight">{user.username === MASTER_PHONE ? 'TRUNG TÂM QUẢN TRỊ MASTER' : `TRUNG TÂM QUẢN TRỊ ${user.unit.toUpperCase()}`}</h2>
                       <p className={`mt-2 font-medium ${user.username === MASTER_PHONE ? 'text-emerald-200' : 'text-gray-500'}`}>
                         Điều phối và giám sát nhân sự quản lý lịch thăm đơn vị.
                       </p>
                   </div>
               </div>
               <AdminDashboard 
                 requests={requests} 
                 currentUser={user} 
                 accounts={accounts}
                 onAddAccount={handleAddAccount}
                 onDeleteAccount={handleDeleteAccount}
               />
            </div>
          )}
        </div>
      )}
    </Layout>
    <SpeedInsights />
    </>
  );
};

export default App;
