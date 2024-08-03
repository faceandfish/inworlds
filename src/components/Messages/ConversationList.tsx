import React from "react";
import { Conversation, UserInfo } from "@/app/lib/definitions";
import Image from "next/image";
import { BiBell } from "react-icons/bi";

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  currentUser: UserInfo;
  getOtherUser: (conversation: Conversation) => UserInfo;
  onClearUnread: (conversationId: number) => void;
  onViewSystemMessages: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  currentUser,
  getOtherUser,
  onClearUnread,
  onViewSystemMessages,
}) => {
  const handleConversationClick = (conversation: Conversation) => {
    onSelectConversation(conversation);
    if (conversation.unreadCount > 0) {
      onClearUnread(conversation.id);
    }
  };

  return (
    <div className="bg-white shadow w-60  text-gray-600">
      <h2 className="list-none text-2xl font-bold text-center py-5  border-b border-gray-100">
        消息中心
      </h2>

      <ul className="divide-y ">
        {/* 系统通知项 */}
        <li
          onClick={onViewSystemMessages}
          className="cursor-pointer py-3 flex items-start gap-3 px-5 hover:bg-gray-100 bg-gray-50"
        >
          <div className="relative flex-shrink-0">
            <div className="rounded-full overflow-hidden flex-shrink-0 w-10 h-10 bg-orange-500 flex items-center justify-center">
              <BiBell size={20} className="text-white" />
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm">系统通知</p>
            <p className="text-xs text-gray-500 truncate">
              您有新的系统消息，请查看
            </p>
          </div>
        </li>

        {/* 现有的会话列表 */}
        {conversations.map((conversation) => {
          const otherUser = getOtherUser(conversation);
          return (
            <li
              key={conversation.id}
              className="cursor-pointer py-3 flex items-start gap-3 px-5  hover:bg-gray-100 "
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="relative flex-shrink-0">
                <div className="rounded-full overflow-hidden  flex-shrink-0 w-10 h-10">
                  <Image
                    src={otherUser.avatarFile || "/avatar.png"}
                    alt={`${otherUser.name}'s avatar`}
                    style={{ objectFit: "cover" }}
                    width={40}
                    height={40}
                  />
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-sm">{otherUser.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {conversation.lastMessage.content}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationList;
