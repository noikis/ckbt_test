import { CategoryAttributeType, CategorySortType, SortType } from 'src/types';

export const onlyLatinRegex = /^[A-Za-z0-9]/;

export const spaceToHyphen = (str: string) => str.replace(/\s+/g, '-');

export const generateNumbersStringified = (length: number) => {
  return Array.from({ length }, (_, i) => (i + 1).toString());
};

export const changeCyrilicE = (str: string) => {
  if (!str.includes('ё')) {
    return str;
  } else {
    return str.replaceAll('ё', 'e');
  }
};

const isCategoryAttribute = (attr: string): attr is CategoryAttributeType => {
  const categoryAtts: CategoryAttributeType[] = [
    'id',
    'name',
    'description',
    'slug',
    'active',
    'createdAt',
  ];

  return categoryAtts.includes(attr as CategoryAttributeType);
};

export const sortByCategory = (value: string): CategorySortType => {
  let order: SortType;
  let attribute: string;
  if (value.startsWith('-')) {
    order = 'DESC';
    attribute = value.split('-')[1];
  } else {
    order = 'ASC';
    attribute = value;
  }

  if (isCategoryAttribute(attribute)) {
    return { attribute, order };
  } else {
    return { attribute: 'createdAt', order: 'DESC' };
  }
};
