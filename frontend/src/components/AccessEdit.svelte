<script>
    import { API } from '../constants/api'
    import { apiFetch, handleApiError } from '../utils/apiFetch'
    import { ACCESS_LEVEL_TEXT } from '../constants/settingState'
    import { onMount } from "svelte"
    import { formatDate } from "../utils/time"
    import { PATHS } from '../constants/paths'
    import { adminToolToken, adminUserInfo, isAdminLoggedIn } from '../utils/auth';


    export let isInsert = false

    let url       = window.location.pathname
    let settingID = url.split('/').pop()
    let setting

    const apiUrlBase         = API.ACCESS_LEVEL
    const hrefBase           = PATHS.ACCESS_LEVEL
    const stateEntries       = Object.entries(ACCESS_LEVEL_TEXT)
    const STATE_NOT_SELECTED = -1

    onMount(async ()=> {
        await fetchSetting()
    })
    
    async function fetchSetting() {
        const response = await apiFetch(apiUrlBase.READ(settingID), {
            method: 'GET',
        }).catch(handleApiError);

        if (response != null) {
            const userInfo = response.userInfo
            setting = {
                id:          userInfo.id,
                state:       userInfo.user_type,
                title:       userInfo.user_id,
                create_date: userInfo.join_date, 
            }      
        }
    }

    // TODO 수정/삭제 권한 있는지 확인 후 조작하도록 예외처리 필요
    async function handleDelete() {
        const isConfirm = confirm(`정말 ${setting.title} 유저 정보를 삭제하시겠습니까?`);
        if (!isConfirm) {
            return
        }

        const response = await apiFetch(apiUrlBase.DELETE(settingID), {
            method: 'DELETE',
            body: JSON.stringify({
                "adminUserId": $adminUserInfo,
                "adminToken":  $adminToolToken,
            }),
        }).catch(handleApiError)

        if (response.success) {
            alert(`${setting.title} 유저 정보가 삭제되었습니다.`)
            location.href = hrefBase.LIST
            return
        }
        
        alert(`${setting.title} 유저 정보 삭제에 실패하였습니다.`)
        return
    }

    function isValidForm() {
        if (setting.state == STATE_NOT_SELECTED) {
            alert("유저의 권한 레벨이 선택되어 있지 않습니다.")
            return false
        }

        if (setting.title == "") {
            alert("유저의 아이디명이 기입되어 있지 않습니다.")
            return false
        }

        return true
    }

    async function handleEdit() {
        if (!isValidForm()) {
            return
        }

        const response = await apiFetch(apiUrlBase.UPDATE(settingID), {
            method: 'PUT',
            body: JSON.stringify({
                "setting":     setting,
                "adminUserId": $adminUserInfo,
                "adminToken":  $adminToolToken,
            }),
        }).catch(handleApiError);

        if (response.success) {
            alert('설정 수정이 반영되었습니다.')
            location.href = hrefBase.LIST
            return
        }

        alert('설정 수정 반영에 실패하였습니다.')
        return
    }
</script>


{#if setting}       
    <section class="content news">
        <div class="board_view news_view">
            <dl>
                <dt>
                    <select bind:value={ setting.state }>
                        <option class="active-not-selected" value={ STATE_NOT_SELECTED } disabled selected>
                            권한 선택
                        </option>
                        {#each stateEntries as [state, text]}
                            <option value={Number(state)}>{text}</option>
                        {/each}
                    </select>
                </dt>

                <!-- {#if siteSetting.active_state === SETTING_STATE.RESERVED}
                    <dd class="reserved">
                        <label class="reserved_label" for="reserved-date">설정 ON 예약 날짜</label>
                        <input type="datetime-local" id="reserved-date" bind:value={ reservedDate }/>
                    </dd>
                {/if} -->

                <dd>
                    <p class="title">
                        <input type="text" bind:value={ setting.title } placeholder="아이디명을 기입해 주세요.">
                    </p>
                    <p class="sinfo">
                        <span class="date">
                            { formatDate(setting.create_date) }
                        </span>
                    </p>
                </dd>
            </dl>

            <div class="bd_viewcont">
                <div class="operation_guide">
<!-- 
                    <div class="settings-container">
                        {#each Object.keys(settings) as key}
                            <div class="setting-item">
                                <div class="setting-label">{ SETTING_LABEL[key] }</div>
                                <input type="number" bind:value={ settings[key] } min="0"/>
                            </div>
                        {/each}
                    </div> -->

                </div>
            </div>
        </div>

        <article class="bdview_btnarea line">
            <div class="btnst2">
                <!-- 수정, 삭제는 관리자에게만 출력 -->
                {#if $isAdminLoggedIn}
                    <a on:click={ handleEdit } id="editButton" class="btn btntype_bk46 bold" style="width:140px">
                        {#if isInsert}
                            추가하기
                        {:else}
                            수정 완료
                        {/if}
                    </a>

                    {#if !isInsert}
                        <a on:click={ handleDelete } id="deleteButton" class="btn btntype_bk46 bold" style="width:140px">삭제</a>
                    {/if}
                {/if}
                <a href={ hrefBase.LIST } class="btn btntype_bk46 bold list" style="width:140px">목록</a>
            </div>          
        </article>

    </section>
{/if}


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
    }

    .news {
        position: relative;
    }
    
    .content {
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
    
    .board_view {
        position: relative;
        margin-top: 23px;
        width: 1300px;
    }

    .comment-count {
        margin-left: 5px !important;
        color: #3392ff;
    }
    
    .board_view dl {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .board_view dl dt {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 180px;
        height: 200px;
        border: 1px solid #e0e2ec;
        background: #f8f9fb;
        color: #36393f;
        font-size: 16px;
        font-weight: 400;
    }

    option:disabled {
        color: #3392ff !important;
    }

    .board_view dl .reserved {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 200px;
        height: 200px;
        border: 1px solid #e0e2ec;
        border-left: 0;
        background: #f8f9fb;
        color: #36393f;
        font-size: 16px;
        font-weight: 400;
    }

    .board_view dl .reserved .reserved_label {
        margin-bottom: 5px;
    }

    .board_view dl .reserved #reserved-date {
        margin: 5px;
    }

    .board_view dl dd {
        display: flex;
        flex-direction: column;
        width: 1120px;
        height: 200px;
        border: 1px solid #eeedf2;
        border-left: none;
    }
    
    .board_view dl dd p:nth-child(1) {
        padding-left: 30px;
        height: 139px;
        border-bottom: 1px solid #eeedf2;
        color: #36393f;
        font-size: 22px;
        line-height: 34px;
    }
    
    .board_view dl dd p {
        display: flex;
        align-items: center;
    }

    .board_view dl dd p.title {
        padding: 0;
    }   

    .board_view dl dd p input {
        padding: 30px;
        height: 139px;
        line-height: 70px;
        border: none;
        border-top: 0.5px solid #eeedf2;
        border-bottom: 0.5px solid #eeedf2;
        font-size: 22px;
        color: #36393f;
    }

    .board_view dl dd p input::placeholder {
        color: #6a6e76;
    }

    input[type="text"] {
        display: block;
        width: 100%;
    }
    
    .board_view dl dd p:nth-child(2) {
        padding-right: 45px;
        height: 59px;
        justify-content: end;
        color: #6a6e76;
        font-size: 13px;
        font-weight: 500;
    }
    
    .board_view dl dd p span {
        margin-left: 60px;
    }

    .board_view dl dd p.sinfo .arthor {
        margin-left: 0; /* 기본 마진 제거 */
        margin-right: auto; /* 남은 공간을 오른쪽으로 밀어 좌측 정렬 */
        padding-left: 30px;
    }
    
    .board_view dl dd p span.hits {
      padding-left: 24px;
      background: url("#{$DF_UI}/img/board/board_ico_view.png") no-repeat 0 calc(50% + 1px);
    }
    
    .board_view  .bd_viewcont {
        padding: 45px 0 95px 0;
        color: #36393f;
        font-size: 16px;
        line-height: 30px;
        font-weight: 400;

        display: flex; /* Flexbox 활성화 */
        justify-content: center; /* 가로 중앙 정렬 */
        align-items: center; /* 세로 중앙 정렬 */
    }
    
    .operation_guide {
        position: relative;
        color: #36393f;
        font-size: 16px;
        line-height: 30px;
        font-weight: 400;
    }

    :global(.operation_guide p) {
        margin: 0;
    }

    // 기본 블랙인 경우에 한해서만 색상 변경
    :global(.operation_guide p strong[style*="color: rgb(0, 0, 0)"]) {
        color: #36393f !important;
    }

    // color: rgb(57, 132, 198); -> 공홈에서 사용하는 블루 텍스트 값
    :global(.operation_guide p strong[style*="color: rgb(0, 102, 204)"]) {
        color: rgb(57, 132, 198) !important;
    }



    // ==========[ 수정 테스트 중]==========
    // 홈페이지 설정 값 입력 목록
    .settings-container {
        display: flex;
        flex-direction: column;
        gap: 1rem; /* 항목 간 간격 */
    }

    .setting-item {
        display: flex;
        align-items: center; /* 입력 칸과 라벨을 수직 중앙 정렬 */
        justify-content: flex-start; /* 좌측 정렬 */
    }

    .setting-item .setting-label {
        flex: 0 0 250px; /* 라벨의 고정 너비 설정 */
        text-align: right; /* 라벨 텍스트를 우측 정렬 */
        margin-right: 20px; /* 라벨과 입력 칸 사이 간격 */
    }
    
    .setting-item input {
        width: 80px; /* 숫자 입력 칸의 고정 너비 */
        height: 30px; /* 숫자 입력 칸의 고정 높이 */
        text-align: center; /* 숫자를 중앙 정렬 */
    }
    
    input[type="number"]::-webkit-inner-spin-button {
        opacity: 1; /* (증가/감소) 버튼 기본 숨겨진 상태 해제 */
    }
    // ==========[ 수정 테스트 중]==========



    .bdview_bnrarea {
        position: relative;
        margin-bottom: 80px;
        width: 100%;
        height: 200px;
    }
    
    .bdview_btnarea.line {
        padding-bottom: 20px;
        // border-bottom: 1px solid #eeedf2;
    }
    
    .bdview_btnarea {
        position: relative;
        vertical-align: top;
        overflow: hidden;
    }
    
    .bdview_btnarea .btnst1 {
        float: left;
    }
    
    .bdview_btnarea .btnst1 a.btncopy {
        margin-right: 25px;
    }
    
    .bdview_btnarea .btnst1 a {
        display: inline-block;
        height: 46px;
        line-height: 46px;
        color: #6a6e76;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
    }
    
    .btncopy {
        width: 49px;
        background: #484e5f url('#{$DF_UI}/img/board/board_ico_copy.png') no-repeat 50%;
        text-indent: -9999px;
    }
    
    .bdview_btnarea .btnst2 {
        float: right;
        font-size: 0;
    }
    
    .bdview_btnarea .btnst2 a {
        margin-left: 4px;
        cursor: pointer;
    }
    
    .btntype_bk46 {
        height: 46px;
        line-height: 45px;
        background: #484e5f;
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