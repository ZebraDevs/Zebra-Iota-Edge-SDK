import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import App from "./App.svelte";

describe("App component", () => {
    test("Should render", () => {
        const component = render(App);
        expect(component).toBeTruthy();
    });
});
