export function reportError(...error: unknown[]): void {
    console.error(...error);
}

export function throwError(message: string): never {
    throw new Error(message);
}
