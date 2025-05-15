import { useState } from 'react';
import { useCreateConversationMutation } from '../../slices/messagingApiSlice';
import { useGetUsersQuery } from '../../slices/usersApiSlice';

function CreateConversation({ onConversationCreated }) {
  const [createConversation] = useCreateConversationMutation();
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStartChat = async (userId) => {
    try {
      const result = await createConversation({ participants: [userId] }).unwrap();
      onConversationCreated(result);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <div className="create-conversation">
      
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3"
      />
      <div className="user-list">
        {filteredUsers?.map(user => (
          <div 
            key={user._id} 
            className="user-item d-flex align-items-center p-2"
            onClick={() => handleStartChat(user._id)}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-circle me-3"
              width="40"
              height="40"
            />
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateConversation;