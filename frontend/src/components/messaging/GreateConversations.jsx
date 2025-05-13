import { useState } from 'react';
import { useCreateConversationMutation } from '../../slices/messagingApiSlice';

function CreateConversation({ onConversationCreated }) {
  const [createConversation] = useCreateConversationMutation();
  const [participantId, setParticipantId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!participantId.trim()) return;

    try {
      const result = await createConversation({ participants: [participantId] }).unwrap();
      onConversationCreated(result);
      setParticipantId('');
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  return (
    <div className="create-conversation">
      <h3>Start New Conversation</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter user ID"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
        />
        <button type="submit">Start Chat</button>
      </form>
    </div>
  );
}

export default CreateConversation;