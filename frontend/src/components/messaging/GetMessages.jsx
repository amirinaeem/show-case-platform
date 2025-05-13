import { useGetMessagesQuery } from '../../slices/messagingApiSlice';
import { useSelector } from 'react-redux';

function GetMessages({ conversationId }) {
  const { data: messages, isLoading, isError } = useGetMessagesQuery(
    { conversationId },
    { skip: !conversationId }
  );

  // Get current user info from Redux state
  const { userInfo } = useSelector(state => state.auth);
  const currentUserId = userInfo?._id;
  const currentUserAvatar = userInfo?.avatar;

  if (isLoading) return <div className="loading">Loading messages...</div>;
  if (isError) return <div className="error">Error loading messages</div>;

  return (
    <div className="card-body msg_card_body">
      {messages?.map(message => (
        <div 
          key={message._id} 
          className={`d-flex justify-content-${message.sender === currentUserId ? 'end' : 'start'} mb-4`}
        >
          {message.sender !== currentUserId && (
            <div className="img_cont_msg">
              <img
                src={message.senderAvatar || 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'}
                className="rounded-circle user_img_msg"
                alt={message.senderName}
              />
            </div>
          )}
          <div className={`msg_cotainer${message.sender === currentUserId ? '_send' : ''}`}>
            {message.text}
            {message.attachments?.map(attachment => (
              <div key={attachment._id} className="attachment">
                <img src={attachment.url} alt={attachment.name} />
              </div>
            ))}
            <span className={`msg_time${message.sender === currentUserId ? '_send' : ''}`}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {message.sender === currentUserId && (
            <div className="img_cont_msg">
              <img
                src={currentUserAvatar || 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'}
                className="rounded-circle user_img_msg"
                alt="You"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GetMessages;