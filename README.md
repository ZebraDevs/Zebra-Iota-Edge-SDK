# zebra-iota-edge-sdk

<h2 align="center">Zebra-IOTA Edge SDK</h2>

<p align="center">
 <a href="https://iota.stackexchange.com/" style="text-decoration:none;"><img src="https://img.shields.io/badge/StackExchange-9cf.svg?logo=stackexchange" alt="StackExchange"></a>
    <a href="https://github.com/ZebraDevs/zebra-iota-edge-sdk/blob/master/LICENSE" style="text-decoration:none;"><img src="https://img.shields.io/github/license/ZebraDevs/zebra-iota-edge-sdk.svg" alt="MIT license"></a>
</p>
      
<p align="center">
  <a href="#about">About</a> ◈
  <a href="#prerequisites">Prerequisites</a> ◈
  <a href="#getting-started">Getting started</a> ◈
  <a href="#supporting-the-project">Supporting the project</a> ◈
  <a href="#joining-the-discussion">Joining the discussion</a>
</p>

---

## About

This SDK allows building applications with Zebra Devices in combination with the [IOTA](https://wiki.iota.org) Distributed Ledger Technology. It is composed of the following modules:

* **[Identity Enabler](./identity-enabler)**. Provides all the scaffolding structured around reference applications that facilitate the creation of solutions that exploit [IOTA  Decentralized Identities](https://files.iota.org/comms/IOTA_The_Case_for_a_Unified_Identity.pdf) in different domains (Personal identity and health passports, Organizational Identities and Device Identities in the Global Trade and Supply Chain domain).

* **EPCIS 2.0 Enabler**. Adds the capability to record [GS1 EPCIS 2.0](https://github.com/gs1/EPCIS) events directly from Zebra Devices. Those events can be stored on distributed datastores and anchored immutably to the IOTA Distributed Ledge. As a result, supply chain participants, in combination with the Identity Enabler, can share authenticated, trusted, verifiable and immutable data about business processes. *(This enabler will come out in Q2 2022)*.

## Prerequisites

The SDK uses Web Technologies for the user interface of the reference applications. In particular, the applications are coded in TypeScript, using the [Svelte](https://svelte.dev/) framework. To package the Web Applications as Android applications, the [Capacitor](https://capacitorjs.com/) framework is used. That means that you can run these applications in your local browser as Web Applications or in your Android device or emulator.

Specific prerequisites are:

* [Node.js](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
* [Android Studio](https://developer.android.com/studio) and related Android development tools such as [adb](https://developer.android.com/studio/command-line/adb).
* Ideally a Zebra Device with DataWedge such as the [TC21](https://www.zebra.com/gb/en/products/mobile-computers/handheld/tc21-tc26.html).
* [DataWedge](https://techdocs.zebra.com/datawedge/11-1/guide/about/) profiles for the reference applications. You can download and import them from [here](./test/datawedge/datawedge.db).

## Getting started

For the Identity Enabler go to the [identity-enabler](./identity-enabler) folder and there you will find three different mobile applications:

* *Holder Application* which allows generating and presenting credentials using data matrix codes.
* *Verifier Application* which allows verifying credentials.
* *Device Onboarding Application* which allows to onboard devices and assign decentralized identities.

If you want to run the applications as Android application, for instance the Holder application, you just need to:

```console
cd holder-mobile-app
npm install
npm run android
```

Afterwards the Web application code will be compiled and generated. Then, ff your Android Studio is present and configured on your local machine automatically a new project with the application will be open. You can then compile and run your Android application.

If you want to run the applications as local Web application, for instance the Verifier Application, you just need to:

```console
cd verifier-mobile-app
npm install
npm run build
npm run start:dev
```

Then open your browser on `http://localhost:5001` for the Holder App, `http://localhost:5002` for the Verifier App, and `http://localhost:5003` for the Device ID App.

The applications are optimized for working with the native scanning capabilities of Zebra devices (Camera Scanner or 2D Barcode Scanner). However you can also use a regular Android's device camera or PC camera provided it has a good resolution. 

## Supporting the project

If this project has been useful to you and you feel like contributing, consider submitting a [bug report](https://github.com/ZebraDevs/zebra-iota-edge-sdk/issues/new), [feature request](https://github.com/ZebraDevs/zebra-iota-edge-sdk/issues/new) or a [pull request](https://github.com/ZebraDevs/zebra-iota-edge-sdk/pulls/).

## Joining the discussion

If you want to get involved in the community, need help with getting set up, have any issues or just want to discuss IOTA, Distributed Ledger Technology (DLT), and Zebra Technologies with other people, feel free to join our [Discord](https://discord.iota.org/).
