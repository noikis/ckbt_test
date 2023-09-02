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
