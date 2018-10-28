import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { GeneralValidation, ComplexValidation, RegexValidation } from './data/data-types';

@Injectable()
export class CommonService {
    constructor(public _http: Http) { }
    public _screenConfig;

    public getMaxLenValidator(max: GeneralValidation) {
        return (c: FormControl | any) => {
            let msg =`The maximum length of the field is ${max.value}.`;
            if(max.hasOwnProperty('message')) {
                msg= max.message;
            }

            if (this.isValidMaxLen(c.value, max.value)) {
                return null;
            } else {
                return {
                    maxLength:
                    {
                        message: msg
                    }
                };
            }
        };
    }
    public getMinLenValidator(min: GeneralValidation) {

        return (c: FormControl | any) => {
             let msg = `The minimum length of the field is ${min.value}.`;
            if (min.hasOwnProperty('message')) {
                msg = min.message;
            }
            if (this.isValidMinLen(c.value, min.value)) {
                return null;
            } else {
                return {
                    minLength:
                    {
                        message: msg
                    }
                };
            }
        };

    }
    public getRequiredValidator() {
        return (c: FormControl | any) => {
            if (this.isRequired(c.value)) {
                return {
                    required:
                    {
                        message: `This is a required field.`
                    }
                };
            } else {
                return null;
            }
        };
    }

    public isSelectInValid(value: string) {
        return (value === null || value === 'null' || value === undefined || 
        value.toString().toLowerCase().indexOf('select') > 0 || value.toString().trim() === '');
    }
    public isValidMaxLen(value, len) {
        return (value == null || value.toString().trim() === '' || value.length <= len);

    }
    public isValidMinLen(value, len) {
        return (value == null || value.toString().trim() === '' || value.length >= len);

    }
    public isRequired(value) {
        return (value == null || value === undefined || value.toString().trim() === '');

    }
    public getRequiredSelectValidator() {
        return (c: FormControl | any) => {
            if (this.isSelectInValid(c.value)) {
                return {
                    required:
                    {
                        message: `This is a required field.`
                    }
                };
            } else {
                return null;
            }
        };
    }
    public errorMessageGeneration(formGroup: FormGroup, isNested = null, errMsgs = null) {
        errMsgs = errMsgs ? errMsgs : {};
        if (!formGroup) {
            return;
        }
        let formControls = {};
        if (isNested === null) {
            formControls = formGroup.getRawValue();
            // tslint:disable-next-line:forin
            for (const field in formControls) {
                const control = formGroup.get(field);
                if (control && !control.valid) {
                    if (control.hasOwnProperty('controls')) {
                        errMsgs[field] = {};
                        Object.assign(errMsgs[field], this.errorMessageGeneration(control['controls'], true));
                    }
                    // tslint:disable-next-line:forin
                    for (const key in control.errors) {
                        errMsgs[field] = control.errors[key].message;
                    }
                }
            }
        } else {
            const frmCtrls = [];
            errMsgs = {};
            for (const item in formGroup) {
                if (formGroup[item] && formGroup[item].constructor.toString().toLowerCase().indexOf('formcontrol') > 0) {
                    frmCtrls.push({ name: item, val: formGroup[item] });
                } else if (formGroup[item] && formGroup[item].constructor.toString().toLowerCase().indexOf('formgroup') > 0) {
                    errMsgs[item] = {};
                    Object.assign(errMsgs[item], this.errorMessageGeneration(formGroup[item]['controls'], true));
                }
            }

            for (const ctrls of frmCtrls) {
                if (ctrls.val.invalid) {
                    // tslint:disable-next-line:forin
                    for (const key in ctrls.val.errors) {
                        errMsgs[ctrls.name] = ctrls.val.errors[key].message;
                    }
                }
            }
        }

        return errMsgs;
    }

    public httpGet(uri) {
        return this._http.get(uri);
    }

    public httpPost(uri, data) {
        return this._http.post(uri, data);
    }

    public distinctValValidation(settingsObj: { dependsOn: Array<string>, condition: string, message: string }) {
        return (c: FormControl) => {
            const ctrlArr: Array<any> = [];
            if (Array.isArray(settingsObj.dependsOn)) {
                settingsObj.dependsOn.forEach(ctrlName => {
                    const ctrl = c.root.get(ctrlName);
                    if (ctrl !== null) {ctrlArr.push(ctrl); }
                });
            }
            let isValid = true;
            switch (settingsObj.condition) {
                case 'NE': for (const ctrl of ctrlArr) {
                    if (ctrl && ctrl.value !== null && ctrl.value.trim() !== '') {
                        if (ctrl.value === c.value) {
                            isValid = false;
                            break;
                        }
                    }
                }
                    break;
                default: break;
            }
            return isValid ? null : { distVal: { message: settingsObj.message } };
        };

    }
    dateRangeValidation(settingsObj: { dependsOn: Array<string>, condition: string, message: string }) {

        return (c: FormControl) => {
            const ctrlArr: Array<any> = [];
            if (Array.isArray(settingsObj.dependsOn)) {
                settingsObj.dependsOn.forEach(ctrlName => {
                    const ctrl = c.root.get(ctrlName);
                    if (ctrl !== null) {ctrlArr.push(ctrl); }
                });
            }
            let isValid = true;

            switch (settingsObj.condition) {
                  case 'G': for (const ctrl of ctrlArr) {
                    if (ctrl && ctrl.value !== null && ctrl.value.trim() !== '') {
                       console.log(c.value > ctrl.value);
                      console.log(ctrl.value +  c.value);

                        const tdt = new Date(c.value);
                        const odt = new Date(ctrl.value);
                        if (tdt < odt) {
                            isValid = false;
                            break;
                        }
                    }
                }
                    break;
                default: break;
            }
            return isValid ? null : { distVal: { message: settingsObj.message } };
        };

    }


}
