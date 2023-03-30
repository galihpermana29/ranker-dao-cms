import { useEffect, useState } from 'react';

// import { ShopSelector } from './ShopSelector';

import RankerCoinImg from '@/assets/img/shop/ranker-coin.png';

import MetaGearImg from '@/assets/img/shop/metagear.png';
import MetaGear1 from '@/assets/img/shop/metagear-1.png';
import MetaGear2 from '@/assets/img/shop/metagear-2.png';
import MetaGear3 from '@/assets/img/shop/metagear-3.png';
import MetaGear4 from '@/assets/img/shop/metagear-4.png';
import ApeironImg from '@/assets/img/shop/apeiron.png';
import Apeiron1 from '@/assets/img/shop/apeiron-1.png';
import Apeiron2 from '@/assets/img/shop/apeiron-2.png';
import Apeiron3 from '@/assets/img/shop/apeiron-3.png';
import Apeiron4 from '@/assets/img/shop/apeiron-4.png';

import './style.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DUMMY_DATA } from './constant';
import CardProduct from '@/components/card';
import { Modal } from '@/components/modal';
import ProductDetailModal from '@/components/modal/product-detail';

const SHOP_GAME_LIST = {
  apeiron: {
    name: 'apeiron',
    label: 'APEIRON',
    img: ApeironImg,
    description:
      "Apeiron is the world's first ever god-game on the blockchain. Come uncover the mysteries of the Godiverse! Step into your role as a Wandering God and build up planets, explore celestial dungeons, and battle the forces of Chaos!",
    imageList: [
      { img: Apeiron1, title: 'FOONIE EMBLEMS', price: 0.0005 },
      { img: Apeiron2, title: 'DOOD PLUSHIE', price: 0.0005 },
      {
        img: Apeiron3,
        title: 'ORIGINS GUARDIANS APOSTLE MINT TICKET',
        price: 0.0005,
      },
      { img: Apeiron4, title: 'FOONIE EMBLEMS', price: 0.0005 },
    ],
  },
  metagear: {
    name: 'metagear',
    label: 'METAGEAR',
    img: MetaGearImg,
    description:
      'MetaGear is a game that shows creativity in assembling robots to fight. You can visit other players’ garages, decorate and protect their garages by the surprise attack from other players!',
    imageList: [
      { img: MetaGear1, title: 'BRAKE DISC', price: 0.0005 },
      { img: MetaGear2, title: 'BRAKE DISC 2', price: 0.0005 },
      {
        img: MetaGear3,
        title: 'HEADLAMP',
        price: 0.0005,
      },
      { img: MetaGear4, title: 'ARMORED HEADLAMP', price: 0.0005 },
    ],
  },
};

const DetailShop = () => {
  const [activeGame, setActiveGame] = useState('apeiron');
  const [isHovered, setIsHovered] = useState({});
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [showSort, setShowSort] = useState(false);

  const { id } = useParams();
  const [data, setData] = useState({ logo: '' });
  const navigate = useNavigate();
  const loc = window.location.pathname.split('/')[1];
  const { logo } = data;

  const onClickEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const modalTypeDict = {
    productDetail: <ProductDetailModal />,
  };

  useEffect(() => {
    let filtered = DUMMY_DATA.filter((datas) => datas.id === parseInt(id));
    setData(filtered[0]);
  }, [id]);

  return (
    <div className="detail-shop-wrapper">
      <Modal
        maxWidth={600}
        isOpen={isOpenModal.visible}
        onClose={() => setIsOpenModal({ visible: false, type: '' })}>
        {modalTypeDict?.[isOpenModal.type] || <></>}
      </Modal>
      <div className="header-filter">
        <div className="logo-wrapper">
          <img src={logo} alt="logo" className="logo" />
        </div>
        <div className={`filter ${loc === 'edit' ? 'edit' : ''}`}>
          <input type="text" className="input" />
          <div className={`button-wrapper ${loc === 'edit' ? 'edit' : ''}`}>
            <div className={`sort `}>
              <button className="button" onClick={() => setShowSort(!showSort)}>
                SORT BY
              </button>
              <div
                className={`list ${showSort ? 'show' : ''}`}
                onClick={(e) => console.dir(e.target.innerText, 'd')}>
                <div className="list-item">ALPHABET</div>
                <div className="list-item">LAST UPDATED</div>
                <div className="list-item">LATEST UPLOADED</div>
                <div className="list-item">LATEST UPLOADED</div>
                <div className="list-item">PRICE</div>
              </div>
            </div>
            <Link className="button nft-add-button" to={'/add-nft'}>
              ADD NFT
            </Link>
            <button className={`button ${loc === 'edit' ? 'hidden' : ''}`}>
              GO BACK
            </button>
          </div>
        </div>
      </div>
      {loc === 'edit' ? (
        <div className="edit-wrapper">
          <div className="edit-section">
            <div className="edit-title">EDIT LISTING</div>
            <div className="card-image"> </div>
            <div className="text-desc">
              <div>DATE ADDED 29/01/2002</div>
              <div>LAST UPDATED 29/01/2002</div>
              <div>LAST EDITED 29/01/2002</div>
            </div>

            <div className="address-title">NFT ADDRESS</div>
            <input type="text" name="address" id="address" className="input" />
            <div className="address-title">PRICE</div>
            <input type="text" name="address" id="address" className="input" />
            <button className="button update">UPDATE LISTING</button>
            <button className="button">GO BACK</button>
          </div>
          <div className="body-wrapper product-section">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((data, idx) => (
              <CardProduct
                id={data}
                onEdit={onClickEdit}
                onClickCard={() =>
                  setIsOpenModal({ visible: true, type: 'productDetail' })
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="body-wrapper">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((data, idx) => (
            <CardProduct
              id={data}
              onEdit={onClickEdit}
              onClickCard={() =>
                setIsOpenModal({ visible: true, type: 'productDetail' })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailShop;
