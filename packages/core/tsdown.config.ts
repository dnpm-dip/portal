import { defineConfig } from 'tsdown';
import Vue from 'unplugin-vue/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
    entry: 'src/index.ts',
    format: 'esm',
    dts: false,
    sourcemap: true,
    deps: {
        neverBundle: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
            ...Object.keys(pkg.devDependencies || {}),
        ],
    },
    css: { fileName: 'index.css' },
    plugins: [
        Vue(),
    ],
});
