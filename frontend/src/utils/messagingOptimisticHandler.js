// features/messaging/messagingOptimisticHandler.js
import { toast } from 'react-toastify';

const messagingOptimisticHandler = {
  createHandler: (apiSlice) => ({
    execute: (actionName, preparerName) =>
      async (arg, { dispatch, getState, queryFulfilled }) => {
        try {
          const { actions, preparers } = messagingOptimisticHandler;

          if (!actions[actionName]) throw new Error(`Action "${actionName}" not found`);
          if (!preparers[preparerName]) throw new Error(`Preparer "${preparerName}" not found`);

          const currentUser = getState().auth?.userInfo;
          if (!currentUser?._id) throw new Error('User not authenticated');

          const optimisticData = preparers[preparerName](arg, currentUser, { getState });

          // Handle different query types
          if (actionName === 'sendMessage') {
            const patchResult = dispatch(
              apiSlice.util.updateQueryData(
                'getMessages', 
                { conversationId: arg.conversationId }, 
                (draft) => {
                  if (!draft) return;
                  actions[actionName](draft, optimisticData);
                }
              )
            );

            try {
              await queryFulfilled;
            } catch (error) {
              patchResult.undo();
              toast.error(error.message || 'Failed to send message');
              throw error;
            }
          } else if (actionName === 'createConversation') {
            const patchResult = dispatch(
              apiSlice.util.updateQueryData(
                'getConversations',
                undefined,
                (draft) => {
                  if (!draft) return;
                  actions[actionName](draft, optimisticData);
                }
              )
            );

            try {
              const { data: confirmed } = await queryFulfilled;
              // Replace optimistic conversation with real one
              dispatch(
                apiSlice.util.updateQueryData(
                  'getConversations',
                  undefined,
                  (draft) => {
                    if (!draft) return;
                    const index = draft.findIndex(c => c._id === optimisticData.optimisticId);
                    if (index !== -1) draft[index] = confirmed;
                  }
                )
              );
            } catch (error) {
              patchResult.undo();
              toast.error(error.message || 'Failed to create conversation');
              throw error;
            }
          }
        } catch (error) {
          toast.error(error.message || 'Unexpected error occurred');
          throw error;
        }
      },
  }),

  actions: {
    sendMessage(draft, { message, currentUser, optimisticId }) {
      if (!Array.isArray(draft.messages)) draft.messages = [];
      draft.messages.push({
        _id: optimisticId,
        conversationId: message.conversationId,
        sender: currentUser._id,
        text: message.text,
        attachments: message.attachments || [],
        isOptimistic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'sent'
      });
    },

    createConversation(draft, { participants, currentUser, optimisticId }) {
      if (!Array.isArray(draft)) draft = [];
      draft.unshift({
        _id: optimisticId,
        participants: participants.filter(id => id !== currentUser._id),
        latestMessage: {
          text: 'Conversation started',
          sender: currentUser._id,
          createdAt: new Date().toISOString()
        },
        isOptimistic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCount: 0
      });
    },

    uploadAttachment(draft, { file, currentUser, optimisticId }) {
      // This would typically be handled in the component state rather than Redux
      // as file upload progress is better managed locally
      return {
        _id: optimisticId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadProgress: 0,
        isOptimistic: true,
        uploadedBy: currentUser._id,
        createdAt: new Date().toISOString()
      };
    }
  },

  preparers: {
    sendMessage(arg, currentUser) {
      return {
        message: {
          conversationId: arg.conversationId,
          text: arg.text,
          attachments: arg.attachments || []
        },
        currentUser,
        optimisticId: `msg-${Date.now()}`
      };
    },

    createConversation(arg, currentUser) {
      return {
        participants: arg.participants || [],
        currentUser,
        optimisticId: `conv-${Date.now()}`
      };
    },

    uploadAttachment(arg, currentUser) {
      return {
        file: arg,
        currentUser,
        optimisticId: `att-${Date.now()}`
      };
    }
  }
};

export default messagingOptimisticHandler;