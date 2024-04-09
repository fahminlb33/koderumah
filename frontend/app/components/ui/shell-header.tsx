import { ReactNode } from "react";
import { Breadcrumb, BreadcrumbList } from "./breadcrumb";

export function TitleBar({ title, action }: Readonly<{ title: ReactNode; action?: ReactNode; }>) {
  return <header style={{
    viewTransitionName: "main-page-title",
  }} className=" z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 title-bar">
    <Breadcrumb >
      <BreadcrumbList className="text-lg text-primary-foreground">
        {title}
      </BreadcrumbList>
    </Breadcrumb>


    <div
      className="ml-auto gap-1.5 text-sm"
    >
      {action}
    </div>
  </header>;
}
