export function requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

/** Secret managers and Lambda console env vars often store PEM values with literal "\n" escapes. */
export function normalizePem(value: string): string {
    return value.includes('\\n') ? value.replace(/\\n/g, '\n') : value;
}
