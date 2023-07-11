# Tampermonkey Scripts

### MC-Tweaks [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/mc-tweaks/releases/mc-tweaks.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/mc-tweaks.user.js)]

- Shows a desktop notification upon receiving a new task.
- Incoming tasks show flashing colors to draw attention to them.

###### Note: You can download and install Tampermonkey from [here](https://www.tampermonkey.net/index.php)

### How to Build

```
git clone https://github.com/ClaytonWWilson/scripts.git
cd scripts
```

#### Install Typescript

using npm:

```
npm install
npx tsc
```

using yarn:

```
yarn
yarn tsc
```

using pnpm:

```
pnpm i
pnpm tsc
```

#### Built javascript files will be output to the `dist/tampermonkey/` folder
