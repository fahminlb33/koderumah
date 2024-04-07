import type { MetaFunction } from "@remix-run/cloudflare";
import { useParams } from "@remix-run/react";
import { ChatboxSection } from "~/components/modules/chat/ChatboxSection";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - Api" },
        {
            name: "description",
            content: "Manage your api and hooks",
        },
    ];
};

export default function Index() {
    const { id } = useParams();
    return (
        <ChatboxSection id={id ?? "1"} />
    );
}
