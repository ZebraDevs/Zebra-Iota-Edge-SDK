import App from "./App.svelte";
import init from "./lib/init";

init();

const app = new App({
    target: document.body
});

export default app;
