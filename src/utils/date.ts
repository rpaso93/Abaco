export const formatDate = (string: string): string => {
  return new Date(string).toLocaleDateString();
};
