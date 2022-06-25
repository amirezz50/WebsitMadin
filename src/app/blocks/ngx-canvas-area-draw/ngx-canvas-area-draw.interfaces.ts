export interface Legend {
  serial?: number;
  stateNumber?: number;
  nameAr?: string;
  nameEn?: string;
  shapeType?: string;
  shapeWidth?: number[];
  shapeAsText?: string;
  strokeColor?: string;
  shapeTypeTag?: string;

  shapeProp?: {
    x?: number;
    y?: number;

    radius?: number;
    startAngle?: number;
    EndAngle?: number;

    width?: number;
    height?: number;

    text?: string;
    points?: Array<Array<number>>;

    elementId?: string;
    state?: 1 | 2;
  };
  emrMarkersSerial?:number;
}
export const SHAPES = {
  ARC: 'ARC', // دائرة => 2
  REC: 'REC', // مستطيل => 1
  TRI: 'TRI', // مثلث => 3
  TEXT: 'TEXT', // نص
  PEN: 'PEN' // قلم
};
