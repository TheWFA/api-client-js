import 'dotenv/config';
import { getTestClient, getTestOAuthClient } from './src/tests/client';

beforeAll(async () => {
    getTestClient();
    getTestOAuthClient();
});
