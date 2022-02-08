<script lang="ts">
    import { onDestroy, setContext as baseSetContext } from "svelte";
    import { fly } from "svelte/transition";
    import { modalStatus } from "../../lib/store";

    export let key = "simple-modal";
    export let closeOnEsc = true;
    export let closeOnOuterClick = true;
    export let styleBg = { top: 0, left: 0 };
    export let styleWindow = {};
    export let styleContent = {};
    export let setContext = baseSetContext;
    export let transitionBg = fly;
    export let transitionBgProps = { y: 20, duration: 280 };
    export let transitionWindow = transitionBg;
    export let transitionWindowProps = transitionBgProps;

    const defaultState = {
        closeOnEsc,
        closeOnOuterClick,
        styleBg,
        styleWindow,
        styleContent,
        transitionBg,
        transitionBgProps,
        transitionWindow,
        transitionWindowProps
    };
    let state = { ...defaultState };

    let component = null;
    let props = null;

    let background;
    let wrap;

    const camelCaseToDash = (str: string) => str.replace(/([A-Za-z])(?=[A-Z])/g, "$1-").toLowerCase();

    const toCssString = (props: Record<string, string | number>) => {
        const str = [];
        for (const key of Object.keys(props)) {
            str.push(`${camelCaseToDash(key)}: ${props[key]};`);
        }
        return str.join("");
    };

    $: cssBg = toCssString(state.styleBg);
    $: cssWindow = toCssString(state.styleWindow);
    $: cssContent = toCssString(state.styleContent);
    $: currentTransitionBg = state.transitionBg;
    $: currentTransitionWindow = state.transitionWindow;

    const open = (NewComponent, newProps = {}, options = {}) => {
        component = NewComponent;
        props = newProps;
        state = { ...defaultState, ...options };
    };

    const close = () => {
        component = null;
        props = null;

        // Reset modal status in store
        modalStatus.set({ active: false, type: null });
    };

    const handleKeyup = ({ key }) => {
        if (state.closeOnEsc && component && key === "Escape") {
            event.preventDefault();
            close();
        }
    };

    const handleOuterClick = event => {
        if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) {
            event.preventDefault();
            close();
        }
    };

    setContext(key, { open, close });

    const unsubscribe = modalStatus.subscribe(status => {
        if (
            !status.active &&
            // Also check if any component instance is active
            component
        ) {
            close();
        }
    });

    onDestroy(unsubscribe);
</script>

<svelte:window on:keyup={handleKeyup} />

<div>
    {#if component}
        <div
            class="bg"
            on:click={handleOuterClick}
            bind:this={background}
            transition:currentTransitionBg={state.transitionBgProps}
            style={cssBg}
        >
            <div class="window-wrap" bind:this={wrap}>
                <div class="window" in:currentTransitionWindow={state.transitionWindowProps} style={cssWindow}>
                    <div class="content" style={cssContent}>
                        <svelte:component this={component} {...props} />
                    </div>
                </div>
            </div>
        </div>
    {/if}
    <slot />
</div>

<style>
    * {
        box-sizing: border-box;
    }

    .bg {
        position: absolute;
        z-index: 1000;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(19, 20, 63, 0.87);
    }

    .window-wrap {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
    }

    .window {
        position: relative;
        width: 50rem;
        max-width: 100%;
        max-height: 100%;
        color: black;
        background: white;
    }

    .content {
        overflow: auto;
        background: white;
        border-top-left-radius: 6vw;
        border-top-right-radius: 6vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
