
import React, { useState } from 'react';
import { User, Lock, Save, X, ShieldCheck, Crown } from 'lucide-react';
import { Account } from '../types';

interface ProfileSettingsProps {
  user: Account;
  onUpdate: (updatedUser: Account) => void;
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isMaster = user.username === '0353991356';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const accounts: Account[] = JSON.parse(localStorage.getItem('military_accounts') || '[]');
    const updatedAccounts = accounts.map(acc => {
      if (acc.username === user.username) {
        return {
          ...acc,
          fullName: formData.fullName,
          password: formData.password || acc.password
        };
      }
      return acc;
    });

    localStorage.setItem('military_accounts', JSON.stringify(updatedAccounts));
    
    const updatedUser = {
      ...user,
      fullName: formData.fullName,
      password: formData.password || user.password
    };
    
    onUpdate(updatedUser);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className={`p-6 text-white flex items-center justify-between ${isMaster ? 'bg-gradient-to-r from-emerald-900 to-yellow-700' : 'bg-emerald-900'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              {isMaster ? <Crown className="text-yellow-300" /> : <User />}
            </div>
            <div>
              <h2 className="text-lg font-bold">Cài đặt Tài khoản</h2>
              <p className="text-xs opacity-80">{isMaster ? 'Tài khoản Chủ Hệ thống' : 'Hồ sơ cá nhân'}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-xl text-xs border border-green-100 flex items-center gap-2">
            <ShieldCheck size={16} /> Cập nhật thành công!
          </div>}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Tên hiển thị</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm font-medium"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Mật khẩu mới (Bỏ trống nếu giữ nguyên)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {formData.password && (
              <div className="animate-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Xác nhận mật khẩu</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    required
                    type="password"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition text-sm"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 text-sm ${isMaster ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-emerald-700 hover:bg-emerald-800'}`}
            >
              <Save size={18} /> LƯU THAY ĐỔI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
