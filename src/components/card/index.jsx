import { useState } from 'react';
import rankerCoinBadge from '@/assets/img/shop/ranker-coin.png';
import check from '@/assets/img/check.png';
import uncheck from '@/assets/img/uncheck.png';
import './index.scss';

const AddCard = ({ id, onClickCard, data, checkedStatus }) => {
  return (
    <div key={data.id} className="item-card" onClick={() => onClickCard(data)}>
      <img
        src={checkedStatus ? check : uncheck}
        alt="uncheck"
        className="uncheck"
      />

      <div className="img-wrapper"></div>
      <div>
        <div className="item-title">{data.title}</div>
        <div className="item-id">{data.id}</div>
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

const ShowCard = ({ data, onEdit, id, onClickCard, setShowEdit, showEdit }) => {
  return (
    <div
      key={id}
      className="item-card"
      onMouseEnter={() => setShowEdit({ visible: true, id: id })}
      onMouseLeave={() => setShowEdit({ visible: false, id: -1 })}>
      <div className="img-wrapper" onClick={onClickCard}></div>
      <div onClick={onClickCard}>
        <div className="item-title">AN ITEM</div>
        <div className="item-id">ITEM ID XXXX</div>
      </div>
      <div className="price-title">Price</div>
      <div
        className={`price-tag-wrapper ${
          showEdit.visible && showEdit.id === id ? 'hidden' : 'visible'
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
          showEdit.visible && showEdit.id === id ? 'visible' : 'hidden'
        } `}>
        <button className="delete">DELETE</button>
        <button className="edit" onClick={() => onEdit(id)}>
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
 * @param {number} id - id for key identity
 * @param {function} onClickCard - onClickcard
 * @param {string} purpose - show | add
 * @returns
 */

const CardProduct = ({
  data,
  onEdit,
  id,
  onClickCard,
  purpose = 'show',
  cart = [],
}) => {
  const [showEdit, setShowEdit] = useState(false);

  const addingToCart = (clickedData) => {
    let idx = cart.findIndex((d) => d.id === clickedData.id);
    if (idx < 0) {
      onClickCard((d) => [...d, clickedData]);
    } else {
      const filteredCart = cart.filter((d) => d.id !== clickedData.id);
      onClickCard(filteredCart);
    }
  };

  const isChecked = cart.findIndex((d) => d.id === data.id) < 0 ? false : true;

  if (purpose === 'show') {
    return (
      <ShowCard
        id={id}
        onClickCard={onClickCard}
        onEdit={onEdit}
        setShowEdit={setShowEdit}
        showEdit={showEdit}
      />
    );
  } else {
    return (
      <AddCard
        id={id}
        onClickCard={addingToCart}
        data={data}
        checkedStatus={isChecked}
      />
    );
  }
};

export default CardProduct;
