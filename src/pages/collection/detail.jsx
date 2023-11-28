import { useEffect, useState } from 'react';

import { Col, Row, Spin, message } from 'antd';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import cmsAPI from '@/api/cms';
import { Modal } from '@/components/modal';
import AddCollection from '@/components/modal/add-collection';
import ProductDetailModal from '@/components/modal/product-detail';
import {
  FailCollectionRewarding,
  SuccessCollectionRewarding,
} from '@/components/modal/rewarding';
import { CustomTable } from '@/components/table';
import { useWalletContext } from '@/context/WalletContext';
import { useCreateCollection } from '@/hooks/useCreateCollection';
import { useStoreCollectionAddress, useStoreGamesData } from '@/state';
import { imageBaseUrl } from '@/utils';

import './style.scss';

const DetailCollection = () => {
  const queryClient = useQueryClient();
  const { address } = useWalletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = window.location.pathname.split('/')[1];

  const [isOpenModal, setIsOpenModal] = useState({
    visible: false,
    type: '',
    data: [],
  });

  const [showSort, setShowSort] = useState(false);
  const [contractMetadataError, setContractMetadataError] = useState(null);
  const [listedNFT, setListedNFT] = useState([]);

  const { data: gamesData } = useQuery('games', () => cmsAPI.getAllGames());

  const {
    data: detailGameData,
    isLoading,
    isError,
  } = useQuery(['detail-game', id], () => cmsAPI.getDetailGame(id));

  const [gamesOptionsForLabel, setGamesData, setGamesOptionsForLabel] =
    useStoreGamesData((state) => [
      state.gamesOptionsForLabel,
      state.setGamesData,
      state.setGamesOptionsForLabel,
    ]);

  const [
    rawData,
    collectionData,
    collectionDataFiltered,
    setCollectionData,
    setCollectionDataFiltered,
  ] = useStoreCollectionAddress((state) => [
    state.rawData,
    state.collectionData,
    state.collectionDataFiltered,
    state.setCollectionData,
    state.setCollectionDataFiltered,
  ]);

  const creationAndEditCollection = async (payload) => {
    try {
      if (isOpenModal.data) {
        await cmsAPI.editCollection(isOpenModal.data.id, payload[0]);
      } else {
        await cmsAPI.createCollection(payload);
      }
      setIsOpenModal({ type: 'successCollection', visible: true });
    } catch (error) {
      setIsOpenModal({ type: 'failCollection', visible: true });
    }
  };

  const deleteCollection = async (id) => {
    try {
      await cmsAPI.deleteCollection(id);
      setIsOpenModal({ type: 'successDeletion', visible: true });
    } catch (error) {
      setIsOpenModal({ type: 'failCollection', visible: true });
    }
  };

  const { mutate: deletionMutation } = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: 'games',
      });
      queryClient.invalidateQueries({
        queryKey: ['detail-game'],
      });
    },
  });

  const { mutate: creationMutation } = useMutation({
    mutationFn: creationAndEditCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: 'games',
      });
      queryClient.invalidateQueries({
        queryKey: ['detail-game'],
      });
    },
  });

  const onClickGoBack = () => {
    navigate('/collection');
  };

  const { handleCreateCollections } = useCreateCollection(
    setContractMetadataError,
    creationMutation
  );

  const onSearchCollection = (value) => {
    setCollectionDataFiltered(value, 'search', collectionData);
  };

  const onSort = (value) => {
    setCollectionDataFiltered(value, 'sort', collectionData);
  };

  const modalTypeDict = {
    productDetail: <ProductDetailModal />,
    addCollection: (
      <AddCollection
        initialData={isOpenModal.data}
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
    successDeletion: (
      <SuccessCollectionRewarding
        title={'COLLECTION DELETED!'}
        desc={'A collection category successfully deleted!'}
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
      key: 'collectionId',
    },
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'game',
      render: () => <p>{rawData.title}</p>,
    },
    {
      title: 'Date Uploaded',
      dataIndex: 'dateUploaded',
      key: 'dateUploaded',
      render: (dateUploaded) => (
        <p>{dayjs(dateUploaded).format('MM-DD-YYYY')}</p>
      ),
    },
    {
      title: 'Date Updated',
      dataIndex: 'dateUpdated',
      key: 'dateUpdated',
      render: (dateUpdated) => <p>{dayjs(dateUpdated).format('MM-DD-YYYY')}</p>,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'id',
      render: (data) => (
        <Row gutter={[12, 12]}>
          <Col>
            <button
              className="button"
              onClick={() => {
                if (address) {
                  return setIsOpenModal({
                    type: 'addCollection',
                    visible: true,
                    data: data,
                  });
                }

                message.info('Please connect to your wallet via metamask');
              }}>
              Edit
            </button>
          </Col>
          <Col>
            <button
              className="button"
              onClick={() => {
                if (listedNFT.length === 0) {
                  deletionMutation(data.id);
                  return;
                }

                message.error(
                  'You cannot delete this collection because there are still listed NFT'
                );
              }}>
              DELETE
            </button>
          </Col>
        </Row>
      ),
    },
  ];

  const getListedNFT = async () => {
    try {
      const {
        data: { data },
      } = await cmsAPI.getListingProductByGame(`gameId=${id}&sold=false`);
      setListedNFT(data);
    } catch (error) {
      message.error('Error while getting listed product');
    }
  };

  useEffect(() => {
    if (detailGameData) {
      setCollectionData(detailGameData);
      getListedNFT();
    }
  }, [id, detailGameData]);

  useEffect(() => {
    if (gamesData) {
      setGamesData(gamesData);
      setGamesOptionsForLabel(gamesData);
    }
  }, [gamesData, setGamesData, setGamesOptionsForLabel]);

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
    <div className="detail-shop-wrapper">
      <Modal
        maxWidth={600}
        isOpen={isOpenModal.visible}
        onClose={() => setIsOpenModal({ visible: false, type: '' })}>
        {modalTypeDict?.[isOpenModal.type] || <></>}
      </Modal>
      <div className="header-filter">
        <div className="logo-wrapper">
          <img
            src={imageBaseUrl(rawData.logo_url)}
            alt="logo"
            className="logo"
          />
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
                <div className="list-item">RESET</div>
              </div>
            </div>
            <button
              className="button add-collection-button"
              onClick={() => {
                if (address) {
                  return setIsOpenModal({
                    type: 'addCollection',
                    visible: true,
                  });
                }

                message.info('Please connect to your wallet via metamask');
              }}>
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
        <CustomTable
          columns={dataCollectionsCol}
          data={
            collectionDataFiltered.length > 0
              ? collectionDataFiltered
              : collectionData
          }
        />
      </div>
    </div>
  );
};

export default DetailCollection;
