<script>
  import { PATHS } from "../constants/paths"
  import BoldLink from "./BoldLink.svelte"
</script>


<footer>
    <ul>
        <li class="copy">
            이 홈페이지는 <BoldLink href={ "https://developers.neople.co.kr/" } text={ "네오플 Developers 홈페이지" }/>를 참고하여 제작된 비상업적 개인 프로젝트입니다.<br />
            원저작권은 NEOPLE Inc. 및 NEXON Korea Corporation에 있으며,<br />
            본 사이트는 공식 제작물은 아닙니다.
        </li>
        <li class="flogo">
            <a target="_blank"><img class="logo-blue-moon" src="images/logo_blue_moon_img.png" alt="블루문"></a>
            <a href={ PATHS.HOME } target="_blank"><img src="images/logo_admin_tool_footer.png" alt="어드민툴"></a>
            <a href={ PATHS.WEAPON_MASTER } target="_blank"><img src="images/logo_weapon_footer.png" alt="웨펀마스터"></a>
        </li>
    </ul>
</footer>


<style>
    footer{position:relative;height:95px;border-top:1px solid #e4e4e4;clear:both}
    footer ul{position:relative;margin:0 auto;width:1200px}
    footer ul li{list-style:none}
    footer ul li.copy{float:left;margin:23px 0 0 50px;font-size:12px;color:#9f9f9f}
    footer ul li.flogo{float:right;margin:22px 32px 0 0}
    footer ul li.flogo a{display:inline-block;margin-right:24px}
    footer ul li.menu{position:relative;float:left;margin:37px 0 0 30px;font-size:12px;color:#9f9f9f}
    footer ul li.menu a{color:#828282}
    footer ul li.menu:after{content:'';display:block;position:absolute;left:-14px;top:3px;background:#d0d0d0;width:1px;height:12px}

    .logo-blue-moon {
        padding-top: 8px;
    }
</style>