import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Applications from './Applications';
import { useApplications } from './hooks/useApplications';

// Mock the useApplications hook
vi.mock('./hooks/useApplications');
const mockUseApplications = vi.mocked(useApplications);

describe('Applications', () => {
  const mockApplications = [
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: true,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    expect(screen.getByText('Loading applications...')).toBeInTheDocument();
  });

  it('should render applications when loaded', () => {
    mockUseApplications.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    // Check that applications are rendered
    expect(screen.getByText('Kulas, Renner and Dietrich')).toBeInTheDocument();
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Jacobi, Sauer and Okuneva')).toBeInTheDocument();
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();
    
    // Check that Load More button is present
    expect(screen.getByText('Load more')).toBeInTheDocument();
  });

  it('should render error state when fetch fails', () => {
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: 'Network error',
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    expect(screen.getByText('Error loading applications')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should render empty state when no applications', () => {
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    expect(screen.getByText('No applications found')).toBeInTheDocument();
    expect(screen.getByText('There are currently no applications to display.')).toBeInTheDocument();
  });

  it('should call loadMore when Load More button is clicked', () => {
    const mockLoadMore = vi.fn();
    mockUseApplications.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
      isLoadingMore: false,
    });

    render(<Applications />);
    
    const loadMoreButton = screen.getByText('Load more');
    fireEvent.click(loadMoreButton);
    
    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should show loading state on Load More button when loading more', () => {
    mockUseApplications.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      isLoadingMore: true,
    });

    render(<Applications />);
    
    const loadMoreButton = screen.getByText('Loading...');
    expect(loadMoreButton).toBeDisabled();
  });

  it('should not show Load More button when no more pages', () => {
    mockUseApplications.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should reload page when Try Again button is clicked in error state', () => {
    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: 'Network error',
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should render each application with correct key', () => {
    mockUseApplications.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    // Check that both applications are rendered
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();
    
    // Check that companies are rendered
    expect(screen.getByText('Kulas, Renner and Dietrich')).toBeInTheDocument();
    expect(screen.getByText('Jacobi, Sauer and Okuneva')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    mockUseApplications.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    const loadMoreButton = screen.getByLabelText('Load more applications');
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('should have proper accessibility attributes when loading more', () => {
    mockUseApplications.mockReturnValue({
      applications: mockApplications,
      isLoading: false,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      isLoadingMore: true,
    });

    render(<Applications />);
    
    const loadingButton = screen.getByLabelText('Loading more applications');
    expect(loadingButton).toBeInTheDocument();
  });

  it('should have proper accessibility attributes in error state', () => {
    mockUseApplications.mockReturnValue({
      applications: [],
      isLoading: false,
      error: 'Network error',
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
    });

    render(<Applications />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    
    const tryAgainButton = screen.getByLabelText('Retry loading applications');
    expect(tryAgainButton).toBeInTheDocument();
  });
});
