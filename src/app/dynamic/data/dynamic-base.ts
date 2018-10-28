import { Validators, FormGroup, ReactiveFormsModule, FormsModule, FormBuilder, FormControl } from '@angular/forms';
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import {ConfigSettings} from './data-types';

export class DynamicBase {
    constructor(public commonService?: any, formName?: string) {
        this._formName = formName;
    }
    _formName: string = null;
    screenobj;
    public manageFormState(formval) {
        if (this[`${this._formName}`].status === 'INVALID') {
            // tslint:disable-next-line:forin
            for (const ctrls in this[`${this._formName}`].controls) {
                this['tooltips'] = this.commonService.errorMessageGeneration(this[`${this._formName}`]);
            }
        } else {
            for (const val in this['tooltips']) {
                if (this['tooltips'][val] !== null || this['tooltips'][val] !== undefined) {
                    this['tooltips'][val] = undefined;
                }
            }
        }
    }

    public createHtmlTemplate(data: ConfigSettings[], parent: string = '', inRec: boolean = false) {
        const defaultClassName = 'formGroup';
        const defaultReactiveFormName = 'cform';
        let containerTemplate = `<form class="form-horizontal ${defaultClassName}"
    [formGroup]="${defaultReactiveFormName}" role="form" novalidate>`;
        let template = '';
        parent = parent === '' ? parent : parent + '.';
        for (const item of data) {
            switch (item.controlType) {
                case 'text': template += this.generateTextbox({
                     labelName: item.label, controlName: item.controlName,
                      parentTree: parent + item.controlName
                     });
                    break;
                case 'select': template += this.generateSelect({
                    labelName: item.label, controlName: item.controlName,
                    endPoint: item.options, defaultValue: item.defaultValue,
                    parentTree: parent + item.controlName
                });
                    break;
                case 'form': template += this.generateNestedForm({
                    labelName: item.label, formGroupName: item.controlName,
                    childItems: item.childControls, parentTree: parent + item.controlName
                });
                    break;
                case 'checkbox': template += this.generateCheckbox({
                    labelName: item.label, controlName: item.controlName,
                    parentTree: parent + item.controlName
                });
                    break;
                case 'customSelect': template += this.generateCustomSelect({
                    labelName: item.label, controlName: item.controlName,
                    endPoint: item.options, defaultValue: item.defaultValue,
                    parentTree: parent + item.controlName
                });
                    break;
                case 'radio': template += this.generateRadio({
                    labelName: item.label, controlName: item.controlName,
                    endPoint: item.options, parentTree: parent + item.controlName
                });
                    break;
                case 'customDate': template += this.generateCustomDate({
                    labelName: item.label, controlName: item.controlName,
                    parentTree: parent + item.controlName
                });
                    break;
                case 'submit': template += this.generateSubmitButton({
                    labelName: item.label, controlName: item.controlName,
                    parentTree: parent + item.controlName,
                    webApi: item.endPoints.api,
                    httpVerb: item.endPoints.method
                });
                    break;
                default: break;
            }
        }
        return !inRec ? containerTemplate += template + `</form>` : template;
    }


    public createContainerExpr(parentTree) {
        const tree = parentTree.split('.');
        let expression = `"tooltips?.${parentTree}`;
        if (tree.length > 1) {
            expression = `"`;
            let val = tree.shift();
            let cval = val;
            let idx = 0;
            while (val !== undefined) {
                expression += idx === 0 ? '' : ' &&';
                expression += ` tooltips?.${cval}`;
                idx++;
                val = tree.shift();
                cval += '?.' + val;
            }
            expression += ``;
        }

        return expression;
    }

    public checkContent(objectRef) {
        const label = objectRef.target.parentElement.getElementsByTagName('label');
        if ((null != objectRef.target.value) && (undefined !== objectRef.target.value) && ('' !== objectRef.target.value)) {
            objectRef.target.parentElement.getElementsByTagName('label')[0].classList.add('label-active');
        } else {
            objectRef.target.parentElement.getElementsByTagName('label')[0].classList.remove('label-active');
        }
    }

    public generateCustomDate(obj: { labelName: string, controlName: string, parentTree: string }) {
         const expression = this.createContainerExpr(obj.parentTree);
        const valdationMessage = expression.indexOf('&&') < 0 ? expression.replace('"', '') : expression.split('&&').pop();

        return `
        <div class="check-block col-md-4 col-sm-6 col-xs-12">
            <label for="${obj.controlName.toLowerCase()}" class="col-xs-3 clear-padding"> ${obj.labelName} </label>
            <input-date formControlName='${obj.controlName}'></input-date>
              <span [style.display]= ${expression}?'block':'none'" class="error-message" [innerText]="${valdationMessage}">
            </span>
        </div>
        `;
    }

    public generateTextbox(object: { labelName: string, controlName: string, parentTree: string }) {
        const expression = this.createContainerExpr(object.parentTree);
        const valdationMessage = expression.indexOf('&&') < 0 ? expression.replace('"', '') : expression.split('&&').pop();

        return `
        <div class="input-box col-md-${4} col-sm-6 col-xs-12">
            <input type="text" id='${object.controlName.toLowerCase()}' #${object.controlName.toLowerCase()}
                formControlName='${object.controlName}' autocomplete="off" (blur)="checkContent($event)"/>
            <span class="bar"></span>
            <span [style.display]= ${expression}?'block':'none'" class="error-message" [innerText]="${valdationMessage}">
            </span>

            <label for="${object.controlName.toLowerCase()}">${object.labelName}:</label>
        </div>
        `;
    }
    public generateSelect(obj: { labelName: any, controlName: string, endPoint: any, defaultValue: any, parentTree: string }) {

        const expression = this.createContainerExpr(obj.parentTree);
        const valdationMessage = expression.indexOf('&&') < 0 ? expression.replace('"', '') : expression.split('&&').pop();

        return `
        <div class="form-group">
            <label class="control-label col-sm-2" for="${obj.controlName.toLowerCase()}">${obj.labelName}:</label>
            <div class="col-sm-2">
                <select #${obj.controlName.toLowerCase()}  formControlName='${obj.controlName}'  id="${obj.controlName.toLowerCase()}"
                class="select-col form-control" >
                    <option *ngFor="let item of ${obj.controlName.toLowerCase() + 'Source'}"  value={{item.key}}>
                    {{item.value}}
                    </option>
                </select>
                <span [style.display]= ${expression}?'block':'none'" class="error-message" [innerText]="${valdationMessage}">
                           </span>
            </div>
        </div>`;

    }
    public generateCheckbox(object: { labelName: string, controlName: string, parentTree: string }) {
        const expression = this.createContainerExpr(object.parentTree);
        const valdationMessage = expression.indexOf('&&') < 0 ? expression.replace('"', '') : expression.split('&&').pop();
        return `
        <div class="check-block col-md-4 col-sm-6 col-xs-12">
            <input type="checkbox" id='${object.controlName.toLowerCase()}' #${object.controlName.toLowerCase()}
                        formControlName='${object.controlName}'  class="right-checkbox" placeholder="${object.labelName}"/>
            <label class="control-label col-sm-2" for="${object.controlName.toLowerCase()}">${object.labelName}:</label>
            <span [style.display]= ${expression}?'block':'none'" class="error-message" [innerText]="${valdationMessage}">
            </span>
        </div>
        `;
    }

    public generateRadio(obj: { labelName: string, controlName: string, endPoint: string, parentTree: string }) {
        const expression = this.createContainerExpr(obj.parentTree);
        const valdationMessage = expression.indexOf('&&') < 0 ? expression.replace('"', '') : expression.split('&&').pop();
        return `
        <div class="check-block col-md-4 col-sm-6 col-xs-12"
            *ngFor="let item of ${obj.controlName.toLowerCase() + 'Source'}">
            <input formControlName="${obj.controlName}" type="radio" name="${obj.controlName}" id={{item.value}} value={{item.value}}>
            <label for={{item.value}}>{{item.value}}</label>
        </div>
        `;
    }

    public generateNestedForm(object: { labelName: string, formGroupName: string, childItems: any, parentTree: string }) {
        const template = this.createHtmlTemplate(object.childItems, object.parentTree, true);
        return ` <span formGroupName='${object.formGroupName}'>
            ${template}
        </span>`;
    }

    public generateCustomSelect(obj: { labelName: any, controlName: string, endPoint: any, defaultValue: any, parentTree: string }) {
        const expression = this.createContainerExpr(obj.parentTree);
        const valdationMessage = expression.indexOf('&&') < 0 ? expression.replace('"', '') : expression.split('&&').pop();
        return `
        <div class="input-box col-md-4 col-sm-6 col-xs-12">
            <select-list  formControlName='${obj.controlName}' controlName= "${obj.controlName}" defaultVal="${obj.defaultValue}"
                source="${obj.endPoint}">
                </select-list>
                <span [style.display]= ${expression}?'block':'none'" class="error-message" [innerText]="${valdationMessage}">
                           </span>

                             </div>
        `;
    }

    public generateSubmitButton(object: { labelName: any, controlName: string, parentTree: string,
         webApi: string, httpVerb: string }) {
            const api = object.webApi;
            const method = object.httpVerb;
            const eventExpr = `submitThis('${api}', '${method}', $event)`;

            console.dir(eventExpr);
            return `
                <div class="col-xs-12">
                    <div class="col-md-2 col-md-offset-5 col-sm-4 col-sm-offset-4 col-xs-12">
                        <input class="submit-btn" type="submit" value="${object.labelName}"
                        (click)="${eventExpr}">
                    </div>
                </div>
            `;
    }
    public createSelectSources() {
        if (this && this.screenobj) {
            (<Array<any>>this.screenobj).forEach(item => {
                if (item.controlType === 'select') {
                    this[item.controlName.toLowerCase() + 'Source'] = [];
                }
            });
        }
    }
    public populateFormObject(screenObject: Array<ConfigSettings>) {
        const formObj = {};
        for (const val of screenObject) {
            if (val.controlType === 'form') {
                formObj[val.controlName] = this.populateFormObject(val.childControls);
            }
            const validations = [];
            if (val.validationRules) {
                if (val.validationRules.hasOwnProperty('maxLength')) {
                    validations.push(this.commonService.getMaxLenValidator(val.validationRules.maxLength));
                }
                if (val.validationRules.hasOwnProperty('minLength')) {
                    validations.push(this.commonService.getMinLenValidator(val.validationRules.minLength));
                }
                if (val.validationRules.hasOwnProperty('required')) {
                    validations.push(this.commonService.getRequiredValidator());
                }
                if (val.validationRules.hasOwnProperty('requiredSelect')) {
                    validations.push(this.commonService.getRequiredSelectValidator());
                }
                if (val.validationRules.hasOwnProperty('regexes')) {
                    if (val.validationRules.regexes && val.validationRules.regexes.length > 0) {
                        val.validationRules.regexes.forEach(item => validations.push(
                            Validators.pattern(item.regexExpression)
                            ));
                    }
                }
                if (val.validationRules.hasOwnProperty('complex')) {
                    if (val.validationRules.complex && val.validationRules.complex.length > 0) {
                        val.validationRules.complex.forEach(item => {
                            if (item.hasOwnProperty('validatorFunction')) {
                                const validatorFn = this.commonService[item.validatorFunction];
                                const dependantControlNames = item.hasOwnProperty('dependantControlNames') ?
                                                               item['dependantControlNames'] : null;
                                if (dependantControlNames !== null) {
                                    if (this['depenCtrlMap']) {
                                        const key = val.controlName;
                                        this['depenCtrlMap'][key] = dependantControlNames;
                                    }
                                }
                                const conditions = item.hasOwnProperty('condition') ? item['condition'] : null;
                                const message = item.hasOwnProperty('validationMessage') ? item['validationMessage'] : null;

                                validations.push(validatorFn({ dependsOn: dependantControlNames, condition: conditions,
                                     message: message }));
                            }
                        });
                    }
                }
            }
            if (!formObj.hasOwnProperty(val.controlName)) {

                formObj[val.controlName] = new FormControl(val.defaultValue, validations);
            }

        }
        return formObj;
    }



    public getDynamicModule(component) {
        @NgModule({
            imports: [ReactiveFormsModule, FormsModule, CommonModule, SharedModule],
            declarations: [component],
            providers: []
        })
        class DummyModule { }

        return DummyModule;
    }

    public createNestedFormObject(obj: Object): FormGroup {
        const frmObj = {};
        for (const controlName in obj) {
            if (obj[controlName].constructor.toString().indexOf('Object') > 0) {
                frmObj[controlName] = this.createNestedFormObject(obj[controlName]);
            } else {
                frmObj[controlName] = obj[controlName];
            }
        }
        return new FormGroup(frmObj);
    }

    public createValidationMessagesObject(formObject) {
        const validationMessages = {};
        for (const item in formObject) {
            if (formObject[item].constructor.toString().toLowerCase().indexOf('object') > 0) {
                validationMessages[item] = {};
                const childMessages = this.createValidationMessagesObject(formObject[item]);
                // tslint:disable-next-line:forin
                for (const msg in childMessages) {
                    validationMessages[item][msg] = childMessages[msg];
                }
            } else {
                validationMessages[item] = undefined;
            }
        }
        return validationMessages;
    }
}
