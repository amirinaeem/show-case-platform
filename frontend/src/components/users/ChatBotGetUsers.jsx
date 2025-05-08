import { useGetUsersQuery } from "../../slices/usersApiSlice";
import ChatBotScreen from "./ChatBotScreen";

const ChatBotGetUsers = () => {
  const { data: users = [] } = useGetUsersQuery();
  
  // Just pass the users data without any additional logic
  return <ChatBotScreen users={users} />;
};

export default ChatBotGetUsers;