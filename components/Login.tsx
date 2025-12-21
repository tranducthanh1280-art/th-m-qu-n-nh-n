
import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Account } from '../types';
import Register from './Register';

interface LoginProps {
  accounts: Account[];
  onLogin: (account: Account) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ accounts, onLogin, onClose }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Tìm trong danh sách tài khoản được truyền xuống
    const user = accounts.find(a => a.username === formData.username && a.password === formData.password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu. Vui lòng kiểm tra lại.');
    }
  };

  if (showRegister) {
    return (
      <Register 
        onRegisterSuccess={(acc) => { onLogin(acc); onClose(); }} 
        onBackToLogin={() => setShowRegister(false)} 
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-emerald-900 p-8 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-emerald-300 hover:text-white">✕</button>
          <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="text-emerald-900" size={32} />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Cổng thông tin Đơn vị</h2>
          <p className="text-emerald-200 text-sm mt-1">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 mb-4">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Tên đăng nhập / Email / SĐT</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 outline-none transition"
                  placeholder="Username / Email / SĐT"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 outline-none transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2 mt-6"
          >
            <LogIn size={20} /> ĐĂNG NHẬP
          </button>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase">Hoặc</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="w-full bg-white text-emerald-700 border-2 border-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-50 transition flex items-center justify-center gap-2"
          >
            <UserPlus size={20} /> ĐĂNG KÝ TÀI KHOẢN MỚI
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-4 italic">
            Thông tin của bạn được bảo mật theo quy định của đơn vị.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
