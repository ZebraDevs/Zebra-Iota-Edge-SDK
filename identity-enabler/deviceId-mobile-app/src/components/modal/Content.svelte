<script>
    import { onDestroy, getContext } from "svelte";
    import { modalStatus } from "../../lib/store";
    import Share from "./Share.svelte";
    import JSON from "./JSON.svelte";

    const { open } = getContext("simple-modal");

    const unsubscribe = modalStatus.subscribe(status => {
        if (status.active) {
            switch (status.type) {
                case "share":
                    open(Share, {...status.props });
                    break;
                case "json":
                    open(JSON, { ...status.props });
                    break;
            }
        }
    });

    onDestroy(unsubscribe);
</script>
