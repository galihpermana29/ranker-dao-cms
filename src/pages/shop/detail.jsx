import { useEffect, useState } from 'react';

import { Spin, message } from 'antd';
import dayjs from 'dayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import cmsAPI from '@/api/cms';
import CardProduct, { checkImageUrl } from '@/components/card';
import { Modal } from '@/components/modal';
import ProductDetailModal from '@/components/modal/product-detail';
import {
  FailCollectionRewarding,
  LoadingModal,
  SuccessCollectionRewarding,
} from '@/components/modal/rewarding';
import { useWalletContext } from '@/context/WalletContext';
import { useStoreListedNFT } from '@/state';
import { imageBaseUrl } from '@/utils';
import contractAbi from '@/utils/contract-listing.json';

import failCollection from '../../assets/img/fail-collection.png';
import './style.scss';

const DetailShop = () => {
  const { address, errors } = useWalletContext();

  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [showSort, setShowSort] = useState(false);

  const [data, setData] = useState({ logo: '' });

  const { gameId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const routPath = window.location.pathname.split('/');
  const loc = routPath[1];
  const listingId = routPath[3] ?? null;

  const [contractPayload, setContractPayload] = useState({
    web3: [],
    web2: [],
  });

  const [
    listedNFT,
    listedFilteredNFT,
    detailNFT,
    setListedNFT,
    setDetailNFT,
    setListedFilteredNFT,
  ] = useStoreListedNFT((state) => [
    state.listedNFT,
    state.listedFilteredNFT,
    state.detailNFT,
    state.setListedNFT,
    state.setDetailNFT,
    state.setListedFilteredNFT,
  ]);

  const onClickEdit = (ids) => {
    navigate(`/edit/${gameId}/${ids}`);
  };

  const onClickDelete = async (id) => {
    try {
      await cmsAPI.deleteListingProduct(id);
      setIsOpenModal({ visible: true, type: 'successDelete' });
      setTimeout(() => {
        getListedNFT();
      }, 1000);
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const onClickGoBack = () => {
    navigate(`/detail/${gameId}`);
  };

  const modalTypeDict = {
    productDetail: <ProductDetailModal />,
    metamaskError: (
      <FailCollectionRewarding
        title={'METAMASK ERROR'}
        desc={'Please try again or check your internet connection!'}
      />
    ),
    loading: (
      <LoadingModal
        title={'IT TAKES A TIME..'}
        desc={'Please dont close this tab and approve the transactions'}
      />
    ),
    successUpdate: (
      <SuccessCollectionRewarding
        title={'PRODUCT UPDATED!'}
        desc={' Product listing successfully updated!'}
      />
    ),
    successDelete: (
      <SuccessCollectionRewarding
        title={'PRODUCT DELETED!'}
        desc={' Product listing successfully deleted!'}
      />
    ),
    missmatched: (
      <FailCollectionRewarding
        title={'WRONG WALLET ADDRESS'}
        desc={
          'Please connect the wallet into registered wallet address in your account'
        }
      />
    ),
  };

  const getDetailGame = async () => {
    try {
      setLoading(true);
      const data = await cmsAPI.getDetailGame(gameId);
      setData(data);
    } catch (error) {
      message.error('error while getting data detail game');
    } finally {
      setLoading(false);
    }
  };

  const getListedNFT = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await cmsAPI.getListingProductByGame(`gameId=${gameId}`);
      setListedNFT(data);
    } catch (error) {
      message.error('Error while getting listed product');
    } finally {
      setLoading(false);
    }
  };

  const getDetailListing = async () => {
    try {
      const {
        data: { data },
      } = await cmsAPI.getListingProductById(listingId);
      setDetailNFT(data);
    } catch (error) {
      console.log(error);
      message.error('Error while getting detail listed product');
    }
  };

  const { config: erc721Config, refetch: refetch721 } = usePrepareContractWrite(
    {
      address: import.meta.env.VITE_LISTING_CONTRACT,
      abi: contractAbi,
      functionName: 'addERC721Listing',
      args: [
        contractPayload.web3[0] ?? '100', //price
        contractPayload.web3[1] ?? '0x4a1c82542ebdb854ece6ce5355b5c48eb299ecd8',
        contractPayload.web3[2] ?? '233', //token
      ],
    }
  );

  const { config: erc1155Config, refetch: refetch1155 } =
    usePrepareContractWrite({
      address: import.meta.env.VITE_LISTING_CONTRACT,
      abi: contractAbi,
      functionName: 'addERC1155Listing',
      args: [
        contractPayload.web3[0] ?? '100', //price
        contractPayload.web3[1] ?? '0x4a1c82542ebdb854ece6ce5355b5c48eb299ecd8',
        contractPayload.web3[2] ?? '233', //token
        '1',
      ],
    });

  const {
    write: addERC1155Listing,
    isSuccess: success1155,
    isError: error1155,
    isLoading: loading1155,
  } = useContractWrite(erc1155Config);

  const {
    write: addERC721Listing,
    isSuccess: success721,
    isError: error721,
    isLoading: loading721,
  } = useContractWrite(erc721Config);

  const handleUpdateNFT = async () => {
    try {
      if (contractPayload.web2.length === 0) return;
      if (contractPayload.web2.rawData.tokenType === 'ERC721') {
        refetch721?.();
        addERC721Listing?.();
      }

      if (contractPayload.web2.rawData.tokenType === 'ERC1155') {
        refetch1155?.();
        addERC1155Listing?.();
      }

      getDetailListing();
    } catch (error) {
      message.error('Error in web3');
    }
  };

  const updateListingProduct = async () => {
    try {
      await cmsAPI.updateListingProduct(
        contractPayload.web2,
        contractPayload.web2.id
      );
      setIsOpenModal({ visible: true, type: 'successUpdate' });
    } catch (error) {
      console.log(error, 'errir');
    }
  };

  useEffect(() => {
    if (success721 || success1155) {
      updateListingProduct();
    }
  }, [success721, success1155]);

  useEffect(() => {
    if (error721 || error1155) {
      setIsOpenModal({ visible: true, type: 'metamaskError' });
    }
  }, [error721, error1155]);

  useEffect(() => {
    if (loading721 || loading1155) {
      setIsOpenModal({ visible: true, type: 'loading' });
    }
  }, [loading721, loading1155]);

  useEffect(() => {
    if (listingId) {
      getDetailListing();
    }
  }, [listingId]);

  useEffect(() => {
    getDetailGame();
  }, [gameId]);

  useEffect(() => {
    if (address && errors !== 'WALLET MISSMATCHED') {
      getListedNFT();
    }
    if (errors === 'WALLET MISSMATCHED') {
      setIsOpenModal({ type: 'missmatched', visible: true });
    }
  }, [address, errors]);

  if (loading) {
    return (
      <div className="loading-wrapper">
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
      {address ? (
        <>
          <div className="header-filter">
            <div className={`logo-wrapper ${loc === 'edit' ? 'edit' : ''}`}>
              <img
                src={imageBaseUrl(data?.logo_url)}
                alt="logo"
                className="logo"
              />
            </div>
            <div className={`filter ${loc === 'edit' ? 'edit' : ''}`}>
              <input
                placeholder="SEARCH BY NFT NAME"
                type="text"
                className="input"
                onChange={(e) =>
                  setListedFilteredNFT(e.target.value, 'search', listedNFT)
                }
              />
              <div className={`button-wrapper ${loc === 'edit' ? 'edit' : ''}`}>
                <div className={`sort `}>
                  <button
                    className="button"
                    onClick={() => setShowSort(!showSort)}>
                    SORT BY
                  </button>
                  <div
                    className={`list ${showSort ? 'show' : ''}`}
                    onClick={(e) =>
                      setListedFilteredNFT(
                        e.target.innerText,
                        'sort',
                        listedNFT
                      )
                    }>
                    <div className="list-item">ALPHABET</div>
                    <div className="list-item">LAST UPDATED</div>
                    <div className="list-item">LAST UPLOADED</div>
                    <div className="list-item">PRICE</div>
                    <div className="list-item">RESET</div>
                  </div>
                </div>
                <Link className="button nft-add-button" to={'/add-nft'}>
                  ADD NFT
                </Link>
                <button
                  className={`button ${loc === 'edit' ? 'hidden' : ''}`}
                  onClick={() => navigate('/product')}>
                  GO BACK
                </button>
              </div>
            </div>
          </div>
          {loc === 'edit' ? (
            <div className="edit-wrapper">
              <div className="edit-section">
                <div className="edit-title">EDIT LISTING</div>
                <div className="card-image">
                  <img
                    src={checkImageUrl(detailNFT?.rawData?.image)}
                    alt="thumb"
                  />
                </div>
                <div className="text-desc">
                  <div>
                    DATE ADDED{' '}
                    {dayjs(detailNFT?.createdAt).format('DD/MM/YYYY')}
                  </div>
                  <div>
                    LAST EDITED{' '}
                    {dayjs(detailNFT?.updatedAt).format('DD/MM/YYYY')}
                  </div>
                </div>

                <div className="address-title">NFT ADDRESS</div>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="input"
                  value={detailNFT?.contractAddress}
                  disabled
                />
                <div className="address-title">PRICE</div>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="input"
                  defaultValue={detailNFT?.price}
                  onChange={(e) =>
                    setContractPayload({
                      web3: [
                        e.target.value,
                        detailNFT?.contractAddress,
                        detailNFT?.tokenId,
                      ],
                      web2: { ...detailNFT, price: e.target.value },
                    })
                  }
                />
                <button className="button update" onClick={handleUpdateNFT}>
                  UPDATE LISTING
                </button>
                <button className="button" onClick={() => onClickGoBack()}>
                  GO BACK
                </button>
              </div>
              <div className="body-wrapper product-section">
                {listedFilteredNFT?.map((collection, idx) => (
                  <div key={idx}>
                    <CardProduct
                      idx={idx}
                      onEdit={onClickEdit}
                      onDelete={onClickDelete}
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
              {listedFilteredNFT?.map((collection, idx) => (
                <div key={idx}>
                  <CardProduct
                    idx={idx}
                    onEdit={onClickEdit}
                    onDelete={onClickDelete}
                    onClickCard={() =>
                      setIsOpenModal({ visible: true, type: 'productDetail' })
                    }
                    data={collection}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="not-connected">
            <div className="img">
              <img src={failCollection} />
            </div>
            <div className="title">
              You are not connected to related wallet address. <br />
              Please click the Connect Wallet on navbar
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailShop;
