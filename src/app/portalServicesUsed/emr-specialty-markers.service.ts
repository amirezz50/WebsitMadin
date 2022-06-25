import { Injectable } from '@angular/core';
import { EmrGraphicsMaster } from '../blocks/ngx-canvas-area-draw/canvas-marker/emr-graphics.interface';
import { EmrSpecialtyMarkers } from '../blocks/ngx-canvas-area-draw/canvas-marker/marker.component';
import { HttpGeneralService } from '../shared';
import { CONFIG } from '../shared/config';

const emrUrl = CONFIG.baseUrls.emrSheets;

@Injectable()
export class EmrSpecialtyMarkersService {

    constructor(private htp: HttpGeneralService) { }

    medicalSpeciatiesMarkersSearch(entity: EmrSpecialtyMarkers) {
        return this.htp.search(entity, `${emrUrl}/EmrSpecialtyMarkers`);
    }

    medicalSpeciatiesMarkersSave(entity: EmrSpecialtyMarkers) {
        return this.htp.post(entity, `${emrUrl}/EmrSpecialtyMarkers`);
    }

    emrGraphicsSave(entity: EmrGraphicsMaster) {
        return this.htp.post(entity, `${emrUrl}/EmrGraphics`);
    }

    emrGraphicsSearch(entity: EmrGraphicsMaster) {
        return this.htp.search(entity, `${emrUrl}/EmrGraphics`);
    }

}
