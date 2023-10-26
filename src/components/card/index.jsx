import { useState } from 'react';
import rankerCoinBadge from '@/assets/img/shop/ranker-coin.png';
import check from '@/assets/img/check.png';
import uncheck from '@/assets/img/uncheck.png';
import './index.scss';

const checkImageUrl = (url = '') => {
  const images = url.split('//');
  if (images[0] === 'https:') return url;
  else if (images[0] === 'ipfs:') return 'https://ipfs.io/ipfs/' + images[1];
};

const AddCard = ({ onClickCard, data, checkedStatus, idx }) => {
  const { image, name, tokenId } = data;
  return (
    <div key={idx} className="item-card" onClick={() => onClickCard(data)}>
      <img
        src={checkedStatus ? check : uncheck}
        alt="uncheck"
        className="uncheck"
      />

      <div className="img-wrapper">
        <img src={checkImageUrl(image)} alt="thumb" />
      </div>
      <div>
        <div className="item-title">{name}</div>
        <div className="item-id">ITEM ID {tokenId.substring(0, 7)}</div>
      </div>
      <div className="price-title">Price</div>
      <div className={`price-tag-wrapper `}>
        <img
          src={rankerCoinBadge}
          alt=""
          className="coin-icon"
          style={{ width: '30px' }}
        />
        <div className="nominal">{data.price}</div>
      </div>
    </div>
  );
};

const ShowCard = ({ data, onEdit, idx, onClickCard, setShowEdit, showEdit }) => {
  const { image, name } = data;
  return (
    <div
      key={idx}
      className="item-card"
      onMouseEnter={() => setShowEdit({ visible: true, id: idx })}
      onMouseLeave={() => setShowEdit({ visible: false, id: -1 })}>
      <div className="img-wrapper" onClick={onClickCard}>
        <img src={checkImageUrl(image)} alt="thumb" />
      </div>
      <div onClick={onClickCard}>
        <div className="item-title">{name}</div>
        <div className="item-id">ITEM ID XXXX</div>
      </div>
      <div className="price-title">Price</div>
      <div
        className={`price-tag-wrapper ${
          showEdit.visible && showEdit.id === idx ? 'hidden' : 'visible'
        } `}>
        <img
          src={rankerCoinBadge}
          alt=""
          className="coin-icon"
          style={{ width: '30px' }}
        />
        <div className="nominal">0.0005</div>
      </div>
      <div
        className={`edit-delete-wrapper ${
          showEdit.visible && showEdit.id === idx ? 'visible' : 'hidden'
        } `}>
        <button className="delete">DELETE</button>
        <button className="edit" onClick={() => onEdit(idx)}>
          EDIT
        </button>
      </div>
    </div>
  );
};

/**
 *
 * @param {object} data - data for the card
 * @param {function} onEdit - function for edit button
 * @param {number} idx - idx for key identity
 * @param {function} onClickCard - onClickcard
 * @param {string} purpose - show | add
 * @returns
 */

const CardProduct = ({
  data,
  onEdit,
  idx,
  onClickCard,
  purpose = 'show',
  cart = [],
}) => {
  const newData = {
    image: data.rawMetadata.image,
    name: data.rawMetadata.name,
    tokenId: data.tokenId,
    tokenType: data.tokenType,
    address: data.contract.address,
    idx,
    price: '-',
  };
  const [showEdit, setShowEdit] = useState(false);

  const addingToCart = (clickedData) => {
    let idx = cart.findIndex(
      (d) =>
        d.tokenId === clickedData.tokenId && d.address === clickedData.address
    );
    if (idx < 0) {
      onClickCard((d) => [...d, clickedData]);
    } else {
      const filteredCart = cart.filter((d) => {
        if (d.tokenId !== clickedData.tokenId) {
          return true;
        } else if (
          d.tokenId !== clickedData.tokenId &&
          d.address !== clickedData.address
        ) {
          return true;
        }
      });
      onClickCard(filteredCart);
    }
  };

  const isChecked =
    cart.findIndex(
      (d) => d.tokenId === newData.tokenId && d.address === newData.address
    ) < 0
      ? false
      : true;

  if (purpose === 'show') {
    return (
      <ShowCard
        data={newData}
        idx={idx}
        onClickCard={onClickCard}
        onEdit={onEdit}
        setShowEdit={setShowEdit}
        showEdit={showEdit}
      />
    );
  } else {
    return (
      <AddCard
        idx={idx}
        onClickCard={addingToCart}
        data={newData}
        checkedStatus={isChecked}
      />
    );
  }
};

export default CardProduct;
