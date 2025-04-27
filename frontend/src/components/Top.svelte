<script>
    import { onMount, onDestroy } from 'svelte';


    const topButtonTriggerPoint = 250;
    let   showTopButton         = false;

    function handleScroll() {
        showTopButton = window.scrollY > topButtonTriggerPoint;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0 });
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll);
    });
</script>


{#if showTopButton}
    <a class="top" on:click={ scrollToTop } id="gnbTopBtn">
        TOP
    </a>
{/if}


<style>
    .top {
        position: fixed;
        right: 40px;
        bottom: 40px;
        width: 70px;
        height: 70px;
        background: #484e5f;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.12);
        text-align: center;
        color: #fff;
        font-size: 13px;
        line-height: 70px;
        cursor: pointer;
        z-index: 100;
        text-decoration: none;
    }

    .top:hover {
        background: #e0aa00;
    }
</style>
