import cmsAPI from '@/api/cms';
import { Modal } from '@/components/modal';
import AddEditAdmin from '@/components/modal/add-edit-admin/add-admin';
import { AdminRewarding } from '@/components/modal/rewarding';
import { CustomTable } from '@/components/table';
import { useStoreAdminData } from '@/state';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import './index.scss';

const AllAdmin = () => {
  const [
    activeAdminData,
    inactiveAdminData,
    activeParams,
    inactiveParams,
    setActiveAdminData,
    setInactiveAdminData,
    setActiveParams,
    setInactiveParams,
  ] = useStoreAdminData((state) => [
    state.activeAdminData,
    state.inactiveAdminData,
    state.activeParams,
    state.inactiveParams,
    state.setActiveAdminData,
    state.setInactiveAdminData,
    state.setActiveParams,
    state.setInactiveParams,
  ]);

  const [isOpenModal, setIsOpenModal] = useState({ visible: false, type: '' });

  const getAllAdminsData = async () => {
    try {
      let activeParamsQ = new URLSearchParams(activeParams.query);
      const { data: activeAdmin } = await cmsAPI.getAllAdmins(activeParamsQ);
      setActiveAdminData(activeAdmin?.data);
      setActiveParams(
        {
          total: activeAdmin.metadata.total,
          totalPage: activeAdmin.metadata.totalPage,
        },
        'metadata'
      );

      let inactiveParamsQ = new URLSearchParams(inactiveParams.query);
      const { data: inactiveAdmin } = await cmsAPI.getAllAdmins(
        inactiveParamsQ
      );
      setInactiveAdminData(inactiveAdmin?.data);
      setInactiveParams(
        {
          total: inactiveAdmin.metadata.total,
          totalPage: inactiveAdmin.metadata.totalPage,
        },
        'metadata'
      );
    } catch (error) {
      console.log(error, 'error while getting admins');
    }
  };

  const handleEditAddNewAdmin = async (bodyAPI, id) => {
    try {
      if (id) {
        await cmsAPI.editAdminData(bodyAPI, id);
        setIsOpenModal({ type: 'successEdit', visible: true });
      } else {
        await cmsAPI.addAdminData(bodyAPI);
        setIsOpenModal({ type: 'successAdd', visible: true });
      }
      setTimeout(() => getAllAdminsData(), 2500);
    } catch (error) {
      console.log(error, 'Error while submitting admin data.');
    }
  };

  const handleEditAdminStatus = async (data, id) => {
    try {
      await cmsAPI.editAdminData(data, id);
      setIsOpenModal({ type: 'successEdit', visible: true });
      setTimeout(() => getAllAdminsData(), 2500);
    } catch (error) {
      console.log(error, 'error while changing the admin status');
    }
  };

  const onChange = (purpose, value, isActive) => {
    if (isActive) {
      setActiveParams(
        {
          active: isActive,
          limit: 10,
          [purpose]: value,
        },
        'query'
      );
    } else {
      setInactiveParams(
        {
          active: isActive,
          limit: 10,
          [purpose]: value,
        },
        'query'
      );
    }
  };

  const ActionComponents = (data) => {
    const { id, active, email, username, walletAddresses } = data;
    const payload = {
      email,
      username,
      walletAddresses,
      active: !active,
    };
    return (
      <Row>
        <Col span={9} style={{ marginRight: '8px' }}>
          <button
            className="button activate"
            onClick={() => handleEditAdminStatus(payload, id)}>
            {active ? 'DEACTIVATE' : 'ACTIVATE'}
          </button>
        </Col>
        <Col span={8}>
          <button
            onClick={() =>
              setIsOpenModal({
                type: 'addAdmin',
                visible: true,
                initialData: data,
              })
            }
            className="button">
            EDIT
          </button>
        </Col>
      </Row>
    );
  };

  const activeCol = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: ActionComponents,
    },
  ];

  const modalTypeDict = {
    addAdmin: (
      <AddEditAdmin
        initialData={isOpenModal.initialData}
        onClickSubmit={handleEditAddNewAdmin}
      />
    ),
    successEdit: (
      <AdminRewarding
        title="CHANGES SAVED"
        desc={'All changes are successfully applied'}
      />
    ),
    successAdd: (
      <AdminRewarding
        title="ADMIN ADDED"
        desc={'New admin successfully added'}
      />
    ),
  };

  useEffect(() => {
    getAllAdminsData();
  }, [activeParams.query]);
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
            <input
              type="text"
              name="search"
              id="search"
              className="input"
              placeholder="SEARCH NAME"
              onChange={(e) => onChange('username', e.target.value, true)}
            />
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
          <CustomTable
            columns={activeCol}
            data={activeAdminData}
            pagination={{
              defaultPageSize: 10,
              total: activeParams?.metadata.total,
              onChange: (page) => onChange('page', page, true),
            }}
          />
        </div>
      </div>
      <div className="active-wrapper">
        <div className="header">
          <div className="title">INACTIVE ADMIN</div>
          <div className="filter-active">
            <input
              type="text"
              name="search"
              id="search"
              className="input"
              placeholder="SEARCH NAME"
              onChange={(e) => onChange('username', e.target.value, false)}
            />
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
          <CustomTable
            columns={activeCol}
            data={inactiveAdminData}
            pagination={{
              defaultPageSize: 10,
              total: inactiveParams?.metadata.total,
              onChange: (page) => onChange('page', page, false),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AllAdmin;
