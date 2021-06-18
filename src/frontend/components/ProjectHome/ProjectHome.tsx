import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Box from '../Box/Box';
import {
  Project,
  Image,
  useGetProjectsByCatQuery,
  Category,
} from '../../generated/graphql';
import styles from '../../../pagesCss/sections.module.css';
import { useRouter } from 'next/router';
import { getSrcPath, getSrcPathIndex } from '../../../utils/getSrcPath';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import dynamic from 'next/dynamic';
import { formatDate } from '../../../utils/date';
import Head from 'next/head';

const DynamicProjectInterface = dynamic(
  () => import('../ProjectInterface/ProjectInterface')
);

interface ProjectHomeProps {
  category: 'Desarrollo' | 'Construcción';
  withFilters?: boolean;
  activeFilters?: String[];
  setFilters?: Dispatch<SetStateAction<String[]>>;
}

const ProjectHome: React.FC<ProjectHomeProps> = ({
  category,
  withFilters,
  activeFilters,
  setFilters,
}) => {
  const [variables, setVariables] = useState<{
    limit: number;
    cursor: string | null;
  }>({ limit: 12, cursor: null });
  const [{ data }] = useGetProjectsByCatQuery({
    variables: { category, ...variables },
  });
  const [showArrows, setShowArrows] = useState<boolean>(false);
  const [project, setProject] = useState<Project>(null);
  const [currentImg, setImg] = useState<{ path: string; index: number }>(null);
  const [showing, setShowing] = useState<'projects' | 'description'>(null);
  const [descriptionBox, setDescriptionBox] = useState<boolean>(false);
  const router = useRouter();
  const [hover, setHover] = useState(null);
  const [cardHover, setCardHover] = useState(null);
  const onHover = num => {
    setHover(num);
  };

  const onDesaResize = () => {
    const width = window.innerWidth;
    switch (true) {
      case width <= 750:
        setDescriptionBox(true);
        break;
      default:
        setDescriptionBox(false);
        break;
    }
  };

  const handleMouseEnter = () => {
    setShowArrows(true);
  };

  const handleMouseLeave = () => {
    setShowArrows(false);
  };

  const handleChangeProject = (
    _project: {
      __typename?: 'Project';
    } & Pick<Project, 'name' | 'id' | 'description' | 'categories'> & {
        images?: ({
          __typename?: 'Image';
        } & Pick<Image, 'path' | 'id'>)[];
      }
  ) => {
    if (_project.id === project.id) {
      return;
    }
    setProject(_project as any);
    history.pushState({}, `${_project.name} - Ábaco`, `${_project.id}`);
    setImg({
      path:
        _project.images[0].path +
        '/' +
        (_project.images[0] as any).fileName +
        '.webp',
      index: 0,
    });
  };

  const onArrowClick = (num: 1 | -1) => {
    const newIndex = currentImg.index + num;
    if (newIndex < 0 || newIndex > project.images.length - 1) {
      return;
    }
    setImg({
      path:
        project.images[newIndex].path +
        '/' +
        project.images[newIndex].fileName +
        '.webp',
      index: newIndex,
    });
  };

  useEffect(() => {
    const { id } = router.query;
    const selectedProject = data?.projectsByCat.projects.find(
      _project => _project.id === id
    );
    setProject(selectedProject as any);
    setImg({
      path: getSrcPath(selectedProject),
      index: getSrcPathIndex(selectedProject),
    });
    window.addEventListener('resize', onDesaResize, { passive: true });
    onDesaResize();
    return () => {
      window.removeEventListener('resize', onDesaResize);
    };
  }, [data]);
  
  return (
    <LazyMotion features={domAnimation}>
      <Head>
        <title>{project?.name} - Ábaco</title>
        {hover && (
          <link
            rel="preload"
            href={`${project.images[currentImg.index + hover]?.path}/${
              project.images[currentImg.index + hover]?.fileName
            }-w1200.webp`}
            as="image"
          />
        )}
        {cardHover && (
          <link rel="preload" href={`${cardHover}.webp`} as="image" />
        )}
      </Head>
      <m.main
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.2, easings: 'easeInOut' }}
      >
        <section
          style={{
            backgroundImage: !currentImg?.path.includes('undefined')
              ? `url("${currentImg?.path}")`
              : null,
            transition: 'background-image .3s ease-in-out',
          }}
          className={styles.Body}
        >
          <>
            <div className={styles.TopContent}>
              {showing === null && (
                <span>
                  <h1>{project?.name}</h1>
                  <p>
                    Ubicación: <strong>{project?.location}</strong>
                  </p>
                  <p>
                    Superficie: <strong>{project?.surface}m2</strong>
                  </p>
                  <abbr>{formatDate(project?.year)}</abbr>
                </span>
              )}
              {showing !== 'projects' &&
                (!descriptionBox ? (
                  <div
                    style={{ padding: '.5rem', maxWidth: '40%' }}
                    dangerouslySetInnerHTML={{ __html: project?.description }}
                  ></div>
                ) : (
                  <Box
                    labelSide="right"
                    label="Descripción"
                    style={{
                      marginLeft: 'auto',
                    }}
                    show={setShowing}
                    value="description"
                  >
                    <div
                      style={{ padding: '1rem' }}
                      dangerouslySetInnerHTML={{ __html: project?.description }}
                    ></div>
                  </Box>
                ))}
            </div>
            {showing === null && (
              <div className={styles.Arrows}>
                <div
                  className={styles.ArrowContainer}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {(showArrows || descriptionBox) && 0 !== currentImg.index && (
                    <LeftOutlined
                      className={styles.Arrow}
                      onClick={() => onArrowClick(-1)}
                      onMouseOver={() => onHover(-1)}
                      onMouseLeave={() => setHover(null)}
                    />
                  )}
                </div>
                <div
                  className={styles.ArrowContainer}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {(showArrows || descriptionBox) &&
                    project?.images?.length - 1 !== currentImg.index && (
                      <RightOutlined
                        className={styles.Arrow}
                        onClick={() => onArrowClick(1)}
                        onMouseOver={() => onHover(1)}
                        onMouseLeave={() => setHover(null)}
                      />
                    )}
                </div>
              </div>
            )}
            {!descriptionBox && showing === null && (
              <div className={styles.ImgContainer}>
                <div className={styles.ImgScroll}>
                  {project?.images.map((img, index) => {
                    return (
                      <img
                        src={`${img.path}/${img.fileName}-w300.webp`}
                        key={img.id}
                        style={{
                          border:
                            currentImg.path ===
                            img.path + '/' + img.fileName + '.webp'
                              ? '2px solid #E6E6E6'
                              : '',
                          boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.3)',
                        }}
                        onClick={() =>
                          setImg({
                            path: img.path + '/' + img.fileName + '.webp',
                            index,
                          })
                        }
                        onMouseOver={() =>
                          setCardHover(
                            `${project?.images[index]?.path}/${project?.images[index]?.fileName}`
                          )
                        }
                        onMouseLeave={() => setCardHover(null)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
          {showing !== 'description' && (
            <Box
              labelSide="bottom"
              label="ver listado"
              style={{
                margin: '0 auto',
                marginTop: 'auto',
              }}
              show={setShowing}
              value="projects"
            >
              {showing === 'projects' && (
                <DynamicProjectInterface
                  projects={data?.projectsByCat.projects}
                  limit={variables.limit}
                  setVariables={setVariables}
                  hasMore={data?.projectsByCat.hasMore}
                  change={handleChangeProject}
                  currentProject={project?.id}
                  withFilter={withFilters}
                  filters={activeFilters}
                  setFilters={setFilters}
                />
              )}
            </Box>
          )}
        </section>
      </m.main>
    </LazyMotion>
  );
};

export default ProjectHome;

const categoriesToRoute = (categories: Category[]): string => {
  if (
    categories.some(
      cat => cat.name === 'Construcción' || cat.name === 'Arquitectura'
    )
  ) {
    return categories[0].name === 'Construcción'
      ? 'construccion'
      : 'arquitectura';
  }
  return 'desarrollo';
};
