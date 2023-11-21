import dayjs from 'dayjs';

import { checkImageUrl } from '@/components/card';

import './index.scss';
const ProductDetailModal = ({ data }) => {
  const { raw_data, title, uploadedBy, tokenId, updatedAt, sold } = data;
  const { image } = JSON.parse(raw_data);
  return (
    <div className="detail-modal">
      <div className="image-wrapper">
        <img src={checkImageUrl(image)} alt="thumb" />
      </div>
      <div className="title-item">{title}</div>
      <div className="text-desc">ITEM ID {tokenId}</div>
      {sold && (
        <div className="text-desc">
          ITEM SOLD AT {dayjs(updatedAt).format('MM-DD-YYYY')}
        </div>
      )}
      <div className="text-desc">ITEM LISTED BY {uploadedBy}</div>
    </div>
  );
};

export default ProductDetailModal;
