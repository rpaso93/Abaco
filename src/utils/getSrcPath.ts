export const getSrcPath = (project, width?) => {
  const img =
    typeof project?.portraitId !== 'undefined'
      ? project?.images.find(img => img.id === project.portraitId)
      : project?.images[0];
  const size = 'undefined' !== typeof width ? `-w${width}` : '';
  const src = img?.path + '/' + img?.fileName + size + '.webp';
  return src;
};

export const getSrcPathIndex = project => {
  return project?.portraitId
    ? project?.images.findIndex(img => img.id === project.portraitId)
    : 0;
};
