import cmsAPI from '@/api/cms';
import imageLogin from '@/assets/img/login-image.png';
import {
  EnterEmail,
  EnterPassword,
  EnterVerifCode,
} from '@/components/login/modal';
import { Modal } from '@/components/modal';
import SuccessResetPassword from '@/components/modal/rewarding';
import { AuthContext } from '@/providers/AuthProviders';
import { Form } from 'antd';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './index.scss';

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });

  const handleSubmitFormLogin = async (value) => {
    try {
      handleLogin(value);
      navigate('/collection');
    } catch (error) {
      console.log(error, 'err');
    }
  };

  const handleModal = () => {};

  const modalTypeDict = {
    enterEmail: (
      <EnterEmail
        onSubmit={() => setIsOpenModal({ visible: true, type: 'enterOTP' })}
      />
    ),
    enterOTP: (
      <EnterVerifCode
        onSubmit={() =>
          setIsOpenModal({ visible: true, type: 'enterSubmitPassword' })
        }
      />
    ),
    enterSubmitPassword: (
      <EnterPassword
        onSubmit={() =>
          setIsOpenModal({ visible: true, type: 'successResetPassword' })
        }
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
              initialValues={''}
              className="input text-center"
              placeholder="email"
            />
          </Form.Item>
          <Form.Item name={'pass'} noStyle>
            <input
              type="password"
              name="password"
              id="password"
              initialValues={''}
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
