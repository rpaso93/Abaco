import Card from './Card/Card';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import styles from './ProjectInterface.module.css';
import { AnimatePresence, useElementScroll } from 'framer-motion';
import { Project, Image, useGetCategoriesQuery } from '../../generated/graphql';
import dynamic from 'next/dynamic';

const DynamicFilterList = dynamic(() => import('../FilterList/FilterList'));

interface ProjectInterfaceProps {
  projects: ({
    __typename?: 'Project';
  } & Pick<Project, 'name' | 'id' | 'year' |'description' | 'categories'> & {
      images?: ({
        __typename?: 'Image';
      } & Pick<Image, 'path' | 'id'>)[];
    })[];
  change: (
    project: {
      __typename?: 'Project';
    } & Pick<Project, 'name' | 'id' | 'year' | 'description' | 'categories'> & {
        images?: ({
          __typename?: 'Image';
        } & Pick<Image, 'path' | 'id' | 'fileName'>)[];
      }
  ) => void;
  currentProject: string;
  withFilter?: boolean;
  filters?: String[];
  hasMore?: boolean;
  setVariables?: Dispatch<
    SetStateAction<{
      limit: number;
      cursor: string | null;
    }>
  >;
  limit: number;
  setFilters?: Dispatch<SetStateAction<String[]>>;
  close?: () => void;
}

const ProjectInterface: React.FC<ProjectInterfaceProps> = ({
  projects,
  change,
  currentProject,
  close,
  withFilter,
  filters,
  setFilters,
  hasMore,
  setVariables,
  limit
}) => {
  const [{ data }] = useGetCategoriesQuery();
  const cardLayout = useRef<HTMLDivElement>(null);
  const { scrollY } = useElementScroll(cardLayout);

  useEffect(() => {
    const LoadOnScroll = () => {
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = (scrollY.get() / height) * 100;
      if (scrolled > 75 && hasMore) {
        const projectsLength = projects.length - 1;
        setVariables({
          limit: limit,
          cursor: projects[projectsLength].year,
        });
      }
    };
    scrollY.onChange(LoadOnScroll);
    return () => {
      scrollY.clearListeners();
    };
  }, []);

  return (
    <div
      style={{
        maxHeight: '75vh',
        width: '90vw',
        padding: '10px 3px',
      }}
    >
      {withFilter && (
        <DynamicFilterList
          categories={data?.categories}
          actives={filters}
          setFilters={setFilters}
          noPadding
        />
      )}
      <AnimatePresence presenceAffectsLayout initial={false}>
        <div className={styles.CardsLayout} ref={cardLayout}>
          {projects?.map(project => {
            if (withFilter) {
              return project.categories.some(
                category =>
                  filters.length === 0 || filters.includes(category.id)
              ) ? (
                <Card
                  key={project.id}
                  project={project}
                  onClick={change}
                  close={close}
                  current={project.id === currentProject}
                />
              ) : null;
            } else {
              return (
                <Card
                  key={project.id}
                  project={project}
                  onClick={change}
                  close={close}
                  current={project.id === currentProject}
                />
              );
            }
          })}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ProjectInterface;
