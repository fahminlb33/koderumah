import dayjs from "dayjs";
import { Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Chat } from "~/domain/services/chat";

export function ChatBubble({ chat }: Readonly<{ chat: Chat; }>) {

  return <>
    <div
      className={`flex gap-4 items-start ${chat.role === "user" ? "flex-row-reverse" : ""}`}
    >
      <div className="flex flex-col items-start gap-1  max-w-[90%]">
        <div className={`p-4 rounded-lg ${chat.role === "user" ? "bg-primary text-background" : "bg-background text-foreground"}`}>
          {chat.content}
        </div>
        <div className="flex gap-1 items-center">
          <p className="text-sm text-muted-foreground ">{dayjs(chat.createdAt).format("HH:mm")}</p>

          {chat.role !== "user" && (
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Copy className="size-2" />
            </Button>
          )}
        </div>
      </div>



    </div>

    {
      chat.role !== "user" && (
        <Collapsible>
          <CollapsibleTrigger>See details</CollapsibleTrigger>
          <CollapsibleContent>

            <HouseCard chat={chat} />
          </CollapsibleContent>
        </Collapsible>
      )
    }
  </>;
}



const HouseCard = ({ chat }: { chat: Chat; }) => {
  return (
    <div
      className={`flex gap-4 items-start`}
    >
      {
        chat.houses?.map((house) => {
          const content = house.content;
          // get the first sentence as title,
          // const title = parseHouseInfo(content.slice(0, content.indexOf(',.')));
          // const description = content.slice(content.indexOf(',.') + 2);
          return (
            <Card key={house.id} className="w-20%">
              <CardHeader>
                <img className="w-full rounded-md" src={house.images[0]} alt={house?.address + house.id} />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-xl mb-2">{"Rp." + house.price + ".000.000"}</div>
                <p className="text-gray-700 text-base mb-2">
                  {house.address}
                </p>

                <p className="text-gray-700 text-base">
                  {content}
                </p>
              </CardContent>
              <CardFooter>

                <Button asChild>
                  <a href={"#"}>
                    View Listing
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })
      }

    </div>
  );
};

export default HouseCard;


function parseHouseInfo(text: string): { price: string, location: string, buildingSize: string; } | null {
  const regex = /house for sale for Rp([\d,.]+) located at ([^.]+).+?with ([\d,.]+) m sq building/;
  const match = regex.exec(text);
  if (match) {
    const [_, price, location, buildingSize] = match;
    return { price, location, buildingSize };
  }
  return null;
}