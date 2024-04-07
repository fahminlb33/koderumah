import { ReactNode } from "react";

export function TitleBar({ title, action }: Readonly<{ title: string; action?: ReactNode; }>) {
  return <header style={{
    viewTransitionName: "main-page-title",
  }} className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 title-bar">
    <h1 className="text-xl font-semibold" >{title}</h1>

    <div
      className="ml-auto gap-1.5 text-sm"
    >
      {action}
    </div>
  </header>;
}
