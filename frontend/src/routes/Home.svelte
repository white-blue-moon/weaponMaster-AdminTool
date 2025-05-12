<script>
    import { onMount } from "svelte";
    import { useLocation } from "svelte-routing";

    import Gnb from "../components/Gnb.svelte";
    import VisualBanner from "../components/VisualBanner.svelte";
    import SettingList from "../components/SettingList.svelte";
    import Footer from "../components/Footer.svelte";
    import Top from "../components/Top.svelte";

    let   show     = false;
    const location = useLocation();

    onMount(() => {
        const isFromGate = sessionStorage.getItem('fromAccessGate') === 'true';
        
        if (isFromGate) {
            // 화면이 렌더링될 준비가 되었을 때(show = true) 실행되도록 예약
            // → 이렇게 하면 화면이 '서서히 등장하는' 애니메이션 효과를 줄 수 있음
            requestAnimationFrame(() => show = true);
            sessionStorage.removeItem('fromAccessGate'); // 비밀번호 입력 후 한 번만 연출
        }

        if (!isFromGate) {
            // 즉시 화면을 보여줌 (애니메이션 없이 바로 나타남)
            show = true;
        }
    })
</script>


<div class:fade-in={ show } class="home-wrapper">
    <Gnb />
    <VisualBanner title="홈페이지 설정 제어"/>
    <SettingList />
    <Footer />
</div>


<style>
    .home-wrapper {
		opacity: 0;
		transition: opacity 2.5s ease-in-out;
	}

	.fade-in {
		opacity: 1;
	}
</style>