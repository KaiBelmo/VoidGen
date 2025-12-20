import type { CliArgs } from './types';
import { JsonDataSource } from './datasource/JsonDataSource';
import { Server } from './server/Server';
import { runCli } from './cli/cli';

export const startApp = ({ file, port, watch }: CliArgs) => {
  const dataSource = new JsonDataSource(file);
  const server = new Server(dataSource, port, file, watch);
  server.start();
};

runCli();
