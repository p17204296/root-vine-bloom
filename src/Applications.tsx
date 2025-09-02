import SingleApplication from './SingleApplication';
import { Button } from './ui/Button/Button';
import { useApplications } from './hooks/useApplications';
import styles from './Applications.module.css';

const Applications = () => {
  const { 
    applications, 
    isLoading, 
    error, 
    hasMore, 
    loadMore, 
    isLoadingMore 
  } = useApplications();

  if (isLoading) {
    return (
      <div className={styles.Applications}>
        <div className={styles.loadingMessage}>
          Loading applications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.Applications}>
        <div className={styles.errorMessage} role="alert">
          <h2>Error loading applications</h2>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            aria-label="Retry loading applications" className={undefined}          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Applications}>
      {applications.length === 0 ? (
        <div className={styles.emptyMessage}>
          <h2>No applications found</h2>
          <p>There are currently no applications to display.</p>
        </div>
      ) : (
        <>
          {applications.map((application) => (
            <SingleApplication 
              key={application.id} 
              application={application} 
            />
          ))}
          
          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <Button 
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  aria-label={isLoadingMore ? 'Loading more applications' : 'Load more applications'}
                  className={styles.loadMoreButton}
              >
                {isLoadingMore ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications;
