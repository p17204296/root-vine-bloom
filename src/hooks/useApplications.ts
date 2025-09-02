import { useState, useEffect, useCallback } from 'react';
import { LoanHistory } from '../types/loan-history.types';

export interface Application {
  id: number;
  first_name: string;
  last_name: string;
  loan_amount: number;
  loan_type: string;
  email: string;
  company: string;
  date_created: string;
  expiry_date: string;
  avatar: string;
  loan_history: Array<LoanHistory>;
}

interface UseApplicationsReturn {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
}

export const useApplications = (): UseApplicationsReturn => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchApplications = useCallback(async (page: number, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await fetch(`http://localhost:3001/api/applications?_page=${page}&_limit=5`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const newApplications: Application[] = await response.json();
      
      // Parse Link header for pagination metadata
      const linkHeader = response.headers.get('Link');
      const hasNextPage = linkHeader?.includes('rel="next"') ?? false;
      
      if (append) {
        setApplications(prev => [...prev, ...newApplications]);
      } else {
        setApplications(newApplications);
      }
      
      setHasMore(hasNextPage);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchApplications(currentPage + 1, true);
    }
  }, [currentPage, hasMore, isLoadingMore, fetchApplications]);

  useEffect(() => {
    fetchApplications(1, false);
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    error,
    hasMore,
    loadMore,
    isLoadingMore,
  };
};
