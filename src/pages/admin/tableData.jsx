import { Row, Col } from 'antd';

const ActionComponents = (data) => {
  return (
    <Row>
      <Col span={8} style={{ marginRight: '8px' }}>
        <button className="button">Deactivate</button>
      </Col>
      <Col span={8}>
        <button className="button">Edit</button>
      </Col>
    </Row>
  );
};

export const activeCol = [
  {
    title: 'Name',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    key: 'action',
    render: ActionComponents,
  },
];
