import type { MetaFunction } from "@remix-run/cloudflare";
import { TitleBar } from "~/components/ui/shell-header";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - Help" },
        {
            name: "description",
            content: "read Help",
        },

    ];
};

export const handle = {
    breadcrumb: () => "Help",
};

export default function Index() {
    return (
        <div className="p-4">
            <p className="text-sm text-gray-500">
                Here's some help
            </p>
        </div>
    );
}
