import Settings from './settings';
import * as readline from 'readline-sync';
import * as fs from 'fs';
import { Notification, Provider} from 'apn';

export default async ([file]: string[], options: any) => {
  const settings = new Settings(options['settings-name']);
  settings.validate();
  const deviceToken = options['device-token'] || process.env.APN_DEVICE_TOKEN;
  if (!deviceToken) {
    throw Error('No device token specified');
  }
  let pushMessage: any = {};
  if (file) {
    const raw = fs.readFileSync(file, 'utf-8');
    pushMessage = JSON.parse(raw);
  } else {
    const expiry = readline.question('expire: ');
    pushMessage.expiry = expiry ? expiry : undefined;

    const badge = readline.question('badge: ');
    pushMessage.badge = badge ? parseInt(badge, 10) : undefined;

    const sound = readline.question('sound: ');
    pushMessage.sound = sound ? sound : undefined;


    const alert = readline.question('alert: ');
    pushMessage.alert = alert ? alert : undefined;

    const topic = readline.question('topic: ');
    pushMessage.topic = topic ? topic : process.env.APN_TOPIC;

    const payload = readline.question('payload: ');
    pushMessage.payload = payload ? JSON.parse(payload) : undefined;
  }
  const apnProvider = new Provider(settings.getOptions());
  const push = new Notification(pushMessage.payload);
  push.expiry = pushMessage.expiry;
  push.badge = pushMessage.badge;
  push.sound = pushMessage.sound;
  push.alert = pushMessage.alert;
  push.topic = pushMessage.topic;
  push.payload = pushMessage.payload;
  const responses = await apnProvider.send(push, deviceToken);
  responses.failed.map(({ response }) => {
    console.log(response);
  });
  apnProvider.shutdown();
  console.log(`Push send to ${deviceToken}`);
  process.exit(responses.failed.length > 0 ? 1 : 0);
};
