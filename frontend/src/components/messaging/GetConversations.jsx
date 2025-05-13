import { useGetConversationsQuery } from '../../slices/messagingApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function GetConversations({ setSelectedConversation }) {
  const { data: conversations, isLoading, isError } = useGetConversationsQuery();

  if (isLoading) return <div className="loading">Loading conversations...</div>;
  if (isError) return <div className="error">Error loading conversations</div>;

  return (
    <div className="card mb-sm-3 mb-md-0 contacts_card">
      <div className="card-header">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search..."
            name=""
            className="form-control search"
          />
          <div className="input-group-prepend">
            <span className="input-group-text search_btn">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
        </div>
      </div>
      <div className="card-body contacts_body">
        <ul className="contacts">
          {conversations?.map(conversation => (
            <li 
              key={conversation._id} 
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img
                    src={conversation.participants[0]?.avatar || 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'}
                    className="rounded-circle user_img"
                    alt={conversation.participants[0]?.name}
                  />
                  <span className={`online_icon ${conversation.isOnline ? '' : 'offline'}`} />
                </div>
                <div className="user_info">
                  <span>{conversation.participants[0]?.name}</span>
                  <p>{conversation.latestMessage?.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GetConversations;