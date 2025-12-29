import { parseDates } from '../time';

describe('parseDates', () => {
    describe('handles null and undefined', () => {
        it('returns null for null input', () => {
            expect(parseDates(null)).toBeNull();
        });

        it('returns undefined for undefined input', () => {
            expect(parseDates(undefined)).toBeUndefined();
        });
    });

    describe('parses ISO date strings', () => {
        it('parses ISO date-only string (YYYY-MM-DD)', () => {
            const result = parseDates('2024-01-15');
            expect(result).toBeInstanceOf(Date);
            expect((result as unknown as Date).toISOString()).toContain('2024-01-15');
        });

        it('parses ISO datetime string with Z timezone', () => {
            const result = parseDates('2024-01-15T10:30:00Z');
            expect(result).toBeInstanceOf(Date);
            expect((result as unknown as Date).toISOString()).toBe('2024-01-15T10:30:00.000Z');
        });

        it('parses ISO datetime string with milliseconds', () => {
            const result = parseDates('2024-01-15T10:30:00.123Z');
            expect(result).toBeInstanceOf(Date);
            expect((result as unknown as Date).toISOString()).toBe('2024-01-15T10:30:00.123Z');
        });

        it('parses ISO datetime string with offset timezone', () => {
            const result = parseDates('2024-01-15T10:30:00+02:00');
            expect(result).toBeInstanceOf(Date);
            // Should be converted to UTC
            expect((result as unknown as Date).toISOString()).toBe('2024-01-15T08:30:00.000Z');
        });

        it('parses ISO datetime string with negative offset', () => {
            const result = parseDates('2024-01-15T10:30:00-05:00');
            expect(result).toBeInstanceOf(Date);
            expect((result as unknown as Date).toISOString()).toBe('2024-01-15T15:30:00.000Z');
        });

        it('parses ISO datetime without timezone (treated as local)', () => {
            const result = parseDates('2024-01-15T10:30:00');
            expect(result).toBeInstanceOf(Date);
        });

        it('parses datetime with space separator (API format)', () => {
            const result = parseDates('2022-09-03 08:15:00+00');
            expect(result).toBeInstanceOf(Date);
        });

        it('parses datetime with space separator and colon in timezone', () => {
            const result = parseDates('2022-09-03 08:15:00+00:00');
            expect(result).toBeInstanceOf(Date);
        });
    });

    describe('does not parse non-ISO strings', () => {
        it('returns non-ISO date strings unchanged', () => {
            const result = parseDates('January 15, 2024');
            expect(result).toBe('January 15, 2024');
        });

        it('returns partial dates unchanged', () => {
            const result = parseDates('2024-01');
            expect(result).toBe('2024-01');
        });

        it('returns random strings unchanged', () => {
            const result = parseDates('hello world');
            expect(result).toBe('hello world');
        });

        it('returns empty string unchanged', () => {
            const result = parseDates('');
            expect(result).toBe('');
        });
    });

    describe('handles primitive non-string values', () => {
        it('returns numbers unchanged', () => {
            expect(parseDates(42)).toBe(42);
            expect(parseDates(3.14)).toBe(3.14);
            expect(parseDates(0)).toBe(0);
        });

        it('returns booleans unchanged', () => {
            expect(parseDates(true)).toBe(true);
            expect(parseDates(false)).toBe(false);
        });
    });

    describe('recursively parses arrays', () => {
        it('parses dates in flat arrays', () => {
            const result = parseDates(['2024-01-15', 'hello', '2024-02-20']);
            expect(result[0]).toBeInstanceOf(Date);
            expect(result[1]).toBe('hello');
            expect(result[2]).toBeInstanceOf(Date);
        });

        it('parses dates in nested arrays', () => {
            const result = parseDates([['2024-01-15'], [['2024-02-20']]]);
            expect(result[0][0]).toBeInstanceOf(Date);
            expect(result[1][0][0]).toBeInstanceOf(Date);
        });

        it('returns empty array unchanged', () => {
            const result = parseDates([]);
            expect(result).toEqual([]);
        });
    });

    describe('recursively parses objects', () => {
        it('parses dates in flat objects', () => {
            const input = {
                createdAt: '2024-01-15T10:30:00Z',
                name: 'Test',
                count: 5,
            };
            const result = parseDates(input);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.name).toBe('Test');
            expect(result.count).toBe(5);
        });

        it('parses dates in nested objects', () => {
            const input = {
                user: {
                    profile: {
                        createdAt: '2024-01-15T10:30:00Z',
                    },
                },
            };
            const result = parseDates(input);
            expect(result.user.profile.createdAt).toBeInstanceOf(Date);
        });

        it('parses dates in arrays within objects', () => {
            const input = {
                events: [
                    { date: '2024-01-15T10:30:00Z' },
                    { date: '2024-02-20T15:45:00Z' },
                ],
            };
            const result = parseDates(input);
            expect(result.events[0].date).toBeInstanceOf(Date);
            expect(result.events[1].date).toBeInstanceOf(Date);
        });

        it('parses dates in objects within arrays', () => {
            const input = [
                { createdAt: '2024-01-15T10:30:00Z' },
                { updatedAt: '2024-02-20T15:45:00Z' },
            ];
            const result = parseDates(input);
            expect(result[0].createdAt).toBeInstanceOf(Date);
            expect(result[1].updatedAt).toBeInstanceOf(Date);
        });

        it('returns empty object unchanged', () => {
            const result = parseDates({});
            expect(result).toEqual({});
        });
    });

    describe('handles complex nested structures', () => {
        it('parses a typical API response structure', () => {
            const input = {
                id: '12345',
                match: {
                    startTime: '2024-01-15T14:00:00Z',
                    endTime: '2024-01-15T16:00:00Z',
                    teams: [
                        { name: 'Team A', foundedAt: '2020-05-01' },
                        { name: 'Team B', foundedAt: '2019-03-15' },
                    ],
                },
                metadata: {
                    createdAt: '2024-01-10T09:00:00Z',
                    modifiedAt: '2024-01-14T18:30:00Z',
                },
            };
            const result = parseDates(input);

            expect(result.id).toBe('12345');
            expect(result.match.startTime).toBeInstanceOf(Date);
            expect(result.match.endTime).toBeInstanceOf(Date);
            expect(result.match.teams[0].name).toBe('Team A');
            expect(result.match.teams[0].foundedAt).toBeInstanceOf(Date);
            expect(result.match.teams[1].foundedAt).toBeInstanceOf(Date);
            expect(result.metadata.createdAt).toBeInstanceOf(Date);
            expect(result.metadata.modifiedAt).toBeInstanceOf(Date);
        });
    });
});
