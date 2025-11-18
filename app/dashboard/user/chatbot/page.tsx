'use client';

import { UserSidebar } from '@/components/layout/user-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { ChatbotPlaceholder } from '@/components/chatbot/chatbot-placeholder';

export default function UserChatbotPage() {
  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName="María García" userRole="Cliente" />
        <div className="flex-1 overflow-hidden p-6 scrollbar-hide">
          <ChatbotPlaceholder />
        </div>
      </div>
    </div>
  );
}
