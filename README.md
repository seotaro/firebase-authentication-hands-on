# firebase-authentication-hands-on

[ライブデモ](https://fir-authentication-hands.web.app/)

## Hosting setting

```bash
cd app
firebase init

? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm your choices. (Press <space> to select, <a> to 
toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

? What do you want to use as your public directory? build

? Configure as a single-page app (rewrite all urls to /index.html)? (y/N) Yes

? Set up automatic builds and deploys with GitHub? No
? File build/index.html already exists. Overwrite? No
i  Skipping write of build/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!
```

## build

```bash
make build
```

## deploy

```bash
make deploy
```
