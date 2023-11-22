export function reportError(...error: any[]): void {
    console.error(...error);
}

export function throwError(message: string): never {
    throw new Error(message);
}
