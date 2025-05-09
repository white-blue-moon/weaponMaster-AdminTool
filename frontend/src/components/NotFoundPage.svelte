<script>
    import { PATHS } from "../constants/paths"
    import { DF_UI } from "../constants/resourcePath"

    import Footer from "./Footer.svelte"
    import Gnb from "./Gnb.svelte"
    import VisualBanner from "./VisualBanner.svelte"
</script>


<div class="error">
    <Gnb />
    <VisualBanner
        background="/img/svisual4.jpg"
        title="Not Found"
    />

    <section>
        <article class="cbox mt40">
            <img src="{DF_UI}/img/error/cu.png" alt="">
            <h2 class="mt30">이용에 불편을 드려 죄송합니다.</h2>
                <h3>서버 오류가 발생했습니다.</h3>
        </article>
        <h4 class="mt30">
            새로고침을 눌러도 계속 현재 페이지가 보여질 경우<br>
            주소가 잘못되었거나 이름이 변경된 페이지일 수 있습니다.<br>
            주소를 다시 한번 확인해 주세요.
        </h4>
        <article class="btnarea mt80">
            <a href={ PATHS.HOME } class="btn btntype_bk70" style="width:260px">홈페이지 메인</a>
        </article>
    </section>

    <Footer showBorderTop={ true }/>
</div>


<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    flex-shrink: 0;  /* 크기가 줄어들지 않음 */
}

a {
    text-decoration: none;
}

.error section{position:relative;margin:0 auto;width:1000px;padding-bottom:100px;}
.error section .cbox{display:flex;flex-direction:column;position:relative;padding:60px;background:#f8f9fb;border:1px solid #e0e2ec;text-align:center;}
.error section .cbox img{display:block;margin:0 auto;width:124px;height:93px}
.error section h2{color:#151518;font-size:32px;font-weight:300;line-height:43px;letter-spacing:-.8px}
.error section h3{margin-top:10px;color:#36393f;font-size:18px;font-weight:400;line-height:24px;}
.error section h4{color:#898c92;font-size:16px;font-weight:400;line-height:32px;text-align:center;}
.error section .btnarea a{vertical-align:top;}

.mt30{margin-top:30px !important}
.mt40{margin-top:40px !important}
.mt80{margin-top:80px !important}

.btnarea{text-align:center;font-size:0;}

.btntype_bk70 {
    height: 70px;
    line-height: 69px;
    background: #484e5f;
    color: #fff;
    font-size: 15px;
}

.btn {
    position: relative;
    display: inline-block;
    min-width: 90px;
    text-align: center;
}
</style>
