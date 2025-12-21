
export enum VisitStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REPROPOSED = 'REPROPOSED',
  REJECTED = 'REJECTED',
  ARRIVED = 'ARRIVED'
}

export type UnitCategory = 'REGIMENT_HQ' | 'BATTALION' | 'DIRECT_COMPANY';

export interface MilitarySubUnit {
  id: string;
  name: string;
  parentId: string; // ID của Tiểu đoàn hoặc Khối
}

export interface VisitRequest {
  id: string;
  visitorName: string;
  visitorId: string;
  visitorPhone: string;
  relationship: string;
  soldierName: string;
  soldierRank: string;
  parentUnit: string;      // VD: Tiểu đoàn 1
  specificUnit: string;    // VD: Đại đội 1 hoặc bTT
  unitCategory: UnitCategory;
  visitDate: string;
  timeSlot: string;
  note?: string;
  status: VisitStatus;
  feedback?: string;
  proposedTime?: string;
  createdAt: number;
  arrivedAt?: number;
}

export interface Account {
  username: string;
  fullName: string;
  role: 'OFFICER' | 'ADMIN' | 'VISITOR';
  // Đơn vị quản lý: Có thể là "Tiểu đoàn 1" (quản lý hết D1) 
  // hoặc "Đại đội 1 - Tiểu đoàn 1" (chỉ quản lý C1)
  unit: string; 
  parentUnit?: string; // Để lọc cấp Tiểu đoàn
  password?: string;
  email?: string;
  phone?: string;
}

export interface UnitSchedule {
  id: string;
  title: string;
  date: string;
  type: 'TRAINING' | 'DUTY' | 'RESTRICTED' | 'EVENT';
  description: string;
}
