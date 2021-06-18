import { Dispatch, SetStateAction } from 'react';
import Btn from './Btn/Btn';
import styles from './FilterList.module.css';

interface FilterListProps {
  categories: any[];
  actives: String[];
  setFilters: Dispatch<SetStateAction<String[]>>;
  noPadding?: boolean;
}

const FilterList: React.FC<FilterListProps> = ({
  categories,
  actives,
  setFilters,
  noPadding,
}) => {
  const addFilter = (id: string) => {
    setFilters(prevFilters => [...prevFilters, id]);
  };
  const removeFilter = (id: string) => {
    setFilters(prevFilters => prevFilters.filter(filter => filter !== id));
  };

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  return (
    <div className={styles.List} style={{ padding: noPadding ? 0 : null }}>
      {categories
        ?.find(category => category.name === 'Desarrollo')
        ?.subCategories?.map(subCategory => {
          if (subCategory.subCategories.length > 0) {
            return subCategory.subCategories.map(subCategory => {
              const isActive = actives.includes(subCategory.id);
              return (
                <Btn
                  key={subCategory.id}
                  active={isActive}
                  onClick={() =>
                    isActive
                      ? removeFilter(subCategory.id)
                      : addFilter(subCategory.id)
                  }
                >
                  {subCategory.name}
                </Btn>
              );
            });
          } else {
            const isActive = actives.includes(subCategory.id);
            return (
              <Btn
                key={subCategory.id}
                active={isActive}
                onClick={() =>
                  isActive
                    ? removeFilter(subCategory.id)
                    : addFilter(subCategory.id)
                }
              >
                {subCategory.name}
              </Btn>
            );
          }
        })}
    </div>
  );
};

export default FilterList;
