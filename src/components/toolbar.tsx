import { EmojiPopover } from "@/components/emoji-popover";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Languages,
  Loader,
  MessageSquareTextIcon,
  Pencil,
  Smile,
  Trash,
} from "lucide-react";

interface ToolbarProos {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  handleTranslate: () => void;
  translateText: string;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  translateText,
  handleReaction,
  handleTranslate,
  hideThreadButton,
}: ToolbarProos) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => {
            handleReaction(emoji);
          }}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        <Hint label="Translate message">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleTranslate}
                // onClick={() => {}}
              >
                <Languages
                  // TODO :add Ai translate
                  className="size-4"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <TranslatePopover translateText={translateText} />
            </PopoverContent>
          </Popover>
        </Hint>

        {isAuthor && (
          <Hint label="Delete message">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};

const TranslatePopover = ({ translateText }: { translateText: string }) => {
  if (!translateText) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="space-y-2">
          <Loader className="size-6 animate-spin text-muted-foreground " />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{translateText}</p>
      </div>
    </div>
  );
};
