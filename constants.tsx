
import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, MapPin, Swords, Zap, Landmark } from 'lucide-react';
import { VisitStatus, UnitCategory } from './types';

export const STATUS_MAP = {
  [VisitStatus.PENDING]: {
    label: 'Chờ duyệt',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: <Clock size={16} />
  },
  [VisitStatus.APPROVED]: {
    label: 'Đã duyệt',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: <CheckCircle2 size={16} />
  },
  [VisitStatus.REPROPOSED]: {
    label: 'Đề nghị đổi lịch',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: <AlertCircle size={16} />
  },
  [VisitStatus.REJECTED]: {
    label: 'Từ chối',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: <XCircle size={16} />
  },
  [VisitStatus.ARRIVED]: {
    label: 'Đã đến cổng',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    icon: <MapPin size={16} />
  }
};

// Cấu trúc tổ chức chi tiết
export const ORGANIZATION_STRUCTURE = {
  BATTALION: {
    label: 'Khối Tiểu đoàn',
    units: [
      { 
        id: 'D1', 
        name: 'Tiểu đoàn 1', 
        subUnits: ['Đại đội 1', 'Đại đội 2', 'Đại đội 3', 'Đại đội 4', 'bTT (Thông tin)', 'bSPG (Hỏa lực)', 'b12,7 (Phòng không)', 'bNQ (Nuôi quân)'] 
      },
      { 
        id: 'D2', 
        name: 'Tiểu đoàn 2', 
        subUnits: ['Đại đội 5', 'Đại đội 6', 'Đại đội 7', 'Đại đội 8', 'bTT (Thông tin)', 'bSPG (Hỏa lực)', 'b12,7 (Phòng không)', 'bNQ (Nuôi quân)'] 
      },
      { 
        id: 'D3', 
        name: 'Tiểu đoàn 3', 
        subUnits: ['Đại đội 9', 'Đại đội 10', 'Đại đội 11', 'Đại đội 12', 'bTT (Thông tin)', 'bSPG (Hỏa lực)', 'b12,7 (Phòng không)', 'bNQ (Nuôi quân)'] 
      }
    ]
  },
  REGIMENT_HQ: {
    label: 'Khối Cơ quan',
    units: [
      { 
        id: 'HQ', 
        name: 'Cơ quan Trung đoàn', 
        subUnits: ['Ban Tham mưu', 'Ban Chính trị', 'Ban Hậu cần - Kỹ thuật'] 
      }
    ]
  },
  DIRECT_COMPANY: {
    label: 'Khối Trực thuộc',
    units: [
      { 
        id: 'DC', 
        name: 'Các đại đội trực thuộc', 
        subUnits: [
          'C14 (Cối 100)', 
          'C15 (SPG9)', 
          'C16 (SMPK 12,7)', 
          'C17 (Công binh)', 
          'C18 (Thông tin)', 
          'C20 (Trinh sát)', 
          'C24 (Quân y)', 
          'C25 (Vận tải)'
        ] 
      }
    ]
  }
};

export const UNIT_CATEGORY_MAP: Record<UnitCategory, { label: string, color: string, icon: React.ReactNode }> = {
  REGIMENT_HQ: {
    label: 'Khối Cơ quan',
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: <Landmark size={14} />
  },
  BATTALION: {
    label: 'Khối Tiểu đoàn',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: <Swords size={14} />
  },
  DIRECT_COMPANY: {
    label: 'Khối Trực thuộc',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: <Zap size={14} />
  }
};

export const MOCK_UNIT_SCHEDULES = [
  { id: '1', date: '2024-05-20', title: 'Huấn luyện Bắn súng', type: 'TRAINING', description: 'Huấn luyện dã ngoại cả ngày' },
  { id: '2', date: '2024-05-21', title: 'Trực SSCĐ Cao', type: 'DUTY', description: 'Toàn đơn vị trực chiến' },
  { id: '3', date: '2024-05-22', title: 'Ngày Hội Thao', type: 'EVENT', description: 'Giao lưu văn nghệ thể thao' }
];
