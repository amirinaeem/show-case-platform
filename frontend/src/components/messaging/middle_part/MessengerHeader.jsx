import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPhoneAlt, FaVideo, FaEllipsisH, FaCircle } from 'react-icons/fa';

const MessengerHeader = ({ selectFriend, isFriendOnline }) => (
  <div className="message-header d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center">
      <Image
        src={selectFriend?.avatar || "/images/logo.jpg"}
        roundedCircle
        className={`message-header-avatar ${isFriendOnline ? 'online-avatar' : 'offline-avatar'}`}
        alt="Friend avatar"
      />
      {isFriendOnline && <div className="online-indicator"><span className="online-circle" /></div>}
      <div className="ms-3">
        <h5 className="mb-0">{selectFriend?.name || 'Unknown User'}</h5>
      </div>
    </div>
    <div className="header-icons d-flex align-items-center gap-2">
      <OverlayTrigger placement="top" overlay={<Tooltip>Call</Tooltip>}>
        <button className="icon-button"><FaPhoneAlt /></button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Video Call</Tooltip>}>
        <button className="icon-button"><FaVideo /></button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>More Options</Tooltip>}>
        <button className="icon-button"><FaEllipsisH /></button>
      </OverlayTrigger>
      <small className="text-muted">
        {isFriendOnline ? <FaCircle className="text-success me-1" size={8} /> : 'Offline'}
      </small>
    </div>
  </div>
);

export default MessengerHeader;
