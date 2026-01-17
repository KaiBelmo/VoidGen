import { watch } from 'chokidar';
import { normalize } from 'path';

export const watchFile = (path: string, label: string, onChange: () => void) => {
  const normalizedPath = normalize(path);

  const watcher = watch(normalizedPath, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100 },
  });

  watcher.on('change', () => {
    console.log(`[${normalizedPath}]: ${label} changed, reloading...`);
    onChange();
    console.log(`[${normalizedPath}]: ${label} reloaded`);
  });

  watcher.on('error', console.error);
};
