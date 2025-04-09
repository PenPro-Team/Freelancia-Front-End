import React, { useState } from "react";
import ProjectCard from "../project-card/ProjectCard";
import Search from "../Search/Search";
import FilterJobs from "../FilterJobs/FilterJobs";
import { useTranslation } from 'react-i18next';

export default function Projects(props) {
  const { t } = useTranslation();
  const [isSortedByRecent, setIsSortedByRecent] = useState(false);

  return (
    <div className="container">
      <div className="p-3">
        <div>
          <h2>{t('projects.filter.title')}</h2>
          <Search placeholder={t('projects.search.placeholder')} />
          <div>
            {/* <FilterJobs 
              onSortRecent={() => setIsSortedByRecent(!isSortedByRecent)} 
              isSortedByRecent={isSortedByRecent}
              sortLabel={t('projects.filter.sortBy')}
              recentLabel={t('projects.filter.recent')}
              oldestLabel={t('projects.filter.oldest')}
            /> */}
            <ProjectCard 
              skills={props.skills} 
              jobStates={props.jobStates} 
              priceRange={props.priceRange}
              isSortedByRecent={isSortedByRecent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
