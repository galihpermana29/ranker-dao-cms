import { Form, Input, Select } from 'antd';
import './index.scss';

const AddCollection = ({ gameOptions = [], onFinish, contractError }) => {
  const [form] = Form.useForm();
  return (
    <div className="add-collection">
      <div className="modal-title">ADD COLLECTION</div>
      <div className="modal-title2">ADD A CATEGORY FOR YOUR ITEMS</div>
      <Form form={form} className="form-wrapper" onFinish={onFinish}>
        <div className="label">COLLECTION ADDRESS</div>
        <Form.List name="fields">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key} className="input-wrapper">
                    <Form.Item noStyle name={[index, 'name']}>
                      <Input
                        placeholder="COLLECTION ADDRESS"
                        className="input"
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <div
                        type="danger"
                        className="button delete-button"
                        onClick={() => remove(field.name)}>
                        DELETE
                      </div>
                    ) : null}
                  </div>
                ))}
                <Form.Item noStyle>
                  <div
                    type="dashed"
                    onClick={() => add()}
                    className="add-input">
                    + Add more collection
                  </div>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        {contractError && <div className="add-input">{contractError}</div>}
        <div className="label">SELECT GAME</div>
        <Form.Item name={'game'} rules={[{ required: true }]}>
          <Select
            className="select-add"
            showSearch
            placeholder="SELECT GAME"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={gameOptions}
          />
        </Form.Item>
        <Form.Item noStyle>
          <button type="submit" className="button">
            ADD COLLECTION
          </button>
        </Form.Item>
        <Form.Item noStyle>
          <button
            type="button"
            className="button"
            style={{ marginTop: '10px' }}>
            VIEW COLLECTION
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCollection;
