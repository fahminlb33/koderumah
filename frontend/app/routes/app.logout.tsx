import type { MetaFunction } from "@remix-run/cloudflare";
import { MainHeader } from "~/components/ui/shell-header";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah" },
        {
            name: "description",
            content: "Manage your models",
        },

    ];
};

export default function Index() {
    return (
        <>
            Logout
        </>
    );
}
