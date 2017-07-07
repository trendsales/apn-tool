import * as path from 'path';
import * as fs from 'fs';
import IToken from './itoken';
import IOptions from './ioptions';
import * as mkdirp from 'mkdirp';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

class Settings {
  private _settingsName: string;

  constructor(name: string = 'default') {
    this._settingsName = name;
  }

  private get basePath() {
    return path.join(__dirname, '../settings', this._settingsName);
  }

  private get settingsPath() {
    return path.join(this.basePath, 'settings.json');
  }

  private get keyPath() {
    return path.join(this.basePath, 'key.p8');
  }

  public validate() {
    console.log('Using settings: ' + this._settingsName);
    if (!fs.existsSync(this.basePath)) {
      throw Error('No certificate installed');
    }
    if (!fs.existsSync(this.settingsPath)) {
      throw Error('No settings found');
    }
    const settings = this.getOptions();
    if (!settings.token.keyId) {
      throw Error('No key ID found');
    }
    if (!settings.token.teamId) {
      throw Error('No team ID found');
    }
  }

  getOptions(): IOptions {
    const settingsRaw = fs.readFileSync(this.settingsPath, 'utf-8');
    const settings = JSON.parse(settingsRaw) as IOptions;
    settings.token.key = this.keyPath;
    return settings;
  }

  saveOptions(options:IOptions) {
    mkdirp.sync(this.basePath);
    fs.writeFileSync(this.settingsPath, JSON.stringify(options), 'utf-8');
  }

  saveCert(path: string) {
    mkdirp.sync(this.basePath);
    fs.createReadStream(path).pipe(fs.createWriteStream(this.keyPath));
  }
}

export default Settings;
