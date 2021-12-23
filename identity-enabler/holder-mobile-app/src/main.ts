import App from "./App.svelte";
import init from "./lib/init";

init();

const app = new App({
    target: document.body,
    props: {
        name: "zebra"
    }
});

export default app;
