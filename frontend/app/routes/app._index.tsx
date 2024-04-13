import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { Activity, ArrowUpRight, CreditCard, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { TitleBar } from "~/components/ui/shell-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { getChats } from "~/utils/chat-database";

export const meta: MetaFunction = () => {
    return [
        { title: "KodeRumah - App" },
        {
            name: "description",
            content: "Dashboard KodeRumah",
        },
    ];
};


function FavouriteSection() {
    return (<Card>
        <CardHeader>
            <CardTitle>Your Favourite Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                        {/* Property Name */}
                        Olivia Martin Residence
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {/* Property Address */}
                        1234, 5th Avenue, New York
                    </p>
                </div>
                <div className="ml-auto font-medium">+$4,999.00</div>
            </div>
        </CardContent>
    </Card>);
}

export async function clientLoader() {
    const chatItems = await getChats();
    return { chatItems };
}

function HistorySection({ items }: {
    items: { title: string; id: string; }[];
}) {
    return (<Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Chat History</CardTitle>
                <CardDescription>
                    Recent chat history is saved on your browser
                </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="/app/chat">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>
                            Title
                        </TableHead>
                        <TableHead  >
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        // get last 5 items from the list reversed
                        items.slice(
                            -5
                        ).map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="w-40  ">
                                    {new Date().toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{item.title}</div>
                                </TableCell>
                                <TableCell>
                                    <Button asChild size="sm" variant="ghost">
                                        <Link to={`/app/chat/${item.id}`} unstable_viewTransition>
                                            View
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </CardContent>
    </Card>);
}



export const handle = {
    breadcrumb: () => "Dashboard",
};

export default function Index() {
    const { chatItems } = useLoaderData<typeof clientLoader>();
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Link to="/app/chat/new" className="block">
                    <Card className="bg-primary text-white" >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-medium">
                                New Chat
                            </CardTitle>
                            <Plus className="h-4 w-4 text-white" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-bold">
                                {" "}
                            </div>
                            <p className="text-xs text-white">
                                Start a new chat with your clients
                            </p>
                        </CardContent>
                    </Card>
                </Link>

            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-3 md:grid-cols-2">
                <HistorySection items={chatItems} />
                <FavouriteSection />
            </div>
        </main>

    );
}
