'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ChatbotPlaceholder } from '@/components/chatbot/chatbot-placeholder';

export default function AdminChatbotPage() {
  return (
    <DashboardLayout>
      <div className="-m-8 -mb-16 h-screen">
        <ChatbotPlaceholder />
      </div>
    </DashboardLayout>
  );
}
