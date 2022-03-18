import { render } from "@testing-library/svelte";
import TextField from "./TextField.svelte";

describe("TextField component", () => {
    test("Should render", () => {
        const component = render(TextField);
        expect(component).toBeTruthy();
    });
});
