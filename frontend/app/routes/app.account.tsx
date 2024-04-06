import type { MetaFunction } from "@remix-run/cloudflare";
import { MainHeader } from "~/components/ui/shell-header";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - Accounts" },
        {
            name: "description",
            content: "Manage your accounts",
        },
    ];
};

export default function Index() {
    return (
        <>
            <MainHeader title={"Accounts"} />

            <div className="p-4">
                <p className="text-sm text-gray-500">
                    Manage your accounts
                </p>
            </div>
        </>
    );
}
