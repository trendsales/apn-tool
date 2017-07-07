import Settings from './settings';
import * as readline from 'readline-sync';

export default ([location]: string[], options: any) => {
  const settings = new Settings(options['settings-name']);
  settings.saveCert(location);
  const keyId = readline.question('key id: ');
  const teamId = readline.question('team id: ');
  const production = readline.question('production [y/N]: ');
  settings.saveOptions({
    token: {
      key: '',
      keyId,
      teamId,
    },
    production: production.toLowerCase() === 'y',
  });
};
