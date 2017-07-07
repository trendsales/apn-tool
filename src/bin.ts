#!/usr/bin/env node

import * as apn from 'apn';
import * as path from 'path';
import * as yargs from 'yargs';

import install from './install';
import send from './send';

const commands: {[name: string]: (args:string[], options:any) => void} = {
  'install-cert': install,
  send,
};

yargs.command('send', 'send a push notification', (yargs) => {
  yargs.option('device-token', {
    description: 'The device token of the receiver',
    alias: 'd',
  });
  return yargs;
}, () => {
});

yargs.command('install-cert', 'install a certificat');

yargs.option('settings-name', {
  alias: 's',
  default: 'default',
});

yargs.help();

const [command, ...args] = yargs.argv._;

if (commands[command]) {
  const cmd = Promise.resolve(commands[command](args, yargs.argv));
  cmd.catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
