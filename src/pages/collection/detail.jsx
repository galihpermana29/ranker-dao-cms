import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cmsAPI from '@/api/cms';
import { useStoreGamesData } from '@/state';
import { imageBaseUrl } from '@/utils';

import { CustomTable } from '@/components/table';
import { Modal } from '@/components/modal';
import AddCollection from '@/components/modal/add-collection';
import ProductDetailModal from '@/components/modal/product-detail';
import {
  FailCollectionRewarding,
  SuccessCollectionRewarding,
} from '@/components/modal/rewarding';

import {
  checkContractAddressName,
  gettingTheContractMetaData,
  mappingAddress,
} from '@/utils/collectionsUtils';

import './style.scss';

const DetailCollection = () => {
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [showSort, setShowSort] = useState(false);
  const [data, setData] = useState({ logo: '' });
  const [collections, setCollections] = useState([]);
  const [contractMetadataError, setContractMetadataError] = useState(null);

  const [gamesOptionsForLabel, setGamesData, setGamesOptionsForLabel] =
    useStoreGamesData((state) => [
      state.gamesOptionsForLabel,
      state.setGamesData,
      state.setGamesOptionsForLabel,
    ]);

  const { id } = useParams();
  const navigate = useNavigate();
  const loc = window.location.pathname.split('/')[1];
  const { logo } = data;

  const onClickEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const onClickGoBack = (id) => {
    navigate('/collection');
  };

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

  const onSearchCollection = (value) => {
    let newCollections = data.Collections.filter((collection) => {
      if (collection.collectionId.includes(value)) {
        return collection;
      }
    });

    setCollections(newCollections);
  };

  const onSort = (value) => {
    let sorted = data.Collections.sort((a, b) => {
      if (value === 'ALPHABET') {
        return a.collectionId - b.collectionId;
      } else if (value === 'LAST UPDATED') {
        const dateA = Math.floor(new Date(a.dateUpdated).getTime() / 1000);
        const dateB = Math.floor(new Date(b.dateUpdated).getTime() / 1000);

        return dateB - dateA;
      } else if (value === 'LATEST UPLOADED') {
        const dateA = Math.floor(new Date(a.dateUploaded).getTime() / 1000);
        const dateB = Math.floor(new Date(b.dateUploaded).getTime() / 1000);

        return dateB - dateA;
      }
    });

    setCollections([...sorted]);
  };

  const modalTypeDict = {
    productDetail: <ProductDetailModal />,
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

  const dataCollectionsCol = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Collection ID',
      dataIndex: 'collectionId',
      key: 'no',
    },
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'no',
    },
    {
      title: 'Date Uploaded',
      dataIndex: 'dateUploaded',
      key: 'no',
    },
    {
      title: 'Date Updated',
      dataIndex: 'dateUpdated',
      key: 'no',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'no',
      render: () => <button className="button">DELETE</button>,
    },
  ];

  useEffect(() => {
    const getDetailGame = async () => {
      try {
        const {
          data: { data },
        } = await cmsAPI.getDetailGame(id);
        data.Collections = data.Collections?.map((el, i) => {
          return {
            key: i,
            no: i + 1,
            collectionId: el.address,
            game: el.gameId,
            dateUploaded: el.createdAt,
            dateUpdated: el.updatedAt,
          };
        });
        setData(data);
        setCollections(data.Collections);
      } catch (error) {
        console.log(err, 'error while getting data detail game');
      }
    };
    getDetailGame();
  }, [id]);

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
          <input
            type="text"
            className="input"
            placeholder=" SEARCH COLLECTION"
            onChange={(e) => onSearchCollection(e.target.value)}
          />
          <div className={`button-wrapper ${loc === 'edit' ? 'edit' : ''}`}>
            <div className={`sort `}>
              <button className="button" onClick={() => setShowSort(!showSort)}>
                SORT BY
              </button>
              <div
                className={`list ${showSort ? 'show' : ''}`}
                onClick={(e) => onSort(e.target.innerText)}>
                <div className="list-item">ALPHABET</div>
                <div className="list-item">LAST UPDATED</div>
                <div className="list-item">LATEST UPLOADED</div>
                <div className="list-item">PRICE</div>
              </div>
            </div>
            <button
              className="button add-collection-button"
              onClick={() =>
                setIsOpenModal({ type: 'addCollection', visible: true })
              }>
              ADD COLLECTION
            </button>
            <button
              className={`button ${loc === 'edit' ? 'hidden' : ''}`}
              onClick={() => onClickGoBack()}>
              GO BACK
            </button>
          </div>
        </div>
      </div>

      <div className="body-wrappers">
        <CustomTable columns={dataCollectionsCol} data={collections} />
      </div>
    </div>
  );
};

export default DetailCollection;
