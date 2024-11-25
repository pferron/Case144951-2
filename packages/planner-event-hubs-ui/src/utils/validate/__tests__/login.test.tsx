import { validateLogin } from '../login';

describe('Validate Login', () => {
  it('should throw incorrect first name', async () => {
    const user = {
      firstName: '',
      lastName: 'Dummy',
      email: 'dummy@j-mail.com'
    };

    expect(validateLogin(user)).toStrictEqual({ firstName: 'login_error_required' });
  });

  it('should throw incorrect last name', async () => {
    const user = {
      firstName: 'Dummy',
      lastName: '',
      email: 'dummy@j-mail.com'
    };

    expect(validateLogin(user)).toStrictEqual({ lastName: 'login_error_required' });
  });

  it('should throw incorrect email', async () => {
    const user = {
      firstName: 'Dummy',
      lastName: 'Dummy',
      email: 'dummy@j-mail'
    };

    expect(validateLogin(user)).toStrictEqual({ email: 'login_error_email_invalid' });
  });
});
