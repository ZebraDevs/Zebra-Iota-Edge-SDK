<script>
    import { onMount, onDestroy, getContext } from "svelte";
    import { modalStatus } from "../../lib/store";
    import Share from "./Share.svelte";

    const { close, open } = getContext("simple-modal");

    const unsubscribe = modalStatus.subscribe(status => {
        if (status.active) {
            if (status.type === "share") {
                open(Share, { props: status.props });
            }
        }
    });

    onDestroy(unsubscribe);
</script>
