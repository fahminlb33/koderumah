import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";

export const meta: MetaFunction = () => {
  return [
    { title: "KodeRumah - Chat" },
    {
      name: "description",
      content: "Chat with your assistant",
    },
  ];
};

export const handle = {
  breadcrumb: () => "Chat",
};

const ChatItems = [
  {
    title: "Conversation 1",
    path: "/app/chat/1",
  },
  {
    title: "Conversation 2",
    path: "/app/chat/2",
  },
];

function ChatList() {
  return (
    <div className="flex h-full flex-col">
      <div className="bg-white/80 border mb-2 dark:bg-muted/70 rounded-lg">
        <Button className="w-full">New Conversation</Button>
      </div>
      <div className="bg-white/80  flex-1 border dark:bg-muted/70 rounded-lg">
        {
          ChatItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-4 hover:bg-muted/90 dark:bg-gray-950/80"
            >
              {/* two column flex with left item for actions */}
              <div className="flex justify-between">
                <p>{item.title}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger><DotsHorizontalIcon/></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Rename</DropdownMenuItem> 
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}


export default function Index() {

  return (
    <ResizablePanelGroup direction="horizontal" className="gap-4 p-4 h-full">
      <ResizablePanel defaultSize={2} >
        <ChatList />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={8} className="rounded-lg bg-muted/50 h-full p-4 lg:col-span-2 relative">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}


