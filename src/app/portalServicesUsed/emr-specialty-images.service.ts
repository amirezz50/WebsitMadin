import { Injectable } from '@angular/core';
import { EmrSpecialtyImages } from '../blocks/ngx-carousel-master/carousel-viewer/carousel-viewer.component';
import { HttpGeneralService } from '../shared';
import { CONFIG } from '../shared/config';


const emrUrl = CONFIG.baseUrls.emrSheets;

@Injectable()
export class EmrSpecialtyImagesService {

    constructor(private http: HttpGeneralService) { }

    MedicalSpeciatiesImagesSearch(entity: EmrSpecialtyImages) {
        return this.http.search(entity, `${emrUrl}/EmrSpecialtyImages`);
    }

    MedicalSpeciatiesImagesSave(entity: EmrSpecialtyImages) {
        return this.http.add(entity, `${emrUrl}/EmrSpecialtyImages`);
    }

}
