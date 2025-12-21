
import React, { useState } from 'react';
import { Shield, Mail, Phone, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Account } from '../types';

interface RegisterProps {
  onRegisterSuccess: (account: Account) => void;
  onBackToLogin: () => void;
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onBackToLogin, onClose }) => {
  const [regMethod, setRegMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [formData, setFormData] = useState({
    fullName: '',
    identifier: '', // Email hoặc Phone
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    // Kiểm tra định dạng đơn giản
    if (regMethod === 'EMAIL' && !formData.identifier.includes('@')) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ.');
      return;
    }
    if (regMethod === 'PHONE' && !/^\d{10,11}$/.test(formData.identifier)) {
      setError('Vui lòng nhập số điện thoại hợp lệ (10-11 số).');
      return;
    }

    const accounts: Account[] = JSON.parse(localStorage.getItem('military_accounts') || '[]');
    
    if (accounts.some(a => a.username === formData.identifier)) {
      setError('Tài khoản này đã tồn tại trên hệ thống.');
      return;
    }

    const newAccount: Account = {
      username: formData.identifier,
      fullName: formData.fullName,
      role: 'VISITOR',
      unit: 'Khách tự do',
      password: formData.password,
      email: regMethod === 'EMAIL' ? formData.identifier : undefined,
      phone: regMethod === 'PHONE' ? formData.identifier : undefined
    };

    const updatedAccounts = [...accounts, newAccount];
    localStorage.setItem('military_accounts', JSON.stringify(updatedAccounts));
    
    onRegisterSuccess(newAccount);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-emerald-900 p-6 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-emerald-300 hover:text-white">✕</button>
          <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User className="text-emerald-900" size={24} />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Đăng ký Tài khoản</h2>
          <p className="text-emerald-200 text-xs mt-1">Dành cho Khách thăm và Thân nhân</p>
        </div>

        <div className="p-6">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => { setRegMethod('EMAIL'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${regMethod === 'EMAIL' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500'}`}
            >
              <Mail size={16} /> Gmail
            </button>
            <button 
              onClick={() => { setRegMethod('PHONE'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${regMethod === 'PHONE' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500'}`}
            >
              <Phone size={16} /> Số điện thoại
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-100">{error}</div>}
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    required
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 outline-none transition text-sm"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  {regMethod === 'EMAIL' ? 'Địa chỉ Gmail' : 'Số điện thoại'}
                </label>
                <div className="relative">
                  {regMethod === 'EMAIL' ? <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} /> : <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />}
                  <input
                    required
                    type={regMethod === 'EMAIL' ? 'email' : 'tel'}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 outline-none transition text-sm"
                    placeholder={regMethod === 'EMAIL' ? 'example@gmail.com' : '09xxxxxxxx'}
                    value={formData.identifier}
                    onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    required
                    type="password"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 outline-none transition text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    required
                    type="password"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 outline-none transition text-sm"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              HOÀN TẤT ĐĂNG KÝ
            </button>
            
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-2 text-emerald-700 font-medium text-sm hover:underline mt-2"
            >
              <ArrowLeft size={16} /> Quay lại Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
