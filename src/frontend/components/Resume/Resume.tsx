import { useRouter } from 'next/router';
import { useGetSectionQuery } from '../../generated/graphql';
import styles from './Resume.module.css';

interface ResumeProps {}

const Resume: React.FC<ResumeProps> = ({}) => {
  const [{ data: arqData }] = useGetSectionQuery({
    variables: { id: 'arquitectura' },
  });
  const [{ data: desData }] = useGetSectionQuery({
    variables: { id: 'desarrollo' },
  });
  const [{ data: conData }] = useGetSectionQuery({
    variables: { id: 'construccion' },
  });

  const router = useRouter()

  const redirectOnClick = (path) => {
    router.push(path);
  }

  const srcsLoaded =
    typeof arqData?.section.img !== 'undefined' &&
    typeof desData?.section.img !== 'undefined' &&
    typeof conData?.section.img !== 'undefined';

  return (
    <section className={styles.Container}>
      <div className={styles.Article}>
        <img
          srcSet={srcsLoaded ? `${arqData?.section.img}-w300.webp 300w, ${arqData?.section.img}-w600.webp 600w` : null}
          sizes="(max-width: 400px) 300px, 600px"
          alt="Arquitectura"
        />
        <div>
          <h2 onClick={()=>redirectOnClick('arquitectura')}>Arquitectura</h2>
          <div dangerouslySetInnerHTML={{__html: arqData?.section.contenido}}></div>
        </div>
      </div>
      <div className={styles.Article}>
        <img
          srcSet={srcsLoaded ? `${desData?.section.img}-w300.webp 300w, ${desData?.section.img}-w600.webp 600w` : null}
          sizes="(max-width: 400px) 300px, 600px"
          alt="Desarrollo"
        />
        <div>
          <h2 onClick={()=>redirectOnClick('desarrollo')}>Desarrollo</h2>
          <div dangerouslySetInnerHTML={{__html: desData?.section.contenido}}></div>
        </div>
      </div>
      <div className={styles.Article}>
        <img
          srcSet={srcsLoaded ? `${conData?.section.img}-w300.webp 300w, ${conData?.section.img}-w600.webp 600w` : null}
          sizes="(max-width: 450px) 300px, 600px"
          alt="Construcción"
        />
        <div>
          <h2 onClick={()=>redirectOnClick('construccion')}>Construcción</h2>
          <div dangerouslySetInnerHTML={{__html: conData?.section.contenido}}></div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
