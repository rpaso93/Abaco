export const filterData = (filter: string, data: any[]) => {
  return data.filter(p =>
    Object.keys(p).some(k =>
      String(p[k]).toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    )
  );
};