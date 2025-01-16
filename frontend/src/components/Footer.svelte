<script>
    import { NEOPLE_UI } from '../constants/resourcePath';
</script>


<footer>
    <ul>
        <li class="copy">이 홈페이지는 네오플 Developers 홈페이지를 참고하여 제작되었으며, 비상업적 포트폴리오 제출용으로 사용되었습니다.<br>© 2005 NEOPLE Inc. &amp; NEXON Korea Corporation All Rights Reserved.</li>
        <li class="flogo">
            <!-- TODO 링크 경로 그대로 두는 게 좋을지, home 으로 이동시킬지 고민 -->
            <a href="http://www.nexon.com/Home/Game.aspx" target="_blank"><img src="{ NEOPLE_UI }/img/flogo_nx.png" alt="NEXON"></a>
            <a href="http://www.neople.co.kr" target="_blank"><img src="{ NEOPLE_UI }/img/flogo_np.png" alt="NEOPLE"></a>
            <a href="http://df.nexon.com" target="_blank"><img src="{ NEOPLE_UI }/img/flogo_df.png" alt="던전앤파이터"></a>
            <a href="http://cyphers.nexon.com"><img src="{ NEOPLE_UI }/img/flogo_cp.png" alt="사이퍼즈"></a>
        </li>
    </ul>
</footer>


<style>
    footer{position:relative;height:95px;border-top:1px solid #e4e4e4;clear:both}
    footer ul{position:relative;margin:0 auto;width:1200px}
    footer ul li{list-style:none}
    footer ul li.copy{float:left;margin:37px 0 0 50px;font-size:12px;color:#9f9f9f}
    footer ul li.flogo{float:right;margin:23px 32px 0 0}
    footer ul li.flogo a{display:inline-block;margin-right:17px}
    footer ul li.menu{position:relative;float:left;margin:37px 0 0 30px;font-size:12px;color:#9f9f9f}
    footer ul li.menu a{color:#828282}
    footer ul li.menu:after{content:'';display:block;position:absolute;left:-14px;top:3px;background:#d0d0d0;width:1px;height:12px}
</style>