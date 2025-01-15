<script>
    function handleMouseOver(e) {
        e.currentTarget.classList.add('active');
        const submenu = e.currentTarget.querySelector('ul');
        if (submenu) {
          submenu.style.display = 'block';
        }
    }

    function handleMouseOut(e) {
        e.currentTarget.classList.remove('active');
        const submenu = e.currentTarget.querySelector('ul');
        if (submenu) {
          submenu.style.display = 'none';
        }
    }
</script>

<div class="nav">
    <h1>
        <a href="/">
            <img src="https://developers.neople.co.kr/img/logo.png" alt="Neople Developers">
        </a>
    </h1>
    <ul>
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li class="m1" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}>
            <a href="/">API Docs</a>
            <ul>
                <li>
                    <a href="/contents/apiDocs/df">던전앤파이터</a>
                    <a href="/contents/apiDocs/cyphers">사이퍼즈</a>
                </li>
            </ul>
        </li>
        
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li class="m2" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}>
            <a href="/">이용안내</a>
            <ul>
                <li>
                    <a href="/contents/guide/pages/all">공통 가이드</a>
                    <a href="/contents/guide/pages/code">결과 코드 정보</a>
                    <a href="/contents/bi">BI 가이드</a>
                    <a href="/contents/policy">약관 및 정책</a>
                </li>
            </ul>
        </li>

        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li class="m3" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}>
            <a href="/">지원센터</a>
            <ul>
                <li>
                    <a href="/contents/notice/list">공지사항</a>
                    <a href="/contents/faq">FAQ</a>
                </li>
            </ul>
        </li>
    </ul>
    <div class="topbtn">
        <a href="javascript:goLogin(true)">로그인</a>
    </div>
</div>


<style>
    .nav{clear:both;position:relative;margin:0;width:100%;height:74px;background:#fff;border-bottom:1px solid #d9d9d9;z-index:100}
    .nav h1{position:absolute;top:14px;left:50%;margin:0 0 0 -593px;width:241px;height:46px;}
    .nav ul{width:1200px;margin:0 auto;overflow:hidden;zoom:1;padding:0;}
    .nav ul:after{content:"";display:block;clear:both}
    .nav ul li{float:left;padding-top:28px;height:46px}
    .nav ul li:first-child{margin-left:307px}
    .nav ul li a{display:block;float:left;padding:0;margin-right:30px;font-size:15px;color:#818181}
    .nav ul li.active a{padding-bottom:25px;color:#2d2d2d;border-bottom:3px solid #fabe00}

    .nav ul li ul{display:none;position:absolute;top:75px;left:0;height:55px;width:100%;z-index:900;background:#fff;}
    .nav ul li ul li{position:relative;left:50%;padding:0;margin:0 0 0 -600px !important;width:1200px}
    .nav ul li ul li a{float:left;padding:0;margin:18px 30px 0 0;font-size:15px;color:#818181 !important}
    .nav ul li ul li a:hover{color:#e0aa00 !important}
    .nav ul li.m1 ul li a:first-child{margin-left:305px;}
    .nav ul li.m2 ul li a:first-child{margin-left:397px;}
    .nav ul li.m3 ul li a:first-child{margin-left:481px;}
    .nav .topbtn{position:absolute;top:23px;left:50%;width:300px;margin-left:342px;text-align:right;}
    .nav .topbtn a{display:inline-block;width:77px;height:27px;border:1px solid #cecece;border-radius:10px;color:#b3b3b3;text-align:center;line-height:28px;font-size:11px;}
    .nav .topbtn a:hover{border:1px solid #a7a7a7;color:#818181}
    .nav ul li{list-style:none}
</style>