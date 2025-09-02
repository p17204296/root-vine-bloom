import React from 'react';
import { render, screen } from '@testing-library/react';
import SingleApplication from './SingleApplication';
import { Application } from './hooks/useApplications';

describe('SingleApplication', () => {
  const mockApplication: Application = {
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
  };

  it('should render application data correctly', () => {
    render(<SingleApplication application={mockApplication} />);
    
    // Check company
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Kulas, Renner and Dietrich')).toBeInTheDocument();
    
    // Check name
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    
    // Check email
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Carroll47@yahoo.com')).toBeInTheDocument();
    
    // Check loan amount
    expect(screen.getByText('Loan amount')).toBeInTheDocument();
    expect(screen.getByText('£85,268.00')).toBeInTheDocument();
    
    // Check application date
    expect(screen.getByText('Application date')).toBeInTheDocument();
    expect(screen.getByText('15-06-2021')).toBeInTheDocument();
    
    // Check expiry date
    expect(screen.getByText('Expiry date')).toBeInTheDocument();
    expect(screen.getByText('18-04-2024')).toBeInTheDocument();
  });

  it('should render email as a clickable link', () => {
    render(<SingleApplication application={mockApplication} />);
    
    const emailLink = screen.getByRole('link', { name: 'Carroll47@yahoo.com' });
    expect(emailLink).toHaveAttribute('href', 'mailto:Carroll47@yahoo.com');
  });

  it('should format currency correctly', () => {
    const applicationWithLargeAmount: Application = {
      ...mockApplication,
      loan_amount: 1234567,
    };

    render(<SingleApplication application={applicationWithLargeAmount} />);
    
    expect(screen.getByText('£1,234,567.00')).toBeInTheDocument();
  });

  it('should format currency correctly for small amounts', () => {
    const applicationWithSmallAmount: Application = {
      ...mockApplication,
      loan_amount: 100,
    };

    render(<SingleApplication application={applicationWithSmallAmount} />);
    
    expect(screen.getByText('£100.00')).toBeInTheDocument();
  });

  it('should format dates correctly', () => {
    const applicationWithDifferentDates: Application = {
      ...mockApplication,
      date_created: '2023-06-15T10:30:00.000Z',
      expiry_date: '2024-03-20T15:45:00.000Z',
    };

    render(<SingleApplication application={applicationWithDifferentDates} />);
    
    expect(screen.getByText('15-06-2023')).toBeInTheDocument();
    expect(screen.getByText('20-03-2024')).toBeInTheDocument();
  });

  it('should format dates correctly with single digit days and months', () => {
    const applicationWithSingleDigitDates: Application = {
      ...mockApplication,
      date_created: '2023-01-05T10:30:00.000Z',
      expiry_date: '2024-02-09T15:45:00.000Z',
    };

    render(<SingleApplication application={applicationWithSingleDigitDates} />);
    
    expect(screen.getByText('05-01-2023')).toBeInTheDocument();
    expect(screen.getByText('09-02-2024')).toBeInTheDocument();
  });

  it('should handle different loan types', () => {
    const applicationWithDifferentLoanType: Application = {
      ...mockApplication,
      loan_type: 'Business Loan',
    };

    render(<SingleApplication application={applicationWithDifferentLoanType} />);
    
    // The loan type is not displayed in the component, but we can verify the component still renders
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
  });

  it('should render with different company names', () => {
    const applicationWithDifferentCompany: Application = {
      ...mockApplication,
      company: 'Jacobi, Sauer and Okuneva',
    };

    render(<SingleApplication application={applicationWithDifferentCompany} />);
    
    expect(screen.getByText('Jacobi, Sauer and Okuneva')).toBeInTheDocument();
  });

  it('should render with different names', () => {
    const applicationWithDifferentName: Application = {
      ...mockApplication,
      first_name: 'Edmund',
      last_name: 'Bode',
    };

    render(<SingleApplication application={applicationWithDifferentName} />);
    
    expect(screen.getByText('Edmund Bode')).toBeInTheDocument();
  });

  it('should render with different email addresses', () => {
    const applicationWithDifferentEmail: Application = {
      ...mockApplication,
      email: 'Nakia_Pfannerstill@yahoo.com',
    };

    render(<SingleApplication application={applicationWithDifferentEmail} />);
    
    const emailLink = screen.getByRole('link', { name: 'Nakia_Pfannerstill@yahoo.com' });
    expect(emailLink).toHaveAttribute('href', 'mailto:Nakia_Pfannerstill@yahoo.com');
  });

  it('should handle zero loan amount', () => {
    const applicationWithZeroAmount: Application = {
      ...mockApplication,
      loan_amount: 0,
    };

    render(<SingleApplication application={applicationWithZeroAmount} />);
    
    expect(screen.getByText('£0.00')).toBeInTheDocument();
  });

  it('should handle negative loan amount', () => {
    const applicationWithNegativeAmount: Application = {
      ...mockApplication,
      loan_amount: -1000,
    };

    render(<SingleApplication application={applicationWithNegativeAmount} />);
    
    expect(screen.getByText('-£1,000.00')).toBeInTheDocument();
  });

  it('should handle invalid date strings gracefully', () => {
    const applicationWithInvalidDates: Application = {
      ...mockApplication,
      date_created: 'invalid-date',
      expiry_date: 'another-invalid-date',
    };

    render(<SingleApplication application={applicationWithInvalidDates} />);
    
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Kulas, Renner and Dietrich')).toBeInTheDocument();
  });

  it('should render all required labels', () => {
    render(<SingleApplication application={mockApplication} />);
    
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Loan amount')).toBeInTheDocument();
    expect(screen.getByText('Application date')).toBeInTheDocument();
    expect(screen.getByText('Expiry date')).toBeInTheDocument();
  });

  it('should have proper structure with all cells', () => {
    render(<SingleApplication application={mockApplication} />);
    
    // Check that all data values are present
    expect(screen.getByText('Kulas, Renner and Dietrich')).toBeInTheDocument();
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
    expect(screen.getByText('Carroll47@yahoo.com')).toBeInTheDocument();
    expect(screen.getByText('£85,268.00')).toBeInTheDocument();
    expect(screen.getByText('15-06-2021')).toBeInTheDocument();
    expect(screen.getByText('18-04-2024')).toBeInTheDocument();
  });

  it('should handle empty loan history', () => {
    const applicationWithEmptyLoanHistory: Application = {
      ...mockApplication,
      loan_history: [],
    };

    render(<SingleApplication application={applicationWithEmptyLoanHistory} />);
    
    // Should still render normally
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
  });

  it('should handle multiple loan history entries', () => {
    const applicationWithMultipleLoans: Application = {
      ...mockApplication,
      loan_history: [
        {
          loan_started: '2024-03-15T04:07:18.336Z',
          loan_ended: '2024-10-14T21:29:40.739Z',
          principle: 5763,
          interest_rate: 0.1,
          interest: 576,
        },
        {
          loan_started: '2023-01-01T00:00:00.000Z',
          loan_ended: '2023-12-31T23:59:59.999Z',
          principle: 10000,
          interest_rate: 0.05,
          interest: 500,
        },
      ],
    };

    render(<SingleApplication application={applicationWithMultipleLoans} />);
    
    expect(screen.getByText('Sherman Gerlach')).toBeInTheDocument();
  });
});
