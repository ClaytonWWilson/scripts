# Tampermonkey Scripts

###### Note: You can download and install Tampermonkey from [here](https://www.tampermonkey.net/index.php)

### MC-Tweaks [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/mc-tweaks/releases/mc-tweaks.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/mc-tweaks.user.js)]

- Shows a desktop notification upon receiving a new task.
- Incoming tasks show flashing colors to draw attention to them.

### Default Wavegroup [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/default-wavegroup/releases/default-wavegroup.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/default-wavegroup.user.js)]

- Automatically selects the most frequently used wave group on the upload demand page.
- Saves two clicks in the routing process.

### Demand Upload Redirect [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/demand-upload-redirect/releases/demand-upload-redirect.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/demand-upload-redirect.user.js)]

- Automatically redirects to the old upload page.
- Saves two clicks in the routing process.

### SortPlan Click-to-copy [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/sortplan-click-to-copy/releases/sortplan-click-to-copy.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/sortplan-click-to-copy.user.js)]

- Adds a button to quickly copy the sort plan values.
- Formatted to paste into DCAP checklist.

### How to Build

```
git clone https://github.com/ClaytonWWilson/scripts.git
cd scripts
```

#### Install Typescript

using npm:

```
npm install typescript --save-dev
```

using yarn

```
yarn add typescript --dev
```

using pnpm

```
pnpm add typescript -D
```

#### Build javascript files

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
