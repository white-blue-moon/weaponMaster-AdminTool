<script>
    import { API } from '../constants/api'
    import { apiFetch, handleApiError } from '../utils/apiFetch'
    import { onMount } from "svelte"
    import { SETTING_STATE, SETTING_STATE_TEXT } from '../constants/settingState'
    import { PATHS } from '../constants/paths'
    import { formatDateSimple, formatDateYMD } from '../utils/time'
    import { isAdminLoggedIn } from '../utils/auth'

    import BoardSearch from './BoardSearch.svelte'
    import Top from './Top.svelte'
    import Spinner from './Spinner.svelte'


    export let settings = []
    export let state = SETTING_STATE
    export let stateText = SETTING_STATE_TEXT
    export let getStateClass = (state) => {
        switch (state) {
            case SETTING_STATE.OFF:      return "state-off"
            case SETTING_STATE.ON:       return "state-on"
            case SETTING_STATE.RESERVED: return "state-reserved"
            default: return ""
        }
    }

    let   reservedInfoMap
    let   settingsMap     = new Map()
    const stateList       = Object.values(state)

    let displayedSettings = []
    let totalPageNo       = 1
    let currentPageNo     = 1 // 현재 페이지

    const PAGE_SIZE         = 10 // 한 페이지에 표시할 게시물 수
    const GROUP_PAGING_SIZE = 10 // 한 그룹에 표시할 페이지 번호 개수

    let selectedFilters = new Set()
    let searchKeyword   = ""

    let isLoading = false

    onMount(async () => {
        isLoading = true

        const response = await apiFetch(API.SITE_SETTING.LIST, {
            method: "GET",
        }).catch(handleApiError)

        if (response != null) {
            settings = response.siteSettings
            
            buildSettingsMap()
            buildReservedInfoMap(response.reservedInfo)
            updateDisplayedSettings()

            isLoading = false
            return
        }

        isLoading = false
        alert('설정 정보 리스트 불러오기에 실패하였습니다')
        return
    })

    function buildSettingsMap() {
        settingsMap.clear()
        for (const setting of settings) {
            const key = String(setting.active_state)

            if (!settingsMap.has(key)) {
                settingsMap.set(key, [])
            }
            settingsMap.get(key).push(setting)
        }
    }

    function buildReservedInfoMap(reservedInfo) {
        reservedInfoMap = reservedInfo.reduce((acc, item) => {
                const key = item.settings_id
                if (!acc[key]) {
                    acc[key] = item
                }
                return acc
            }, {})
    }

    function updateDisplayedSettings() {
        let filtered = []

        if (selectedFilters.size > 0) {
            for (const key of selectedFilters) {
                if (settingsMap.has(key)) {
                    filtered.push(...settingsMap.get(key))
                }
            }
        } else {
            filtered = [...settings]
        }

        if (searchKeyword.trim()) {
            filtered = filtered.filter(setting => setting.settings_comment.includes(searchKeyword.trim()))
        }

        const start       = (currentPageNo - 1) * PAGE_SIZE
        const end         = currentPageNo * PAGE_SIZE
        displayedSettings = filtered.slice(start, end)
        totalPageNo       = Math.ceil(filtered.length / PAGE_SIZE)
    }

    function changePage(pageNo) {
        if (pageNo >= 1 && pageNo <= totalPageNo) {
            currentPageNo = pageNo
            updateDisplayedSettings()
        }
    }

    function getReservedDateText(id) {
        return formatDateSimple(reservedInfoMap[id].reserved_date)
    }

    function toggleFilter(filterKey) {
        filterKey = String(filterKey)

        const newSet = new Set(selectedFilters) // 반응성을 위해 기존 Set 복사
        if (newSet.has(filterKey)) {
            newSet.delete(filterKey)
        } else {
            newSet.add(filterKey)
        }
        selectedFilters = newSet // 재할당으로 반응성 유도

        currentPageNo = 1        // 필터 변경 시 페이지 리셋
        updateDisplayedSettings()
    }

    function handleSearch(event) {
        searchKeyword = event.detail.keyword
        currentPageNo = 1
        updateDisplayedSettings()
    }

    $: currentGroupStart = Math.floor((currentPageNo - 1) / GROUP_PAGING_SIZE) * GROUP_PAGING_SIZE + 1 // 첫번째 페이징 번호를 1단위로 끊으려면 -1 필요, Math.floor(1.6) = 1
    $: currentGroupEnd   = Math.min(currentGroupStart + GROUP_PAGING_SIZE - 1, totalPageNo) // 마지막 페이징 번호를 10 단위로 끊으려면 -1 필요
    $: currentGroupPages = Array.from(
        { length: currentGroupEnd - currentGroupStart + 1 }, // ex. 1 ~ 10 을 표현하려면 + 1 해야 함 (start ~ end 모두 표현하려면 +1 필요)
        (_, i) => currentGroupStart + i
    )
</script>


<section class="content news">
    <article class="news_header">
        <div class="category_type_c">
            {#each stateList as state}
                <a class:selected={selectedFilters.has(String(state))} on:click={() => toggleFilter(state)}>
                    { stateText[(state)] }
                </a>
            {/each}
        </div> 
        <BoardSearch on:search={ handleSearch } />
    </article>

    <article class="board_list news_list">
        {#if displayedSettings.length == 0}
            {#if isLoading}
                <ul>
                    <li>
                        <Spinner margin_bottom="2px"/> 설정 리스트를 불러오는 중입니다.
                    </li>
                </ul>
            {:else}
                <ul class="nodata">
                    <li>검색 결과가 없습니다.</li>
                </ul>
            {/if}
        {:else}
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
                                    { getReservedDateText(setting.id) } 예약
                                </span>
                            {/if}
                        </a>
                        <div class="iconset"></div>
                    </li>
                    <li class="date">{ formatDateYMD(setting.create_date) }</li>
                    <li class="hits">#{ setting.id }</li>
                </ul>
            {/each}
        {/if}
    </article>
    
    <!-- 관리자에게만 출력 -->
    {#if $isAdminLoggedIn}
        <article class="btnarea_r mt30">
            <a href={ PATHS.SITE_SETTING.INSERT } class="btn btntype_bu46 bold" id="newArticleButton" style="width:160px">INSERT</a>
        </article>
    {/if}

    <article class="paging mt60">
        <a class="first" on:click={ () => changePage(1) }>FIRST</a>
        <a class="prev" on:click={ () => changePage(currentPageNo - 1) }>PREV</a>

        {#each currentGroupPages as pageNum}
            {#if pageNum === currentPageNo}
                <span>{ pageNum }</span>
            {:else}
                <a on:click={ () => changePage(pageNum) }>{ pageNum }</a>
            {/if}
        {/each}

        <a class="next" on:click={ () => changePage(currentGroupEnd + 1) }>NEXT</a>
        <a class="end" on:click={ () => changePage(totalPageNo) }>END</a>
    </article>
</section>

<Top />

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

     // 필터링 선택 시 
     .category_type_c a.selected {
        background-color: #e0aa00; 
        color: white;
    }

    .category_type_c a.selected::before {
        background-position: 0 -50px; // 체크 이미지 하얀색으로 변경 (이미지 내 위치 이동)            
    }

    li {
        list-style: none;
    }

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
        background-color: #fff8e1;
        color: #e0aa00;
        padding: 0 3px;
        font-weight: 500;
        display: inline-block;
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

    .board_list ul.nodata {
        cursor: default;
    }

    .board_list ul.nodata li {
        width: 1300px;
        height: 200px;
        font-size: 26px;
        font-weight: 300;
        text-align: center;
        line-height: 200px;
    }

    .board_list ul.nodata:hover {
        background: none;
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

    .footer {
        margin-top: 160px !important;
        padding-top: 50px;
        border-top: 1px solid #e0e2ec;
    }
</style>