export enum OrderRequestEnum {
  AdmissionRequest = 1,
  TransferToClinicRequest = 2,
  BedTransferRequest = 3,
  orderRequest = 4,
  sickLeaveRequest=5
}

export const OrderRequests = [
  {serial:6616, nameAr: 'طلب حجز', tagName: 'ADM_REQ', nameEn: 'Admission Request', orderCode: 1 },
  {serial:6617, nameAr: 'طلب تحويل', tagName: 'TRANSFER_REQ', nameEn: 'Transfer Request', orderCode: 2 },
  {serial:6618, nameAr: 'طلب نقل لسرير آخر', tagName: 'BED_TRANSFER_REQ', nameEn: 'Bed Transfer Request', orderCode: 3 },
  {serial:6619, nameAr: 'طلب دم', tagName: 'BLOOD_REQ', nameEn: 'Blood Request', orderCode: 4 },
  {serial:6690, nameAr: 'طلب احازه مرضيه', tagName: 'SICK_LEAVE_REQ', nameEn: 'Sick Leave Request', orderCode: 5 }
]
