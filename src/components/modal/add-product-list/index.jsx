import { CustomTable } from '@/components/table';
import './index.scss';
import { Form, Input, Select, Table } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  gameLabel,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}>
          {dataIndex === 'gameName' ? (
            <Select
              disabled={dataIndex === 'gameName' && children[1]}
              className="select-add"
              showSearch
              placeholder="SELECT GAME"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={gameLabel}
            />
          ) : (
            <Input className="input" />
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AddProductListModal = ({
  columns,
  data,
  form,
  isEditing,
  cancel,
  gameLabel,
}) => {
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div className="modal-add-list-wrapper">
      <div className="table">
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: (props) => (
                  <EditableCell gameLabel={gameLabel} {...props} />
                ),
              },
            }}
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </div>
    </div>
  );
};

export default AddProductListModal;
