import type { MetaFunction } from "@remix-run/cloudflare";
import { TitleBar } from "~/components/ui/shell-header";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - Settings" },
        {
            name: "description",
            content: "Manage your Settings",
        },

    ];
};

export default function Index() {
    return (
        <>
            <TitleBar title={"Settings"} />

            <div className="p-4"> 
                <p className="text-sm text-gray-500">
                    Manage your settings
                </p>
            </div>
        </>
    );
}
