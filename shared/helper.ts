type R2ObjectKey = {
    id: string
    objectKey: string
}

export function generateObjectKey(): R2ObjectKey {
    const id = crypto.randomUUID();
    return {
        id,
        objectKey: id + ".jpg"
    }
}

export function getObjectKeyFromUrl(url: string): R2ObjectKey {
    const parts = url.split("/");
    const objectKey = parts[parts.length - 1];
    return {
        id: objectKey.split('.')[0],
        objectKey
    }
}
