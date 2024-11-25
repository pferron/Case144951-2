import { FieldData } from '@components/customRegistration/FormEditorCard';

const ContactFieldsCodes = {
  FIRST_NAME: {
    code: 'FIRST_NAME'
  },
  LAST_NAME: {
    code: 'LAST_NAME'
  },
  EMAIL: {
    code: 'EMAIL'
  },
  JOB_TITLE: {
    code: 'JOB_TITLE'
  },
  COMPANY: {
    code: 'COMPANY'
  },
  PHONE_NUMBER: {
    code: 'PHONE_NUMBER'
  },
  ADDRESS: {
    code: 'ADDRESS'
  }
};

export const LockedContactFields: FieldData[] = [
  {
    code: ContactFieldsCodes.FIRST_NAME.code,
    order: 1,
    required: true,
    isLocked: true,
    included: true
  },
  {
    code: ContactFieldsCodes.LAST_NAME.code,
    order: 2,
    required: true,
    isLocked: true,
    included: true
  },
  {
    code: ContactFieldsCodes.EMAIL.code,
    order: 3,
    required: true,
    isLocked: true,
    included: true
  }
];

export const DEFAULT_REGISTRATION_FORM_ORDER = [
  {
    code: 'JOB_TITLE',
    order: 0,
    required: false,
    included: true
  },
  {
    code: 'COMPANY',
    order: 0,
    required: false,
    included: true
  },
  {
    code: 'ADDRESS',
    order: 0,
    required: false,
    included: true
  },
  {
    code: 'PHONE_NUMBER',
    order: 0,
    required: false,
    included: true
  }
];

export const StandardContactFields = [
  { ...ContactFieldsCodes.JOB_TITLE },
  { ...ContactFieldsCodes.COMPANY },
  { ...ContactFieldsCodes.PHONE_NUMBER },
  { ...ContactFieldsCodes.ADDRESS }
];

export const formContent = new Map([
  [ContactFieldsCodes.FIRST_NAME.code, 'custom_registration_form_field_text_field_code_first_name'],
  [ContactFieldsCodes.LAST_NAME.code, 'custom_registration_form_field_text_field_code_last_name'],
  [ContactFieldsCodes.EMAIL.code, 'custom_registration_form_field_text_field_code_email'],
  [ContactFieldsCodes.JOB_TITLE.code, 'custom_registration_form_field_text_field_code_job_title'],
  [ContactFieldsCodes.COMPANY.code, 'custom_registration_form_field_text_field_code_company'],
  [ContactFieldsCodes.PHONE_NUMBER.code, 'custom_registration_form_field_text_field_code_number'],
  [ContactFieldsCodes.ADDRESS.code, 'custom_registration_form_field_text_field_code_address']
]);
