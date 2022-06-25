import { Component,Input } from '@angular/core';
import { CONFIG } from '../../shared/config';

export class DevExpressHelperComponent {
  
  reportUrl:string ;
  showReport(_arguments: any ,reportControllerName :string,reportActionName:string, reportClassName:string){

    this.reportUrl = CONFIG.Urls.reportUrl;
    let querystring = '';
    if (_arguments) {
      _arguments["Auth"] =this.getAuthParms()
      for (var key in _arguments) {
        if (_arguments.hasOwnProperty(key)) {
          if (!(_arguments[key] instanceof Date) && _arguments[key] != undefined) {
            querystring = `${querystring}&${key}=${_arguments[key]}`;
          }

        }
       
      }
      
     let finalUrl =  `${this.reportUrl}/${reportControllerName}/${reportActionName}/?name=${reportClassName}${querystring}`;
     window.open( finalUrl , '_blank');
      
    }
  }
  getAuthParms(){

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let forDebug = JSON.parse(sessionStorage.getItem('forDebug')); 
    let link = JSON.parse(sessionStorage.getItem('LinkObj')); 
    let linkId 
    if(link){
     linkId = link.code
    } else { 
      linkId = 0
    }
    
     let Auth=  btoa('SecloginId' + '/' + currentUser.secLoginId + ',' + 'BranchId' + '/' + currentUser.branchId + ','+ 'link'+ '/'+ linkId + ','+ 'ForDebug'+ '/'+ forDebug + ',' + 'AccountId' + '/' + currentUser.accountId)
     return Auth;
   }
}