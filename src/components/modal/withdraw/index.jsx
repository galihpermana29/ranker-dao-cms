import { useEffect } from 'react';

import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';

import './index.scss';

const WithdrawModal = ({ data, handleSubmitWithdraw }) => {
  const [form] = useForm();
  const { withdraw, current } = data;

  useEffect(() => {
    form.setFieldsValue({ current_amount: current, withdraw: withdraw });
  }, []);

  return (
    <div className="add-admin">
      <div className="modal-title">WITHDRAWAL</div>
      <Form
        form={form}
        className="form-wrapper"
        onFinish={handleSubmitWithdraw}>
        <div className="label">CURRENT AMOUNT</div>
        <Form.Item name={'current_amount'}>
          <Input type="text" className="input" disabled />
        </Form.Item>
        <div className="label">AMOUNT TO WITHDRAW</div>
        <Form.Item name={'withdraw'}>
          <Input type="text" className="input" />
        </Form.Item>
        <Form.Item name={'withdraw'}>
          <button type="submit" className="button">
            WITHDRAW
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default WithdrawModal;
