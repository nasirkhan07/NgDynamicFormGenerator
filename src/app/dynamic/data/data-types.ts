export interface ConfigSettings {
     sortOrder: number;
     controlType: string;
     label: string;
     controlName: string;
     defaultValue?: string;
     options?: string;
     validationRules?: ValidationRules;
     childControls?: Array<ConfigSettings>;
     endPoints?: EndPoints;
}
export interface ValidationRules {
     maxLength?: GeneralValidation;
     minLength?: GeneralValidation;
     regexes?: Array<RegexValidation>;
     complex?: Array<ComplexValidation>;
     requiredSelect?: boolean;
     required?: boolean;
}
export interface ComplexValidation {
     dependantControlNames: Array<string>;
     condition: string;
     validatorFunction: string;
     validationMessage?: string;
}
export interface GeneralValidation {
     value: string|number;
     message?: string;
}
export interface RegexValidation {
     regexExpression: string;
     message?: string|null;
}
export interface EndPoints {
    api: string;
    method: string;
}
