import { Copy } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ChatBubble({ message }: Readonly<{ message: any; }>) {

  return <div
    className={`flex gap-4 items-start ${message.user === "user" ? "flex-row-reverse" : ""}`}
  >
    <div className="flex flex-col items-start gap-1">
      <div className={`p-4 rounded-lg ${message.user === "user" ? "bg-primary text-background" : "bg-background text-foreground"}`}>
        {message.message}
      </div>
      <div className="flex gap-1 items-center">
        <p className="text-sm text-muted-foreground ">{message.timestamp}</p>

        {message.user === "bot" && (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Copy className="size-3" />
          </Button>
        )}
      </div>
    </div>

  </div>;
}
