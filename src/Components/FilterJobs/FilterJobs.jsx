import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function FilterJobs({ onSortRecent, isSortedByRecent }) {
  const { t } = useTranslation();

  return (
    <>
      <ul className='list-unstyled list-inline'>
        <li className='list-inline-item'>
          <Button variant="primary" onClick={onSortRecent} style={{ marginBottom: "15px" }}>
            {isSortedByRecent ? t('projects.filter.resetOrder') : t('projects.filter.sortByRecent')}
          </Button>
        </li>
        <li className='list-inline-item'>
          <Button variant="primary" style={{ marginBottom: "15px" }}>
            {t('projects.filter.recommendedJobs')}
          </Button>
        </li>
      </ul>
      <hr />
    </>
  );
}
