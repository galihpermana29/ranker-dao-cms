import { CustomTable } from '@/components/table';
import './index.scss';
const AddProductListModal = () => {
  return (
    <div className="modal-add-list-wrapper">
      <div className="table">
        <CustomTable />
      </div>
    </div>
  );
};

export default AddProductListModal;
