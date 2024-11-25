import isEmail from 'validator/lib/isEmail';

const requiredError = 'login_error_required';

function validateEmail(email: string): boolean {
  return isEmail(email);
}

export function validateLogin(formValues: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!formValues.firstName || formValues.firstName.trim() === '') {
    errors.firstName = requiredError;
  }

  if (!formValues.lastName || formValues.lastName.trim() === '') {
    errors.lastName = requiredError;
  }

  const trimmedEmail = formValues.email.trim();

  if (!trimmedEmail) {
    errors.email = requiredError;
  } else if (!validateEmail(trimmedEmail)) {
    errors.email = 'login_error_email_invalid';
  }

  return errors;
}
