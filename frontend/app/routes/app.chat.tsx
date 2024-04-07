import type { MetaFunction } from "@remix-run/cloudflare";
import { Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer";
import { TitleBar } from "~/components/ui/shell-header";
import { ChatSettings } from "../components/modules/chat/ChatSettingDrawer";
import { ChatboxSection } from "../components/modules/chat/ChatboxSection";

export const meta: MetaFunction = () => {
  return [
    { title: "KodeRumah - Chat" },
    {
      name: "description",
      content: "Chat with your assistant",
    },
  ];
};


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
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        className="relative hidden flex-col items-start gap-8 md:flex"
      >
        <ChatSettings />
      </div>
      <ChatboxSection />
    </main>
  </>
  );
}


