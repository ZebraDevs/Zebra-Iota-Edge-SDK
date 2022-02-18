/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    transform: {
        "^.+\\.svelte$": [
            "svelte-jester",
            {
                preprocess: "./svelte.config.test.cjs"
            }
        ],
        "^.+\\.js$": "babel-jest",
        "^.+\\.ts$": "ts-jest",
        ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
    },
    transformIgnorePatterns: ["node_modules/(?!(svelte-routing|capacitor-secure-storage-plugin|highlight.js)/)"],
    moduleFileExtensions: ["js", "ts", "svelte"],
    moduleNameMapper: {
        "^\\$lib(.*)$": "<rootDir>/src/lib$1"
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect", "<rootDir>/jest-setup.cjs"],
    collectCoverageFrom: ["src/**/*.{ts,tsx,svelte,js,jsx}"],
    testEnvironment: "jsdom"
};

module.exports = config;
