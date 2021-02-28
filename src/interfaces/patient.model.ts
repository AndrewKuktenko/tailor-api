import * as moment from 'moment';
export default class Hospital {
    patientId: number;
    mrn: string;
    patientDob: string;
    isPatientDeceased: boolean;
    deathDate: string;
    lastName: string;
    firstName: string;
    gender: string;
    sex: string;
    addressLine: string;
    addressCity: string;
    addressState: string;
    addressZipCode: string

    constructor(data: any) {
        this.patientId = parseInt(data.patientid);
        if (data.mrn) {
            this.mrn = data.mrn;
        }
        if (data.patientdob) {
            this.patientDob = moment(new Date(data.patientdob)).toISOString();
        }
        if (data.dod_ts || data.deathdate) {
            this.deathDate = data.dod_ts ? moment(new Date(data.dod_ts)).toISOString() : moment(new Date(data.deathdate)).toISOString();
        }
        if (data.lastname) {
            this.lastName = data.lastname;
        }
        if (data.firstname) {
            this.firstName = data.firstname;
        }
        if (data.gender) {
            this.gender = data.gender;
        }
        if (data.sex) {
            this.sex = data.sex;
        }
        if (data.line) {
            this.addressLine = data.line;
        }
        if (data.city) {
            this.addressCity = data.city;
        }
        if (data.state) {
            this.addressState = data.state;
        }
        if (data.zipcode) {
            this.addressZipCode = data.zipcode;
        }
        if (data.deceased) {
            this.isPatientDeceased = data.deceased;
        }
    }
}
