/**
 * Returns true if mock data should be used instead of real API calls.
 * Controlled by NEXT_PUBLIC_ENABLE_MOCK_DATA env variable.
 */
export function useMockData(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "true";
}
