import { renderHook, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { useApplications } from "./useApplications";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useApplications", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should fetch initial applications on mount", async () => {
    const mockApplications = [
      {
        id: 1,
        first_name: "Sherman",
        last_name: "Gerlach",
        loan_amount: 85268,
        loan_type: "CBILS",
        email: "Carroll47@yahoo.com",
        company: "Kulas, Renner and Dietrich",
        date_created: "2021-06-15T10:34:23.936Z",
        expiry_date: "2024-04-18T22:12:00.088Z",
        avatar: "https://avatars.githubusercontent.com/u/52583916",
        loan_history: [
          {
            loan_started: "2024-03-15T04:07:18.336Z",
            loan_ended: "2024-10-14T21:29:40.739Z",
            principle: 5763,
            interest_rate: 0.1,
            interest: 576,
          },
        ],
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApplications,
      headers: {
        get: (header: string) =>
          header === "Link"
            ? '<http://localhost:3001/api/applications?_page=2&_limit=5>; rel="next"'
            : null,
      },
    });

    const { result } = renderHook(() => useApplications());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.applications).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.applications).toEqual(mockApplications);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.applications).toEqual([]);
  });

  it("should load more applications when loadMore is called", async () => {
    const initialApplications = [
      {
        id: 1,
        first_name: "Sherman",
        last_name: "Gerlach",
        loan_amount: 85268,
        loan_type: "CBILS",
        email: "Carroll47@yahoo.com",
        company: "Kulas, Renner and Dietrich",
        date_created: "2021-06-15T10:34:23.936Z",
        expiry_date: "2024-04-18T22:12:00.088Z",
        avatar: "https://avatars.githubusercontent.com/u/52583916",
        loan_history: [],
      },
    ];

    const moreApplications = [
      {
        id: 2,
        first_name: "Edmund",
        last_name: "Bode",
        loan_amount: 89066,
        loan_type: "Business Loan",
        email: "Nakia_Pfannerstill@yahoo.com",
        company: "Jacobi, Sauer and Okuneva",
        date_created: "2021-12-26T13:45:51.419Z",
        expiry_date: "2024-12-31T22:44:48.872Z",
        avatar: "https://avatars.githubusercontent.com/u/37575056",
        loan_history: [],
      },
    ];

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => initialApplications,
      headers: {
        get: (header: string) =>
          header === "Link"
            ? '<http://localhost:3001/api/applications?_page=2&_limit=5>; rel="next"'
            : null,
      },
    });

    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Mock second fetch for loadMore
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => moreApplications,
      headers: {
        get: (header: string) => null, // No more pages
      },
    });

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.isLoadingMore).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.applications).toEqual([
      ...initialApplications,
      ...moreApplications,
    ]);
    expect(result.current.hasMore).toBe(false);
  });

  it("should not load more when already isLoading or no more pages", async () => {
    const mockApplications = [
      {
        id: 1,
        first_name: "Sherman",
        last_name: "Gerlach",
        loan_amount: 85268,
        loan_type: "CBILS",
        email: "Carroll47@yahoo.com",
        company: "Kulas, Renner and Dietrich",
        date_created: "2021-06-15T10:34:23.936Z",
        expiry_date: "2024-04-18T22:12:00.088Z",
        avatar: "https://avatars.githubusercontent.com/u/52583916",
        loan_history: [],
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApplications,
      headers: {
        get: (header: string) => null, // No more pages
      },
    });

    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);

    // Should not make additional fetch calls
    const initialCallCount = mockFetch.mock.calls.length;
    act(() => {
      result.current.loadMore();
    });
    expect(mockFetch.mock.calls.length).toBe(initialCallCount);
  });
});
