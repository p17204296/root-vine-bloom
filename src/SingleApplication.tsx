import React from 'react';
import { Application } from './hooks/useApplications';
import styles from './SingleApplication.module.css';

interface SingleApplicationProps {
  application: Application;
}

const SingleApplication: React.FC<SingleApplicationProps> = ({ application }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className={styles.SingleApplication}>
      <div className={styles.cell}>
        <sub>Company</sub>
        <span className={styles.dataValue}>{application.company}</span>
      </div>
      <div className={styles.cell}>
        <sub>Name</sub>
        <span className={styles.dataValue}>{application.first_name} {application.last_name}</span>
      </div>
      <div className={styles.cell}>
        <sub>Email</sub>
        <a href={`mailto:${application.email}`} className={styles.emailLink}>
          {application.email}
        </a>
      </div>
      <div className={`${styles.cell} ${styles.loanAmountValue}`}>
        <sub>Loan amount</sub>
        <span className={`${styles.dataValue} ${styles.loanAmountValue}`}>{formatCurrency(application.loan_amount)}</span>
      </div>
      <div className={styles.cell}>
        <sub>Application date</sub>
        <span className={styles.dataValue}>{formatDate(application.date_created)}</span>
      </div>
      <div className={styles.cell}>
        <sub>Expiry date</sub>
        <span className={styles.dataValue}>{formatDate(application.expiry_date)}</span>
      </div>
    </div>
  );
};

export default SingleApplication;