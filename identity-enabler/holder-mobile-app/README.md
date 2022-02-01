# Holder Mobile App

## Introduction

The Holder Mobile Application is a reference application that serves as an skeleton to build decentralized identity solutions. Such application offers the usual functionalities for the Holder role i.e. credential management and presentation. 

## Setup

This is a project template for [Svelte](https://svelte.dev) + [CapacitorJS](https://capacitorjs.com) apps with live reload.

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

### Get started

Install the dependencies...

```bash
npm ci
```

### Run local dev server (no capacitor)

```bash
npm run build:dev
npm run start:dev
```

### Develop on your device with livereload (hot reload)

If you're only targeting Android, you only need to change the `server.url` section in `capacitor.config.json` to use `http://10.0.2.2:5001`, since [Android Studio already adds a `localhost` proxy](https://stackoverflow.com/questions/9808560/why-do-we-use-10-0-2-2-to-connect-to-local-web-server-instead-of-using-computer). Just remember to remove it when building your app for production.

If you're targeting iOS or both, you will need to append your workstation IP to the `server.url` section in `capacitor.config.json` instead. To discover your workstation IP, just run `ifconfig` or find it on the network settings.

Tip: Remember you will need the `http://` before the server ip.

Back in the root folder:

```bash
npm run android
```

This will run the capacitor/svelte project with a web view pointing to your workstation's IP.

* You need to have an emulator/device connected to adb
* Your device has to be connected to the same wifi network as your workstation.

### To build a production application:

**Remember to remove the `server.url` in `capacitor.config.json`**

`npm run android`
