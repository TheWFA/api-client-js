import 'dotenv/config';
import { getTestClient, getTestOAuthClient } from './src/tests/client';

beforeAll(async () => {
    // Only initialize integration test clients if environment variables are present
    // Unit tests use mocked clients and don't require these
    if (process.env.API_KEY) {
        try {
            getTestClient();
        } catch {
            // Ignore - integration tests will fail but unit tests will work
        }
    }
    if (process.env.CLIENT_ID) {
        try {
            getTestOAuthClient();
        } catch {
            // Ignore - integration tests will fail but unit tests will work
        }
    }
});
