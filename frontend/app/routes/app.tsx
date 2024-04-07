import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { Sidebar } from "~/components/groups/sidebar";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - App" },
        {
            name: "description",
            content: "Dashboard KodeRumah",
        },
    ];
};

export default function Layout() {
    return (
        <div className="grid h-screen w-full pl-[53px]">
            <Sidebar />
            <div className="flex flex-col">
                <Outlet />
            </div>
        </div>
    );
}

