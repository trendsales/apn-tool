# APN Tools

## install

```bash
npm install -g apn-tool
# or
yarn global add apn-tool
```

## Setup

To install a new certificate simply run `apn-tool install-cert ./the-cert.p8`, which will then ask for the key ID and the team ID. After this has been setup the `apn-tool` is good to go.

### Named settings

All commands take an optional `--settings-name` or `-s` argument, for named instances, so if multi setup is required, simply run `apn-tool install-cert ./the-cert.p8 -s demo`. To use this setting afterwards, simply run the command with this setting `apn-tool send -s demo`

## Sending push notifications

You can either send a predefined push notification by passing the path to a JSON file containing the notification as `apn-tool send ./the-file.json`, or specify the parameters ad-hoc using `apn-tool send`, which will ask for the individual informations for the push notification

The device token is supplied either through `--device-token the-token / -d the-token` or using an environment variable named `APN_DEVICE_TOKEN`.
