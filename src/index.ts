import type { CliArgs } from './types';
import { JsonDataSource } from './datasource/JsonDataSource';
import { Server } from './server/Server';
import { runCli } from './cli/cli';

export const startApp = ({ file, port }: CliArgs) => {
  console.log(`Starting with file: ${file} on port: ${port}`);
  const dataSource = new JsonDataSource(file);
  const server = new Server(dataSource, port);
  server.start();
};

runCli();
