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
      content: "Pelajari dan analisa properti yang ada di sekitar Anda",
    },
  ];
};

export default function Index() {
  return (
    <div className="container relative">

      <PageHeader className="max-w-3xl h-full">
        <PageHeaderHeading className="text-balance">
          Selamat Datang Di Kode Rumah
        </PageHeaderHeading>
        <PageHeaderDescription>
          Pelajari dan analisa properti yang ada di sekitar Anda
        </PageHeaderDescription>
        <PageActions>
          <Button asChild>
            <Link to="app" unstable_viewTransition>Mulai</Link>
          </Button>
          <Button asChild variant="outline">
            <a
              href="https://github.com/fahminlb/koderumah"
              target="_blank"
            >
              Buka di GitHub
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
