import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link, useNavigate, useRevalidator } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { removeChat, renameChat } from "~/utils/chat-database";

export function ChatList({ chatItems }: { chatItems: { title: string; id: string; }[]; }) {
  const [chatTitle, setChatTitle] = useState("");
  const [chatItemLocal, setChatItemLocal] = useState(chatItems);
  const navigate = useNavigate();

  const { revalidate } = useRevalidator();
  return (
    <div className="flex h-full flex-col">
      <div className="bg-white/80 border mb-2 dark:bg-muted/70 rounded-lg">
        <Button className="w-full" onClick={() => {
          setChatTitle("");
          navigate("/app/chat/new");
        }}>New Conversation</Button>
      </div>
      <div className="bg-white/80  flex-1 border dark:bg-muted/70 rounded-lg">
        {chatItems.map((item, index) => (
          <Link
            key={item.id}
            to={`/app/chat/${item.id}`}
            replace
            className="block p-4 hover:bg-muted/90 dark:bg-gray-950/80"
          >
            {/* two column flex with left item for actions */}
            <div className="flex justify-between">
              <p>{item.title}</p>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger><DotsHorizontalIcon /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem onClick={() => setChatTitle(item.title)}>Rename</DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem onClick={() => {

                      removeChat(item.id);
                      setChatItemLocal(chatItemLocal.filter((_, i) => i !== index));
                      revalidate();
                    }}>Delete</DropdownMenuItem>
                    <DropdownMenuItem disabled>Export</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Chat</DialogTitle>
                    <DialogDescription>
                      What would you like to rename this chat to?
                    </DialogDescription>

                  </DialogHeader>
                  <div className="py-4">
                    <Input placeholder="New title" value={chatTitle} onChange={(e) => setChatTitle(e.target.value)} />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost" onClick={() => {
                        setChatTitle("");
                      }}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={() => {
                        renameChat(item.id, chatTitle);
                        setChatTitle("");
                        revalidate();
                      }} type="submit">
                        Rename
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
