import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";

/* eslint-disable @next/next/no-img-elememt */
interface ThumbnailsProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailsProps) => {
  if (!url) return null;
  return (
    <Dialog>
      <DialogTitle>
        <div className="relative overflow-hidden max-w-[360px] border rounded-ld my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Message image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTitle>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          alt="Message image"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};
