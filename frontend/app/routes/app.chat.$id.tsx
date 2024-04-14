import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { ClientLoaderFunctionArgs, json, redirect, useLoaderData } from "@remix-run/react";
import localforage from "localforage";
import { ChatboxSection } from "~/components/modules/chat/ChatboxSection";
import { getChatSession, newChatSession } from "~/domain/services/chat";
import { addChat, getChat } from "~/utils/chat-database";
import invariant from "~/utils/invariant";


export const meta: MetaFunction = ({ params }) => {
    return [
        { title: "KodeRumah - Chat - " + params.id },
        {
            name: "description",
            content: "Chat with our AI bot to get help with your questions.",
        },
    ];
};


export const handle = {
    breadcrumb: (match: any) => match.params.id ?? '-',
};


export async function loader({ params }: LoaderFunctionArgs) {
    invariant(params.id, 'Chat ID is required');

    // if the chat ID is 'new', create a new chat session
    if (params.id === 'new') {
        const result = await newChatSession() as {
            id: string;
            title: string;
        };
        if (!result.id) {
            return redirect(`/app/chat`);
        }

        return redirect(`/app/chat/${result.id}`);
    }

    try {
        const chats = await getChatSession(params.id);
        return json({ chat: chats, id: params.id, title: "" });
    } catch (error) {
        return json({ chat: [], id: params.id, title: "" });
    }

}

export async function clientLoader({ serverLoader, params }: ClientLoaderFunctionArgs) {
    invariant(params.id, 'Chat ID is required');


    // check if the chat is already in the cache
    const chat = await getChat(params.id);

    if (!chat) {
        await addChat({ id: params.id, title: "Conversation - " + new Date().toISOString() });
    }


    return serverLoader<typeof loader>();
}

export function HydrateFallback() {
    return <p>Loading...</p>;
}


export default function Index() {
    const { chat, id } = useLoaderData<typeof loader>();

    return (
        <ChatboxSection id={id} initial={chat} />
    );
}
