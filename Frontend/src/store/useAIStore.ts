// Frontend/src/store/useAIStore.ts
import { create } from 'zustand';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AIStore {
  isChatOpen: boolean;
  messages: Message[];
  toggleChat: () => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
  isChatOpen: false,
  messages: [
    {
      role: 'ai',
      content: 'Neural Brain online. Task matrix synced. How can I optimize your workflow?',
    },
  ],

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () =>
    set({
      messages: [
        {
          role: 'ai',
          content: 'Neural Brain online. Task matrix synced. How can I optimize your workflow?',
        },
      ],
    }),
}));