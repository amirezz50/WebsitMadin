
import { AppCodeGroup } from './appcode-group'

export class ControlsParams {
    linkId: number;
    appCodeGroup: AppCodeGroup;
    required: boolean;
    appComponentName: string;
    category: string;

    constructor(_linkId: number, _appCodeGroup: AppCodeGroup, _required: boolean, _appComponentName?: string, _category?: string) {
        this.linkId = _linkId;
        this.appCodeGroup = _appCodeGroup;
        this.required = _required;
        this.appComponentName = _appComponentName;
        this.category = _category;
    }
}