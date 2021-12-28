<script>
    import { onDestroy, getContext } from "svelte";
    import { modalStatus } from "../../lib/store";
    import Share from "./Share.svelte";
    import CodeBlock from "../CodeBlock.svelte";

    const { open } = getContext("simple-modal");

    const unsubscribe = modalStatus.subscribe(status => {
        if (status.active) {
            switch (status.type) {
                case "share":
                    open(Share, { ...status.props });
                    break;
                case "code":
                    open(CodeBlock, { ...status.props });
                    break;
            }
        }
    });

    onDestroy(unsubscribe);
</script>
