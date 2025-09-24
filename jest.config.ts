import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
};

export default config;
