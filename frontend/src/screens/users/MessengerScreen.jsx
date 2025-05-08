import {
  FiX,
  FiSend,
  FiUser,
  FiVideo,
  FiPhone,
  FiMic,
  FiSmile,
  FiImage,
  FiCamera,
} from 'react-icons/fi';

const MessengerScreen = ({ onClose }) => {
  return (
    <div className="fixed bottom-24 right-6 w-80 h-[420px] bg-white border rounded-lg shadow-xl flex flex-col z-[999]">
      
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b bg-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <FiUser size={18} />
          <span className="text-sm font-medium">Person</span>
          <button className="hover:bg-gray-100 p-1 rounded">
            <FiMic size={16} />
          </button>
          <button className="hover:bg-gray-100 p-1 rounded">
            <FiPhone size={16} />
          </button>
          <button className="hover:bg-gray-100 p-1 rounded">
            <FiVideo size={16} />
          </button>
          <button
            className="hover:bg-gray-100 p-1 rounded"
            onClick={onClose}
          >
            <FiX size={16} />
          </button>
        </div>
      
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-3 space-y-3 text-sm">
        {/* Message bubbles */}
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <FiUser size={12} />
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow text-gray-800">
            Hello there! 👋
          </div>
        </div>

        <div className="flex items-start justify-end space-x-2">
          <div className="bg-blue-100 text-gray-800 px-4 py-2 rounded-lg shadow max-w-[75%]">
            This is a message from me.
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <FiUser size={12} />
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow text-gray-400 italic">
            ...
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-24 right-6 w-80 h-[420px] bg-white border rounded-lg shadow-xl flex flex-col z-[999]">
        <div className="flex items-center justify-between p-2 border-b bg-white rounded-t-lg">
        <button className="text-gray-500 hover:text-gray-700">
            <FiSmile size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <FiImage size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <FiCamera size={18} />
          </button>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 text-sm border rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessengerScreen;
