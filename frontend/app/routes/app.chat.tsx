import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";
import { Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { TitleBar } from "~/components/ui/shell-header";
import { ChatSettings } from "../components/modules/chat/ChatSettingDrawer";

export const meta: MetaFunction = () => {
  return [
    { title: "KodeRumah - Chat" },
    {
      name: "description",
      content: "Chat with your assistant",
    },
  ];
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
    <div className="border-t border-gray-200">
      {
        ChatItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className="block p-4 hover:bg-gray-50"
          >
            {item.title}
          </Link>
        ))
      }
    </div>
  );
}


export default function Index() {

  const settingsDrawer = <Drawer>
    <DrawerTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Settings className="size-4" />
        <span className="sr-only">Settings</span>
      </Button>
    </DrawerTrigger>
    <DrawerContent className="max-h-[80vh]">
      <DrawerHeader>
        <DrawerTitle>Configuration</DrawerTitle>
        <DrawerDescription>
          Configure the settings for the model and messages.
        </DrawerDescription>
      </DrawerHeader>
      <ChatSettings isDrawer />
    </DrawerContent>
  </Drawer>;

  return (<>
    <TitleBar title={"Chat"} action={
      settingsDrawer
    } />

    <ResizablePanelGroup direction="horizontal" className="flex-1 gap-4 overflow-auto p-4">
      <ResizablePanel defaultSize={2} className="bg-white border border-gray-200 rounded-lg shadow-sm">


        <ChatList />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={8} className=" ">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  </>
  );
}


