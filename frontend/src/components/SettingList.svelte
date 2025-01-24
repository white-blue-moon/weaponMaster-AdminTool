<script>
    import { API } from '../constants/api';
    import { apiFetch, handleApiError } from '../utils/apiFetch';
    import { onMount } from "svelte";
    import { SETTING_STATE, SETTING_STATE_TEXT } from '../constants/settingState'
    import { PATHS } from '../constants/paths';
    import { formatDateReadable } from '../utils/time';
    
    export let settings = [];
    export let state = SETTING_STATE;
    export let stateText = SETTING_STATE_TEXT;
    let   reservedInfoMap
    const stateEntries = Object.entries(state); // 상태 키와 값을 추출하여 사용하기 위한 배열 생성

    let displayedSettings = [];
    let totalPageNum = 1;
    let currentPageNum = 1; // 현재 페이지

    const PAGE_SIZE = 10; // 한 페이지에 표시할 게시물 수
    const GROUP_PAGING_SIZE = 10; // 한 그룹에 표시할 페이지 번호 개수
    
    // TODO export 로 세팅 값 받아오도록 추후 수정 필요
    onMount(async () => {
        const response = await apiFetch(API.SITE_SETTING.LIST, {
            method: "GET",
        }).catch(handleApiError);

        if (response != null) {
            settings     = response.siteSettings;
            reservedInfoMap = response.reservedInfo.reduce((acc, item) => {
                const key = item.settings_id;
                if (!acc[key]) {
                    acc[key] = item;
                }
                return acc;
            }, {})

            totalPageNum = Math.ceil(settings.length / PAGE_SIZE);
            updateDisplayedArticles();
        }
    });

    function updateDisplayedArticles() {
        displayedSettings = settings.slice((currentPageNum - 1) * PAGE_SIZE, currentPageNum * PAGE_SIZE);
    }

    function changePage(pageNum) {
        if (pageNum >= 1 && pageNum <= totalPageNum) {
            currentPageNum = pageNum;
            updateDisplayedArticles();
        }
    }

    // 상태에 따라 동적으로 CSS 클래스 이름 생성
    function getStateClass(state) {
        switch (state) {
            case SETTING_STATE.OFF:      return "state-off"
            case SETTING_STATE.ON:       return "state-on"
            case SETTING_STATE.RESERVED: return "state-reserved"
            default: return ""
        }
    }

    function getReservedDateText(id) {
        return formatDateReadable(reservedInfoMap[id].reserved_date)
    }

    $: currentGroupStart = Math.floor((currentPageNum - 1) / GROUP_PAGING_SIZE) * GROUP_PAGING_SIZE + 1; // 첫번째 페이징 번호를 1단위로 끊으려면 -1 필요, Math.floor(1.6) = 1
    $: currentGroupEnd   = Math.min(currentGroupStart + GROUP_PAGING_SIZE - 1, totalPageNum); // 마지막 페이징 번호를 10 단위로 끊으려면 -1 필요
    $: currentGroupPages = Array.from(
        { length: currentGroupEnd - currentGroupStart + 1 }, // ex. 1 ~ 10 을 표현하려면 + 1 해야 함 (start ~ end 모두 표현하려면 +1 필요)
        (_, i) => currentGroupStart + i
    );
</script>


<section class="content news">
    <article class="news_header">
        <div class="category_type_c">
            {#each stateEntries as [_, state]}
                <a>{ stateText[(state)] }</a>
            {/each}
        </div> 
        <div class="board_srch">
            <div class="select_gy" style="width:120px">
                <div class="select">
                    <select id="searchType">
                        <option value="1">제목+본문</option>
                        <option value="2">제목</option>
                    </select>
                    <div class="select-element">
                        <span class="active-option">제목</span>
                        <div class="option-list" style="max-height: 205px; height: 84px;">
                            <ul>
                                <li data-value="1">제목+본문</li>
                                <li data-value="2">제목</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bs_ipt">
                <input type="text" id="searchKeyword" name="" class="search_input" autocomplete="off">
                <a class="btn_del">삭제</a>
                <label id="searchButton"></label>
            </div>
        </div>
    </article>

    <article class="board_list news_list">
        {#each displayedSettings as setting}
            <ul>
                <li class="category { getStateClass(setting.active_state) }">
                    { stateText[setting.active_state] }
                </li>
                <li class="title">
                    <a href={ PATHS.SITE_SETTING.EDIT(setting.id) }>
                        { setting.settings_comment }
                        {#if setting.active_state == SETTING_STATE.RESERVED}
                            <span class="reservation-info">
                                &nbsp;({ getReservedDateText(setting.id) } 예약)
                            </span>
                        {/if}
                    </a>
                    <div class="iconset"></div>
                </li>
                <li class="date">{ setting.create_date.split('T')[0] }</li>
                <li class="hits">#{ setting.id }</li>
            </ul>
        {/each}
    </article>
    
    <!-- TODO 권한 있는 상태에서만 보이도록 하기 -->
    <article class="btnarea_r mt30">
        <a href={ PATHS.SITE_SETTING.INSERT } class="btn btntype_bu46 bold" id="newArticleButton" style="width:160px">INSERT</a>
    </article>

    <article class="paging mt60">
        <a class="first" on:click={ () => changePage(1) }>FIRST</a>
        <a class="prev" on:click={ () => changePage(currentPageNum - 1) }>PREV</a>

        {#each currentGroupPages as pageNum}
            {#if pageNum === currentPageNum}
                <span>{ pageNum }</span>
            {:else}
                <a on:click={ () => changePage(pageNum) }>{ pageNum }</a>
            {/if}
        {/each}

        <a class="next" on:click={ () => changePage(currentGroupEnd + 1) }>NEXT</a>
        <a class="end" on:click={ () => changePage(totalPageNum) }>END</a>
    </article>
</section>
<!-- TODO 별도 컴포넌트로 빼기 -->
<a class="top" style="position: fixed; display: inline;" id="gnbTopBtn">TOP</a>


<style lang="scss">
    * {
        margin: 0;
        box-sizing: border-box;
    }

    .menu {
        position: relative;
        height: 300px;
    }
    
    .menu .header-banner {
        position: absolute;
        width: 100%;
        top: 0;
    }

    a {
        text-decoration: none;
        cursor: pointer;
    }

    .news {
        position: relative;
    }

    .content {
        position: relative;
        margin: 63px auto 0 auto;
        width: 1300px;
        min-height: 500px;
    }

    .content h3 {
        color: #151518;
        font-size: 26px;
        line-height: 34px;
        font-weight: 300;
    }

    .news_header {
        position: relative;
        margin-top: 23px;
        width: 1300px;
        height: 58px;
        border-bottom: 1px solid #eeedf2;
    }

    .category_type_c {
        position: relative;
        float: left;
        margin-right: 40px;
        font-size: 0;
    }

    .category_type_c a:first-child {
        margin-left: 0;
    }

    .category_type_c a {
        display: inline-block;
        margin-left: -1px;
        width: 120px;
        height: 42px;
        line-height: 39px;
        background: #f8f9fb;
        border: 1px solid #e0e2ec;
        color: #a2a5ac;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        vertical-align: top;
        text-align: center;
    }

    .category_type_c a::before {
        content: '';
        display: inline-block;
        margin-right: 5px;
        width: 11px;
        height: 8px;
        background: url("#{$DF_UI}/img/board/arrow_tri_dn_11x7.png") no-repeat 0 0;
    }

    .board_srch {
        display: flex;
        margin-left: auto;
        position: relative;
        width: 380px;
    }

    .board_srch .select_gy {
        display: flex;
    }

    .select {
        position: relative;
        margin: 0;
        width: 100%;
        height: 42px;
        z-index: 99;
        font-size: 14px;
        font-weight: 400;
        color: #6a6e76;
        z-index: 1;
    }

    select {
        display: none;
    }

    .select_gy .select .active-option {
        background: #f8f9fb;
        border-color: #e7e8ed;
    }

    .select .active-option {
        width: 100%;
        height: 42px;
        background: #fff;
        border: 1px solid #e7e8ed;
        color: #6a6e76;
        line-height: 39px;
        cursor: pointer;
    }

    .active-option {
        padding: 0 0 0 13px;
        width: 100%;
        display: block;
    }

    .select .active-option:before {
        content: "";
        position: absolute;
        top: 14px;
        right: 10px;
        width: 15px;
        height: 15px;
        background: url("#{$DF_UI}/img/form/select.png") no-repeat;
    }

    .select .option-list {
        border: 1px solid #e7e8ed;
        overflow-y: auto;
    }

    .option-list {
        width: 100%;
        position: absolute;
        visibility: hidden;
        z-index: 100;
    }

    .select .option-list ul {
        color: #6a6e76;
        max-height: 245px;
    }

    .select_gy .select .option-list ul li.on {
        background: #fff;
    }

    .option-list li {
        padding: 0 0 0 13px;
        width: 100%;
        height: 41px;
        line-height: 39px;
        border-bottom: 1px solid #e7e8ed;
        cursor: pointer;
    }

    li {
        list-style: none;
    }

    .board_srch .bs_ipt {
        display: flex;
        align-items: center;
        width: 260px;
        height: 42px;
        border: 1px solid #e7e8ed;
        border-left: none;
        background: #f8f9fb;
        font-size: 0;
    }

    .board_srch .bs_ipt input[type="text"] {
        padding: 0;
        margin: 0;
        width: calc(100% - 60px);
        height: 40px;
        border: none;
        background: #f8f9fb;
        color: #6a6e76;
        font-size: 14px;
        outline: none; /* 기본 포커스 스타일 제거 */
    }

    input[type="text"] {
        display: block;
        line-height: 53px;
        text-indent: 20px;
    }

    .board_srch .bs_ipt a.btn_del {
        display: none;
        position: relative;
        margin-left: auto;
        width: 30px;
        height: 30px;
        background: url("#{$DF_UI}/img/btn/btn_clse_18x18.png") no-repeat 50%;
        cursor: pointer;
        font-size: 0;
        text-indent: -999px;
    }

    .board_srch .bs_ipt label {
        margin-left: auto;
        width: 30px;
        height: 30px;
        background: url("#{$DF_UI}/img/btn/btn_srch_30x30.png") no-repeat;
        cursor: pointer;
    }

    /* 공지사항 리스트 영역 */
    .news_list {
        border-top: none;
    }

    .board_list {
        position: relative;
        width: 1300px;
        border-top: 1px solid #eeedf2;
        clear: both;
    }

    .board_list ul.notice {
        padding: 12px 0 14px 0;
        background: #fbfbfd;
    }

    .board_list ul {
        display: flex;
        align-items: center;
        padding: 17px 0 16px 0;
        border-bottom: 1px solid #eeedf2;
    }

    .board_list ul li.category {
        width: 120px;
        font-weight: 500;
    }

    .board_list ul li {
        color: #898c92;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
    }

    .board_list ul.notice li.title {
        font-weight: 500;
    }

    .news_list ul li.title {
        width: 870px;
    }

    .board_list ul li.title {
        text-align: left;
        font-size: 15px;
        cursor: pointer;
    }

    .board_list ul li.title a {
        color: #36393f;
    }

    .board_list ul li.title b {
        color: #3392ff;
        font-weight: 500;
    }

    .reservation-info {
        color: #3392ff;
    }

    .news_list ul li.date {
        width: 200px;
        font-size: 13px;
    }

    .board_list ul li {
        color: #898c92;
        font-weight: 400;
        text-align: center;
    }

    .board_list ul li.hits {
        width: 110px;
        padding-left: 24px;
        // background: url("#{$DF_UI}/img/board/board_ico_view.png") no-repeat 0 calc(50% + 1px);
        text-align: left;
        font-size: 13px;
    }

    .board_list ul li {
        color: #898c92;
        font-weight: 400;
    }

    .news_list ul li.category.state-on {
        color:#4caf50;
    }

    .news_list ul li.category.state-reserved {
        color:#e0aa00;
    }

    .news_list ul li.category b {
        color: #d50000;
        font-weight: 500;
    }

    /* 페이징 네비게이션 */
    .paging {
        position: relative;
        font-size: 0;
        text-align: center;
        vertical-align: top;
        overflow: hidden;
    }

    .mt60 {
        margin-top: 60px !important;
        margin-bottom: 60px;
    }

    .paging a.first {
        margin-right: 0;
        background: url("#{$DF_UI}/img/btn/paging.png") no-repeat -50px 0;
        text-indent: -9999px;
    }

    .paging a.prev {
        margin-right: 14px;
        background: url("#{$DF_UI}/img/btn/paging.png") no-repeat 0 0;
        text-indent: -9999px;
    }

    .paging a, .paging span {
        display: inline-block;
        padding: 0 10px;
        min-width: 38px;
        height: 36px;
        line-height: 35px;
        color: #6a6e76;
        font-size: 14px;
    }

    .paging span {
        background: #303544;
        color: #fff;
    }

    .paging a.next {
        margin-left: 14px;
        background: url("#{$DF_UI}/img/btn/paging.png") no-repeat 0 -50px;
        text-indent: -9999px;
    }

    .paging a.end {
        margin-left: 0;
        background: url("#{$DF_UI}/img/btn/paging.png") no-repeat -50px -50px;
        text-indent: -9999px;
    }

    /* 글쓰기 버튼 */
    .btnarea_r {
        text-align: right;
        font-size: 0;
    }

    .mt30 {
        margin-top: 30px !important;
    }

    .btntype_bu46 {
        height: 46px;
        line-height: 45px;
        background: #e0aa00;
        color: #fff;
        font-size: 13px;
    }

    .btn {
        position: relative;
        display: inline-block;
        min-width: 90px;
        text-align: center;
    }

    .bold {
        font-weight: 500 !important;
    }

    /* top 버튼 */
    .top {
        display: none;
        position: absolute;
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
    }

    .footer {
        margin-top: 160px !important;
        padding-top: 50px;
        border-top: 1px solid #e0e2ec;
    }
</style>