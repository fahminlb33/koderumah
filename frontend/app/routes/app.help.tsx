import type { MetaFunction } from "@remix-run/cloudflare";
import { MainHeader } from "~/components/ui/shell-header";

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
            <MainHeader title={"Help"} />

            <div className="p-4">
                <p className="text-sm text-gray-500">
                    read Help
                </p>
            </div>
        </>
    );
}
