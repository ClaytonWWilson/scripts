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

### Fix QBar SSD Blurb [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/fix-qbar-ssd-blurb/releases/fix-qbar-ssd-blurb.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/fix-qbar-ssd-blurb.user.js)]

- Fixes the station blurb button on QBar for SSD.

### SortPlan Click-to-copy [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/sortplan-click-to-copy/releases/sortplan-click-to-copy.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/sortplan-click-to-copy.user.js)]

- Adds a button to quickly copy the sort plan values.
- Formatted to paste into DCAP checklist.

### Selectable Replan Text [[Employee Install](https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/selectable-replan-text/releases/selectable-replan-text.user.js?download=true)] [[External Install](https://github.com/ClaytonWWilson/scripts/releases/latest/download/selectable-replan-text.user.js)]

- Makes replan strings selectable, so you're not required to type them out.

### How to Build

```
git clone https://github.com/ClaytonWWilson/scripts.git
cd scripts
```

### Then Build javascript files by running

```
npm install
npm run build
```

or

```
yarn
yarn build
```

or

```
pnpm i
pnpm run build
```

#### Built javascript files will be output to the `out/tampermonkey/` folder
