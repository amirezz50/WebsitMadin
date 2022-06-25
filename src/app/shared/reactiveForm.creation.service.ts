import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';



@Injectable()
export class FormGroupCreationService {

    newFormGroup: FormGroup;

    constructor(private _fb: FormBuilder) {
        this.newFormGroup = this._fb.group({})
    }
    /**********************************************************************************
     * used to return form group control from model data
     * you must send init object to this method with initail value in earch form control
     * you want to add to returned form groub
     *
     * @param _dataModel generic type of model object
     */
    createFormGroupFromModel<T>(_dataModel: T) {

        for (let key in _dataModel) {
            this.newFormGroup.addControl(key, new FormControl());
        }
        return this.newFormGroup;
    }








}
