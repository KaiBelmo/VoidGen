import { Command } from 'commander';
import type { CliArgs } from '@/types/cli';
import { startApp } from '@/index';

const program = new Command();

program
  .name('voidGen')
  .description('A CLI app to mock APIs from data files')
  .option('--file <fileName>', 'File path to data file (e.g., db.json)', 'db.json')
  .option('--port <number>', 'Port to run server', '3030')
  .option('--no-watch', 'disable hot reload (enabled by default)');

program.action(() => {
  const opts = program.opts<CliArgs>();
  opts.port = parseInt(opts.port.toString(), 10);
  startApp(opts);
});

export const runCli = () => {
  program.parse();
};
