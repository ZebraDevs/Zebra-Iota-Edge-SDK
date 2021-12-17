import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import { string } from "rollup-plugin-string";
import json from "@rollup/plugin-json";
import * as fs from "fs";
import * as path from "path";

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true
            });

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        }
    };
}

export default {
    input: "src/main.ts",
    output: {
        sourcemap: !production,
        format: "iife",
        name: "app",
        file: "public/js/bundle.js"
    },
    plugins: [
        copy({
            copyOnce: Boolean(process.env.ROLLUP_WATCH),
            targets: [
                {
                    src: "src/web",
                    dest: ".",
                    rename: "public"
                },
                {
                    src: "node_modules/@iota/identity-wasm/web/identity_wasm_bg.wasm",
                    dest: "public/wasm"
                }
            ]
        }),
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            },
            preprocess: sveltePreprocess()
        }),
        json(),
        string({
            include: ["**/*.md"]
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({
            output: (styles, _) => {
                const dir = path.resolve(process.cwd(), "public/css");
                fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(path.join(dir, "bundle.css"), styles);
            }
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ["svelte"],
            preferBuiltins: false
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production
        }),
        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    },
    moduleContext: id => {
        // In order to match native module behaviour, Rollup sets `this`
        // as `undefined` at the top level of modules. Rollup also outputs
        // a warning if a module tries to access `this` at the top level.

        // The following modules use `this` at the top level and expect it
        // to be the global `window` object (runs in a browser), so we tell
        // Rollup to set `this = window` for these modules.
        const thisAsWindowForModules = ["node_modules/@zxing/library/esm"];

        if (thisAsWindowForModules.some(id_ => id.trimRight().includes(id_))) {
            return "window";
        }
    }
};
