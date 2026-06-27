import fs from "fs";
import path from "path";
import { unlink } from "fs/promises";
import logger from "@/utils/logger";

export interface SaveImageResult {
    fileName: string;
    filePath: string;
}

export const saveBase64Image = (
    base64String: string,
    folderName = "others"
): SaveImageResult => {
    const matches = base64String.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);

    if (!matches) {
        throw new Error("Invalid base64 image");
    }

    const mimeType = matches[1];
    const imageData = matches[2];

    const extension = mimeType.split("/")[1];
    const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;

    const uploadDir = path.join(process.cwd(), "uploads");

    const directory = path.join(uploadDir, folderName);

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    const filePath = path.join(directory, fileName);

    fs.writeFileSync(filePath, Buffer.from(imageData, "base64"));

    return {
        fileName,
        filePath: `/uploads/${folderName}/${fileName}`,
    };
};

export const hasBase64String = (base64String: string): boolean => {
    if (!base64String) return false;

    return /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/.test(base64String);
};

export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        await unlink(filePath);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            logger.info(`File(${filePath}) does not exist`);
        } else {
            logger.error("Failed to delete file:", error);
        }
    }
};