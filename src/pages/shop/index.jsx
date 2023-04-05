import './style.scss';
import { DUMMY_DATA } from './constant';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/modal';
import { useEffect, useState } from 'react';
import AddCollection from '@/components/modal/add-collection';
import cmsAPI from '@/api/cms';
import { useStoreGamesData } from '@/state';
import { imageBaseUrl } from '@/utils';
import { getNftWithSpecificAddress } from '@/api/alchemy';
import { getNFTCollection } from '@/api/bsc-testnet';

const OurShop = () => {
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const loc = window.location.pathname.split('/')[1];
  const [gamesData, setGamesData] = useStoreGamesData((state) => [
    state.gamesData,
    state.setGamesData,
  ]);

  const modalTypeDict = {
    addCollection: <AddCollection />,
  };

  useEffect(() => {
    const getAllGamesData = async () => {
      try {
        const {
          data: { data },
        } = await cmsAPI.getAllGames();
        setGamesData(data);
      } catch (error) {
        console.log(error, 'error while getting data games');
      }
    };
    getNftWithSpecificAddress('0xF97C7A13439DA91254B2D499685D52CC3E64E4EF');
    getAllGamesData();
    getNFTCollection()
      .then((nfts) => {
        console.log(nfts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="shop-container">
      <Modal
        maxWidth={450}
        isOpen={isOpenModal.visible}
        onClose={() => setIsOpenModal({ visible: false, type: '' })}>
        {modalTypeDict?.[isOpenModal.type] || <></>}
      </Modal>
      <div className="shop-title mt-5">
        <div className="my-4">
          <div className="title text-center">our game partners</div>
        </div>
      </div>

      <div className="content-wrapper">
        {gamesData.map((data, idx) => (
          <Link
            to={`${
              loc === 'collection'
                ? `/collection/detail/${data.id}`
                : `/detail/${data.id}`
            }`}
            key={idx}
            className="card-shop">
            <div>
              <img src={imageBaseUrl(data.thumbnail_url)} alt="thumbnail" />
            </div>
            <div className="title">{data.title}</div>
          </Link>
        ))}
      </div>

      <div className="bottom-content">
        {loc === 'collection' ? (
          <Link
            className="button"
            onClick={() =>
              setIsOpenModal({ visible: true, type: 'addCollection' })
            }>
            ADD COLLECTION
          </Link>
        ) : (
          <Link className="button">ADD ITEM</Link>
        )}
      </div>
    </div>
  );
};

export default OurShop;
