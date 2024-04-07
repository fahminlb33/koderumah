import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import "./globals.css";
import { TooltipProvider } from "./components/ui/tooltip";

export function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="application-name" content="KodeRumah"></meta>
        <meta name="apple-mobile-web-app-title" content="KodeRumah"></meta>
        <meta name="theme-color" content="#fbfdf7"></meta>
        <meta name="msapplication-navbutton-color" content="#fbfdf7"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
        <meta name="msapplication-starturl" content="/"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
        <Meta />
        <Links />
      </head>
      <body>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError() as any;
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>

        <h1
          className="text-4xl font-bold text-center text-red-500"
        >Oh no!</h1>

        <p
          className="text-center"
        >An error occurred.</p>

        <p
          className="text-center"
        >
          {error.statusText}
        </p>


        <Scripts />
      </body>
    </html>
  );
}