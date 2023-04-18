import './style.scss';

import { Link } from 'react-router-dom';
import { Modal } from '@/components/modal';
import { useEffect, useState } from 'react';
import AddCollection from '@/components/modal/add-collection';

import cmsAPI from '@/api/cms';

import { imageBaseUrl } from '@/utils';
import { useStoreGamesData } from '@/state';
import {
  FailCollectionRewarding,
  SuccessCollectionRewarding,
} from '@/components/modal/rewarding';
import {
  checkContractAddressName,
  gettingTheContractMetaData,
  mappingAddress,
} from '@/utils/collectionsUtils';

const OurShop = () => {
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

  const hittingAPICollection = async (payload) => {
    try {
      await cmsAPI.createCollection(payload);
      setIsOpenModal({ type: 'successCollection', visible: true });
    } catch (error) {
      setIsOpenModal({ type: 'failCollection', visible: true });
    }
  };

  const handleCreateCollections = async (value) => {
    try {
      const { fields = [], game } = value;
      if (fields.length === 0) {
        setContractMetadataError('Contract Address Is Required!');
        return;
      }

      const payloadForGettingTheContractName = mappingAddress(
        fields,
        setContractMetadataError
      );
      if (payloadForGettingTheContractName) {
        const responsesFromAlchemy = await gettingTheContractMetaData(
          payloadForGettingTheContractName
        );
        const payload = responsesFromAlchemy.map((d) => ({
          name: checkContractAddressName(d.name),
          address: d.address,
          gameId: game,
        }));
        await hittingAPICollection(payload);
      }
    } catch (error) {
      setContractMetadataError(error);
    }
  };

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
    const getAllGamesData = async () => {
      try {
        const {
          data: { data },
        } = await cmsAPI.getAllGames();
        setGamesData(data);
        setGamesOptionsForLabel(data);
      } catch (error) {
        console.log(error, 'error while getting data games');
      }
    };
    getAllGamesData();
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
          <Link className="button" to={'/add-nft'}>
            ADD ITEM
          </Link>
        )}
      </div>
    </div>
  );
};

export default OurShop;
