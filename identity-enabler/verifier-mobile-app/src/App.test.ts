import { render } from "@testing-library/svelte";
import App from "./App.svelte";

describe("App component", () => {
    // Skip, because we cannot test components that use slots (via imports)
    // https://github.com/testing-library/svelte-testing-library/issues/48
    test.skip("Should render", () => {
        const component = render(App);
        expect(component).toBeTruthy();
    });
});
