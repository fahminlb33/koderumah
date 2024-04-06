import type { MetaFunction } from "@remix-run/cloudflare";
import { MainHeader } from "~/components/ui/shell-header";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - Docs" },
        {
            name: "description",
            content: "Documentation for KodeRumah",
        },
    ];
};

export default function Index() {
    return (
        <  >
            <MainHeader title={"Documentations"} />

            <div className="p-4">
                <p className="text-sm text-gray-500">
                    Documentation for KodeRumah
                </p>
            </div>
        </ >
    );
}
