import { useContext, useState } from 'react';

import { Form } from 'antd';
import { useNavigate } from 'react-router-dom';

import cmsAPI from '@/api/cms';
import imageLogin from '@/assets/img/login-image.png';
import {
  EnterEmail,
  EnterPassword,
  EnterVerifCode,
} from '@/components/login/modal';
import { Modal } from '@/components/modal';
import { SuccessResetPassword } from '@/components/modal/rewarding';
import { AuthContext } from '@/providers/AuthProviders';

import './index.scss';

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmitFormLogin = async (value) => {
    await handleLogin(value);
    navigate('/collection');
    window.location.reload();
  };

  const handleSubmitEmailForgotPassword = async (value) => {
    await cmsAPI.forgotPasswordSendOTP(value);
    setIsOpenModal({
      visible: true,
      type: 'enterOTP',
      data: { email: value.email },
    });
  };

  const handleOTPCode = async (value) => {
    try {
      await cmsAPI.sendingOTP({ otp: parseInt(value) });
      setIsOpenModal({
        visible: true,
        type: 'enterSubmitPassword',
        data: { otp: parseInt(value), email: isOpenModal.data.email },
      });
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response.data.error.userMessage);
      console.log(error.response.data.error.userMessage, 'err');
    }
  };

  const handleChangePassword = async (value) => {
    try {
      await cmsAPI.changePassword(value);
      setIsOpenModal({ visible: true, type: 'successResetPassword' });
    } catch (error) {
      console.log(error, 'error while changing the password');
    }
  };

  const modalTypeDict = {
    enterEmail: <EnterEmail onSubmit={handleSubmitEmailForgotPassword} />,
    enterOTP: (
      <EnterVerifCode onSubmit={handleOTPCode} errorMessage={errorMessage} />
    ),
    enterSubmitPassword: (
      <EnterPassword
        onSubmit={handleChangePassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        data={isOpenModal.data}
      />
    ),
    successResetPassword: <SuccessResetPassword />,
  };

  return (
    <>
      <Modal
        maxWidth={isOpenModal.type === 'successResetPassword' ? 315 : 600}
        isOpen={isOpenModal.visible}
        onClose={() => setIsOpenModal({ visible: false, type: '' })}>
        {modalTypeDict?.[isOpenModal.type] || <></>}
      </Modal>
      <div className="login-wrapper">
        <div className="image-wrapper">
          <img src={imageLogin} alt="images" />
        </div>
        <div className="title login-title">WELCOME ADMINISTRATOR</div>
        <div className="p">
          Please enter your details to sign in to your account
        </div>
        <Form className="form-wrapper" onFinish={handleSubmitFormLogin}>
          <Form.Item name={'email'} noStyle>
            <input
              type="email"
              name="email"
              id="email"
              className="input text-center"
              placeholder="email"
            />
          </Form.Item>
          <Form.Item name={'password'} noStyle>
            <input
              type="password"
              name="password"
              id="password"
              className="input text-center"
              placeholder="password"
            />
          </Form.Item>
          <div className="wrapper-check">
            <div className="remember">
              <input type="checkbox" name="remember" id="remeber" />
              <label htmlFor="remember">REMEMBER ME</label>
            </div>
            <div
              className="forgot"
              onClick={() =>
                setIsOpenModal({ visible: true, type: 'enterEmail' })
              }>
              FORGOT PASSWORD
            </div>
          </div>
          <Form.Item>
            <button type="submit" className="button">
              LOGIN
            </button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
