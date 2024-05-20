---
title: Creating a Remote Dev Machine with Raspberry Pi and VS Code
date: 2024-05-20T08:47Z
tags:
  - software-engineering
  - raspberry-pi
  - vs-code
---
I recently came into possession of a Raspberry Pi 5B, and was trying to figure out what to do with it. I came across this article by Jim Bennett on [setting up a headless Raspberry Pi 4 as a headless development machine](https://www.raspberrypi.com/news/coding-on-raspberry-pi-remotely-with-visual-studio-code/), and it got the cogs turning.

My "development environment" on my personal laptop is a bit of a mess; I have been doing a lot of certifications and other learning over the last couple of years, so I have installed a lot of random tools and cloned a lot of repositories. With this much churn, stuff breaks all the time. I had to move my blog's development environment into a Devcontainer because one day it just stopped building locally. So I had a thought - why not keep the laptop for learning (and writing), but move all of my actual projects onto a dedicated machine?

I don't need such a machine to be particularly powerful - fast storage and networking that lets it be accessible from anywhere, and enough horsepower to run VS Code plus the occasional container. Ideally quiet. That's where the Pi comes in.

To set things up as I did, you will need:
- A Raspberry Pi 5B + a means of powering it
- Pimoroni NVMe Base + suitable NVMe SSD (I have 512GB)
- MicroSD card for the initial OS install
- Microsoft or GitHub account

The steps below assume you have assembled all of the hardware according to [the instructions](https://learn.pimoroni.com/article/getting-started-with-nvme-base).

## Step 1: Setup your MicroSD card with Raspberry Pi Imager
[Raspberry Pi Imager](https://www.raspberrypi.com/software/) is the easiest way to get started. It will create a bootable installation of Raspberry Pi OS (a variant of Debian) on the MicroSD card. You can even pre-configure it with Wi-Fi details, username, password + an SSH key. I highly recommend you set these up before booting your Pi, as it means you never have to plug any peripherals into the Pi to get everything else setup.

## Step 2: Boot the Pi and do initial prep
Put your preconfigured MicroSD into the slot on the Pi, and power it on. The Pi might restart once or twice, but it should be ready to go in about 30-45 seconds. Open a terminal and connect to it using SSH:

```bash
ssh chris@raspberrypi.local
```

If you setup a SSH key then you'll probably need to enter the passphrase, otherwise it will prompt you for the account password. Once logged in, run an initial system update:

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

While we're at it, we'll check our NVMe SSD is connected correctly:

```bash
ls /dev/nvme0
```

If this repeats the name of the device back to you, then it's all good. If not, re-check everything is connected together properly.

### Optional: Install + Configure Raspberry Pi Connect
[Raspberry Pi Connect](https://www.raspberrypi.com/documentation/services/connect.html) is an in-beta service that lets you connect to the Pi's desktop from any web browser. I set it up as a fallback, as I didn't know if I might later need to access the desktop.

[Create a Raspberry Pi ID](https://www.raspberrypi.com/documentation/services/id.html#create-a-raspberry-pi-id), then proceed with the installation:

```bash
sudo apt install rpi-connect
```

When installation is finished, reboot with `sudo reboot`.

Once the Pi is back online, connect it to your Raspberry Pi ID:

```bash
rpi-connect signin
```

This will prompt you to visit a URL in a web browser and sign in to your account.

Once completed you can access your Pi desktop from [https://connect.raspberrypi.com/](https://connect.raspberrypi.com/)

## Step 3: Transfer the installation to the SSD
We could, *in theory* continue to boot from the MicroSD card, and just set the SSD as storage. This would work, but the overall performance will be much slower, in my experience. It's better to move everything over to the SSD and boot from that.

You could also setup the SSD fresh using Raspberry Pi Imager on the Pi, but you'd have to repeat all of the previous setup steps again. So I think it's better to transfer (or, more accurately, clone) the MicroSD instead. It's super quick and painless. You can do this in one of 2 ways: use the SD Card Copier software from the Pi desktop, or run the following command:

```bash
sudo dd if=/dev/mmcblk0 of=/dev/nvme0n1 status=progress
```

I used the SD Card Copier, simply because I still had the Raspberry Pi Connect session open.

If you're not sure, [check this section of the instructions](https://learn.pimoroni.com/article/getting-started-with-nvme-base#os-installation-options) for the NVMe Base.

Once the copy is complete, **remove the MicroSD card** and reboot again. You should find your Pi is accessible in less than half the time it previously was.

## Step 4: Prepare Remote Tunnelling
SSH back onto your Pi. Install Visual Studio Code[^1]:

```bash
sudo apt install code
```

Once done, start a tunnel:

```bash
code tunnel
```

You'll need to accept some terms and login to either a Microsoft or GitHub account by following the prompts on-screen. If you leave everything as-is, you will now have a tunnel named "raspberrypi".

## Step 5:  Connect Visual Studio Code
On your regular computer (not the Pi), open VS Code. Install the[ Remote - Tunnels extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-server). Once installed, open the Command Palette (`F1`) and type `Remote Tunnel`. You should see an option to connect. Select this option. You might be asked to authorise the connection using GitHub or Microsoft - use whichever you picked in the previous step, and login if required. Once authorised you should see a list of your available tunnels, which should include your new "raspberrypi" tunnel. Select the tunnel and let VS Code connect (it shouldn't take long).

From here, you can do everything you normally would in VS Code - open folders/workspaces, start a terminal, and work on files as you would on your local computer. You can even install extensions

From a computer without VS Code natively installed you can use [https://vscode.dev/](https://vscode.dev/) instead - you'll just need to authorise the connection with the same account as earlier.

If you get stuck at any point, [refer to the Remote Tunnels documentation](https://code.visualstudio.com/docs/remote/tunnels).

### Optional (recommended): Set the Remote Tunnel to connect whenever the Pi restarts
By default, the Remote Tunnel won't be available when the Pi restarts, or you close the SSH connection you started it from. To fix this, you need to set it up in service mode. If you're still connected to the Pi, and the tunnel is currently running, press `Ctrl + C` to stop the process (this will disconnect any remote sessions). Run the following command to start the tunnel as a service:

```bash
code tunnel service install
```

## What about SSH?
This guide used Remote Tunnels, but you can easily swap to using SSH for remote connections. [Just use the Remote - SSH extension instead](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh). You'll need to use the same login method as you would a regular SSH connection though - so if your Raspberry Pi is setup to only allow SSH keys, you'll need to copy your private key to every machine you want to connect from. Personally, I didn't want to do that from e.g. my work laptop, so that's why I'm using Tunnels instead, but use whatever works best for you!

[^1]: You can install [just the CLI component](https://code.visualstudio.com/docs/remote/tunnels#_using-the-code-cli) if you want, but I installed the full client in case I ever want to edit files directly on the Pi