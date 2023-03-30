import CardProduct from '@/components/card';
import { Modal } from '@/components/modal';
import AddProductListModal from '@/components/modal/add-product-list';
import { useState } from 'react';
import './index.scss';

const DUMMY = [
  {
    img: '',
    title: 'ITEM 1',
    ids: '0x00001',
    price: '0.00007',
    id: 1,
  },
  {
    img: '',
    title: 'ITEM 2',
    ids: '0x00001',
    price: '0.000071',
    id: 2,
  },
  {
    img: '',
    title: 'ITEM 3',
    ids: '0x00001',
    price: '0.00005',
    id: 3,
  },
  {
    img: '',
    title: 'ITEM 4',
    ids: '0x00001',
    price: '0.0000712',
    id: 4,
  },
  {
    img: '',
    title: 'ITEM 5',
    ids: '0x00001',
    price: '0.00107',
    id: 5,
  },
  {
    img: '',
    title: 'ITEM 6',
    ids: '0x00001',
    price: '0.0107',
    id: 6,
  },
];

const AddProduct = () => {
  let [cart, setCart] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });

  const handleNextAction = () => {
    if (cart.length === 0) {
      console.log('Cannot next when you are not select an item');
    } else {
      setIsOpenModal({ visible: true, type: 'addProductModal' });
    }
  };

  const modalTypeDict = {
    addProductModal: <AddProductListModal />,
  };

  return (
    <div className="add-wrapper">
      <Modal
        maxWidth={1200}
        isOpen={isOpenModal.visible}
        onClose={() => setIsOpenModal({ visible: false, type: '' })}>
        {modalTypeDict?.[isOpenModal.type] || <></>}
      </Modal>
      <div className={`filter`}>
        <div className="input-wrapper">
          <input type="text" className="input" />
        </div>
        <div className={`button-wrapper `}>
          <div className={`sort`}>
            <button
              className="button"
              // onClick={() => setShowSort(!showSort)}
            >
              SORT BY
            </button>
            <div
              className={`list `}
              onClick={(e) => console.dir(e.target.innerText, 'd')}>
              <div className="list-item">ALPHABET</div>
              <div className="list-item">LAST UPDATED</div>
              <div className="list-item">LATEST UPLOADED</div>
              <div className="list-item">LATEST UPLOADED</div>
              <div className="list-item">PRICE</div>
            </div>
          </div>
          <button className="button">ADD NFT</button>
        </div>
      </div>
      <div className="content">
        <div className="category">
          <div className="cat-list">ALL</div>
          <div className="cat-list">COLLECTION A</div>
          <div className="cat-list">COLLECTION B</div>
          <div className="cat-list">COLLECTION C</div>
          <div className="cat-list">COLLECTION D</div>
          <div className="cat-list">COLLECTION E</div>
        </div>

        <div className="content-card">
          <div className="body-wrapper product-section">
            {DUMMY.map((data, idx) => (
              <CardProduct
                id={data.id}
                purpose="add"
                onClickCard={setCart}
                cart={cart}
                data={data}
              />
            ))}
          </div>
          <div className="button-next-wrapper">
            <button className="button" onClick={handleNextAction}>
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
