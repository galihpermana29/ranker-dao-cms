import { Table } from 'antd';
import './index.scss';

const dataSource = [
  {
    key: '1',
    no: '1',
    collectionId: '0x000f1121',
    game: 'Monkey Street',
    dateUploaded: '29/01/02',
    dateUpdated: '29/01/02',
    price: '0.001',
  },
  {
    key: '2',
    no: '2',
    collectionId: '0x000f155',
    game: 'Metagear',
    dateUploaded: '29/01/02',
    dateUpdated: '29/01/02',
    price: '0.001',
  },
  {
    key: '3',
    no: '3',
    collectionId: '0x000f112',
    game: 'Monkey Street',
    dateUploaded: '29/01/02',
    dateUpdated: '29/01/02',
    price: '0.001',
  },
  {
    key: '4',
    no: '4',
    collectionId: '0x000f199',
    game: 'Monkey Street',
    dateUploaded: '29/01/02',
    dateUpdated: '29/01/02',
    price: '0.001',
  },
];

export const CustomTable = () => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Collection ID',
      dataIndex: 'collectionId',
      key: 'no',
    },
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'no',
    },
    {
      title: 'Date Uploaded',
      dataIndex: 'dateUploaded',
      key: 'no',
    },
    {
      title: 'Date Updated',
      dataIndex: 'dateUpdated',
      key: 'no',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'no',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'no',
      render: () => <button className="button">DELETE</button>,
    },
  ];
  return <Table dataSource={dataSource} columns={columns} className="table" />;
};
