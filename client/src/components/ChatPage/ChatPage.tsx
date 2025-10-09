import { useParams } from "react-router-dom";

function ChatPage() {
  const { chatId } = useParams();

  // fetch chat details including participants & messages
  // if message.senderId === req.user.id mark as sender, else as receiver

  return <div>ChatPage {chatId}</div>;
}

export default ChatPage;
