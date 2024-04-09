import { Badge } from "~/components/ui/badge";
import { ChatBubble } from "./ChatBubble";
import { InputForm } from "./InputForm";
import { ScrollArea } from "~/components/ui/scroll-area";


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
    {
      id: 3,
      message: "Sure, please provide me with your order number",
      user: "bot",
      timestamp: "2021-10-01T12:02:00Z",
    },
    {
      id: 4,
      message: "123456",
      user: "user",
      timestamp: "2021-10-01T12:03:00Z",
    },
    {
      id: 5,
      message: "Your order is currently being processed and will be shipped",
      user: "bot",
      timestamp: "2021-10-01T12:04:00Z",
    },
    {
      id: 6,
      message: "Here is the tracking number: 123456789",
      user: "bot",
      timestamp: "2021-10-01T12:05:00Z",
    }
  ],
};


export function ChatboxSection({ id }: { id: string; }) {
  return (
    <>
      <Badge variant="outline" className="absolute right-3 top-3">
        Output
      </Badge>
      <ScrollArea className="h-[calc(100dvh_-_230px)] w-full">
        {
          chatMessages[id]?.map(message => <ChatBubble key={message.id} message={message} />)
        }
        <div className="h-100" />
      </ScrollArea>
      <InputForm />
    </>);
}
