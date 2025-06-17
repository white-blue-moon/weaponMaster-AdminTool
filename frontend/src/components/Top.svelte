<script>
    import { onMount, onDestroy } from 'svelte'


    const topButtonTriggerPoint = 650
    let   showTopButton         = false

    onMount(() => {
        window.addEventListener('scroll', handleScroll)
    })

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll)
    })

    function handleScroll() {
        showTopButton = window.scrollY > topButtonTriggerPoint
    }

    function scrollToTop() {
        const scrollSpeed = 200               // 스크롤 올라가는 시간 (단위: ms)
        const startPoint  = window.scrollY    // 현재 스크롤 위치 저장
        const startTime   = performance.now() // 애니메이션 시작 시간 (고해상도 타이머)

        // 스크롤 애니메이션을 수행하는 내부 함수
        function animate(currentTime) {
            const MAX_PROGRESS = 1
            const elapsed      = currentTime - startTime                       // 경과한 시간
            const progress     = Math.min(elapsed / scrollSpeed, MAX_PROGRESS) // 진행률 계산 (MAX_PROGRESS 를 넘지 않게 제한)

            // 현재 진행률에 따라 스크롤 위치를 조정
            window.scrollTo(0, startPoint * (MAX_PROGRESS - progress))

            // 아직 애니메이션이 끝나지 않았으면 다음 프레임 요청
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        // 첫 번째 프레임 시작
        requestAnimationFrame(animate)
    }
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
