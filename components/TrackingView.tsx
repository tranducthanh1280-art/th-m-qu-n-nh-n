
import React, { useState } from 'react';
import { Search, Calendar, User, Shield, Info, QrCode, MapPin, CheckCircle, Camera } from 'lucide-react';
import { VisitRequest, VisitStatus } from '../types';
import { STATUS_MAP } from '../constants';

interface TrackingViewProps {
  requests: VisitRequest[];
  onConfirmArrival?: (id: string) => void;
}

const TrackingView: React.FC<TrackingViewProps> = ({ requests, onConfirmArrival }) => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<VisitRequest | null>(null);
  const [searched, setSearched] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = () => {
    const term = searchId.toLowerCase().trim();
    if (!term) return;

    const found = requests.find(r => 
      r.id.toLowerCase().includes(term) || 
      r.visitorPhone.replace(/\s/g, '').includes(term.replace(/\s/g, ''))
    );
    
    setResult(found || null);
    setSearched(true);
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const approved = requests.find(r => r.status === VisitStatus.APPROVED);
      if (approved) {
        setSearchId(approved.id);
        setResult(approved);
        setSearched(true);
      } else {
        alert("Vui lòng nhập mã thủ công. Không tìm thấy mã QR hợp lệ trong tầm camera.");
      }
    }, 1500);
  };

  const confirmArrival = () => {
    if (result && onConfirmArrival) {
      onConfirmArrival(result.id);
      setResult({ ...result, status: VisitStatus.ARRIVED, arrivedAt: Date.now() });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <QrCode size={80} />
        </div>
        
        <h2 className="text-xl font-bold text-emerald-900 mb-2">Tra cứu Trạng thái Lịch thăm</h2>
        <p className="text-sm text-gray-500 mb-4 font-medium italic">Dành cho Thân nhân & Vệ binh trực cổng</p>
        
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-xl border-gray-200 border p-4 pr-12 focus:ring-2 focus:ring-emerald-500 outline-none transition shadow-sm font-mono text-lg uppercase"
              placeholder="Nhập Mã tra cứu (VD: XA4B2)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={simulateScan}
              className="absolute right-3 top-3 p-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
              title="Quét mã QR"
            >
              <Camera size={20} />
            </button>
          </div>
          
          <button
            onClick={handleSearch}
            className="bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Search size={20} /> TÌM KIẾM HỒ SƠ
          </button>
        </div>

        {isScanning && (
          <div className="absolute inset-0 bg-emerald-900/90 flex flex-col items-center justify-center text-white animate-in fade-in">
            <div className="relative w-48 h-48 border-2 border-emerald-400 rounded-2xl overflow-hidden mb-4">
              <div className="absolute inset-0 bg-emerald-400/20 animate-pulse"></div>
              <div className="w-full h-0.5 bg-emerald-400 absolute top-0 shadow-[0_0_15px_rgba(52,211,153,1)] animate-[scan_2s_infinite]"></div>
            </div>
            <p className="font-bold tracking-widest uppercase text-xs">Đang nhận diện mã QR...</p>
            <style>{`
              @keyframes scan {
                0% { top: 0; }
                50% { top: 100%; }
                100% { top: 0; }
              }
            `}</style>
          </div>
        )}
      </div>

      {searched && result && (
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`p-4 text-center text-white font-black tracking-[0.2em] text-sm bg-emerald-900`}>
             KẾT QUẢ TRA CỨU HỆ THỐNG
          </div>
          
          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 mb-4 shadow-xl transition-transform hover:scale-105 duration-300 ${STATUS_MAP[result.status].color.split(' ')[1].replace('bg-', 'border-')}`}>
                {React.cloneElement(STATUS_MAP[result.status].icon as any, { size: 56, className: STATUS_MAP[result.status].color.split(' ')[0] })}
              </div>
              <h3 className={`text-3xl font-black tracking-tight ${STATUS_MAP[result.status].color.split(' ')[0]}`}>
                {STATUS_MAP[result.status].label.toUpperCase()}
              </h3>
              <p className="text-gray-400 text-sm mt-2 font-mono">Mã hồ sơ: <span className="font-bold text-slate-700">#{result.id}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                  <User size={20} className="text-emerald-700" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Người đăng ký</p>
                  <p className="font-bold text-slate-900 leading-tight">{result.visitorName}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{result.relationship} • {result.visitorPhone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                  <Shield size={20} className="text-emerald-700" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quân nhân</p>
                  <p className="font-bold text-slate-900 leading-tight">{result.soldierName}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{result.specificUnit} - {result.parentUnit}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2 border-t border-slate-200/50 pt-4 mt-2">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                  <Calendar size={20} className="text-emerald-700" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lịch thăm đã đăng ký</p>
                  <p className="font-bold text-slate-900">{result.visitDate}</p>
                  <p className="text-sm font-black text-emerald-700 mt-1">{result.timeSlot}</p>
                </div>
              </div>
            </div>

            {/* Arrival Confirmation Section */}
            {result.status === VisitStatus.APPROVED && (
              <div className="bg-purple-900 p-6 rounded-2xl text-white shadow-xl animate-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-800 rounded-xl">
                    <MapPin size={24} className="text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Thủ tục tại cổng gác</h4>
                    <p className="text-xs text-purple-200">Vệ binh xác nhận khi thân nhân trình hồ sơ.</p>
                  </div>
                </div>
                <button
                  onClick={confirmArrival}
                  className="w-full bg-white text-purple-900 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-50 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> XÁC NHẬN CÓ MẶT
                </button>
              </div>
            )}

            {result.status === VisitStatus.ARRIVED && (
              <div className="bg-slate-100 p-5 rounded-xl border border-dashed border-slate-300 text-center">
                 <p className="text-slate-500 text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={16} className="text-purple-600" /> 
                    Đã hoàn thành thủ tục vào cổng lúc {new Date(result.arrivedAt || Date.now()).toLocaleTimeString('vi-VN')}
                 </p>
              </div>
            )}

            {result.status === VisitStatus.REPROPOSED && (
               <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <p className="text-blue-800 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 mb-2">
                     <Info size={14} /> Đề xuất đổi giờ từ Đơn vị
                  </p>
                  <p className="text-3xl font-black text-blue-900 font-mono tracking-tighter">{result.proposedTime}</p>
                  <p className="text-sm text-blue-700 mt-3 font-medium leading-relaxed italic border-t border-blue-100 pt-2">"{result.feedback || 'Vui lòng xác nhận lịch mới.'}"</p>
               </div>
            )}

            {result.feedback && result.status !== VisitStatus.REPROPOSED && (
               <div className="p-5 bg-slate-50 border rounded-2xl italic">
                  <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Phản hồi của đơn vị:</p>
                  <p className="text-slate-700 font-medium leading-relaxed">"{result.feedback}"</p>
               </div>
            )}

            {result.status === VisitStatus.APPROVED && (
              <div className="p-5 bg-green-50 border-2 border-green-200 rounded-2xl flex items-start gap-4">
                 <div className="p-3 bg-green-600 rounded-2xl text-white shadow-md"><Shield size={24} /></div>
                 <div className="text-sm text-green-900">
                    <p className="font-black uppercase tracking-tight text-green-800 mb-2">Hướng dẫn ra vào</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Trình hồ sơ này cho vệ binh gác cổng.</li>
                      <li className="flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Mang theo CCCD/CMND bản gốc.</li>
                      <li className="flex items-center gap-2 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Tuân thủ nội quy tiếp khách của đơn vị.</li>
                    </ul>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {searched && !result && (
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-dashed text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-bold">Không tìm thấy hồ sơ đăng ký nào.</p>
          <p className="text-sm text-slate-400 mt-2 font-medium">Vui lòng kiểm tra lại Mã số hoặc Số điện thoại của bạn.</p>
        </div>
      )}
    </div>
  );
};

export default TrackingView;
