<script lang="ts">
    import { beforeUpdate } from "svelte";
    import MarkdownIt from "markdown-it";
    import "highlight.js/styles/github.css";
    import hljs from "highlight.js";

    export let markdown = "";
    export let language = "";

    let rendered = "";

    const md = new MarkdownIt({
        highlight: function (str, lang) {
            lang = language;

            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error("Failed to highlight string");
                }
            }
            return "";
        }
    });

    beforeUpdate(() => {
        rendered = md.render(markdown);
    });
</script>

<!-- Render with the `@html` directive -->
<div>
    {@html rendered}
</div>
