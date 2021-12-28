declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onmultiClick?: (ce: CustomEvent<void>) => void;
    }
}
