import { Injectable } from "@angular/core";
import { SelectizeService } from "./selectize.service";
import { UserSessionService } from "../../shared/shared";

@Injectable()
export class SelectizeAddItemHelper {
    constructor(
        private _userSessionService: UserSessionService,
        private _selectizeService: SelectizeService
    ) { }


    addItem(data: any) {
        let arrData = [];
        this._selectizeService.saveNewItem(data)
            .subscribe(
                c => { 
                    arrData = c.data;
                },
                error => console.log(error),
                () => {
                    this._userSessionService.setSessionKey('NewItemData' + data.appCode , arrData[0]);
                });
    }
}