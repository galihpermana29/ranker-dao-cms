import { useEffect, useState } from 'react';

import { Col, Form, Popconfirm, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from 'wagmi';
import './index.scss';

import { getNftWithSpecificAddress } from '@/api/alchemy';
import cmsAPI from '@/api/cms';
import CardProduct from '@/components/card';
import LoadingProcessComponent from '@/components/loading';
import { Modal } from '@/components/modal';
import AddProductListModal from '@/components/modal/add-product-list';
import {
  FailCollectionRewarding,
  LoadingModal,
  SuccessCollectionRewarding,
} from '@/components/modal/rewarding';
import { useWalletContext } from '@/context/WalletContext';
import { useCreateCollection } from '@/hooks/useCreateCollection';
import { useStoreGamesData, useStoreNFTCollection } from '@/state';
import { getUniqueAddress, params, prepareBatchListing } from '@/utils';
import approveAbi from '@/utils/contract-abi-approval.json';
import contractAbi from '@/utils/contract-listing.json';

import failCollection from '../../assets/img/fail-collection.png';

const AddProduct = () => {
  const { address, errors } = useWalletContext();

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [showSort, setShowSort] = useState(false);
  const [contractPayload, setContractPayload] = useState({
    web3: [], // this is for 721erc
    web2: [],
  });
  const [
    nftCollections,
    activeCollections,
    setNftCollections,
    setActive,
    setNftFilter,
  ] = useStoreNFTCollection((state) => [
    state.nftCollections,
    state.activeCollections,
    state.setNftCollections,
    state.setActive,
    state.setNftFilter,
  ]);
  const [gamesOptionsForLabel, setGamesData, setGamesOptionsForLabel] =
    useStoreGamesData((state) => [
      state.gamesOptionsForLabel,
      state.setGamesData,
      state.setGamesOptionsForLabel,
    ]);

  let [cart, setCart] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [contractNftToApprove, setContractNftToApprove] = useState(null);

  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_LISTING_CONTRACT,
    abi: contractAbi,
    functionName: 'batchERC721Listing',
    args: [
      contractPayload.web3[0] ?? '0x4a1c82542ebdb854ece6ce5355b5c48eb299ecd8',
      contractPayload.web3[1] ?? [],
    ],
    enabled: true,
  });

  /**
   * Contract write for adding ERC721
   */

  const {
    write: addingListing,
    isSuccess,
    isError,
    isLoading,
  } = useContractWrite(config);

  const { refetch: checkIsApproved } = useContractRead({
    address: contractNftToApprove,
    // ? contractNftToApprove
    // : '0xbb234d9a79db8bcb880b7a52a243be2087b70812',
    abi: approveAbi,
    functionName: 'isApprovedForAll',
    args: [address, import.meta.env.VITE_LISTING_CONTRACT],
  });

  const hittingAPICollection = async (payload) => {
    try {
      await cmsAPI.createCollection(payload);
    } catch (error) {
      setIsOpenModal({ type: 'failCollection', visible: true });
    }
  };

  const { handleCreateCollections } = useCreateCollection(
    message.error,
    hittingAPICollection
  );

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    record.dataUploaded = dayjs(record.dataUploaded);
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (record) => {
    try {
      let row = await form.validateFields();
      const key = record.key;
      let isNew = false;

      const newData = [...cart];
      const index = newData.findIndex((item) => key === item.key);
      row.dataUploaded = dayjs(row.dataUploaded).format('DD-MM-YYYY');

      if (index > -1) {
        let item = newData[index];
        let gameId = row.gameName;

        // if the contract address doesnt related to any of the collection in db
        if (editingKey === record.key && item.gameName === null) {
          // convert id to the name
          row.gameName = gamesOptionsForLabel.filter(
            (d) => d.value === row.gameName
          )[0].label;
          isNew = true;
        }

        setContractNftToApprove(item.address);

        const { data: isSetApproveAll } = await checkIsApproved();
        if (!isSetApproveAll || isNew) {
          await handleCreateCollections(
            {
              fields: [{ name: item.address }],
              game: gameId,
            },
            isNew
          );

          if (isNew) handleNextAction();
        }

        // convert back the gameName to the id
        row.gameId = gamesOptionsForLabel.filter(
          (d) => d.label === row.gameName
        )[0].value;

        newData.splice(index, 1, { ...item, ...row });
        setCart(newData);

        setEditingKey('');
        setTimeout(async () => {
          await gettingGameByContractAddress(newData);
        }, 1000);
      } else {
        newData.push(row);
        setCart(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteRecord = async (record) => {
    const deleteCart = cart.filter((c) => c.idx !== record.idx);
    setCart(deleteCart);
  };

  const columns = [
    {
      title: 'No',
      editable: false,
      render: (_a, _s, index) => index + 1,
    },
    {
      title: 'COLLECTION ID',
      dataIndex: 'address',
      editable: false,
    },
    {
      title: 'GAME',
      editable: true,
      dataIndex: 'gameName',
    },
    {
      title: 'DATA UPLOUDED',
      editable: true,
      dataIndex: 'dataUploaded',
    },
    {
      title: 'PRICE',
      editable: true,
      dataIndex: 'price',
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Row gutter={[12, 12]}>
            <Col>
              {editable ? (
                <Row>
                  <Col>
                    <button
                      className="button"
                      onClick={() => save(record)}
                      style={{
                        marginRight: 8,
                      }}>
                      Save
                    </button>
                  </Col>
                  <Col>
                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                      <button className="button" style={{ marginTop: '1rem' }}>
                        Cancel
                      </button>
                    </Popconfirm>
                  </Col>
                </Row>
              ) : (
                <button
                  className="button"
                  disabled={editingKey !== ''}
                  onClick={() => edit(record)}>
                  Edit
                </button>
              )}
            </Col>

            {!editable && (
              <Col>
                <button
                  className="button"
                  onClick={() => deleteRecord(record)}
                  style={{
                    marginRight: 8,
                  }}>
                  Delete
                </button>
              </Col>
            )}
          </Row>
        );
      },
    },
  ];

  const gettingGameByContractAddress = async (cartData) => {
    try {
      const uniqueAddress = getUniqueAddress(cartData);
      const paramsForApi = params(uniqueAddress);
      const {
        data: { data },
      } = await cmsAPI.getCollection(paramsForApi);
      let newCart = [...cartData];
      newCart.forEach((c, idx) => {
        c.key = idx;
        data.forEach((d) => {
          if (c.address === d.address) {
            c.gameName = d.Game.title;
          } else {
            if (c.gameName) return;
            c.gameName = null;
          }
        });
      });
      setCart(newCart);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleNextAction = async () => {
    if (cart.length === 0) {
      message.info('Cannot next when you are not select an item');
    } else {
      await gettingGameByContractAddress(cart);
      setIsOpenModal({
        visible: true,
        type: 'addProductModal',
      });
    }
  };

  const mappingNFTPerCollection = (data) => {
    let collectionAdd = [];
    let newCollection = [];

    data = data.filter((d) => d.tokenType === 'ERC721');

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

  const handleSubmitForm = async () => {
    const isPriceValid = cart.every(
      (item) => item.price !== '' && !isNaN(item.price)
    );

    if (isPriceValid) {
      const {
        payloadWeb3: { erc721 },
        payloadWeb2,
      } = prepareBatchListing(cart, address);

      erc721.forEach((data, idx) => {
        setTimeout(() => {
          setContractPayload((contractPayload) => ({
            ...contractPayload,
            web3: [data.address, [...data.data]],
          }));
        }, 1000 * idx + 1);
      });
      console.log('PPPPP');
      setContractPayload((contractPayload) => ({
        ...contractPayload,
        web2: payloadWeb2,
      }));
    } else {
      message.info('Make sure all of the items has been filled out');
    }
  };

  const interactListing = () => {
    try {
      addingListing();
    } catch (error) {
      if (error.message === 'addingListing is not a function') {
        message.error(
          'This wallet address is not admin, please contact super admin!'
        );
      } else {
        message.error('Error blockchain network is busy, try again!');
      }
    }
  };

  const createListingProduct = async () => {
    try {
      await cmsAPI.createListingProduct(contractPayload.web2);
      setIsOpenModal({ visible: true, type: 'successCollection' });
    } catch (error) {
      setIsOpenModal({ visible: true, type: 'duplicateNft' });
    }
  };

  useEffect(() => {
    console.log(contractPayload, 'payload??', isSuccess);

    if (contractPayload.web3.length > 0 && contractPayload.web2.length > 0) {
      if (isSuccess) {
        createListingProduct();
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setIsOpenModal({ visible: true, type: 'metamaskError' });
    }
  }, [isError]);

  useEffect(() => {
    if (isLoading) {
      setIsOpenModal({ visible: true, type: 'loading' });
    }
  }, [isLoading]);

  useEffect(() => {
    if (contractPayload.web3.length > 0) {
      interactListing();
    }
  }, [contractPayload.web3]);

  useEffect(() => {
    const getAllGamesData = async () => {
      try {
        const data = await cmsAPI.getAllGames();
        setGamesData(data);
        setGamesOptionsForLabel(data);
      } catch (error) {
        console.log(error, 'error while getting data games');
      }
    };
    getAllGamesData();
  }, []);

  useEffect(() => {
    const getNFT = async () => {
      setLoading(true);
      try {
        const nfts = await getNftWithSpecificAddress(address);
        mappingNFTPerCollection(nfts.ownedNfts);
        setLoading(false);
      } catch (error) {
        console.log(error, 'error when getting nft from the wallet account');
      }
    };
    if (address && errors !== 'WALLET MISSMATCHED') {
      getNFT();
    }
    if (errors === 'WALLET MISSMATCHED') {
      setIsOpenModal({ type: 'missmatched', visible: true });
    }
  }, [address, errors]);

  const modalTypeDict = {
    addProductModal: (
      <AddProductListModal
        columns={columns}
        data={cart}
        form={form}
        isEditing={isEditing}
        cancel={cancel}
        gameLabel={gamesOptionsForLabel}
        handleSubmit={handleSubmitForm}
      />
    ),
    successCollection: (
      <SuccessCollectionRewarding
        title={'PRODUCT ADDED!'}
        desc={'New product listing successfully added!'}
      />
    ),
    failCollection: (
      <FailCollectionRewarding
        title={'UPDATE FAILED'}
        desc={'Please try again or check your internet connection!'}
      />
    ),
    duplicateNft: (
      <FailCollectionRewarding
        title={'UPDATE FAILED'}
        desc={'This NFT is already in the listing! Error duplicate'}
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
  };

  return (
    <LoadingProcessComponent loading={loading}>
      {address ? (
        <div className="add-wrapper">
          <Modal
            maxWidth={
              ['addProductModal'].includes(isOpenModal.type) ? 1200 : 500
            }
            isOpen={isOpenModal.visible}
            onClose={() => setIsOpenModal({ visible: false, type: '' })}>
            {modalTypeDict?.[isOpenModal.type] || <></>}
          </Modal>
          <div className={`filter`}>
            <div className="input-wrapper">
              <input
                placeholder="SEARCH BY NFT NAME"
                type="text"
                className="input"
                onChange={(e) =>
                  setNftFilter(e.target.value, 'search', activeCollections)
                }
              />
            </div>
            <div className={`button-wrapper `}>
              <div className={`sort`}>
                <button
                  className="button"
                  onClick={() => setShowSort(!showSort)}>
                  SORT BY
                </button>
                <div
                  className={`list ${showSort ? 'show' : ''}`}
                  onClick={(e) =>
                    setNftFilter(e.target.innerText, 'sort', activeCollections)
                  }>
                  <div className="list-item">ALPHABET</div>
                  <div className="list-item">LAST UPDATED</div>
                  <div className="list-item">RESET</div>
                </div>
              </div>
              <button className="button" onClick={() => navigate(-1)}>
                GO BACK
              </button>
            </div>
          </div>
          <div className="content">
            <div className="category">
              <div
                className={`cat-list ${
                  activeCollections?.index === 'ALL' ? 'active' : ''
                }`}
                onClick={() => setActive('ALL')}>
                ALL
              </div>
              {nftCollections?.map((_, idx) => {
                return (
                  <div
                    className={`cat-list ${
                      activeCollections?.index === idx ? 'active' : ''
                    }`}
                    key={idx}
                    onClick={() => setActive(idx)}>
                    COLLECTION {idx + 1}
                  </div>
                );
              })}
            </div>

            <div className="content-card">
              <div className="body-wrapper product-section">
                {activeCollections?.data?.map((data, idx) => (
                  <div key={idx}>
                    <CardProduct
                      idx={idx}
                      purpose="add"
                      onClickCard={setCart}
                      cart={cart}
                      data={data}
                    />
                  </div>
                ))}
              </div>
              <div className="button-next-wrapper">
                <button className="button" onClick={handleNextAction}>
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Modal
            maxWidth={360}
            isOpen={isOpenModal.visible}
            onClose={() => setIsOpenModal({ visible: false, type: '' })}>
            {modalTypeDict?.[isOpenModal.type] || <></>}
          </Modal>
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
    </LoadingProcessComponent>
  );
};

export default AddProduct;
