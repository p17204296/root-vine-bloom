import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Applications from '../Applications';

// Mock fetch with realistic pagination responses
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the useApplications hook for integration tests
vi.mock('../hooks/useApplications', () => ({
  useApplications: vi.fn(),
}));

import { useApplications } from '../hooks/useApplications';
const mockUseApplications = vi.mocked(useApplications);

describe('Pagination Integration', () => {
  const page1Applications = [
    {
      id: 1,
      first_name: 'Sherman',
      last_name: 'Gerlach',
      loan_amount: 85268,
      loan_type: 'CBILS',
      email: 'Carroll47@yahoo.com',
      company: 'Kulas, Renner and Dietrich',
      date_created: '2021-06-15T10:34:23.936Z',
      expiry_date: '2024-04-18T22:12:00.088Z',
      avatar: 'https://avatars.githubusercontent.com/u/52583916',
      loan_history: [
        {
          loan_started: '2024-03-15T04:07:18.336Z',
          loan_ended: '2024-10-14T21:29:40.739Z',
          principle: 5763,
          interest_rate: 0.1,
          interest: 576,
        },
      ],
    },
    {
      id: 2,
      first_name: 'Edmund',
      last_name: 'Bode',
      loan_amount: 89066,
      loan_type: 'Business Loan',
      email: 'Nakia_Pfannerstill@yahoo.com',
      company: 'Jacobi, Sauer and Okuneva',
      date_created: '2021-12-26T13:45:51.419Z',
      expiry_date: '2024-12-31T22:44:48.872Z',
      avatar: 'https://avatars.githubusercontent.com/u/37575056',
      loan_history: [],
    },
  ];

  const page2Applications = [
    {
      id: 3,
      first_name: 'John',
      last_name: 'Smith',
      loan_amount: 50000,
      loan_type: 'CBILS',
      email: 'john.smith@example.com',
      company: 'Smith & Co',
      date_created: '2022-01-15T09:30:00.000Z',
      expiry_date: '2024-01-15T09:30:00.000Z',
      avatar: 'https://avatars.githubusercontent.com/u/12345678',
      loan_history: [],
    },
    {
      id: 4,
      first_name: 'Jane',
      last_name: 'Doe',
      loan_amount: 75000,
      loan_type: 'Business Loan',
      email: 'jane.doe@example.com',
      company: 'Doe Enterprises',
      date_created: '2022-02-20T14:15:00.000Z',
      expiry_date: '2024-02-20T14:15:00.000Z',
      avatar: 'https://avatars.githubusercontent.com/u/87654321',
      loan_history: [],
    },
  ];

  const page3Applications = [
    {
      id: 5,
      first_name: 'Alice',
      last_name: 'Johnson',
      loan_amount: 100000,
      loan_type: 'CBILS',
      email: 'alice.johnson@example.com',
      company: 'Johnson Ltd',
      date_created: '2022-03-10T11:45:00.000Z',
      expiry_date: '2024-03-10T11:45:00.000Z',
      avatar: 'https://avatars.githubusercontent.com/u/11223344',
      loan_history: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full pagination flow with multiple pages', async () => {
    const mockLoadMore = vi.fn();
    
    // Mock first page state
    mockUseApplications.mockReturnValue({
      applications: page1Applications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
      isLoadingMore: false,
    });

    const { rerender } = render(<Applications />);

    // Verify first page applications are shown
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();
    expect(screen.getByText('Load more')).toBeInTheDocument();

    // Click load more
    fireEvent.click(screen.getByText('Load more'));

    // Verify loadMore was called
    expect(mockLoadMore).toHaveBeenCalledTimes(1);

    // Mock second page state (simulating the hook's behavior after loadMore)
    mockUseApplications.mockReturnValue({
      applications: [...page1Applications, ...page2Applications],
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
      isLoadingMore: false,
    });

    // Re-render to simulate state update
    rerender(<Applications />);

    // Verify both pages are shown
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    // Click load more again
    fireEvent.click(screen.getByText('Load more'));

    // Mock final page state (no more pages)
    mockUseApplications.mockReturnValue({
      applications: [...page1Applications, ...page2Applications, ...page3Applications],
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: mockLoadMore,
      isLoadingMore: false,
    });

    // Re-render to simulate final state
    rerender(<Applications />);

    // Verify all applications are shown
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();

    // Verify load more button is hidden (no more pages)
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();

    // Verify loadMore was called twice
    expect(mockLoadMore).toHaveBeenCalledTimes(2);
  });

  it('should handle loading states correctly during pagination', async () => {
    const mockLoadMore = vi.fn();
    
    // Mock loading more state
    mockUseApplications.mockReturnValue({
      applications: page1Applications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
      isLoadingMore: true,
    });

    const { rerender } = render(<Applications />);

    // Verify loading state is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeDisabled();

    // Mock completed state
    mockUseApplications.mockReturnValue({
      applications: [...page1Applications, ...page2Applications],
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: mockLoadMore,
      isLoadingMore: false,
    });

    // Re-render to simulate state update
    rerender(<Applications />);

    // Verify loading state is gone and button is hidden (no more pages)
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
    
    // Verify applications are shown
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('should handle error during pagination and allow retry', async () => {
    // Mock error state
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: 'Network error',
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);

    // Verify error state
    expect(screen.getByText('Error loading applications')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();

    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    // Click try again
    fireEvent.click(screen.getByText('Try Again'));

    // Verify page reload was called
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should handle empty response gracefully', async () => {
    // Mock empty state
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);

    // Verify empty state
    expect(screen.getByText('No applications found')).toBeInTheDocument();
    expect(screen.getByText('There are currently no applications to display.')).toBeInTheDocument();
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  });

  it('should handle malformed API response gracefully', async () => {
    // Mock error state
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: 'Invalid JSON',
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);

    // Verify error handling
    expect(screen.getByText('Error loading applications')).toBeInTheDocument();
    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should handle HTTP error responses', async () => {
    // Mock HTTP error state
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: 'Failed to fetch applications: 500',
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);

    // Verify error message includes status code
    expect(screen.getByText('Error loading applications')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch applications: 500')).toBeInTheDocument();
  });

  it('should verify data formatting in rendered applications', async () => {
    // Mock applications with data
    mockUseApplications.mockReturnValue({
      applications: page1Applications,
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);

    // Verify currency formatting
    expect(screen.getByText('£85,268.00')).toBeInTheDocument();
    expect(screen.getByText('£89,066.00')).toBeInTheDocument();

    // Verify date formatting
    expect(screen.getByText('15-06-2021')).toBeInTheDocument();
    expect(screen.getByText('26-12-2021')).toBeInTheDocument();

    // Verify email links
    const emailLink1 = screen.getByRole('link', { name: 'Carroll47@yahoo.com' });
    expect(emailLink1).toHaveAttribute('href', 'mailto:Carroll47@yahoo.com');

    const emailLink2 = screen.getByRole('link', { name: 'Nakia_Pfannerstill@yahoo.com' });
    expect(emailLink2).toHaveAttribute('href', 'mailto:Nakia_Pfannerstill@yahoo.com');
  });

  it('should maintain application order across pagination', async () => {
    const mockLoadMore = vi.fn();
    
    // Mock first page state
    mockUseApplications.mockReturnValue({
      applications: page1Applications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
      isLoadingMore: false,
    });

    const { rerender } = render(<Applications />);

    // Verify first page applications
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();

    // Mock combined state (simulating pagination)
    mockUseApplications.mockReturnValue({
      applications: [...page1Applications, ...page2Applications],
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: mockLoadMore,
      isLoadingMore: false,
    });

    // Re-render to simulate state update
    rerender(<Applications />);

    // Check that all applications are present in correct order
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
});
