---
title: 'Installing Threads on Windows 11'
date: 2023-07-10
categories:
  - general-life
tags:
  - android
  - social-media
  - threads
  - windows-11
  - wsa
authors:
  - chris
redirectFrom: ['/2023/07/10/installing-threads-on-windows-11/']
---

[Threads](https://www.threads.net/@mstrkapowski) is the new social media app on the block; Facebook Meta's long-rumoured Twitter-like service. You've probably heard of it - only 5 days after launch and it [already has 100 million users](https://www.bbc.co.uk/news/technology-66153244). There isn't a web version of Threads yet, much to my chagrin, but if you're on Windows 11 you can use the Windows Subsystem for Android (WSA) and Android Debug Bridge (ADB) to sideload the Android version of the mobile app.

This guide needs Windows 11. You can achieve a similar setup using an emulator on older versions of Windows, but you'll have to find steps for getting the emulator installed elsewhere.

## Windows Subsystem for Android

The easiest way to install the WSA is to install the [Amazon App Store](https://www.microsoft.com/store/productId/9NJHK44TTKSX) from the Microsoft Store. This will prompt you to install WSA first. In all, it took a couple of minutes for me.

Once installed, you'll find Windows Subsystem for Android in the Start Menu

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image.png", "A screenshot of part of the Windows Start Menu, showing an entry for Windows Subsystem for Android" %}

Open the application, and go to the Advanced Settings tab. Turn on Developer Mode

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-1.png", "The Advanced Settings pane of the WSA application, showing Developer Mode is toggled on" %}

In the Developer mode panel, it should say "ADB can be connected on 127.0.0.1:58526". If it doesn't, go to the System tab and click on the Files link. This will start the WSA service and open a file browser (you can close it once loaded).

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-2.png", "The System pane of the WSA application, showing the link to the Files app circled in red" %}

## Android Debug Bridge

The easiest method to install ADB is to use Winget. Open the Windows Terminal/Powershell, and enter the following command:

```
winget install Google.PlatformTools
```

Once complete, close and reopen your terminal. Type `adb devices`. It should return an empty list for now:

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-3.png", "a snippet of the terminal, showing the command 'adb devices' and the output 'List of devices attached' with no devices listed" %}

If you don't get any output, see the troubleshooting section below.

Now that ADB is working, let's connect to our WSA "device":

```
adb connect 127.0.0.1:58526
```

The terminal will respond with "failed to authenticate", but there will also be a pop up asking you to authorise the connection. Click Allow.

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-4.png", "a snippet of the terminal showing the command 'adb connect 127.0.0.1:58526' and the output 'failed to authenticate to 127.0.0.1.58526'" %}

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-5.png", "A Windows dialog box asking 'Allow ADB debugging?' The text 'The computer's RSA key fragment is:' is displayed, with a red line below it, added by the author to obscure the value. There is a checkbox to always allow from this computer, and 2 buttons: Deny and Allow" %}

Once you've allowed the debugging connection, type `adb devices` again. It should list your WSA device.

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-6.png", "a snippet of the terminal, showing the command 'adb devices', and the output 'List of devices attached' with the device 127.0.0.1:58526 listed" %}

With this done, you're all set to install Threads.

## Download and install Threads

Threads isn't on the Amazon App Store, and we can't install the Google Play Store on Windows, so we need to "sideload" the Threads app by using the APK file. Head over to [APK Mirror](https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=threads), and download the latest version (make sure the version you download is verified)

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-7.png", "a partial screenshot of APKMirror, showing the text 'verified safe to install (read more)', a button to 'see available downloads' and a listing of the latest version available to download" %}

Once downloaded, make a note of where you saved the file, and what it was named. Swap back over to the terminal from earlier and enter the `adb install` command using the path and name of the file. Use the tab key to auto-complete as you type. It should look something like this:

```
adb install 'C:\users\mrkap\Downloads\com.instagram.barcelona_291.0.0.28.111-493027109_minAPI28(arm64-v8a)(nodpi)_apkmirror.com.apk'
```

You'll know it's worked when the terminal returns the following

```
Performing Streamed Install
Success
```

Well done, you did it! Threads is now installed. You can find it in the Start Menu, through Windows Search, or by opening the WSA file explorer from earlier, and opening the Apps tab. Once you've opened Threads, you can pin it to the Taskbar like any other application.

{% image "https://assets.chrism.cloud/chrismcleod.dev/2023/07/image-8.png", "a screenshot of Threads running on Windows, with a couple of posts loaded, the Taskbar at the bottom of the screen, and the system wallpaper displayed in the background" %}

So far I haven't found anything which doesn't work, but as this isn't really a "supported setup" (and because Threads is still very new) there may be bugs.

## Troubleshooting

### ADB gives no output after installation/restarting the terminal

I had this issue, which seemed to be caused by the symlink created by Winget to put ADB in your `$PATH` being present but not pointing to anything. To get around this, open `%userprofile%\\AppData\\Local\\Microsoft\\WinGet\\Packages` in Explorer, then find and open the Platform Tools directory. Copy the full path. You can either add this path to your `$PATH` yourself, or `cd` to it in a terminal. If you add it to your `$PATH`, you'll need to restart the terminal. Once done, ADB commands should start working as per the rest of the guide.
