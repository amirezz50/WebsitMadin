import { Injectable } from '@angular/core';

//services
import { AuthService } from './auth.service';
import { LoaderService } from '../ng2-loader/ng2-loader';

//custom types
import { SharedDateService } from './date.service';
import { DatePipe } from '@angular/common';

@Injectable()
export class FhirService {
    defaultUserBranch: number;
    fhirJsonObj: any
    fhirJsonText: any


    constructor(private loaderService: LoaderService,
        private _authService: AuthService,
        public datepipe: DatePipe,
        private _sharedDateService: SharedDateService,
    ) {
        _authService.fetchuserInfo().subscribe(c => { if (c && c.userID) this.defaultUserBranch = c.defaultBranch });
    }

    setFormSettings(settingFileName: string, folder?: string) {
        this.loaderService.getSettings(`${settingFileName}_${this.defaultUserBranch == undefined ? 1 : this.defaultUserBranch}`, folder).subscribe(
            v => {
                this.fhirJsonObj = v
                // if( settingFileName  == 'fhirPaymentResponse'){
                //     this.fhirJsonObj = JSON.parse(v['item'][3]['request']['body']['raw'] );
                // }
                // else{
                //     this.fhirJsonObj = v
                // }
            },
            error => console.log(error),
            () => {

            }
        );
    }

    //--------------------------------GENERAL ID----------------------------------
    getRandomId(keyName, KeyVal) {
        if (keyName == "bundelId") {
            this.fhirJsonObj['id'] = KeyVal
        }
    }

    getTimeStamp(keyName, KeyVal) {
        if (keyName == "timestamp") {
            this.fhirJsonObj['timestamp'] = KeyVal
        }
    }

    //-------------------------------------------ELEGABLILITY----------------------------------
    getObjVal(keyName, KeyVal) {
        if (keyName == "gender") {
            this.fhirJsonObj['entry'][4].resource[keyName] = KeyVal == 1 ? "male" : "female"
        }
        if (keyName == "patCode") {
            this.fhirJsonObj['entry'][4].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][4].fullUrl = `http://provider.com/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['patient']['reference'] = `http://provider.com/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][2].resource['subscriber']['reference'] = `http://provider.com/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][2].resource['beneficiary']['reference'] = `http://provider.com/Patient/${KeyVal}`
        }
        if (keyName == "birthDate") {
            this.fhirJsonObj['entry'][4].resource[keyName] = KeyVal
        }
        if (keyName == "identifierCode") {
            this.fhirJsonObj['entry'][4].resource['identifier'][0]['type']['coding'][0]['code'] = KeyVal == 4 ? "DP" : "VS"
        }

        if (keyName == "identifierValue") {
             this.fhirJsonObj['entry'][4].resource['identifier'][0]['value'] = KeyVal
        }
        if (keyName == "maritalStatus") {
            // this.fhirJsonObj['entry'][4].resource[keyName]['coding'][0]['code'] = KeyVal == 1 ? "L" : KeyVal == 2 ? "U"
            //     : KeyVal == 3 ? "W" : KeyVal == 4 ? "D" : "U"
        }
        if (keyName == "nameGiven") {
            this.fhirJsonObj['entry'][4].resource['name'][0]['given'] = KeyVal
        }
        if (keyName == "nameText") {
            this.fhirJsonObj['entry'][4].resource['name'][0]['text'] = KeyVal
        }
        if (keyName == "telecom") {
            this.fhirJsonObj['entry'][4].resource[keyName][0]['value'] = `+${KeyVal}`
        }
        if (keyName == "_gender") {
            this.fhirJsonObj['entry'][4].resource[keyName]['extension'][0]['valueCodeableConcept']['coding'][0]['code'] =
                KeyVal == 1 ? "male" : "female"
        }

        if (keyName == "destination") {
            this.fhirJsonObj['entry'][5].resource['name'] = KeyVal
        }

        if (keyName == "provider") {
            this.fhirJsonObj['entry'][3].resource['id'] = KeyVal.branchCode
            this.fhirJsonObj['entry'][3].resource['name'] = KeyVal.branchName
            this.fhirJsonObj['entry'][3].fullUrl = `http://provider.com/Organization/${KeyVal.branchCode}`
            this.fhirJsonObj['entry'][1].resource['provider']['reference'] = `http://provider.com/Organization/${KeyVal.branchCode}`
            this.fhirJsonObj['entry'][6].resource['managingOrganization']['reference'] = `http://provider.com/Organization/${KeyVal.branchCode}`
        } 

        if (keyName == "nphiesID") {
            this.fhirJsonObj['entry'][1].resource['insurer']['reference'] = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][2].resource['payor'][0]['reference'] = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][5].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][5].fullUrl = `http://provider.com/Organization/${KeyVal}`
        }
        if (keyName == "focus") {
            this.fhirJsonObj['entry'][0].resource[keyName][0]['reference'] = `http://sgh.com.sa/CoverageEligibilityRequest/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].fullUrl = `http://sgh.com.sa/CoverageEligibilityRequest/${KeyVal}`
        }

        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

       // // if (keyName == "period") {
       // //     this.fhirJsonObj['entry'][2].resource['period']['start'] = KeyVal.startDate
      //  //     this.fhirJsonObj['entry'][2].resource['period']['end'] = KeyVal.endDate
      //  // }
        if (keyName == "subscriberId") {
         //   this.fhirJsonObj['entry'][2].resource[keyName] = KeyVal
         //   this.fhirJsonObj['entry'][2].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "EligablityType") {
            this.fhirJsonObj['entry'][1].resource['purpose'] = []
            this.fhirJsonObj['entry'][1].resource['purpose'][0] = KeyVal

            if(KeyVal == 'discovery'){
                
            }
        } 

        if (keyName == "SerivesDate") {
            this.fhirJsonObj['entry'][1].resource['servicedPeriod']['start']  = KeyVal
            this.fhirJsonObj['entry'][1].resource['servicedPeriod']['end'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['created'] = KeyVal
        }
    }


    //-------------------------------------------PRIAUTHORIZATION-----------------------------------
    replaceAuthVals(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "claimId") {
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://pr-fhir.com.sa/Claim/${KeyVal}`
            this.fhirJsonObj['entry'][1].fullUrl = `http://pr-fhir.com.sa/Claim/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "patCode") {
            this.fhirJsonObj['entry'][1].resource['patient']['reference'] = `Patient/${KeyVal}`
            this.fhirJsonObj['entry'][2].fullUrl = `http://pr-fhir.com.sa/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][2].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][3].resource['beneficiary']['reference'] = `Patient/${KeyVal}`
        }

        if (keyName == "insurer") {
            this.fhirJsonObj['entry'][1].resource['insurer']['reference'] = `Organization/${KeyVal}`
            this.fhirJsonObj['entry'][3].resource['payor'][0]['reference'] = `Organization/${KeyVal}`
            this.fhirJsonObj['entry'][7].fullUrl = `http://pr-fhir.com.sa/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][7].resource['id'] = KeyVal
        }

        if (keyName == "careTeam") {
            this.fhirJsonObj['entry'][4].fullUrl = `http://pr-fhir.com.sa/Practitioner/${KeyVal}`
            this.fhirJsonObj['entry'][4].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][5].resource['practitioner']['reference'] = `Practitioner/${KeyVal}`
        }

        if (keyName == "identityVal") {
            this.fhirJsonObj['entry'][2].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "patFullName") {
            this.fhirJsonObj['entry'][2].resource['name'][0]['text'] = KeyVal
        }
        if (keyName == "patNameArr") {
            this.fhirJsonObj['entry'][2].resource['name'][0]['given'] = KeyVal
        }
        if (keyName == "familyName") {
            this.fhirJsonObj['entry'][2].resource['name'][0]['family'] = KeyVal
        }
        if (keyName == "gender") {
            this.fhirJsonObj['entry'][2].resource['gender'] = KeyVal == 1 ? 'male' : 'female'
            this.fhirJsonObj['entry'][2].resource['_gender']['extension'][0]['valueCodeableConcept']['coding'][0]['code'] = KeyVal == 1 ? 'male' : 'female'
        }
        if (keyName == "birthDate") {
            this.fhirJsonObj['entry'][2].resource['birthDate'] = KeyVal
        }
        if (keyName == "createdDate") {
            this.fhirJsonObj['entry'][1].resource['created'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['item'][0]['servicedDate'] = KeyVal
        }

        if (keyName == "serviceCode") {
            this.fhirJsonObj['entry'][1].resource['item'][0]['productOrService']['coding'][0]['code'] = KeyVal ? KeyVal : null
        }

        if (keyName == "serviceName") {
            this.fhirJsonObj['entry'][1].resource['item'][0]['productOrService']['text'] = KeyVal
        }

        if (keyName == "serviceCost") {
            //net = ((quantity * unit price) * factor) + tax
            let quantity = this.fhirJsonObj['entry'][1].resource['item'][0]['quantity']['value']
            let tax = this.fhirJsonObj['entry'][1].resource['item'][0]['extension'][1]['valueMoney']['value']
            //-------------------------
            this.fhirJsonObj['entry'][1].resource['item'][0]['unitPrice']['value'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['item'][0]['net']['value'] = (((KeyVal * quantity) * 1) + tax)
            this.fhirJsonObj['entry'][1].resource['total']['value'] = (((KeyVal * quantity) * 1) + tax)
            //-------------------------
        }

        if (keyName == "relationship") {
            this.fhirJsonObj['entry'][3].resource['relationship']['coding'][0]['code'] = KeyVal
            this.fhirJsonObj['entry'][3].resource['relationship']['coding'][0]['display'] = KeyVal
        }

        if (keyName == "Practionerlicense") {
            this.fhirJsonObj['entry'][4].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "nphiesSpecialtyID") {
            this.fhirJsonObj['entry'][5].resource['specialty'][0]['coding'][0]['code'] = KeyVal
        }

        if (keyName == "specialtyName") {
            this.fhirJsonObj['entry'][6].resource['specialty'][0]['text'] = KeyVal
        }


        if (keyName == "specialtyPK") {
            this.fhirJsonObj['entry'][1].resource['careTeam'][0]['provider']['reference'] = `PractitionerRole/${KeyVal}`
            this.fhirJsonObj['entry'][5].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][5].fullUrl = `http://pr-fhir.com.sa/PractitionerRole/${KeyVal}`
        }

        if (keyName == "NphiesProvID") {
            this.fhirJsonObj['entry'][6].fullUrl = `http://pr-fhir.com.sa/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][6].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['provider']['reference'] = `Organization/${KeyVal}`
            this.fhirJsonObj['entry'][5].resource['organization']['reference'] = `Organization/${KeyVal}`
        }

        if (keyName == "diagnosis") {
            if (KeyVal.type == "institutional") {
                this.fhirJsonObj['entry'][1].resource['diagnosis'][0]['onAdmission']['coding'][0]['code'] = KeyVal.diagCode ? 'y' : 'n'
            }
            this.fhirJsonObj['entry'][1].resource['diagnosis'][0]['diagnosisCodeableConcept']['coding'][0]['code'] = KeyVal.diagCode
        }

        if (keyName == "medicalDevice") {
            if (KeyVal.type == "pharmacy") {
                this.fhirJsonObj['entry'][1].resource['item'][0]['productOrService']['coding'][0]['system'] = `http://nphies.sa/terminology/CodeSystem/medical-devices`
                this.fhirJsonObj['entry'][1].resource['item'][0]['productOrService']['coding'][0]['code'] = KeyVal.medicalDeviceCode
            }
        }


        if (keyName == "AuthorizationType") {
            let supType
            switch (KeyVal) {
                case 'institutional':
                    supType = 'ip'
                    break;

                case 'professional':
                    supType = 'op'
                    break;

                case 'oral':
                    supType = 'op'
                    break;

                case 'pharmacy':
                    supType = 'op'
                    break;

                case 'vision':
                    supType = 'op'
                    break;
                default:
                    supType = 'ip'
                    break;

            }
            this.fhirJsonObj['entry'][1].resource['type']['coding'][0]['code'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['subType']['coding'][0]['code'] = supType
            this.fhirJsonObj['entry'][1].resource['meta']['profile'][0] = `http://nphies.sa/fhir/ksa/nphies-fs/StructureDefinition/${KeyVal}-priorauth|1.0.0`

            if (KeyVal == 'professional' || KeyVal == 'oral' || KeyVal == 'pharmacy' || KeyVal == 'vision') {
                delete this.fhirJsonObj['entry'][1].resource['diagnosis'][0]['onAdmission'];
            }
            if (KeyVal == 'pharmacy') {
                delete this.fhirJsonObj['entry'][1].resource['careTeam'][0]['qualification'];
            }
        }


        // if (keyName == "diagnosis") {
        //     this.fhirJsonObj['entry'][2].resource['identifier'][0]['value'] = KeyVal
        // }

        if (keyName == "identityValue") {
            this.fhirJsonObj['entry'][2].resource['identifier'][0]['value'] = KeyVal
        }




    }

    //--------------------------------------------CLAIM--------------------------------------

    replaceClaim(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "claimId") {
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://provider.com/Claim/${KeyVal}`
            this.fhirJsonObj['entry'][1].fullUrl = `http://provider.com/Claim/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "patCode") {
            this.fhirJsonObj['entry'][1].resource['patient']['reference'] = `http://provider.com/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][3].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][3].fullUrl = `http://provider.com/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][5].resource['subscriber']['reference'] = `http://provider.com/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][5].resource['beneficiary']['reference'] = `http://provider.com/Patient/${KeyVal}`
            this.fhirJsonObj['entry'][7].resource['subject']['reference'] = `http://provider.com/Patient/${KeyVal}`

        }

        if (keyName == "createdDate") {
            this.fhirJsonObj['entry'][1].resource['created'] = KeyVal
        }

        if (keyName == "insurer") {
            this.fhirJsonObj['entry'][1].resource['insurer']['reference'] = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][4].fullUrl = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][4].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][5].resource['payor'][0]['reference'] = `http://provider.com/Organization/${KeyVal}`
        }

        if (keyName == 'provider') {
            this.fhirJsonObj['entry'][1].resource['provider']['reference'] = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][2].fullUrl = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][2].resource['id'] = KeyVal
            //  this.fhirJsonObj['entry'][3].resource['managingOrganization']['reference'] = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][6].resource['organization']['reference'] = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][7].resource['hospitalization']['origin']['reference'] = `http://provider.com/Organization/${KeyVal}`
            this.fhirJsonObj['entry'][7].resource['serviceProvider']['reference'] = `http://provider.com/Organization/${KeyVal}`
        }

        if (keyName == 'providerName') {
            this.fhirJsonObj['entry'][2].resource['name'] = KeyVal
        }

        if (keyName == 'InsurerName') {
            this.fhirJsonObj['entry'][4].resource['name'] = KeyVal
        }

        if (keyName == "specialtyPK") {
            this.fhirJsonObj['entry'][1].resource['careTeam'][0]['provider']['reference'] = `http://provider.com/PractitionerRole/${KeyVal}`
            this.fhirJsonObj['entry'][6].fullUrl = `http://provider.com/PractitionerRole/${KeyVal}`
            this.fhirJsonObj['entry'][6].resource['id'] = KeyVal
        }
        if (keyName == "nphiesSpecialtyID") {
            this.fhirJsonObj['entry'][6].resource['specialty'][0]['coding'][0]['code'] = KeyVal
        }

        if (keyName == "serviceCode") {
            this.fhirJsonObj['entry'][1].resource['item'][0]['productOrService']['coding'][0]['code'] = KeyVal ? KeyVal : null
        }

        if (keyName == "serviceName") {
            this.fhirJsonObj['entry'][1].resource['item'][0]['productOrService']['text'] = KeyVal
        }
        if (keyName == "servicedDate") {
            this.fhirJsonObj['entry'][1].resource['item'][0]['servicedDate'] = KeyVal
        }

        if (keyName == "TaxAndSharedVal") {
            this.fhirJsonObj['entry'][1].resource['item'][0]['extension'][1]['valueMoney']['value'] = KeyVal.vatValue
            this.fhirJsonObj['entry'][1].resource['item'][0]['extension'][2]['valueMoney']['value'] = KeyVal.sharedPrice
        }
        
        if (keyName == "servicesTotalCost") {
            //---------------
             //net = ((quantity * unit price) * factor) + tax
             let quantity = this.fhirJsonObj['entry'][1].resource['item'][0]['quantity']['value']
             let tax = this.fhirJsonObj['entry'][1].resource['item'][0]['extension'][1]['valueMoney']['value']
            this.fhirJsonObj['entry'][1].resource['item'][0]['unitPrice']['value'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['item'][0]['net']['value'] = (((KeyVal * quantity) * 1) + tax)
            this.fhirJsonObj['entry'][1].resource['total']['value'] = (((KeyVal * quantity) * 1) + tax)
             //------------------------- 
        }

        // if (keyName == "servicesTotalCost") {
        // }

        if (keyName == "identityValue") {
            this.fhirJsonObj['entry'][3].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "patientName") {
            this.fhirJsonObj['entry'][3].resource['name'][0]['text'] = KeyVal
        }
        if (keyName == "patientFamilyName") {
            this.fhirJsonObj['entry'][3].resource['name'][0]['family'] = KeyVal
        }

        if (keyName == "patientFullName") {
            this.fhirJsonObj['entry'][3].resource['name'][0]['given'] = KeyVal
        }

        if (keyName == "telecom") {
            this.fhirJsonObj['entry'][3].resource['telecom'][0]['value'] =`+${KeyVal}` 
        }

        if (keyName == "gender") {
            this.fhirJsonObj['entry'][3].resource['gender'] = KeyVal == 1 ? 'male' : 'female'
            this.fhirJsonObj['entry'][3].resource['_gender']['extension'][0]['valueCodeableConcept']['coding'][0]['code'] = KeyVal == 1 ? 'male' : 'female'
        }

        if (keyName == "birthDate") {
            this.fhirJsonObj['entry'][3].resource['birthDate'] = KeyVal
        }

        if (keyName == "servicePeriod") {
          //  this.fhirJsonObj['entry'][1].resource['extension'][2]['valuePeriod']['start'] = this.datepipe.transform(KeyVal.startDate, 'yyyy-MM-dd')
          //  this.fhirJsonObj['entry'][1].resource['extension'][2]['valuePeriod']['end'] = this.datepipe.transform(KeyVal.endDate, 'yyyy-MM-dd')
            this.fhirJsonObj['entry'][7].resource['period']['start'] = this.datepipe.transform(KeyVal.startDate, 'yyyy-MM-dd')
            this.fhirJsonObj['entry'][7].resource['period']['end'] = this.datepipe.transform(KeyVal.endDate, 'yyyy-MM-dd')
            this.fhirJsonObj['entry'][1].resource['billablePeriod']['start'] = this.datepipe.transform(KeyVal.startDate, 'yyyy-MM-dd')
            this.fhirJsonObj['entry'][1].resource['billablePeriod']['end'] = this.datepipe.transform(KeyVal.endDate, 'yyyy-MM-dd')

        }

       // if (keyName == "visitSerial") {
          //  this.fhirJsonObj['entry'][1].resource['extension'][0]['valueIdentifier']['value'] = KeyVal
       //     this.fhirJsonObj['entry'][7].resource['identifier'][0]['value'] = KeyVal
       // }

        // if (keyName == "Practionerlicense") {
        //     this.fhirJsonObj['entry'][6].resource['practitioner']['identifier']['value'] = KeyVal
        // }

        //------------------------- Serivces Array -------------------------
        if (keyName == "patientServices") {
            if (KeyVal && KeyVal.length > 0) {
                let itemObjCop = Object.assign({}, this.fhirJsonObj['entry'][1].resource['item'][0]);
                this.fhirJsonObj['entry'][1].resource['item'] = []
                KeyVal.forEach((ele, indx) => {
                    itemObjCop['sequence'] = indx + 1
                    itemObjCop['unitPrice']['value'] = ele.serviceCost
                    itemObjCop['net']['value'] = ele.serviceCost
                    itemObjCop['servicedDate'] = this.datepipe.transform(ele.realActionDate, 'yyyy-MM-dd')
                    itemObjCop['productOrService']['text'] = ele.serviceNameEn
                    itemObjCop['productOrService']['coding'][0]['code'] = ele.codeHyphanated ? ele.codeHyphanated : null
                    this.fhirJsonObj['entry'][1].resource['item'].push(itemObjCop)
                    // itemObjCop = <any>{}
                    console.log(this.fhirJsonObj)
                });
            }
        }
        //------------------------------------------------------------------
        if (keyName == "visitNo") {
         //   this.fhirJsonObj['entry'][1].resource['extension'][3]['valueReference']['reference'] = `http://pr-fhir.com.sa/Encounter/${KeyVal}`
            this.fhirJsonObj['entry'][7].fullUrl = `http://pr-fhir.com.sa/Encounter/${KeyVal}`
            this.fhirJsonObj['entry'][7].resource['id'] = KeyVal
        }

        if (keyName == "diagnosis") {
            this.fhirJsonObj['entry'][1].resource['diagnosis'][0]['onAdmission']['coding'][0]['code'] = KeyVal ? 'y' : 'n'
            this.fhirJsonObj['entry'][1].resource['diagnosis'][0]['diagnosisCodeableConcept']['coding'][0]['code'] = KeyVal
        }

        if (keyName == "docSchedual") {
            let tempWeekArr = [];
            KeyVal.forEach(ele => {
                if (ele['weekDayName']) {
                    tempWeekArr.push(ele['weekDayName'])
                }
            });
            // this.fhirJsonObj['entry'][6].resource['availableTime'][0]['daysOfWeek'] = tempWeekArr
        }

        if (keyName == "AuthorizationType") {
            let supType
            switch (KeyVal) {
                case 'institutional':
                    supType = 'ip'
                    break;

                case 'professional':
                    supType = 'op'
                    break;

                default:
                    supType = 'ip'
                    break;

            }
            this.fhirJsonObj['entry'][1].resource['type']['coding'][0]['code'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['subType']['coding'][0]['code'] = supType
            this.fhirJsonObj['entry'][1].resource['meta']['profile'][0] = `http://nphies.sa/fhir/ksa/nphies-fs/StructureDefinition/${KeyVal}-claim|1.0.0`

            if (KeyVal == 'pharmacy') {
                delete this.fhirJsonObj['entry'][1].resource['careTeam'][0]['qualification'];
            }
        }

    

        if (keyName == "subscriberId") {
            this.fhirJsonObj['entry'][5].resource['subscriberId'] = KeyVal ? KeyVal : 474;
            this.fhirJsonObj['entry'][5].resource['identifier'][0]['value'] = KeyVal ? KeyVal : 474;
        }

    }

    //-------------------------------------Poll-------------------------------------
    replacePoll(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "TaskId") {
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://nphies.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].fullUrl = `http://nphies.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "PollType") {
            this.fhirJsonObj['entry'][1].resource['input'][0]['valueCode'] = KeyVal
        }
        if (keyName == "PollPeriod") {
            this.fhirJsonObj['entry'][1].resource['input'][1]['valuePeriod']['start'] = KeyVal.start
            this.fhirJsonObj['entry'][1].resource['input'][1]['valuePeriod']['end'] = KeyVal.end
        }

        if (keyName == "sender") {
            let id = KeyVal.resource['id']
            this.fhirJsonObj['entry'][2].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][2].resource['id'] = id
            this.fhirJsonObj['entry'][1].resource['requester']['reference'] = `http://pr-fhir.com.sa/Organization/${id}`
        }

        // if (keyName == "resciever") {
        //     let id = KeyVal.resource['id']
        //     this.fhirJsonObj['entry'][3].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
        //     this.fhirJsonObj['entry'][3].resource['id'] = id
        //     this.fhirJsonObj['entry'][1].resource['owner']['reference'] = `Organization/${id}`
        // }

        if (keyName == "currentDate") {
            this.fhirJsonObj['entry'][1].resource['authoredOn'] = KeyVal.start
            this.fhirJsonObj['entry'][1].resource['lastModified'] = KeyVal.end
        }

    }
    //-----------------------------------Cancel Request---------------------------- 
    replaceCancelRequest(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "TaskId") {
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://pr-fhir.com.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].fullUrl = `http://pr-fhir.com.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "CancelType") {
            let cancelType: string
            switch (KeyVal) {
                case 'EligibilityRequest':
                    cancelType = 'CoverageEligibilityRequest'
                    break;

                case 'AuthorizationRequest':
                    cancelType = 'Claim'
                    break;

                case 'ClaimRequest':
                    cancelType = 'Claim'
                    break;

            }
            this.fhirJsonObj['entry'][1].resource['focus']['type'] = cancelType
            this.fhirJsonObj['entry'][1].resource['focus']['identifier']['system'] = `http://happyvalley.com/${cancelType}`
        }

        if (keyName == "msgCancelId") {
            this.fhirJsonObj['entry'][1].resource['focus']['identifier']['value'] = KeyVal
        }

        if (keyName == "currentDate") {
            this.fhirJsonObj['entry'][1].resource['authoredOn'] = KeyVal.start
            this.fhirJsonObj['entry'][1].resource['lastModified'] = KeyVal.end
        }

        if (keyName == "sender") {
            let id = KeyVal.resource['id']
            let senderName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][2].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][2].resource['id'] = id
            this.fhirJsonObj['entry'][2].resource['name'] = senderName;
            this.fhirJsonObj['entry'][1].resource['requester']['reference'] = `Organization/${id}`
        }

        if (keyName == "resciever") {
            let id = KeyVal.resource['id']
            let rescieverName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][3].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][3].resource['id'] = id
            this.fhirJsonObj['entry'][3].resource['name'] = rescieverName;
            this.fhirJsonObj['entry'][1].resource['owner']['reference'] = `Organization/${id}`
        }
    }
    //---------------------------------Nullify Request-----------------------------
    replaceNullifyRequest(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "TaskId") {
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://pr-fhir.com.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].fullUrl = `http://pr-fhir.com.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "CancelType") {
            let cancelType: string
            switch (KeyVal) {
                case 'EligibilityRequest':
                    cancelType = 'CoverageEligibilityRequest'
                    break;

                case 'AuthorizationRequest':
                    cancelType = 'Claim'
                    break;

                case 'ClaimRequest':
                    cancelType = 'Claim'
                    break;

            }
            this.fhirJsonObj['entry'][1].resource['focus']['type'] = cancelType
            this.fhirJsonObj['entry'][1].resource['focus']['identifier']['system'] = `http://happyvalley.com/${cancelType}`
        }

        if (keyName == "msgCancelId") {
            this.fhirJsonObj['entry'][1].resource['focus']['identifier']['value'] = KeyVal
        }

        if (keyName == "currentDate") {
            this.fhirJsonObj['entry'][1].resource['authoredOn'] = KeyVal.start
            this.fhirJsonObj['entry'][1].resource['lastModified'] = KeyVal.end
        }

        if (keyName == "sender") {
            let id = KeyVal.resource['id']
            let senderName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][2].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][2].resource['id'] = id
            this.fhirJsonObj['entry'][2].resource['name'] = senderName;
            this.fhirJsonObj['entry'][1].resource['requester']['reference'] = `Organization/${id}`
        }

        if (keyName == "resciever") {
            let id = KeyVal.resource['id']
            let rescieverName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][3].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][3].resource['id'] = id
            this.fhirJsonObj['entry'][3].resource['name'] = rescieverName;
            this.fhirJsonObj['entry'][1].resource['owner']['reference'] = `Organization/${id}`
        }
    }
    //---------------------------------CheckStatus Request-------------------------
    replaceCheckStatusRequest(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "TaskId") {
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://nphies.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].fullUrl = `http://nphies.sa/Task/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
        }

        if (keyName == "CancelType") {
            let cancelType: string
            switch (KeyVal) {
                case 'EligibilityRequest':
                    cancelType = 'CoverageEligibilityRequest'
                    break;

                case 'AuthorizationRequest':
                    cancelType = 'Claim'
                    break;

                case 'ClaimRequest':
                    cancelType = 'Claim'
                    break;

            }
            this.fhirJsonObj['entry'][1].resource['focus']['type'] = cancelType
            this.fhirJsonObj['entry'][1].resource['focus']['identifier']['system'] = `http://happyvalley.com/${cancelType}`
        }

        if (keyName == "msgCancelId") {
            this.fhirJsonObj['entry'][1].resource['focus']['identifier']['value'] = KeyVal
        }

        if (keyName == "currentDate") {
            this.fhirJsonObj['entry'][1].resource['authoredOn'] = KeyVal.start
            this.fhirJsonObj['entry'][1].resource['lastModified'] = KeyVal.end
        }

        if (keyName == "sender") {
            let id = KeyVal.resource['id']
            let senderName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][2].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][2].resource['id'] = id
            this.fhirJsonObj['entry'][2].resource['name'] = senderName;
            this.fhirJsonObj['entry'][1].resource['requester']['reference'] = `http://pr-fhir.com.sa/Organization/${id}`
        }

        if (keyName == "resciever") {
            let id = KeyVal.resource['id']
            let rescieverName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][3].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][3].resource['id'] = id
            this.fhirJsonObj['entry'][3].resource['name'] = rescieverName;
            this.fhirJsonObj['entry'][1].resource['owner']['reference'] = `http://pr-fhir.com.sa/Organization/${id}`
        }
    }
    //--------------------------------Communication Request------------------------
    getCommunicationValidation(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "CommunicationRequestId") {
            this.fhirJsonObj['entry'][1].fullUrl = `http://tmb-ins.com.sa/CommunicationRequest/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://tmb-ins.com.sa/CommunicationRequest/${KeyVal}`
        }

        if (keyName == "patientInfo") {
            let patCode = KeyVal['resource']['id']
            this.fhirJsonObj['entry'][2] = KeyVal
            this.fhirJsonObj['entry'][1].resource['subject']['reference'] = `Patient/${patCode}`
        }

        if (keyName == "sender") {
            let id = KeyVal.resource['id']
            let senderName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][1].resource['sender']['reference'] = `Organization/${id}`
            this.fhirJsonObj['entry'][3].fullUrl = `http://tmb-ins.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][3].resource['id'] = id
            this.fhirJsonObj['entry'][3].resource['name'] = senderName;
        }

        if (keyName == "resciever") {
            let id = KeyVal.resource['id']
            let rescieverName = KeyVal.resource['name']
            this.fhirJsonObj['entry'][1].resource['recipient']['reference'] = `Organization/${id}`
            this.fhirJsonObj['entry'][4].fullUrl = `http://tmb-ins.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][4].resource['id'] = id
            this.fhirJsonObj['entry'][4].resource['name'] = rescieverName;
        }

        // if (keyName == "currentDate") {
        //     this.fhirJsonObj['entry'][1].resource['authoredOn'] = KeyVal.start
        //     this.fhirJsonObj['entry'][1].resource['lastModified'] = KeyVal.end
        // }
    }

    replacePaymentRequest(keyName, KeyVal) {
        if (keyName == "messageHeaderId") {
            this.fhirJsonObj['entry'][0].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][0].fullUrl = `urn:uuid:${KeyVal}`
        }

        if (keyName == "messageHeaderFocusId") {
            this.fhirJsonObj['entry'][1].fullUrl = `http://pr-fhir.com.sa/PaymentNotice/${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['id'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['identifier'][0]['value'] = KeyVal
            this.fhirJsonObj['entry'][0].resource['focus'][0]['reference'] = `http://pr-fhir.com.sa/PaymentNotice//${KeyVal}`
            this.fhirJsonObj['entry'][1].resource['payment']['identifier']['value'] = KeyVal;
        }

        if (keyName == "paymentDate") {
            this.fhirJsonObj['entry'][1].resource['paymentDate'] = KeyVal
            this.fhirJsonObj['entry'][1].resource['created'] = KeyVal
        }

        if (keyName == "sender") {
            let id = KeyVal.resource['id']
            let senderName = KeyVal.resource['name']
            // this.fhirJsonObj['entry'][1].resource['sender']['reference'] = `Organization/${id}`
            this.fhirJsonObj['entry'][2].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][2].resource['id'] = id
            this.fhirJsonObj['entry'][2].resource['name'] = senderName;
        }

        if (keyName == "resciever") {
            let id = KeyVal.resource['id']
            let rescieverName = KeyVal.resource['name']
            //  this.fhirJsonObj['entry'][1].resource['recipient']['reference'] = `Organization/${id}`
            this.fhirJsonObj['entry'][3].fullUrl = `http://pr-fhir.com.sa/Organization/${id}`
            this.fhirJsonObj['entry'][3].resource['id'] = id
            this.fhirJsonObj['entry'][3].resource['name'] = rescieverName;
        }

        this.fhirJsonObj['entry'][1].resource['payment']['identifier']['system'] = "http://tmb-ins.com.sa/PaymentReconciliation"

    }
    //-----------------------------------------------------------------------------
    getFhirJsonObj() {
        console.log(this.fhirJsonObj)
        return this.fhirJsonObj
    }
    getFhirJsonTxt(resourceTypeUrl: string, url: string) {
        var jsonString = JSON.stringify(this.fhirJsonObj)
        while ((jsonString.indexOf(resourceTypeUrl)) > 0) {
            jsonString = jsonString.replace(resourceTypeUrl, url); //convert to JSON string
        }
        console.log(jsonString)
        return (jsonString)
    }
}
