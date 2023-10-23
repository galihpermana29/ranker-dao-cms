import { getNftWithSpecificAddress } from '@/api/alchemy';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStoreNFTCollection } from '@/state';
import { imageBaseUrl } from '@/utils';
import cmsAPI from '@/api/cms';

import { Modal } from '@/components/modal';
import { useWalletContext } from '@/context/WalletContext';
import CardProduct from '@/components/card';
import ProductDetailModal from '@/components/modal/product-detail';

import './style.scss';
const DetailShop = () => {
  const { address, errors } = useWalletContext();
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [showSort, setShowSort] = useState(false);
  const [data, setData] = useState({ logo: '' });

  const { gameId } = useParams();
  const navigate = useNavigate();
  const loc = window.location.pathname.split('/')[1];

  const [activeCollections, setNftCollections, setActive] =
    useStoreNFTCollection((state) => [
      state.activeCollections,
      state.setNftCollections,
      state.setActive,
    ]);

  const onClickEdit = (ids) => {
    navigate(`/edit/${gameId}/${ids}`);
  };

  const onClickGoBack = (id) => {
    navigate('/product');
  };

  const modalTypeDict = {
    productDetail: <ProductDetailModal />,
  };

  const mappingNFTPerCollection = (data) => {
    let collectionAdd = [];
    let newCollection = [];

    data.forEach((d) => {
      if (collectionAdd.includes(d.contract.address)) return;
      else collectionAdd.push(d.contract.address);
    });

    collectionAdd.forEach((d) => {
      let nn = data.filter((x) => d === x.contract.address);
      newCollection.push(nn);
    });
    setNftCollections(newCollection);
    setActive('ALL');
  };

  useEffect(() => {
    const getDetailGame = async () => {
      try {
        const {
          data: { data },
        } = await cmsAPI.getDetailGame(gameId);
        setData(data);
      } catch (error) {
        console.log(error, 'error while getting data detail game');
      }
    };
    getDetailGame();
  }, [gameId]);

  useEffect(() => {
    const getNFT = async () => {
      // setLoading(true);
      try {
        const nfts = await getNftWithSpecificAddress(address);
        mappingNFTPerCollection(nfts.ownedNfts);
        // setLoading(false);
      } catch (error) {
        console.log(error, 'error when getting nft from the wallet account');
      } finally {
      }
    };
    if (address && errors !== 'WALLET MISSMATCHED') {
      getNFT();
    }
    if (errors === 'WALLET MISSMATCHED') {
      setIsOpenModal({ type: 'missmatched', visible: true });
    }
  }, [address, errors]);

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
          <img src={imageBaseUrl(data.logo_url)} alt="logo" className="logo" />
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
            <button
              className={`button ${loc === 'edit' ? 'hidden' : ''}`}
              onClick={() => onClickGoBack()}>
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
            {activeCollections?.data?.map((collection, idx) => (
              <div key={idx}>
                <CardProduct
                  id={idx}
                  onEdit={onClickEdit}
                  onClickCard={() =>
                    setIsOpenModal({ visible: true, type: 'productDetail' })
                  }
                  data={collection}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="body-wrapper">
          {activeCollections?.data?.map((collection, idx) => (
            <div key={idx}>
              <CardProduct
                id={idx}
                onEdit={onClickEdit}
                onClickCard={() =>
                  setIsOpenModal({ visible: true, type: 'productDetail' })
                }
                data={collection}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailShop;
