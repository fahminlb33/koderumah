import type { MetaFunction } from "@remix-run/cloudflare";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, Outlet, json } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "~/components/ui/page-header";

export const meta: MetaFunction = () => {
  return [
    { title: "KodeRumah" },
    {
      name: "description",
      content: "Analyse and learn about properties around you",
    },
  ];
};

export default function Index() {
  return (
    <div className="container relative">

      <PageHeader className="max-w-3xl h-full">
        <PageHeaderHeading className="text-balance">
          Welcome to KodeRumah
        </PageHeaderHeading>
        <PageHeaderDescription>
          Analyse and learn about properties around you
        </PageHeaderDescription>
        <PageActions>
          <Button asChild>
            <Link to="app" unstable_viewTransition>Start</Link>
          </Button>
          <Button asChild variant="outline">
            <a
              href="https://github.com/fahminlb33/koderumah"
              target="_blank"
            >
              GitHub
            </a>
          </Button>
        </PageActions>
      </PageHeader>
      <section id="blocks" className="grid scroll-mt-24 gap-24 lg:gap-48">
        <Outlet />
      </section>
    </div>
  );
}
