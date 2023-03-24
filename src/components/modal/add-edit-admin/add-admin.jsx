import './index.scss';
import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';

const AddEditAdmin = () => {
  const [form] = useForm();

  const [walletInput, setWalletInput] = useState('');
  const [initialStateWallet, setInitialStateWallet] = useState([]);
  const [initialVal, setInitialVal] = useState([]);

  const handleAddAdmin = (val) => {
    console.log(val, 'submitted~');
  };
  return (
    <div className="add-admin">
      <div className="modal-title">ADD NEW ADMIN</div>
      <div className="modal-title2">Please input data for new admin</div>
      <Form form={form} className="form-wrapper" onFinish={handleAddAdmin}>
        <div className="label">USERNAME</div>
        <Form.Item name={'username'} noStyle>
          <Input type="text" className="input" />
        </Form.Item>
        <div className="label">PASSWORD</div>
        <Form.Item name={'password'} noStyle>
          <Input.Password
            placeholder="INSERT PASSWORD"
            className="input add-password"
          />
        </Form.Item>
        <div className="label">EMAIL</div>
        <Form.Item name={'email'} noStyle>
          <Input placeholder="INSERT EMAIL" type="text" className="input" />
        </Form.Item>
        <div className="label">WALLET ADDRESS</div>
        <Form.Item noStyle>
          <Input
            placeholder="ADD WALLET ADDRESS"
            className="input"
            onChange={(e) => setWalletInput(e.target.value)}
          />
        </Form.Item>
        <Form.Item noStyle>
          <div
            type="dashed"
            onClick={() => {
              setInitialStateWallet((val) => [
                ...val,
                {
                  address: walletInput,
                  fieldKey: initialStateWallet.length + 1,
                  isListField: true,
                  key: initialStateWallet.length + 1,
                  name: initialStateWallet.length + 1,
                },
              ]);
              setInitialVal((val) => [...val, { address: walletInput }]);
              form.setFieldsValue({
                fields: [
                  ...initialStateWallet,
                  {
                    address: walletInput,
                    fieldKey: initialStateWallet.length + 1,
                    isListField: true,
                    key: initialStateWallet.length + 1,
                    name: initialStateWallet.length + 1,
                  },
                ],
              });
            }}
            className="add-input">
            + ADD MORE WALLET ADDRESS
          </div>
        </Form.Item>
        <Form.List name="fields" initialValue={initialVal}>
          {(fields = initialStateWallet, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => {
                  return (
                    <div key={field.index} className="input-wrapper">
                      <Form.Item
                        noStyle
                        name={[index, 'address']}
                        rules={[{ required: true }]}>
                        <Input
                          placeholder="WALLET ADDRESS"
                          bordered={false}
                          className="address-input"
                          defaultValue={field.address}
                        />
                      </Form.Item>

                      <div
                        type="danger"
                        className="button delete-button"
                        onClick={() => remove(field.name)}>
                        EDIT
                      </div>
                      <div
                        type="danger"
                        className="button delete-button"
                        onClick={() => remove(field.name)}>
                        DELETE
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }}
        </Form.List>

        <Form.Item noStyle>
          <button type="submit" className="button">
            ADD
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEditAdmin;
