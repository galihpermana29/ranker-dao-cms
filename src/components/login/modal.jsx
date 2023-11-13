import { Form } from 'antd';
import './style.scss';

/**
 *
 * @property {React.HTMLProps<HTMLButtonElement>['onFinish']} [onSubmit]
 */

export const EnterEmail = ({ onSubmit }) => {
  const handleSubmit = async (value) => {
    onSubmit(value);
  };
  return (
    <div className="staking-modal enter-email-modal">
      <div className="title-modal">ENTER EMAIL ADDRESS</div>
      <div className="p-modal">
        We will send verification code to the designated email address
      </div>
      <Form className="form-wrapper-input" onFinish={handleSubmit}>
        <Form.Item name={'email'} noStyle>
          <input
            type="text"
            className="input text-center"
            placeholder="ENTER EMAIL ADDRESS"
          />
        </Form.Item>
        <Form.Item noStyle>
          <button type="submit" className="button">
            SEND
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

/**
 * @param {string} errorMessage - error message appear when unconditional condition reached
 * @property {React.HTMLProps<HTMLButtonElement>['onFinish']} [onSubmit]
 */
export const EnterVerifCode = ({ onSubmit, errorMessage }) => {
  const handleSubmit = async (value) => {
    const { digit1, digit2, digit3, digit4 } = value;
    const concate = digit1 + digit2 + digit3 + digit4;
    onSubmit(concate);
  };
  return (
    <div className="staking-modal enter-email-modal">
      <div className="title-modal">ENTER VERIFICATION CODE</div>
      <div className="p-modal">
        Please enter verification code from your email address
      </div>
      <Form className="form-wrapper-input" onFinish={handleSubmit}>
        <Form.Item className="form-code-otp">
          <Form.Item name={'digit1'} noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          <Form.Item name={'digit2'} noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          <Form.Item name={'digit3'} noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          <Form.Item name={'digit4'} noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          {/* <Form.Item noStyle>
            <input type="number " className="input text-center" />
          </Form.Item> */}
        </Form.Item>
        <Form.Item noStyle>
          <button type="submit" className="button">
            SEND
          </button>
        </Form.Item>
        <Form.Item noStyle>
          <div className="p-modal red">{errorMessage && errorMessage}</div>
        </Form.Item>
      </Form>
    </div>
  );
};

/**
 * @param {Function} setErrorMessage - setter for set the error
 * @param {String} errorMessage - the error message
 * @param {Object} data - data object contain the OTP and Email
 * @property {React.HTMLProps<HTMLButtonElement>['onFinish']} [onSubmit]
 */
export const EnterPassword = ({
  onSubmit,
  setErrorMessage,
  errorMessage,
  data,
}) => {
  const submitNewPassword = async (value) => {
    if (value.newPass !== value.confirmPass) {
      setErrorMessage('Password not match!');
    } else {
      onSubmit({ newPass: value.newPass, ...data });
    }
  };
  return (
    <div className="staking-modal enter-email-modal">
      <div className="title-modal">RESET PASSWORD</div>
      <div className="p-modal">
        We will send verification code to the designated email address
      </div>
      <Form className="form-wrapper-input" onFinish={submitNewPassword}>
        <Form.Item noStyle name={'newPass'}>
          <input
            type="password "
            className="input text-center"
            placeholder="NEW PASSWORD"
          />
        </Form.Item>
        <Form.Item noStyle name={'confirmPass'}>
          <input
            style={{ marginTop: '20px' }}
            type="password "
            className="input text-center"
            placeholder="CONFIRM NEW PASSWORD"
          />
        </Form.Item>
        <Form.Item noStyle>
          <button type="submit" className="button">
            SEND
          </button>
        </Form.Item>
        <Form.Item noStyle>
          <div className="p-modal red">{errorMessage && errorMessage}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
