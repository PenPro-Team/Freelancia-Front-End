import React from 'react'
import ProjectCard from '../project-card/ProjectCard'
import Search from '../Search/Search'
import FilterJobs from '../FilterJobs/FilterJobs'


export default function Projects() {

  return (
    <>
    <div className='container'>
        <div className='p-3'>
            <div>
                <Search />
                <div>
                    <FilterJobs/>
                    <ProjectCard />
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
