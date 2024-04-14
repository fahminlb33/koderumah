import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet, useMatches } from "@remix-run/react";
import { Fragment, PropsWithChildren, useMemo } from "react";
import { Sidebar } from "~/components/groups/sidebar";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { TitleBar } from "~/components/ui/shell-header";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - App" },
        {
            name: "description",
            content: "Dashboard KodeRumah",
        },
    ];
};

export default function Layout({ children }: PropsWithChildren) {

    const matches = useMatches();

    const breadcrumbItem = useMemo(() => {
        return matches
            .filter(
                (match) =>
                    match?.handle &&
                    (match?.handle as any).breadcrumb !== undefined
            );
    }, [matches]);

    return (
        <div className="grid grid-cols[53px_1fr] grid-rows-[53px_1fr] grid-flow-row gap-0 h-screen w-full pl-[53px]">
            <Sidebar />
            <div className="row-start-1 col-start-1 col-span-1">
                <TitleBar title={breadcrumbItem.map((match, index) => (
                    <Fragment key={match.pathname}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={
                                match?.pathname
                            }>{(match?.handle as any)?.breadcrumb?.(match)}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {/* if last, dont add separator */}
                        {breadcrumbItem[index + 1] && <BreadcrumbSeparator />}
                    </Fragment>
                ))} />
            </div>

            {children}
        </div>
    );
}

