import { useState } from 'react';

import check from '@/assets/img/check.png';
import rankerCoinBadge from '@/assets/img/shop/ranker-coin.png';
import uncheck from '@/assets/img/uncheck.png';
import './index.scss';

export const checkImageUrl = (url = '') => {
  const images = url.split('//');
  if (images[0] === '')
    return 'https://ipfs.io/ipfs/QmQtbA1RdTzRBLxEWAkdzdF7N1yxSyphfBDBak2DZYBBc9/B.gif';
  if (images[0] === 'https:') return url;
  else if (images[0] === 'ipfs:') return 'https://ipfs.io/ipfs/' + images[1];
};

const AddCard = ({ onClickCard, data, checkedStatus, idx }) => {
  const { image, name, tokenId, tokenType } = data;
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
        <div className="item-title">{name ? name : '-'}</div>
        <div className="item-id">ITEM ID {tokenId.substring(0, 7)}</div>
        <div className="item-id">{tokenType}</div>
      </div>
    </div>
  );
};

const ShowCard = ({
  data,
  onEdit,
  idx,
  onClickCard,
  setShowEdit,
  showEdit,
  onDelete,
}) => {
  const currentUserEmail = JSON.parse(localStorage.getItem('email'));
  const { image, name, tokenId, price, idCollection, uploadedBy, tokenType } =
    data;
  const isTheOwner = currentUserEmail === uploadedBy;
  return (
    <div
      key={idx}
      className="item-card"
      onMouseEnter={() => isTheOwner && setShowEdit({ visible: true, id: idx })}
      onMouseLeave={() =>
        isTheOwner && setShowEdit({ visible: false, id: -1 })
      }>
      <div className="img-wrapper" onClick={onClickCard}>
        <img src={checkImageUrl(image)} alt="thumb" />
      </div>
      <div onClick={onClickCard}>
        <div className="item-title">{name}</div>
        <div className="item-id">ITEM ID {tokenId ?? '-'}</div>
        <div className="item-id">{tokenType}</div>
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
        <div className="nominal">{price}</div>
      </div>
      {isTheOwner && (
        <div
          className={`edit-delete-wrapper ${
            showEdit.visible && showEdit.id === idx ? 'visible' : 'hidden'
          } `}>
          <button className="delete" onClick={() => onDelete(idCollection)}>
            DELETE
          </button>
          <button className="edit" onClick={() => onEdit(idCollection)}>
            EDIT
          </button>
        </div>
      )}
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
  onDelete,
  cart = [],
}) => {
  const newData = {
    productId: data.contract.address + data.tokenId,
    image: data.rawMetadata.image,
    name: data.rawMetadata.name,
    tokenId: data.tokenId,
    tokenType: data.tokenType,
    address: data.contract.address,
    idx,
    price: 'price' in data ? data.price : '',
    gameName: null,
    gameId: null,
    idCollection: 'id' in data ? data.id : '',
    ...data,
  };

  const [showEdit, setShowEdit] = useState(false);

  const addingToCart = (clickedData) => {
    let idx = cart.findIndex(
      (d) =>
        d.productId === clickedData.productId &&
        d.address === clickedData.address
    );
    if (idx < 0) {
      onClickCard((d) => [...d, clickedData]);
    } else {
      const filteredCart = cart.filter((d) => {
        if (d.productId !== clickedData.productId) {
          return true;
        }
        if (
          d.productId !== clickedData.productId &&
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
      (d) => d.productId === newData.productId && d.address === newData.address
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
        onDelete={onDelete}
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
