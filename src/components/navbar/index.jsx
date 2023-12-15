import './index.scss';
import { useEffect, useState } from 'react';

import { message } from 'antd';
import { ethers } from 'ethers';
import { Link, useLocation } from 'react-router-dom';
import { useContractWrite, usePrepareContractWrite, useSigner } from 'wagmi';

import cmsAPI from '@/api/cms';
import logo from '@/assets/img/logo-hori.png';
import { useWalletContext } from '@/context/WalletContext';
import contractAbi from '@/utils/contract-listing.json';

import { Modal } from '../modal';
import { AdminRewarding } from '../modal/rewarding';
import WithdrawModal from '../modal/withdraw';

const Navbar = () => {
  const { onConnect, connectors, disconnect, address } = useWalletContext();

  const loc = useLocation().pathname.split('/')[1];
  const role = JSON.parse(localStorage.getItem('role'));
  const { data: walletSigner } = useSigner();

  const [isOpenModal, setIsOpenModal] = useState({
    visible: false,
    type: '',
    data: { current: 0, withdraw: 0 },
  });

  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_LISTING_CONTRACT,
    abi: contractAbi,
    functionName: 'withdrawIncome',
    args: [isOpenModal.data.withdraw],
    enabled: true,
  });

  const { write: withdrawIncome, isSuccess } = useContractWrite(config);

  const getIncome = async () => {
    const contract = new ethers.Contract(
      import.meta.env.VITE_LISTING_CONTRACT,
      contractAbi,
      walletSigner
    );
    const income = (await contract.getIncome()).toString();
    return income;
  };

  const handleOpenWithdraw = async () => {
    try {
      const data = await getIncome();
      setIsOpenModal({
        visible: true,
        type: 'withdrawModal',
        data: { current: data, withdraw: 0 },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitWithdraw = async (value) => {
    const { withdraw } = value;
    setIsOpenModal({
      visible: false,
      type: '',
      data: { current: 0, withdraw },
    });
  };

  const handleLogout = async () => {
    try {
      await cmsAPI.logout();
      disconnect();
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error('Error logout cookies');
    }
  };

  const modalTypeDict = {
    withdrawModal: (
      <WithdrawModal
        data={isOpenModal.data}
        handleSubmitWithdraw={handleSubmitWithdraw}
      />
    ),
    success: (
      <AdminRewarding
        title={'WITHDRAW SUCCESS'}
        desc={'Successfully Withdraw'}
      />
    ),
  };

  useEffect(() => {
    if (isSuccess) {
      setIsOpenModal({
        visible: true,
        type: 'success',
        data: { current: 0, withdraw: 0 },
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isOpenModal.data.withdraw > 0) {
      withdrawIncome?.();
    }
  }, [isOpenModal.data.withdraw]);

  return (
    <div className="navbar-wrapper">
      <Modal
        maxWidth={450}
        isOpen={isOpenModal.visible}
        onClose={() =>
          setIsOpenModal({
            visible: false,
            type: '',
            data: { current: 0, withdraw: 0 },
          })
        }>
        {modalTypeDict?.[isOpenModal.type] || <></>}
      </Modal>
      <div className="left">
        <img src={logo} alt="logo" className="logo" />
        {loc !== 'login' && (
          <div className="link-wrapper">
            <Link
              to="/collection"
              className={`link ${loc === 'collection' ? 'active' : ''}`}>
              COLLECTION
            </Link>
            <Link
              to={'/product'}
              className={`link ${loc === 'product' ? 'active' : ''}`}>
              PRODUCT
            </Link>
            <div onClick={handleOpenWithdraw} className={`link `}>
              WITHDRAW
            </div>
            {role === 'superAdmin' && (
              <Link
                to={'/admin'}
                className={`link ${loc === 'admin' ? 'active' : ''}`}>
                ADMIN
              </Link>
            )}
          </div>
        )}
      </div>

      {loc !== 'login' && (
        <div className="right">
          <div className="address">
            {address && address.substring(0, 20) + '...'}
          </div>
          <div>
            {connectors.map((connector, idx) => (
              <div
                key={idx}
                onClick={() => onConnect({ connector })}
                className="link connect">
                {address ? 'CONNECTED' : 'CONNECT WALLET'}
              </div>
            ))}
          </div>
          <div className="link connect" onClick={handleLogout}>
            LOGOUT
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
