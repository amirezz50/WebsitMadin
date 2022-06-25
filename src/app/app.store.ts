
//// redux 
//import { createStore } from 'redux';

/////////////////////////////////////////////
//import { appState, doctorState, specialityState, patientState, patientServicesState } from './app.action';

/////******************************************************************************************************///
/////******************************************************************************************************///
/////******************************************************************************************************///
//// specialiaty store state 
//export interface IAppState {
//    Speciality: any,
//    Doctor: any,
//    Patient: any,
//    PatientServices: any
//}

//export const Init_AppState: IAppState = {
//    Speciality: {},
//    Doctor: {},
//    Patient: {},
//    PatientServices: []
//}

//export function appReducer(state = Init_AppState, action) {
//    switch (action.type) {
//        case appState:
//            return action.newState;
//        default: return state;
//    }
//}
/////******************************************************************************************************///
/////******************************************************************************************************///
/////******************************************************************************************************///
//// specialiaty store state 
//export const Init_Speciality: ISpecialityState = {
//    Speciality: {
//        code: 0,
//        nameEn: '',
//        nameAr: '',
//        parentCode: 0,
//        active: 0
//    }
//}

//export interface ISpecialityState {
//    Speciality: any
//}

//export function specialityReducer(state = Init_Speciality, action) {
//    switch (action.type) {
//        case specialityState:
//            return action.newState;
//        default: return state;
//    }
//}

/////******************************************************************************************************///
/////******************************************************************************************************///
/////******************************************************************************************************///

//// Doctor store state 
//export const Init_Doctor: IDoctorState = {
//    Doctor: {}
//}

//export interface IDoctorState {
//    Doctor: any
//}

//export function doctorReducer(state = Init_Doctor, action) {
//    switch (action.type) {
//        case doctorState:
//            return action.newState;
//        default: return state;
//    }
//}

/////******************************************************************************************************///
/////******************************************************************************************************///
/////******************************************************************************************************///

//// Patient store state
//export const Init_Patient: IPatientState = {
//    Patient: {}
//}

//export interface IPatientState {
//    Patient: any
//}

//export function patientReducer(state = Init_Patient, action) {
//    switch (action.type) {
//        case patientState:
//            return action.newState;
//        default: return state;
//    }
//}

////***************************************************************************************************************

//export const appStore = createStore<IAppState>(appReducer);
//export const specialityStore = createStore<ISpecialityState>(specialityReducer);
//export const doctorStore = createStore<IDoctorState>(doctorReducer);
//export const patientStore = createStore<IPatientState>(patientReducer);


