
import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, Check, X, RefreshCw, Sparkles, User, Info, Eye, FileText, Clock as ClockIcon, ShieldCheck, MapPin, FileOutput } from 'lucide-react';
import { VisitRequest, VisitStatus, Account } from '../types';
import { STATUS_MAP, MOCK_UNIT_SCHEDULES, UNIT_CATEGORY_MAP } from '../constants';
import { getSmartAdvice } from '../services/gemini';
import { exportVisitRequestsToWord } from '../services/export';

interface OfficerDashboardProps {
  requests: VisitRequest[];
  onUpdateStatus: (id: string, status: VisitStatus, feedback?: string, proposedTime?: string) => void;
  currentUser: Account;
}

const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ requests, onUpdateStatus, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  const isMaster = currentUser.username === '0353991356';
  
  const filteredRequests = requests.filter(req => {
    // PHÂN QUYỀN TRUY CẬP DỮ LIỆU
    if (!isMaster) {
      if (currentUser.unit === req.parentUnit) {
      } else if (currentUser.unit === `${req.specificUnit} - ${req.parentUnit}`) {
      } else {
        return false;
      }
    }

    const matchesSearch = req.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.soldierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.specificUnit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesDate = !dateFilter || req.visitDate === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSelectRequest = async (req: VisitRequest) => {
    setSelectedRequest(req);
    setFeedback('');
    setNewStartTime('');
    setNewEndTime('');
    setAiAdvice('');
    setLoadingAi(true);
    const advice = await getSmartAdvice(req, MOCK_UNIT_SCHEDULES as any);
    setAiAdvice(advice || 'Không có tư vấn AI.');
    setLoadingAi(false);
  };

  const handleRepropose = () => {
    if (selectedRequest && newStartTime && newEndTime) {
      onUpdateStatus(selectedRequest.id, VisitStatus.REPROPOSED, feedback, `${newStartTime} - ${newEndTime}`);
    }
  };

  const handleExportWord = () => {
    if (filteredRequests.length === 0) {
      alert("Không có dữ liệu để xuất báo cáo cho ngày này.");
      return;
    }
    exportVisitRequestsToWord(filteredRequests, currentUser.unit, dateFilter);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               Danh sách Hồ sơ
            </h2>
            <div className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 uppercase tracking-tighter">
              {currentUser.unit}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm tên, đơn vị, mã..."
                className="pl-10 w-full rounded-md border-gray-300 border p-2 text-sm focus:ring-emerald-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="date" 
                className="w-full rounded-md border-gray-300 border p-2 text-xs font-bold outline-none"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <select
                className="w-full rounded-md border-gray-300 border p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Trạng thái</option>
                {Object.entries(STATUS_MAP).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportWord}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-black uppercase flex items-center justify-center gap-2 transition border border-slate-200"
            >
              <FileOutput size={14} /> Xuất báo cáo Word
            </button>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-400px)] pr-1 custom-scrollbar">
          {filteredRequests.map(req => (
            <div
              key={req.id}
              onClick={() => handleSelectRequest(req)}
              className={`p-4 rounded-xl shadow-sm border cursor-pointer transition-all duration-200 group relative ${selectedRequest?.id === req.id ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_MAP[req.status].color}`}>
                  {STATUS_MAP[req.status].label}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">#{req.id}</span>
              </div>
              <p className="font-bold text-gray-900 group-hover:text-emerald-800 transition-colors uppercase">{req.visitorName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <p className="text-[10px] font-black text-emerald-800 uppercase">{req.specificUnit} - {req.parentUnit}</p>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                  <CalendarIcon size={12} /> {req.visitDate}
                </div>
                <div className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {req.timeSlot}
                </div>
              </div>
            </div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed">
              <Info className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm italic">Không có hồ sơ trong ngày này</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedRequest ? (
          <div className="bg-white rounded-xl shadow border flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-700 text-white p-2 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Chi tiết Hồ sơ Thẩm định</h2>
                  <p className="text-xs text-emerald-700 font-black uppercase tracking-widest">{selectedRequest.specificUnit} • {selectedRequest.parentUnit}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Người đăng ký thăm</h3>
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700"><User size={24} /></div>
                    <div>
                      <p className="text-lg font-black text-slate-900 uppercase">{selectedRequest.visitorName}</p>
                      <p className="text-sm font-bold text-emerald-700">{selectedRequest.relationship} • {selectedRequest.visitorPhone}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono tracking-tighter">CCCD: {selectedRequest.visitorId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900/5 p-4 rounded-xl border border-emerald-900/10">
                  <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3">Quân nhân được thăm</h3>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-700" size={24} />
                    <div>
                      <p className="font-black text-emerald-900 text-lg uppercase leading-none">{selectedRequest.soldierName}</p>
                      <p className="text-sm font-bold text-emerald-700 uppercase tracking-tight mt-1">
                        {selectedRequest.soldierRank} — {selectedRequest.specificUnit} ({selectedRequest.parentUnit})
                      </p>
                    </div>
                  </div>
                </div>

                {selectedRequest.note && (
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <p className="text-[10px] font-black text-yellow-800 uppercase tracking-widest mb-1">Lời nhắn của thân nhân:</p>
                    <p className="text-sm text-yellow-900 italic">"{selectedRequest.note}"</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-white border-2 border-dashed border-emerald-100 rounded-xl">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Thời gian đề xuất</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <CalendarIcon className="text-emerald-700" size={16} />
                       <span className="text-sm font-black">{selectedRequest.visitDate}</span>
                    </div>
                    <div className="text-xs bg-emerald-700 text-white px-3 py-1 rounded-lg font-black tracking-widest shadow-md">
                       {selectedRequest.timeSlot}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={60} className="text-white" /></div>
                  <h3 className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-yellow-400" /> Trợ lý quân sự (AI)
                  </h3>
                  {loadingAi ? (
                    <div className="flex items-center gap-3 text-sm text-emerald-300 animate-pulse font-medium italic">
                      <RefreshCw size={18} className="animate-spin" /> 
                      <span>Đang phân tích trực chiến & huấn luyện...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-white leading-relaxed font-medium italic">"{aiAdvice}"</p>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border rounded-xl flex items-center gap-3 text-slate-500">
                  <MapPin size={20} className="text-emerald-700" />
                  <div className="text-xs">
                     <p className="font-bold uppercase tracking-widest text-[9px] text-gray-400 mb-0.5">Địa điểm tiếp khách:</p>
                     <p className="font-medium">Nhà văn hóa hoặc Phòng trực cổng {selectedRequest.parentUnit}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedRequest.status === VisitStatus.PENDING && (
              <div className="p-6 bg-slate-50 border-t mt-auto rounded-b-xl shadow-inner">
                <div className="mb-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Lời dặn hoặc lý do thay đổi lịch</label>
                  <textarea
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition shadow-inner"
                    rows={2}
                    placeholder="VD: Quân nhân đang đi huấn luyện, dời sang chiều..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => onUpdateStatus(selectedRequest.id, VisitStatus.APPROVED, feedback)}
                    className="flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-800 transition shadow-lg"
                  >
                    <Check size={18} /> PHÊ DUYỆT
                  </button>
                  <button
                    onClick={() => onUpdateStatus(selectedRequest.id, VisitStatus.REJECTED, feedback)}
                    className="flex items-center justify-center gap-2 bg-rose-600 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-rose-700 transition"
                  >
                    <X size={18} /> TỪ CHỐI
                  </button>
                  <div className="col-span-2 flex gap-2">
                    <input type="time" className="w-1/2 border rounded-xl p-3 text-sm font-bold" value={newStartTime} onChange={e => setNewStartTime(e.target.value)} />
                    <input type="time" className="w-1/2 border rounded-xl p-3 text-sm font-bold" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} />
                    <button
                      disabled={!newStartTime || !newEndTime}
                      onClick={handleRepropose}
                      className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex-grow"
                    >
                      ĐỔI GIỜ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-emerald-100">
            <ShieldCheck size={80} className="text-emerald-100 mb-6" />
            <p className="text-emerald-900/60 font-black text-xl uppercase tracking-widest">HỆ THỐNG PHÊ DUYỆT: {currentUser.unit}</p>
            <p className="text-gray-400 mt-2 font-medium italic">Chọn hồ sơ từ danh sách bên trái để thực hiện nghiệp vụ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
