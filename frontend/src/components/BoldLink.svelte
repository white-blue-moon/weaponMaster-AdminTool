<script>
    export let href
    export let text
</script>


<a href={ href } target="_blank" class="bold-link">
    { text }
</a>


<style>
    .bold-link {
        all: unset;
        color: inherit;
        font-weight: bold;
        cursor: pointer;
        display: inline;
    }

    .bold-link:hover {
        text-decoration: underline; /* 링크 느낌은 마우스 올릴 때만 */
    }
</style>
