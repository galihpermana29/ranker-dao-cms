import { Modal } from '@/components/modal';
import AddEditAdmin from '@/components/modal/add-edit-admin/add-admin';
import { CustomTable } from '@/components/table';
import { useState } from 'react';
import './index.scss';

const AllAdmin = () => {
  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });

  const modalTypeDict = {
    addAdmin: <AddEditAdmin />,
  };
  return (
    <div className="admin-wrapper">
      <Modal
        maxWidth={450}
        isOpen={isOpenModal.visible}
        onClose={() => setIsOpenModal({ visible: false, type: '' })}>
        {modalTypeDict?.[isOpenModal.type] || <></>}
      </Modal>
      <div className="active-wrapper">
        <div className="header">
          <div className="title">ACTIVE ADMIN</div>
          <div className="filter-active">
            <input type="text" name="search" id="search" className="input" />
            <button
              className="button"
              onClick={() =>
                setIsOpenModal({ type: 'addAdmin', visible: true })
              }>
              ADD NEW ADMIN
            </button>
          </div>
        </div>
        <div className="body">
          <CustomTable />
        </div>
      </div>
      <div className="active-wrapper">
        <div className="header">
          <div className="title">INACTIVE ADMIN</div>
          <div className="filter-active">
            <input type="text" name="search" id="search" className="input" />
            <button className="button">ADD NEW ADMIN</button>
          </div>
        </div>
        <div className="body">
          <CustomTable />
        </div>
      </div>
    </div>
  );
};

export default AllAdmin;
