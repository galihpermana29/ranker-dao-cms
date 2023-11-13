import { Col, DatePicker, Form, InputNumber, Row, Select, Table } from 'antd';

import './index.scss';

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
  const renderedComponent = () => {
    if (dataIndex === 'gameName') {
      return (
        <Select
          disabled={dataIndex === 'gameName' && children[1]}
          className="select-add"
          showSearch
          placeholder="SELECT GAME"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={gameLabel}
        />
      );
    }

    if (dataIndex === 'dataUploaded') {
      return <DatePicker className="date-input" />;
    }

    if (dataIndex === 'price') {
      return <InputNumber className="input" />;
    }
  };

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
          {renderedComponent()}
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
  handleSubmit,
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

      <Row justify={'end'} gutter={[12, 12]}>
        <Col>
          <button
            onClick={handleSubmit}
            type="button"
            className="button"
            style={{
              marginRight: 8,
            }}>
            Upload
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default AddProductListModal;
