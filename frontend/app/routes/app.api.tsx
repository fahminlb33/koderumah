import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";
import { MainHeader } from "~/components/ui/shell-header";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "~/components/ui/resizable";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - Api" },
        {
            name: "description",
            content: "Manage your api and hooks",
        },
    ];
};

const ApiList = [
    {
        title: "Hooks",
        path: "/app/api/hooks",
    },
    {
        title: "Endpoints",
        path: "/app/api/endpoints",
    },
];


export default function Index() {
    return (
        <>
            <MainHeader title={"API"} />
            <ResizablePanelGroup direction="horizontal" className="flex-1 gap-4 overflow-auto p-4">
                <ResizablePanel defaultSize={4} className="bg-white border border-gray-200 rounded-lg shadow-sm">

                    <div className="p-4">
                        <h2 className="text-xl font-semibold">API</h2>
                        <p className="text-sm text-gray-500">
                            Manage your api and hooks
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        {
                            ApiList.map((item, index) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="block p-4 hover:bg-gray-50"
                                >
                                    {item.title}
                                </Link>
                            ))
                        }

                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={8} className="bg-white border border-gray-200 rounded-lg shadow-sm ">
                    <Outlet />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}
