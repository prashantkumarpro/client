import { apiClient } from "@/lib/api/client";
import type {
    FileApiResponse,
    RenameFileData,
    UploadFileData,
} from "./types";

const isValidObjectId = (id?: string | null): boolean => {
    return Boolean(id && typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id));
};

export const uploadFile = async (
    data: UploadFileData,
    parentDirId?: string
): Promise<FileApiResponse> => {
    const validParentId = isValidObjectId(parentDirId) ? parentDirId : undefined;
    const endpoint = validParentId ? `/file/${validParentId}` : "/file";
    const filename =
        data.filename || (data.file instanceof File ? data.file.name : "untitled");

    try {
        const response = await apiClient.post<FileApiResponse>(endpoint, data.file, {
            headers: {
                filename,
                "Content-Type": data.file.type || "application/octet-stream",
            },
        });
        return response.data;
    } catch (err: unknown) {
        const axiosError = err as { response?: { status?: number } };
        // If parent directory was not found (404), fallback and upload to root directory
        if (validParentId && axiosError?.response?.status === 404) {
            const response = await apiClient.post<FileApiResponse>("/file", data.file, {
                headers: {
                    filename,
                    "Content-Type": data.file.type || "application/octet-stream",
                },
            });
            return response.data;
        }
        throw err;
    }
};

export const getFileBlob = async (id: string): Promise<Blob> => {
    if (!isValidObjectId(id)) {
        throw new Error(`Invalid file ID: ${id}`);
    }
    const response = await apiClient.get<Blob>(`/file/${id}`, {
        responseType: "blob",
    });

    return response.data;
};

export const downloadFile = async (
    id: string,
    customFilename?: string
): Promise<void> => {
    if (!isValidObjectId(id)) {
        throw new Error(`Invalid file ID: ${id}`);
    }
    const response = await apiClient.get<Blob>(`/file/${id}`, {
        params: { action: "download" },
        responseType: "blob",
    });

    let filename = customFilename;
    if (!filename) {
        const disposition = response.headers["content-disposition"];
        if (disposition && disposition.includes("filename=")) {
            const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }
    }

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "download");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const renameFile = async (
    id: string,
    data: RenameFileData
): Promise<FileApiResponse> => {
    if (!isValidObjectId(id)) {
        throw new Error(`Invalid file ID: ${id}`);
    }
    const response = await apiClient.patch<FileApiResponse>(`/file/${id}`, {
        newFilename: data.newFilename,
    });

    return response.data;
};

export const deleteFile = async (id: string): Promise<FileApiResponse> => {
    if (!isValidObjectId(id)) {
        throw new Error(`Invalid file ID: ${id}`);
    }
    const response = await apiClient.delete<FileApiResponse>(`/file/${id}`);

    return response.data;
};