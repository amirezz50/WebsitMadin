import { Legend } from '../ngx-canvas-area-draw.interfaces';
import { EmrSpecialtyMarkers } from './marker.component';

export interface EmrGraphicsMaster {
    serial?: number;
    masterSerial?: number;
    visitSerial?: number;
    shapeProp?: string;
    dataStatus?: number;
    emrSpecImageSerial?: number;
    imageSerial?: number;
    graphicsDetails?: Array<EmrGraphicsDetails>;
}

export interface EmrGraphicsDetails extends Legend {
    serial?: number;
    masterSerial?: number;
    emrMarkersSerial?: number;
    dataStatus?: number;
    markers?: EmrSpecialtyMarkers;
}
