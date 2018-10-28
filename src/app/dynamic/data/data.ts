import { ConfigSettings } from './data-types';

export const settings: Array<ConfigSettings> = [
  {
    sortOrder: 1,
    controlType: 'text',
    label: 'First Name',
    controlName: 'FirstName',
    defaultValue: null,
    validationRules: {
      maxLength: { value: 10 },
      minLength: { value: 4 }
    }
  },
  {
    sortOrder: 2,
    controlType: 'text',
    label: 'Last Name',
    controlName: 'LastName',
    defaultValue: null,
    validationRules: {
      maxLength: { value: 10 },
      minLength: { value: 4 },
      complex: [{
        dependantControlNames: ['FirstName'],
        condition: 'NE',
        validatorFunction: 'distinctValValidation',
        validationMessage: 'FirstName and LastName can not be same '
      }]
    }
  },
  {
    sortOrder: 3,
    controlType: 'form',
    label: 'Address',
    controlName: 'Address',
    childControls: [{
      sortOrder: 1,
      controlType: 'text',
      label: 'Address1',
      controlName: 'Address1',
      defaultValue: null,
      validationRules: {
        maxLength: { value: 10 },
        minLength: { value: 4 },
      }
    },
    {
      sortOrder: 2,
      controlType: 'text',
      label: 'Address2',
      controlName: 'Address2',
      defaultValue: null,
      validationRules: {
        maxLength: { value: 10 },
        minLength: { value: 4 },
      }
    },
    {
      sortOrder: 3,
      controlType: 'form',
      label: 'Address3',
      controlName: 'Address3',
      childControls: [{
        sortOrder: 1,
        controlType: 'text',
        label: 'City',
        controlName: 'City',
        defaultValue: null,
        validationRules: {
          maxLength: { value: 10 },
          minLength: { value: 4 },
        }
      }],
      defaultValue: null,
      validationRules: {
        maxLength: { value: 10 },
        minLength: { value: 4 },
      }
    }],
  },
  {
    sortOrder: 6,
    controlType: 'text',
    label: 'State',
    controlName: 'State',
    defaultValue: null,
    validationRules: {
      maxLength: { value: 10 },
      minLength: { value: 4 },
    }
  },
  {
    sortOrder: 7,
    controlType: 'customSelect',
    label: 'Gender',
    controlName: 'Gender',
    options: 'assets/mock-data/selectdata.json',
    defaultValue: '--Select--',
    validationRules: {
      requiredSelect: true
    },

  },
  {
    sortOrder: 8,
    controlType: 'checkbox',
    label: 'Married',
    controlName: 'IsMarried',
    defaultValue: null,

  }, {
    sortOrder: 10,
    controlType: 'radio',
    label: 'RadioGender',
    controlName: 'MaritalStatus',
    options: 'assets/mock-data/radiodata.json',
    defaultValue: null,
    validationRules: {
      requiredSelect: true
    }
  },
  {
    sortOrder: 7,
    controlType: 'customSelect',
    label: 'Designation',
    controlName: 'Designation',
    options: 'assets/mock-data/selectdata.json',
    defaultValue: '--Select--',
    validationRules: {
      requiredSelect: true
    },

  },
  {
    sortOrder: 6,
    controlType: 'customDate',
    label: 'Start Date',
    controlName: 'StartDate',
    defaultValue: null,
    validationRules: {
      maxLength: { value: 10 },
      minLength: { value: 4 },
    }
  },
  {
    sortOrder: 6,
    controlType: 'customDate',
    label: 'End Date',
    controlName: 'EndDate',
    defaultValue: null,
    validationRules: {
      minLength: { value: 4 },
      maxLength: { value: 10 },
      complex: [
        {
          dependantControlNames: ['StartDate'],
          condition: 'G',
          validatorFunction: 'dateRangeValidation',
          validationMessage: 'End date must be greater than start date'
        }
      ]
    }
  },
  {
    sortOrder: 100,
    controlType: 'submit',
    label: 'Submit',
    controlName: 'submit',
    defaultValue: null,
    endPoints: {
      api: 'api/user/submit',
      method: 'post'
    }
  }
];
