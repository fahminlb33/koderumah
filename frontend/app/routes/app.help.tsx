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

export default function Index() {
    return (
        <>
            <TitleBar title={"Help"} />

            <div className="p-4">
                <p className="text-sm text-gray-500">
                    read Help
                </p>
            </div>
        </>
    );
}
