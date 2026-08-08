import 'dotenv/config';
import { getTestClient } from './src/tests/client';

beforeAll(async () => {
    // Only initialize the integration test client if environment variables are present.
    // Unit tests use mocked clients and don't require these.
    if (process.env.API_KEY) {
        try {
            getTestClient();
        } catch {
            // Ignore - integration tests will fail but unit tests will work
        }
    }
});
