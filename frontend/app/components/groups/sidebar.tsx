import { Link } from "@remix-run/react";
import {
  BuildingIcon,
  HomeIcon, LifeBuoy, Settings2,
  SquareTerminal,
  Triangle
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { ModeToggle } from "../ui/mode-toggle";

const navItems = [
  { label: "Dashboard", icon: HomeIcon, path: "/app/" },
  { label: "Playground", icon: SquareTerminal, path: "/app/chat" },
];


const navFooter = [
  { label: "Settings", icon: Settings2, path: "/app/settings" },
  { label: "Help", icon: LifeBuoy, path: "/app/help" },
];
export function Sidebar() {
  return <aside className="inset-y fixed col-start-1 left-0 z-20 flex h-full flex-col border-r" style={{
    viewTimelineName: "sidebar",
  }}>
    <div className="border-b p-2">
      <Button variant="outline" size="icon" aria-label="Home" asChild>
        <Link to="/">
          <BuildingIcon className="size-5 " />
        </Link>
      </Button>
    </div>
    <nav className="grid gap-1 p-2">
      {
        navItems.map((item, index) => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label={item.label}
                asChild
              >
                <Link to={item.path} unstable_viewTransition>
                  <item.icon className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))
      }

    </nav>
    <nav className="mt-auto grid gap-1 p-2">
      {
        navFooter.map((item, index) => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label={item.label}
                asChild
              >
                <Link to={item.path} unstable_viewTransition>
                  <item.icon className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))
      }
      <ModeToggle />
    </nav>
  </aside>;
}
