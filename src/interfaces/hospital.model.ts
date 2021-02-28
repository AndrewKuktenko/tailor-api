import * as moment from 'moment';
export default class Hospital {
    treatmentId: string;
    patientId: number;
    status: string;
    diagnose: string;
    numberOfCycles: string;
    treatmentLine: string;
    displayName: string;
    protocolId: number;
    startDate: string;
    endDate: string;
    
    constructor(data: any) {
        this.treatmentId = data.treatmentid;
        this.patientId = parseInt(data.patientid);
        if (data.treatmentline) {
            this.treatmentLine = data.treatmentline;
        }
        if (data.protocolid) {
            this.protocolId = parseInt(data.protocolid);
        }
        if (data.startdate) {
            this.startDate = moment(new Date(data.startdate)).toISOString();
        }
        if (data.enddate) {
            this.endDate = moment(new Date(data.enddate)).toISOString();
        }
        if (data.status) {
            this.status = data.status.toLocaleLowerCase();
        }
        if (data.displayname) {
            this.displayName = data.displayname;
        }
        if (data.diagnose) {
            this.diagnose = data.diagnose;
        }
        if (data.cycles) {
            this.numberOfCycles = data.cycles;
        }
    }
  }
  