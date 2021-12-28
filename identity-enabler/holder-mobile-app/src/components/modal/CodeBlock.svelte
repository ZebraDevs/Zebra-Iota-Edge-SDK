<script lang="ts">
    export let code: string;
</script>

<section>
    <div class="modal-wrapper">
        <pre><code>{code}</code></pre>
    </div>
</section>

<style>
    pre {
        max-height: 70vh;
        overflow: auto;
        margin: 1.5rem;
        background-color: #eee;
        padding: 1rem;
        border-radius: 6px;
    }
</style>
