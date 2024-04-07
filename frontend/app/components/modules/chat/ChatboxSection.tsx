import { Badge } from "~/components/ui/badge";
import { ChatBubble } from "./ChatBubble";
import { InputForm } from "./InputForm";


export const chatMessages: Record<string, any[]> = {
  "1": [
    {
      id: 1,
      message: "Hello, how can I help you today?",
      user: "bot",
      timestamp: "2021-10-01T12:00:00Z",
    },
    {
      id: 2,
      message: "I want to know more about your products",
      user: "user",
      timestamp: "2021-10-01T12:01:00Z",
    },
  ],
  "2": [
    {
      id: 1,
      message: "Hello, how can I help you today?",
      user: "bot",
      timestamp: "2021-10-01T12:00:00Z",
    },
    {
      id: 2,
      message: "I need help with my order status",
      user: "user",
      timestamp: "2021-10-01T12:01:00Z",
    },
  ],
};


export function ChatboxSection({ id }: { id: string; }) {
  return (<div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
    <Badge variant="outline" className="absolute right-3 top-3">
      Output
    </Badge>
    <div className="flex-1" />
    {// Chat messages will be displayed here
      chatMessages[id]?.map(message => <ChatBubble key={message.id} message={message} />)}
    <div className="mt-4" />
    <InputForm />
  </div>);
}
