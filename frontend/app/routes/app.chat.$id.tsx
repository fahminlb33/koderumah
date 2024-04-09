import type { MetaFunction } from "@remix-run/cloudflare";
import { useParams } from "@remix-run/react";
import { ChatboxSection } from "~/components/modules/chat/ChatboxSection";

export const meta: MetaFunction = ({ params }) => {
    return [
        { title: "KodeRumah - Chat - " + params.id },
        {
            name: "description",
            content: "Manage your api and hooks",
        },
    ];
};


export const handle = {
    breadcrumb: (match: any) => match.params.id ?? 'New',
};

export default function Index() {
    const { id } = useParams();
    return (
        <ChatboxSection id={id ?? "1"} />
    );
}
