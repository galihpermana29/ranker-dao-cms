import { Form } from 'antd';
import './style.scss';

/**
 *
 * @property {React.HTMLProps<HTMLButtonElement>['onFinish']} [onSubmit]
 */

export const EnterEmail = ({ onSubmit }) => {
  return (
    <div className="staking-modal enter-email-modal">
      <div className="title-modal">ENTER EMAIL ADDRESS</div>
      <div className="p-modal">
        We will send verification code to the designated email address
      </div>
      <Form className="form-wrapper-input" onFinish={onSubmit}>
        <Form.Item noStyle>
          <input
            type="text "
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
 *
 * @property {React.HTMLProps<HTMLButtonElement>['onFinish']} [onSubmit]
 */
export const EnterVerifCode = ({ onSubmit }) => {
  return (
    <div className="staking-modal enter-email-modal">
      <div className="title-modal">ENTER VERIFICATION CODE</div>
      <div className="p-modal">
        Please enter ferivication code from your email address
      </div>
      <Form className="form-wrapper-input" onFinish={onSubmit}>
        <Form.Item className="form-code-otp">
          <Form.Item noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          <Form.Item noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          <Form.Item noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          <Form.Item noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
          <Form.Item noStyle>
            <input type="number " className="input text-center" />
          </Form.Item>
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
 *
 * @property {React.HTMLProps<HTMLButtonElement>['onFinish']} [onSubmit]
 */
export const EnterPassword = ({ onSubmit }) => {
  return (
    <div className="staking-modal enter-email-modal">
      <div className="title-modal">RESET PASSWORD</div>
      <div className="p-modal">
        We will send verification code to the designated email address
      </div>
      <Form className="form-wrapper-input" onFinish={onSubmit}>
        <Form.Item noStyle>
          <input
            type="password "
            className="input text-center"
            placeholder="NEW PASSWORD"
          />
        </Form.Item>
        <Form.Item noStyle>
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
      </Form>
    </div>
  );
};
