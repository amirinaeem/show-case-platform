import { useState } from 'react';
import { useGetConversationsQuery } from '../../slices/messagingApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function GetConversations({ setSelectedConversation }) {
  const { data: conversations, isLoading, isError } = useGetConversationsQuery();
  const { userInfo } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <div className="loading">Loading conversations...</div>;
  if (isError) return <div className="error">Error loading conversations</div>;

  const filteredConversations = conversations?.filter(conversation => {
    const participant = conversation.participants.find(p => p.user._id !== userInfo._id);
    return participant?.user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="card mb-sm-3 mb-md-0 contacts_card">
      <div className="card-header">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredConversations?.length === 0 ? (
          <div className="no-conversations">
            {searchTerm ? 'No matching conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <ul className="contacts">
            {filteredConversations?.map(conversation => {
              const participant = conversation.participants.find(p => p.user._id !== userInfo._id);
              return (
                <li 
                  key={conversation._id} 
                  onClick={() => setSelectedConversation(conversation)}
                  className="conversation-item"
                >
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
                      <img
                        src={participant?.user.avatar || 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'}
                        className="rounded-circle user_img"
                        alt={participant?.user.name}
                      />
                      <span className={`online_icon ${participant?.user.status === 'online' ? '' : 'offline'}`} />
                    </div>
                    <div className="user_info">
                      <span>{participant?.user.name}</span>
                      <p>{conversation.latestMessage?.content || 'No messages yet'}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GetConversations;