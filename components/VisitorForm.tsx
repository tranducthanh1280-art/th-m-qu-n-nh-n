
import React, { useState, useEffect } from 'react';
import { Send, User, Calendar, Clock, Shield, CheckCircle2, QrCode, Copy, Building2, Layers, Download } from 'lucide-react';
import { VisitRequest, UnitCategory } from '../types';
import { ORGANIZATION_STRUCTURE } from '../constants';

interface VisitorFormProps {
  onSubmit: (request: Omit<VisitRequest, 'id' | 'status' | 'createdAt'>) => void;
  lastSubmitId: string | null;
  onReset: () => void;
  onTrack: () => void;
}

const VisitorForm: React.FC<VisitorFormProps> = ({ onSubmit, lastSubmitId, onReset, onTrack }) => {
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorId: '',
    visitorPhone: '',
    relationship: '',
    soldierName: '',
    soldierRank: 'Hạ sĩ',
    category: 'BATTALION' as keyof typeof ORGANIZATION_STRUCTURE,
    parentUnit: 'Tiểu đoàn 1',
    specificUnit: 'Đại đội 1',
    visitDate: '',
    startTime: '08:00',
    endTime: '10:00',
    note: ''
  });

  // Khi thay đổi Category hoặc ParentUnit, cập nhật specificUnit mặc định
  useEffect(() => {
    const categoryData = ORGANIZATION_STRUCTURE[formData.category];
    const parent = categoryData.units.find(u => u.name === formData.parentUnit) || categoryData.units[0];
    setFormData(prev => ({ ...prev, specificUnit: parent.subUnits[0] }));
  }, [formData.category, formData.parentUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { startTime, endTime, category, ...rest } = formData;
    onSubmit({
      ...rest,
      unitCategory: category as UnitCategory,
      timeSlot: `${startTime} - ${endTime}`
    });
  };

  const copyToClipboard = () => {
    if (lastSubmitId) {
      navigator.clipboard.writeText(lastSubmitId);
      alert('Đã sao chép mã tra cứu!');
    }
  };

  if (lastSubmitId) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${lastSubmitId}&margin=10`;

    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-emerald-700 text-center space-y-6 animate-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle2 size={56} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Đăng ký thành công</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Hồ sơ thăm quân nhân tại <span className="text-emerald-700 font-bold">{formData.specificUnit} - {formData.parentUnit}</span> đã được gửi đi.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <QrCode size={120} />
          </div>
          
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Mã tra cứu quân nhân thăm</p>
          
          <div className="flex items-center justify-center gap-4">
            <span className="text-5xl font-black tracking-[0.2em] font-mono text-white drop-shadow-md">
              {lastSubmitId}
            </span>
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Sao chép mã"
            >
              <Copy size={20} />
            </button>
          </div>
          
          <div className="mt-6 flex justify-center flex-col items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-lg border-4 border-emerald-500/20 ring-4 ring-white/5">
              <img 
                src={qrUrl} 
                alt={`Mã QR cho hồ sơ ${lastSubmitId}`} 
                className="w-40 h-40 rounded-lg"
              />
            </div>
            <a 
              href={qrUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors"
            >
              <Download size={14} /> Tải mã QR về máy
            </a>
          </div>

          <p className="text-[10px] text-emerald-300 mt-4 italic font-medium">
            * Chụp màn hình hoặc lưu mã QR để làm thủ tục xác minh tại cổng gác.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <button 
            onClick={onTrack}
            className="bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            <QrCode size={18} /> KIỂM TRA TRẠNG THÁI
          </button>
          <button 
            onClick={onReset}
            className="bg-white text-emerald-700 border-2 border-emerald-700 py-4 rounded-xl font-bold hover:bg-emerald-50 transition"
          >
            ĐĂNG KÝ MỚI
          </button>
        </div>
      </div>
    );
  }

  const currentCategoryData = ORGANIZATION_STRUCTURE[formData.category];
  const currentParentData = currentCategoryData.units.find(u => u.name === formData.parentUnit) || currentCategoryData.units[0];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border overflow-hidden">
      <div className="bg-emerald-800 p-6 text-white text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Calendar /> ĐĂNG KÝ THĂM QUÂN NHÂN
        </h2>
        <p className="text-emerald-100 opacity-90 mt-1">Hồ sơ sẽ được chuyển trực tiếp đến Chỉ huy Đơn vị quản lý</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* THÔNG TIN NGƯỜI THĂM */}
        <section>
          <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest border-b pb-2 mb-4 flex items-center gap-2">
            <User size={18} /> 1. Thông tin Thân nhân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Họ và tên</label>
              <input required className="w-full rounded-xl border-gray-200 border p-2.5 text-sm" placeholder="Nguyễn Văn A" value={formData.visitorName} onChange={e => setFormData({...formData, visitorName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Số CCCD</label>
              <input required className="w-full rounded-xl border-gray-200 border p-2.5 text-sm" placeholder="012345678901" value={formData.visitorId} onChange={e => setFormData({...formData, visitorId: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Số điện thoại</label>
              <input required type="tel" className="w-full rounded-xl border-gray-200 border p-2.5 text-sm" placeholder="09xx xxx xxx" value={formData.visitorPhone} onChange={e => setFormData({...formData, visitorPhone: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Quan hệ với quân nhân</label>
              <select required className="w-full rounded-xl border-gray-200 border p-2.5 text-sm" value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})}>
                <option value="">Chọn quan hệ</option>
                <option value="Cha/Mẹ">Cha/Mẹ</option>
                <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                <option value="Vợ/Chồng">Vợ/Chồng</option>
                <option value="Bạn bè">Bạn bè</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
        </section>

        {/* ĐƠN VỊ TIẾP NHẬN - PHÂN CẤP */}
        <section className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
          <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest border-b border-emerald-200 pb-2 mb-4 flex items-center gap-2">
            <Shield size={18} /> 2. Đơn vị Tiếp nhận
          </h3>
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-800 ml-1">Tên quân nhân được thăm</label>
              <input required className="w-full rounded-xl border-emerald-200 border p-3 font-black text-emerald-900 uppercase" placeholder="NGUYỄN VĂN B" value={formData.soldierName} onChange={e => setFormData({...formData, soldierName: e.target.value.toUpperCase()})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Khối đơn vị</label>
                <select 
                  className="w-full rounded-xl border-gray-200 border p-2.5 text-sm font-bold"
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value as any;
                    setFormData({
                      ...formData, 
                      category: cat, 
                      parentUnit: ORGANIZATION_STRUCTURE[cat as keyof typeof ORGANIZATION_STRUCTURE].units[0].name
                    });
                  }}
                >
                  {Object.entries(ORGANIZATION_STRUCTURE).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Tiểu đoàn / Khối</label>
                <select 
                  className="w-full rounded-xl border-gray-200 border p-2.5 text-sm font-bold"
                  value={formData.parentUnit}
                  onChange={(e) => setFormData({...formData, parentUnit: e.target.value})}
                >
                  {currentCategoryData.units.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Đại đội / Trung đội</label>
                <select 
                  className="w-full rounded-xl border-emerald-300 bg-emerald-50 border-2 p-2.5 text-sm font-black text-emerald-900 shadow-sm"
                  value={formData.specificUnit}
                  onChange={(e) => setFormData({...formData, specificUnit: e.target.value})}
                >
                  {currentParentData.subUnits.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* THỜI GIAN */}
        <section>
          <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest border-b pb-2 mb-4 flex items-center gap-2">
            <Clock size={18} /> 3. Thời gian dự kiến
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Ngày thăm</label>
              <input required type="date" className="w-full rounded-xl border-gray-200 border p-2.5 text-sm" min={new Date().toISOString().split('T')[0]} value={formData.visitDate} onChange={e => setFormData({...formData, visitDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Từ giờ</label>
              <input required type="time" className="w-full rounded-xl border-gray-200 border p-2.5 text-sm" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Đến giờ</label>
              <input required type="time" className="w-full rounded-xl border-gray-200 border p-2.5 text-sm" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-emerald-700 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition shadow-xl flex items-center justify-center gap-2"
        >
          <Send size={20} /> GỬI ĐĂNG KÝ THĂM QUÂN NHÂN
        </button>
      </form>
    </div>
  );
};

export default VisitorForm;
