
import React, { useState } from 'react';
import { Shield, LogOut, User as UserIcon, LogIn, Settings, Crown } from 'lucide-react';
import { Account } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: Account | null;
  onLogout: () => void;
  onShowLogin: () => void;
  onShowProfile?: () => void;
  activeRole: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onShowLogin, onShowProfile, activeRole }) => {
  const isMaster = user?.username === '0353991356';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="relative">
              <Shield className="text-yellow-400 group-hover:scale-110 transition-transform" size={32} />
              {isMaster && <Crown className="absolute -top-2 -right-2 text-yellow-300 animate-bounce" size={16} />}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold leading-none tracking-tight">QUÂN ĐỘI NHÂN DÂN VIỆT NAM</h1>
              <p className="text-[10px] md:text-xs text-emerald-300 font-medium tracking-widest">HỆ THỐNG QUẢN LÝ THĂM QUÂN NHÂN</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:block text-right">
                  <div className="flex items-center justify-end gap-2">
                    {isMaster && <span className="bg-yellow-400 text-emerald-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">MASTER</span>}
                    <p className="text-sm font-bold">{user.fullName}</p>
                  </div>
                  <p className="text-[10px] text-emerald-300 uppercase font-bold">{user.role} • {user.unit}</p>
                </div>
                
                <div className="flex items-center bg-emerald-800/50 p-1 rounded-xl border border-emerald-700">
                  <button 
                    onClick={onShowProfile}
                    className="p-2 hover:bg-emerald-700 rounded-lg transition-colors text-emerald-100 hover:text-white"
                    title="Cài đặt tài khoản"
                  >
                    <Settings size={20} />
                  </button>
                  <div className="w-px h-6 bg-emerald-700 mx-1"></div>
                  <button 
                    onClick={onLogout}
                    className="p-2 hover:bg-red-600 rounded-lg transition-all text-emerald-100 hover:text-white"
                    title="Đăng xuất"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onShowLogin}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-bold transition border border-emerald-600 shadow-sm"
              >
                <LogIn size={18} /> <span className="hidden sm:inline uppercase">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Shield className="text-emerald-900 opacity-30" size={32} />
            </div>
          </div>
          <p className="text-emerald-900 font-black uppercase text-xs tracking-[0.3em]">Cổng thông tin Đăng ký & Phê duyệt trực tuyến</p>
          <p className="text-gray-400 text-[10px] mt-4 max-w-md mx-auto leading-relaxed">
            Hệ thống được bảo mật bởi hạ tầng mạng quân sự. Mọi hành vi truy cập trái phép sẽ bị xử lý theo pháp luật.
          </p>
          <div className="mt-6 flex justify-center gap-6">
            <div className="h-1 w-12 bg-emerald-900/10 rounded-full"></div>
            <div className="h-1 w-12 bg-yellow-400/30 rounded-full"></div>
            <div className="h-1 w-12 bg-emerald-900/10 rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
