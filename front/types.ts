type GroupChatType = {
  id: string;
  user_id: number;
  title: string;
  passcode: string;
  createdAt: string;
};

type GroupChatUserType = {
  id: number;
  name: string;
  groupId: string;
  createdAt: string;
  isOnline?: boolean;
};

type MessageType = {
  id: string;
  message: string;
  groupId: string;
  name: string;
  createdAt: string;
};
