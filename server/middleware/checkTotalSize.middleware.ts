import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";

export const checkTotalSize = (maxMB: number) => {
  return (req: any, res: any, next: any) => {
    const maxBytes = maxMB * 1024 * 1024;

    let totalSize = 0;

    if (req.file) {
      totalSize = req.file.size;
    }

    if (req.files) {
      if (Array.isArray(req.files)) {
        totalSize += req.files.reduce((sum: any, f: any) => sum + f.size, 0);
      } else {
        // handles upload.fields()
        totalSize += Object.values(req.files)
          .flat()
          .reduce((sum: number, f: any) => sum + f.size, 0);
      }
    }

    if (totalSize > maxBytes) {
      return sendResponse(res, HttpStatusCode.BAD_GATEWAY, false, `Total upload exceeds ${maxMB}MB`);
    }

    next();
  };
};