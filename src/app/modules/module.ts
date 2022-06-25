import {ComponentType} from './component-type';
export interface Module {
    code: number;
    branchId: number;
    nameEn: string;
    nameAr: string;
    parentCode: number;
    levelNo: number;
    compType: ComponentType;
    routePath: string;
    iconName: string;
    active: boolean;
    lastModifyAdminId: number;
    isFavorited: boolean;
    mode: string;
    imagePath?:string;
}


