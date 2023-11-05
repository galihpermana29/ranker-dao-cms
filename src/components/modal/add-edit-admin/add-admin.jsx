import './index.scss';
import { useEffect, useState } from 'react';

import { Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';

const AddEditAdmin = ({ initialData, onClickSubmit }) => {
  const [form] = useForm();
  const [walletInput, setWalletInput] = useState('');
  const [initialStateWallet, setInitialStateWallet] = useState([]);
  const [toggleEdit, setToggleEdit] = useState();

  const handleAddAdmin = async (val) => {
    const { fields, email, username, password } = val;

    if (fields.length === 0 && !initialData)
      return message.error('There should be minimum 1 address to be added');

    const walletAddresses = mappingAddressesFromComponentToForm(fields);
    let bodyAPI = {
      email,
      username,
      password,
      walletAddresses,
    };

    /**
     * We check if there is an initial data it means that this modal will handle an edit action, vice versa
     */
    if (initialData) {
      bodyAPI.role = initialData.role;
      bodyAPI.active = initialData.active;
      onClickSubmit(bodyAPI, initialData.id);
    } else {
      onClickSubmit(bodyAPI, null);
    }
  };

  /**
   *
   * @returns {Array} - Array of new mapping so the form can read initial wallet address value if its an edit
   */
  const mappingInitialAdressesToComponent = () => {
    const newMapping = initialData.walletAddresses.map((wallet, idx) => ({
      address: wallet,
      fieldKey: idx,
      isListField: true,
      key: idx,
      name: idx,
    }));
    setInitialStateWallet(newMapping);
    return newMapping;
  };

  /**
   *
   * @param {Array} arrayOfWallets - this function will mapping back the form output to proper form submit input to the api
   * @returns
   */
  const mappingAddressesFromComponentToForm = (arrayOfWallets) => {
    const newMapping = arrayOfWallets.map((data) => data.address);
    return newMapping;
  };

  useEffect(() => {
    if (initialData) {
      const initialNewMappingWallet = mappingInitialAdressesToComponent();
      form.setFieldsValue({
        email: initialData.email,
        username: initialData.username,
        fields: initialNewMappingWallet,
      });
    }
  }, []);
  return (
    <div className="add-admin">
      <div className="modal-title">
        {initialData ? 'EDIT' : 'ADD'} NEW ADMIN
      </div>
      <div className="modal-title2">Please input data for new admin</div>
      <Form form={form} className="form-wrapper" onFinish={handleAddAdmin}>
        <div className="label">USERNAME</div>
        <Form.Item
          name={'username'}
          rules={[
            {
              required: initialData ? false : true,
              message: 'email is required',
            },
          ]}>
          <Input type="text" className="input" />
        </Form.Item>
        <div className="label">PASSWORD</div>
        <Form.Item
          name={'password'}
          rules={[
            {
              required: initialData ? false : true,
              message: 'password is required',
            },
          ]}>
          <Input.Password
            placeholder="INSERT PASSWORD"
            className="input add-password"
          />
        </Form.Item>
        <div className="label">EMAIL</div>
        <Form.Item
          name={'email'}
          rules={[
            {
              required: initialData ? false : true,
              message: 'email is required',
            },
          ]}>
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
              const newState = {
                address: walletInput,
                fieldKey: initialStateWallet.length + 1,
                isListField: true,
                key: initialStateWallet.length + 1,
                name: initialStateWallet.length + 1,
              };
              setInitialStateWallet((val) => [...val, newState]);
              form.setFieldsValue({
                fields: [...initialStateWallet, newState],
              });
            }}
            className="add-input">
            + ADD MORE WALLET ADDRESS
          </div>
        </Form.Item>
        <Form.List name="fields" initialValue={initialStateWallet}>
          {(fields = initialStateWallet, { _, remove }) => {
            return (
              <div>
                {fields.map((field, index) => {
                  return (
                    <div key={field.key} className="input-wrapper">
                      <Form.Item
                        noStyle
                        name={[index, 'address']}
                        rules={[{ required: true }]}>
                        <Input
                          placeholder="WALLET ADDRESS"
                          bordered={toggleEdit === field.key ? true : false}
                          className="address-input"
                          defaultValue={field.address}
                          disabled={toggleEdit === field.key ? false : true}
                        />
                      </Form.Item>

                      <div
                        type="danger"
                        className="button delete-button"
                        onClick={() => setToggleEdit(field.key)}>
                        EDIT
                      </div>
                      <div
                        type="danger"
                        className="button delete-button"
                        onClick={() => {
                          remove(field.name);
                          setInitialStateWallet(form.getFieldValue('fields'));
                        }}>
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
            {initialData ? 'EDIT' : 'ADD'}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEditAdmin;
