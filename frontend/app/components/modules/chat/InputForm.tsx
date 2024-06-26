import { useRevalidator } from "@remix-run/react";
import { CornerDownLeft, Paperclip } from "lucide-react";
import { useCallback, useState } from "react";
import { DropzoneOptions } from "react-dropzone-esm";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button, buttonVariants } from "~/components/ui/button";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "~/components/ui/file-uploader";
import { FormItem } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { useToast } from "~/components/ui/use-toast";
import { sendAttachment, sendMessages } from "~/domain/services/chat";
import { cn } from "~/utils/lib";

export function InputForm({ id }: { id: string; }) {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[] | null>([]);
  const { revalidate } = useRevalidator();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (images && images.length > 0) {
        console.log("Sending attachment");
        await sendAttachment(id, images?.[0]);
      } else if (message !== "") {
        console.log("Sending message");
        await sendMessages(id, message);
      } else {
        console.log("Error", images);
        toast({
          title: "Error",
          description: "Please attach a file or type a message",
        });
      }

      setImages([]);
      setMessage("");

    } catch (error) {
      console.error(error);
    } finally {
      revalidate();
      setIsLoading(false);
    }
  }, [message, images]);


  const dropzone = {
    multiple: true,
    maxFiles: 3,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;


  return <form
    onSubmit={handleSubmit}
    className="sticky bottom-0 left-0 right-0 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
  >
    {
      !images || images.length === 0 ? (
        <Label htmlFor="file" className="sr-only">
          Attach File
        </Label>
      ) : (<Label htmlFor="message" className="sr-only">
        Message
      </Label>)
    }
    <Textarea
      id="message"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder={images && images.length > 0 ? "" : "Type your message here..."}
      className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0" />

    <div className="flex items-center p-3 pt-0">
      <FormItem>
        <FileUploader
          value={images}
          onValueChange={(value) => setImages(value)}
          dropzoneOptions={dropzone}
          reSelect={true}
        >

          {images && images.length > 0 && (
            <FileUploaderContent className="absolute bottom-8 w-full -ml-3 rounded-b-none rounded-t-md flex-row gap-2 ">
              {images.map((file, i) => (
                <FileUploaderItem
                  key={i}
                  index={i}
                  aria-roledescription={`file ${i + 1} containing ${file.name
                    }`}
                  className="p-0 size-20"
                >
                  <AspectRatio className="size-full">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover h-full rounded-md"
                    />
                  </AspectRatio>
                </FileUploaderItem>
              ))}
            </FileUploaderContent>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <FileInput
                className={cn(
                  buttonVariants({
                    size: "icon",
                    variant: "ghost"
                  }),
                  "size-8  rounded-t-none rounded-b-md"
                )}
              >
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </FileInput>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>

        </FileUploader>
      </FormItem>

      <Button type="submit" size="sm" className="ml-auto gap-1.5">
        {isLoading ? "Sending..." : "Send Message"}
        <CornerDownLeft className="size-3.5" />
      </Button>
    </div>
  </form>;
}
