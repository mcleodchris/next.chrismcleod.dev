---
title: 'Some Development Environment Notes'
date: 2021-09-01
categories:
  - work
tags:
  - personal
  - programming
  - notes
  - linux
authors:
  - chris
redirectFrom: ['/2021/09/01/some-development-environment-notes/']
---

Because Docker have changed their licensing and subscription TOS overnight, I've had to rebuild my development environment so it doesn't use Docker Desktop on Windows anymore. What follows are notes I've made along the way on how I got this working on my particular laptop. **This is not a tutorial!** While the notes below might help you, they're mostly a reminder to myself, in case I need to rebuild again, or adapt this into documentation for the rest of the team.

## Docker on WSL

Uninstall Docker Desktop. Make sure WSL2 and a distro are installed and updated, then follow [this guide by Jonathan Bowman](https://dev.to/bowmanjd/install-docker-on-windows-wsl-without-docker-desktop-34m9).

Install `docker-compose`:

```bash
sudo apt-get install docker-compose
```

## Git configuration in WSL

[Setup Git to use your email address and username](https://linuxize.com/post/how-to-configure-git-username-and-email/):

```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@yourdomain.com"
```

Use the Windows Credential Manager, to [share credentials across WSL/Windows](https://code.visualstudio.com/docs/remote/troubleshooting#_sharing-git-credentials-between-windows-and-wsl):

```bash
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/libexec/git-core/git-credential-wincred.exe"
```

## WSL Tweaks

Set the default WSL distro:

```bash
wsl -l --all #list your available distos
wsl --setdefault Ubuntu-20.04
```

Create the file `%USERPROFILE%\.wslconfig`, and add the following:

```ini
[wsl2]
memory=8GB              # How much memory to assign to the WSL2 VM.
processors=4        # How many processors to assign to the WSL2 VM.
```

Adjust the values as necessary. This limits the VMMEM process to a sensible amount of resource usage - it'll consume everything it can otherwise.

Restart WSL:

```bash
wsl --shutdown
```

(Open a new WSL terminal to start it again)

## Windows Terminal Tweaks

To create a command which opens a single tab which is split into four panes, with each pane set to a different service directory, open the settings.json file, and add the following in the commands array:

```json
{
  "command": {
    "action": "wt",
    "commandline": "new-tab -p \"Ubuntu-20.04\" -d \"//wsl$/Ubuntu-20.04/home/chris/dev/graphql\" ; split-pane -V  -p \"Ubuntu-20.04\" -d \"//wsl$/Ubuntu-20.04/home/chris/dev/inbound-service\"; split-pane -H  -p \"Ubuntu-20.04\" -d \"//wsl$/Ubuntu-20.04/home/chris/dev/outbound-service\"; mf left; split-pane -H  -p \"Ubuntu-20.04\" -d \"//wsl$/Ubuntu-20.04/home/chris/dev/front-end\""
  },
  "name": "startdev"
}
```

The network-style [formatting of the starting directory](https://goulet.dev/posts/how-to-set-windows-terminal-starting-directory/) is necessary, otherwise the path won't be parsed properly.

## Other

[Install Node, etc on WSL by following this guide](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm) in the Microsoft docs.

To get [VS Code Remote](https://code.visualstudio.com/docs/remote/wsl) working, open a WSL terminal, then run the following:

```bash
code .
```

This should automatically install the Remote server. Once done, a Remote editor can be opened in Code on the Windows side. Extensions for Remote are managed separately, so install any that are needed, such as Docker, etc.

To have the VS Code Remote window make sure Docker is started when it's opened up, add the following to `~/.vscode-server/server-env-setup` on the WSL side:

```bash
DOCKER_DISTRO="Ubuntu-20.04"
DOCKER_DIR=/mnt/wsl/shared-docker
DOCKER_SOCK="$DOCKER_DIR/docker.sock"
export DOCKER_HOST="unix://$DOCKER_SOCK"
if [ ! -S "$DOCKER_SOCK" ]; then
    mkdir -pm o=,ug=rwx "$DOCKER_DIR"
    chgrp docker "$DOCKER_DIR"
    /mnt/c/Windows/System32/wsl.exe -d $DOCKER_DISTRO sh -c "nohup sudo -b dockerd < /dev/null > $DOCKER_DIR/dockerd.log 2>&1"
fi
```
