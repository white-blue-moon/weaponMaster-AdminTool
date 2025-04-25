<script>
    import { NEOPLE_UI } from "../constants/resourcePath"

    export let background = "/img/svisual_df.jpg"
    export let title = "ADMIN TOOL"

    const imgFileName = background.split("/").pop()
    const visual260   = "svisual_df.jpg"
</script>


<div class="{ imgFileName == visual260 ? 's_visual260' : 's_visual' } s_df"  style="--background-img: url({ NEOPLE_UI + background })">
    <h2>{ title }</h2>
    {#if imgFileName == visual260}
        <h3>
            어드민 툴에 오신 것을 환영합니다.<br>
            Weapon Master 운영을 위한 다양한 관리 기능을 제공합니다.
        </h3>
    {/if}
    <ul class="his">
        <li>
            <!-- TODO 경로 출력 자동화하기 -->
            <!-- 홈  -->
        </li>
    </ul>
</div>


<style>
    .s_df {
        background: var(--background-img) no-repeat 50% 0;
    }

    .s_visual260{position:relative;width:100%;height:260px;text-align:center;overflow:hidden;}
    .s_visual260 h2{margin:68px 0 12px 0;font-size:30px;color:#f5f5f5;font-weight:500;line-height:36px;}
    .s_visual260 h3{font-size:18px;color:#cccac3;font-weight:400;line-height:24px;}

    .s_visual260 ul.his{position:absolute;left:50%;bottom:10px;margin-left:-550px;width:1100px;color:#919191;font-size:13px;line-height:24px;list-style:none}
    .s_visual260 ul.his li{position:relative;margin-right:2px;text-align:right;}
    .s_visual260 ul.his li span{display:inline;color:#b3b3b3}

    .s_visual{position:relative;width:100%;height:150px;text-align:center;line-height:150px;}
    .s_visual h2{font-size:30px;color:#f5f5f5;font-weight:500;margin:0px;padding:0px}
    .s_visual ul.his{position:absolute;left:50%;bottom:10px;margin-left:-550px;width:1100px;color:#919191;font-size:13px;line-height:24px;}
    .s_visual ul.his li{position:relative;margin-right:2px;text-align:right;list-style:none}
    .s_visual ul.his li span{display:inline;color:#b3b3b3}
</style>