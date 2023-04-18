import './index.scss';
import passwordResetImage from '@/assets/img/password-reset.png';
import adminrewardingImage from '@/assets/img/admin-rewarding.png';
import successCollection from '@/assets/img/success-collection.png';
import failCollection from '@/assets/img/fail-collection.png';

export const SuccessResetPassword = () => {
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

export const AdminRewarding = ({ title, desc }) => {
  return (
    <div className="reward-wrapper">
      <img src={adminrewardingImage} alt="" className="reward-image" />
      <div className="text">
        <div className="title-reward">{title}</div>
        <div className="desc-reward">{desc}</div>
      </div>
    </div>
  );
};

export const SuccessCollectionRewarding = ({ title, desc }) => {
  return (
    <div className="reward-wrapper">
      <img src={successCollection} alt="" className="reward-image" />
      <div className="text">
        <div className="title-reward">{title}</div>
        <div className="desc-reward">{desc}</div>
      </div>
    </div>
  );
};

export const FailCollectionRewarding = ({ title, desc }) => {
  return (
    <div className="reward-wrapper">
      <img src={failCollection} alt="" className="reward-image" />
      <div className="text">
        <div className="title-reward">{title}</div>
        <div className="desc-reward">{desc}</div>
      </div>
    </div>
  );
};
