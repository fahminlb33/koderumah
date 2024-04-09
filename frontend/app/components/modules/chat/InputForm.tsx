import { CornerDownLeft, Paperclip } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

export function InputForm() {
  return <form
    className="sticky bottom-0 left-0 right-0 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
  >
    <Label htmlFor="message" className="sr-only">
      Message
    </Label>
    <Textarea
      id="message"
      placeholder="Type your message here..."
      className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0" />
    <div className="flex items-center p-3 pt-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Attach File</TooltipContent>
      </Tooltip>

      <Button type="submit" size="sm" className="ml-auto gap-1.5">
        Send Message
        <CornerDownLeft className="size-3.5" />
      </Button>
    </div>
  </form>;
}
