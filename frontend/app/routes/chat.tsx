import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import localforage from "localforage";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { getChats, seedChats } from "~/utils/chat-database";
import { ChatList } from "../components/modules/ChatList";

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


export async function clientLoader() {
  const db = localforage.createInstance({
    name: "KodeRumahDB",
    storeName: "settings",
  });
  const isSeeded = await db.getItem("seeded");
  if (!isSeeded) {
    await seedChats();
    db.setItem("seeded", true);
  }
  const chatItems = await getChats();
  return json({ chatItems });
}


export default function Index() {
  const { chatItems } = useLoaderData<typeof clientLoader>();

  return (
    <ResizablePanelGroup direction="horizontal" className="gap-4 p-4 h-full">
      <ResizablePanel defaultSize={40} >
        <ChatList chatItems={chatItems} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} className="rounded-lg bg-muted/50 h-full p-4 lg:col-span-2 relative">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}


