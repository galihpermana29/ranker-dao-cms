import './style.scss';

import { useEffect, useState } from 'react';

import { Spin, message } from 'antd';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import cmsAPI from '@/api/cms';
import { Modal } from '@/components/modal';
import AddCollection from '@/components/modal/add-collection';
import {
  FailCollectionRewarding,
  SuccessCollectionRewarding,
} from '@/components/modal/rewarding';
import { useWalletContext } from '@/context/WalletContext';
import { useCreateCollection } from '@/hooks/useCreateCollection';
import { useStoreGamesData } from '@/state';
import { imageBaseUrl } from '@/utils';

const OurShop = () => {
  const { address } = useWalletContext();
  const loc = window.location.pathname.split('/')[1];
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [contractMetadataError, setContractMetadataError] = useState(null);

  const [
    gamesData,
    gamesOptionsForLabel,
    setGamesData,
    setGamesOptionsForLabel,
  ] = useStoreGamesData((state) => [
    state.gamesData,
    state.gamesOptionsForLabel,
    state.setGamesData,
    state.setGamesOptionsForLabel,
  ]);

  const { data, isLoading, isError } = useQuery('games', () =>
    cmsAPI.getAllGames()
  );

  const hittingAPICollection = async (payload) => {
    try {
      await cmsAPI.createCollection(payload);
      setIsOpenModal({ type: 'successCollection', visible: true });
    } catch (error) {
      setIsOpenModal({ type: 'failCollection', visible: true });
    }
  };

  const { handleCreateCollections } = useCreateCollection(
    setContractMetadataError,
    hittingAPICollection
  );

  const modalTypeDict = {
    addCollection: (
      <AddCollection
        gameOptions={gamesOptionsForLabel}
        onFinish={handleCreateCollections}
        contractError={contractMetadataError}
      />
    ),
    successCollection: (
      <SuccessCollectionRewarding
        title={'COLLECTION ADDED!'}
        desc={'New collection category successfully added!'}
      />
    ),
    failCollection: (
      <FailCollectionRewarding
        title={'UPDATE FAILED'}
        desc={'Please try again or check your internet connection!'}
      />
    ),
  };

  useEffect(() => {
    if (data) {
      setGamesData(data);
      setGamesOptionsForLabel(data);
    }
  }, [data, setGamesData, setGamesOptionsForLabel]);

  if (isError) {
    return <div className="loading-container">Error occur</div>;
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin />
      </div>
    );
  }

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
          <div className="title text-center">
            {loc === 'collection' ? 'COLLECTION PAGE' : 'PRODUCT PAGE'}
          </div>
        </div>
      </div>
      <div className="bottom-content">
        {loc === 'collection' ? (
          <button
            type="button"
            className="button"
            onClick={() => {
              if (address) {
                return setIsOpenModal({ visible: true, type: 'addCollection' });
              }
              message.info('Please connect to your wallet via metamask');
            }}>
            ADD COLLECTION
          </button>
        ) : (
          <Link className="button" to={'/add-nft'}>
            ADD ITEM
          </Link>
        )}
      </div>

      <div className="content-wrapper">
        {gamesData?.map((data, idx) => (
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
    </div>
  );
};

export default OurShop;
