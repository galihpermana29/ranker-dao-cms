import { Spin } from 'antd';
import './style.scss';

const LoadingProcessComponent = ({ children, loading }) => {
  return loading ? (
    <div className="wrapper">
      <Spin />
    </div>
  ) : (
    children
  );
};

export default LoadingProcessComponent;
