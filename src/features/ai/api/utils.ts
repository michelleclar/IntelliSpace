import { Op } from "quill/core";

// TODO: need type safety
export const aiReplyFormatToDelta = ({
  aiReply,
  modelName,
}: {
  aiReply: string;
  modelName: string;
}): { ops: Op[] } => {
  return {
    ops: [
      {
        attributes: {
          bold: true,
        },
        insert: `${aiReply}`,
      },
      {
        insert: "\n",
      },
      {
        attributes: {
          bold: true,
        },
        insert: `-- ${modelName} by AI`,
      },
    ],
  };
};
