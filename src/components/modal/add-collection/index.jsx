import { Form, Input, Select } from 'antd';
import './index.scss';

const AddCollection = () => {
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  return (
    <div className="add-collection">
      <div className="modal-title">ADD COLLECTION</div>
      <div className="modal-title2">ADD A CATEGORY FOR YOUR ITEMS</div>
      <Form className="form-wrapper">
        <div className="label">COLLECTION ID</div>
        <Form.List name="fields">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key} className="input-wrapper">
                    <Form.Item
                      noStyle
                      name={[index, 'name']}
                      rules={[{ required: true }]}>
                      <Input placeholder="field name" className="input" />
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
        <div className="label">SELECT GAME</div>
        <Form.Item>
          <Select
            className=" select-add"
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: 'jack',
                label: 'Jack',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              },
              {
                value: 'tom',
                label: 'Tom',
              },
            ]}
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
