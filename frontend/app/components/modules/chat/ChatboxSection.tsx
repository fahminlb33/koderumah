import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Chat } from "~/domain/services/chat";
import { ChatBubble } from "./ChatBubble";
import { InputForm } from "./InputForm";



export function ChatboxSection({ id, initial }: Readonly<{ id: string; initial: Chat[]; }>) {
  return (
    <>
      <Badge variant="outline" className="absolute right-3 top-3">
        Output
      </Badge>
      <ScrollArea className="h-[calc(100dvh_-_230px)] w-full">

        {
          initial instanceof Array && initial?.map((chat: Chat) => <ChatBubble key={chat.id + id} chat={chat} />)
        }

        <div className="h-100" />
      </ScrollArea>

      <InputForm id={id} />
    </>);
}
