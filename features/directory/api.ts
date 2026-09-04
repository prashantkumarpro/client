import { apiClient } from "@/lib/api/client";
import type {
    CreateDirectoryData,
    Directory,
    RenameDirectoryData,
} from "./types";

const isValidObjectId = (id?: string | null): boolean => {
    return Boolean(id && typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id));
};

export const getDirectory = async (
    id?: string
): Promise<Directory> => {
    const validId = isValidObjectId(id) ? id : undefined;
    const response = await apiClient.get<Directory>(
        validId ? `/directory/${validId}` : "/directory"
    );

    return response.data;
};

export const createDirectory = async (
    data: CreateDirectoryData,
    parentDirId?: string
): Promise<void> => {
    const validParentId = isValidObjectId(parentDirId) ? parentDirId : undefined;
    const endpoint = validParentId
        ? `/directory/${validParentId}`
        : "/directory";

    try {
        await apiClient.post(endpoint, {}, {
            headers: {
                dirname: data.dirname,
            },
        });
    } catch (err: unknown) {
        const axiosError = err as { response?: { status?: number } };
        // If parent directory was not found (404), fallback and create in root directory
        if (validParentId && axiosError?.response?.status === 404) {
            await apiClient.post("/directory", {}, {
                headers: {
                    dirname: data.dirname,
                },
            });
            return;
        }
        throw err;
    }
};

export const renameDirectory = async (
    id: string,
    data: RenameDirectoryData
): Promise<void> => {
    if (!isValidObjectId(id)) {
        console.warn("Invalid ObjectId provided for renameDirectory:", id);
        return;
    }
    await apiClient.patch(`/directory/${id}`, data);
};

export const deleteDirectory = async (
    id: string
): Promise<void> => {
    if (!isValidObjectId(id)) {
        console.warn("Invalid ObjectId provided for deleteDirectory:", id);
        return;
    }
    await apiClient.delete(`/directory/${id}`);
};