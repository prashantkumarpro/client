import { apiClient } from "@/lib/api/client";
import type { FileItem } from "./types";

export async function getFiles(): Promise<FileItem[]>  {
    const response = await apiClient.get<FileItem[]>("/file");

    return response.data;
}

// This function will eventually give me an array of FileItem.
// apiClient.get<FileItem[]>("/files"); => I expect the response data to be FileItem[].