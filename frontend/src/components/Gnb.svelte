<script>
    import { PATHS } from "../constants/paths";
    import { handleLogout, userInfo } from "../utils/auth";

    function handleMouseEnter(e) {
        const target = e.currentTarget;
        target.classList.add('active');

        const submenu = target.querySelector('ul');
        if (submenu) {
            submenu.style.display = 'block'; // 표시 설정
            submenu.style.height = '0'; // 초기 높이를 0으로 설정

            // 브라우저 리렌더링을 강제하여 애니메이션이 적용되도록 처리
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    submenu.style.height = '55px'; // 트랜지션 시작
                });
            })
        }
    }

    function handleMouseLeave(e) {
        const target = e.currentTarget;
        target.classList.remove('active');

        const submenu = target.querySelector('ul');
        if (submenu) {
            submenu.style.height = '0'; // 트랜지션 종료 상태로 설정

            submenu.addEventListener(
                'transitionend',
                function handler() {
                    if (submenu.style.height === '0px') {
                        submenu.style.display = 'none'; // 트랜지션 종료 후 숨김
                    }
                    submenu.removeEventListener('transitionend', handler); // 이벤트 제거
                }
            );
        }
    }
</script>

<div class="nav">
    <h1>
        <a href="/">
            <img src="/images/logo.png" alt="Neople Developers">
        </a>
    </h1>
    <ul>
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li class="m1" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
            <a href={ PATHS.HOME }>Site Setting</a>
            <ul>
                <li>
                    <a href={ PATHS.HOME }>홈페이지 설정 제어</a>
                </li>
            </ul>
        </li>
        
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li class="m2" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
            <a href={ PATHS.ACCESS_LEVEL.LIST }>계정관리</a>
            <ul>
                <li>
                    <a href={ PATHS.ACCESS_LEVEL.LIST }>웨펀마스터 계정관리</a>
                </li>
            </ul>
        </li>

        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li class="m3" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
            <a href={ PATHS.MAINTENANCE.LIST }>점검 제어</a>
            <ul>
                <li>
                    <a href={ PATHS.MAINTENANCE.LIST }>홈페이지 점검 상태 제어</a>
                </li>
            </ul>
        </li>
    </ul>
    <div class="topbtn">
        {#if $userInfo}
            <a href="#" on:click={ handleLogout } >로그아웃</a>
        {:else}
            <a href={ PATHS.ACCOUNT.JOIN }>회원가입</a>
            <a href={ PATHS.ACCOUNT.LOGIN }>로그인</a>
        {/if}
    </div>
</div>


<style>
    .nav{clear:both;position:relative;margin:0;width:100%;height:74px;background:#fff;border-bottom:1px solid #d9d9d9;z-index:100}
    .nav h1{position:absolute;top:14px;left:50%;margin:0 0 0 -593px;width:140px;height:46px;}
    .nav ul{width:1200px;margin:0 auto;overflow:hidden;zoom:1;padding:0;}
    .nav ul:after{content:"";display:block;clear:both}
    .nav ul li{float:left;padding-top:28px;height:46px}
    .nav ul li:first-child{margin-left:200px}
    .nav ul li a{display:block;float:left;padding:0;margin-right:30px;font-size:15px;color:#818181}
    .nav ul li.active a{padding-bottom:25px;color:#2d2d2d;border-bottom:3px solid #fabe00}
 
    .nav ul li ul {
        position: absolute;
        top: 75px;
        left: 0;
        height: 0;
        width: 100%;
        z-index: 900;
        background: #fff;
        overflow: hidden;
        display: none; /* 기본적으로 숨김 */
        transition: height 0.3s ease; /* height 애니메이션 적용 */
    } 

    /* 305 -> 190 (115) */
 
    .nav ul li ul li{position:relative;left:50%;padding:0;margin:0 0 0 -600px !important;width:1200px}
    .nav ul li ul li a{float:left;padding:0;margin:18px 30px 0 0;font-size:15px;color:#818181 !important}
    .nav ul li ul li a:hover{color:#e0aa00 !important}
    .nav ul li.m1 ul li a:first-child{margin-left:199px;}
    .nav ul li.m2 ul li a:first-child{margin-left:310px;}
    .nav ul li.m3 ul li a:first-child{margin-left:395px;}
    .nav .topbtn{position:absolute;top:23px;left:50%;width:300px;margin-left:342px;text-align:right;}
    .nav .topbtn a{display:inline-block;width:77px;height:27px;border:1px solid #cecece;border-radius:10px;color:#b3b3b3;text-align:center;line-height:28px;font-size:11px;}
    .nav .topbtn a:hover{border:1px solid #a7a7a7;color:#818181}
    .nav ul li{list-style:none}
</style>