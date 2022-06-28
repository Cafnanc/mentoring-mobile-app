# How to Build the MentorED Mobile Application

This readme file summarizes the system requirements and dependencies for building and using the <b>MentorED Mobile Application</b>, which is one of the key components of the <b>MentorED Platform</b>.

The mobile application is written using the Ionic framework and also uses the Capacitor runtime which makes it easy to run apps across mobile and Web platforms.  

## Key Components in the Development Environment 
- Ionic-Android Build Setup
- Command Line Interface (<b>CLI</b>) Setup
- Ionic Project Setup
- Production Binary: <b>Build apk </b>
- Test Binary: <b>Debug apk</b>

## Dependencies

| Requirement         | Description    |
|--------------|-----------|
| Ionic CLI | Version 6.19.1 (/usr/local/lib/node_modules/@ionic/cli) |
| Ionic Framework | <ul><li>@ionic/angular 6.1.7 </li> <li>@angular-devkit/build-angular : 13.2.6 </li><li> @angular-devkit/schematics : 13.2.6 </li><li>@angular/cli : 13.2.6 </li><li> @ionic/angular-toolkit : 6.1.0 </li></ul> |
| Capacitor | <ul><li>Capacitor CLI : 3.5.1 </li><li>@capacitor/android : 3.5.0 </li><li>@capacitor/core : 3.5.1 </li><li>@capacitor/ios : 3.5.0</li></ul>
| Cordova | <ul><li>Cordova CLI : 11.0.0</li><li>Cordova Platforms : none</li><li>Cordova Plugins : no whitelisted plugins (0 plugins total)</li></ul>
| Utility | <ul><li>cordova-res : 0.15.4</li><li>native-run : 1.6.0</li></ul>
| System | <ul><li>Android SDK Tools: 26.1.1 (/home/afnan/Android/Sdk) </li><li>NodeJS: v14.19.0 (/usr/local/bin/node) </li><li>npm: 6.14.16 </li><li>OS: Linux 5.13</li></ul>

IONIC-ANDROID BUILD SETUP
1. Install Java (see https://www.oracle.com/java/technologies/downloads/#java8 for detailed instructions).

2. Install Gradle (see https://gradle.org/install/ for detailed instructions).

3. Install Android Studio (see https://developer.android.com/studio for detailed instructions)

4. Install Android SDK

    - Open Android studio 
    - Go to **Settings** > **Appearance and Behavior** > **System Settings** > **Android SDK**.
    - Install the appropriate Android SDK platform package.

5. Add environment variables in ~/.bashrc or ~/.bash_profile as follows:

    `export ANDROID_SDK_ROOT=path_to_sdk export` `PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin export` `PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools`

Reference: https://ionicframework.com/docs/installation/android

## Setting up the Command Line Interface (CLI)

` npm install -g ionic`
` npm install @capacitor/core`
` npm install @capacitor/cli --save-dev` 
` npx cap init` 

## PROJECT SETUP
git clone the repo (https://github.com/ELEVATE-Prjoect/mentoring-mobile-app.git)
Add environment files inside src/environments
Go to project folder and run npm i

## BUILD APK
To check attached devices 
1. Type  adb devices
2. Run `ionic build` (Make sure you have attached device)
3. Run `ionic cap sync`
4. Run `ionic capacitor` 
5. Run `android --prod`
6. Specify the apk location `project_folder/platforms/android/app/build/outputs/apk/debug/apk_name.apk`
7. Open chrome and type `chrome://inspect`
8. Select app