import path from 'path';

export const getFileName = (filepath: string): string => {
  const parsed = path.parse(filepath);
  return path.join(parsed.dir, parsed.name);
};
