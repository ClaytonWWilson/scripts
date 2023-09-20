import type { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import metablock from "rollup-plugin-userscript-metablock";

const userscriptFiles = [
  "autoct.user.ts",
  "gotham.user.ts",
  "default-wavegroup.user.ts",
  "demand-upload-redirect.user.ts",
  "mc-tweaks.user.ts",
  "sortplan-click-to-copy.user.ts",
];

const buildUserscriptConfig = (): RollupOptions[] => {
  return userscriptFiles.flatMap((file) => {
    const fileBaseName = file.slice(0, file.search(/.user.ts$/));
    return [
      {
        // For uploading to github
        input: `tamper-monkey/${file}`,
        output: {
          file: `out/tamper-monkey/public/${fileBaseName}.user.js`,
          format: "iife",
          sourcemap: true,
        },
        plugins: [
          typescript(),
          metablock({
            file: `tamper-monkey/${fileBaseName}.user.meta.js`,
            override: {
              updateURL: `https://github.com/ClaytonWWilson/scripts/releases/latest/download/${fileBaseName}.user.js`,
              downloadURL: `https://github.com/ClaytonWWilson/scripts/releases/latest/download/${fileBaseName}.user.js`,
            },
          }),
        ],
      },
      {
        // For uploading internally
        input: `tamper-monkey/${file}`,
        output: {
          file: `out/tamper-monkey/internal/${fileBaseName}.user.js`,
          format: "iife",
          sourcemap: true,
        },
        plugins: [
          typescript(),
          metablock({
            file: `tamper-monkey/${fileBaseName}.user.meta.js`,
            override: {
              updateURL: `https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/${fileBaseName}/releases/${fileBaseName}.user.js?download=true`,
              downloadURL: `https://drive.corp.amazon.com/view/eclawils@/public/scripts/central-ops/${fileBaseName}/releases/${fileBaseName}.user.js?download=true`,
            },
          }),
        ],
      },
    ];
  });
};

const config: RollupOptions[] = buildUserscriptConfig();

export default config;
