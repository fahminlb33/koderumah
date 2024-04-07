import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet, useParams } from "@remix-run/react";
import { Separator } from "~/components/ui/separator";

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
    const { slug } = useParams();
    return (
        <div className="flex flex-col p-4 gap-4">
            <span className="text-2xl font-bold">
                {slug} API
            </span>

            <Separator />

            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
                purus nec purus faucibus ultricies. Donec eget nunc sed nunc
                consectetur ultricies. Integer nec libero nec libero faucibus
                ultricies. Donec eget nunc sed nunc consectetur ultricies. Integer
            </p>

            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
                purus nec purus faucibus ultricies. Donec eget nunc sed nunc
                consectetur ultricies. Integer nec libero nec libero faucibus
                ultricies. Donec eget nunc sed nunc consectetur ultricies. Integer
            </p>
            {/* codeblock */}
            <code className="text-md text-gray-500 bg-gray-100 p-4 rounded-lg">
                {slug}
            </code>
        </div>
    );
}
