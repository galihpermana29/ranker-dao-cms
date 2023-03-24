import passwordResetImage from '@/assets/img/password-reset.png';
import './index.scss';
const SuccessResetPassword = () => {
  return (
    <div className="reward-wrapper">
      <img src={passwordResetImage} alt="" className="reward-image" />
      <div className="text">
        <div className="title-reward">PASSWORD IS RESET</div>
        <div className="desc-reward">Password successfully reset!</div>
      </div>
    </div>
  );
};

export default SuccessResetPassword;
