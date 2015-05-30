#COLLABORATIVE GARBAGE DISPOSAL

<!--- This README is written using Markdown syntax. To correctly visualize it use a suitable editor (for ex. http://dillinger.io/) --->

Enhanced version of the application "[100% Rifiuti](https://github.com/smartcommunitylab/sco.riciclo/tree/master/mobile)" by Smart Community Lab - Trento.

## Using this project

To use this code we recommend to use the `ionic` framework, a front-end SDK for developing hybrid mobile apps ([click here](http://forum.ionicframework.com/) for more information).

To install `ionic` framework run:
```bash
$ sudo npm install -g cordova ionic
```
Warning: you must have a runnning version of `npm` on your computer

To run our project locally on your browser move to the folder where you have downloaded the project and run:
```bash
$ ionic serve
```

## Built the application
####Android
Prerequisite: [Android SDK](http://www.android.com/) (is needed only the "Software Development Kit" tool)

To create in the project all files and folders needed to build the Android app, run in your project folder:
```bash
$ ionic platform add android
```
To build the application and run it on a mobile device connected via USB, run in your project folder:
```bash
$ ionic run android
```
Warning: you must enable the "Developing mode" in the mobile device.

Once having done it, you can find the .apk executable file in platforms/android/ant-build/MainActivity-debug.apk

####iOS
Prerequisite: you need to work on a MAC and have a running version of X-Code installed.

To create in the project all files and folders needed to build the iOS app, run in your project folder:
```bash
$ ionic platform add ios
```
To build the application and run it on a mobile device connected via USB, run in your project folder:
```bash
$ ionic run ios
```
Warning: you must enable the "Developing mode" in the mobile device.

####Other platforms
To visualize all platforms supported by your system, run:
```bash
$ ionic platform list
```
Warning: our code was tested only on Android and iOS, no guarantees for other platforms.