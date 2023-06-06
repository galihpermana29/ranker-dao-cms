import { useEffect, useState } from 'react';
import { Form, Popconfirm } from 'antd';

import { useWalletContext } from '@/context/WalletContext';

import { getNftWithSpecificAddress } from '@/api/alchemy';
import cmsAPI from '@/api/cms';

import { Modal } from '@/components/modal';
import AddProductListModal from '@/components/modal/add-product-list';
import CardProduct from '@/components/card';
import LoadingProcessComponent from '@/components/loading';
import {
  FailCollectionRewarding,
  SuccessCollectionRewarding,
} from '@/components/modal/rewarding';

import { useStoreGamesData, useStoreNFTCollection } from '@/state';
import {
  checkContractAddressName,
  gettingTheContractMetaData,
} from '@/utils/collectionsUtils';
import { convertArrayToObject, params } from '@/utils';

import './index.scss';

import failCollection from '../../assets/img/fail-collection.png';

const AddProduct = () => {
  const { address, errors } = useWalletContext();

  const [form] = Form.useForm();

  const [showSort, setShowSort] = useState(false);

  const [nftCollections, activeCollections, setNftCollections, setActive] =
    useStoreNFTCollection((state) => [
      state.nftCollections,
      state.activeCollections,
      state.setNftCollections,
      state.setActive,
    ]);
  const [
    // gamesData,
    gamesOptionsForLabel,
    setGamesData,
    setGamesOptionsForLabel,
  ] = useStoreGamesData((state) => [
    // state.gamesData,
    state.gamesOptionsForLabel,
    state.setGamesData,
    state.setGamesOptionsForLabel,
  ]);
  let [cart, setCart] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');

  const hittingAPICollection = async (payload) => {
    try {
      await cmsAPI.createCollection(payload);
    } catch (error) {
      setIsOpenModal({ type: 'failCollection', visible: true });
    }
  };

  const handleCreatingNewCollection = async (
    payloadForGettingTheContractName,
    game
  ) => {
    try {
      const responsesFromAlchemy = await gettingTheContractMetaData(
        payloadForGettingTheContractName
      );
      const payload = responsesFromAlchemy.map((d) => ({
        name: checkContractAddressName(d.name),
        address: d.address,
        gameId: game,
      }));
      await hittingAPICollection(payload);
    } catch (error) {
      console.log(error, 'err');
    }
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (record) => {
    try {
      let row = await form.validateFields();
      const key = record.id;
      const newData = [...cart];
      const index = newData.findIndex((item) => key === item.id);

      if (index > -1) {
        let item = newData[index];
        if (editingKey === record.id && item.gameName === null) {
          await handleCreatingNewCollection([item.address], row.gameName);
        }
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
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <button
              className="button"
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}>
              Save
            </button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <button className="button" style={{ marginTop: '1rem' }}>
                Cancel
              </button>
            </Popconfirm>
          </span>
        ) : (
          <button
            className="button"
            disabled={editingKey !== ''}
            onClick={() => edit(record)}>
            Edit
          </button>
        );
      },
    },
  ];

  const gettingGameByContractAddress = async (cartData) => {
    try {
      const newObj = convertArrayToObject(cart, 'id');
      const paramsForApi = params(newObj);
      const {
        data: { data },
      } = await cmsAPI.getCollection(paramsForApi);
      let newCart = [...cartData];
      newCart.forEach((c) => {
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
      console.log('Cannot next when you are not select an item');
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

  const modalTypeDict = {
    addProductModal: (
      <AddProductListModal
        columns={columns}
        data={cart}
        form={form}
        isEditing={isEditing}
        cancel={cancel}
        gameLabel={gamesOptionsForLabel}
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
    missmatched: (
      <FailCollectionRewarding
        title={'WRONG WALLET ADDRESS'}
        desc={
          'Please connect the wallet into registered wallet address in your account'
        }
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

  useEffect(() => {
    const getNFT = async () => {
      setLoading(true);
      try {
        const nfts = await getNftWithSpecificAddress(address);
        console.log(nfts, 'nfts');
        mappingNFTPerCollection(nfts.ownedNfts);
        setLoading(false);
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
    <LoadingProcessComponent loading={loading}>
      {address ? (
        <div className="add-wrapper">
          <Modal
            maxWidth={1200}
            isOpen={isOpenModal.visible}
            onClose={() => setIsOpenModal({ visible: false, type: '' })}>
            {modalTypeDict?.[isOpenModal.type] || <></>}
          </Modal>
          <div className={`filter`}>
            <div className="input-wrapper">
              <input type="text" className="input" />
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
                  onClick={(e) => console.dir(e.target.innerText, 'd')}>
                  <div className="list-item">ALPHABET</div>
                  <div className="list-item">LAST UPDATED</div>
                  <div className="list-item">LATEST UPLOADED</div>
                  <div className="list-item">LATEST UPLOADED</div>
                  <div className="list-item">PRICE</div>
                </div>
              </div>
              <button className="button">ADD NFT</button>
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
                      id={idx}
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
