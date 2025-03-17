export function bufferToFile(buffer: ArrayBuffer, fileName: string) {
    const uint8Array = new Uint8Array(buffer);
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    return new File([blob], fileName, { type: blob.type });
}
