<script>
    import { createEventDispatcher } from 'svelte'  


    const dispatch = new createEventDispatcher()

    let searchKeyword = ""
    let searchInput   = ""

    function handleSearch() {
        searchKeyword  = searchInput
        dispatch('search', { keyword: searchKeyword })
    }

    function clearSearch() {
        searchKeyword = ""
        searchInput   = ""
        dispatch('search', { keyword: "" })
    }
</script>


<div class="board_srch">
    <div class="select_gy" style="width:120px">
        <div class="select">
            <!-- <select id="searchType">
                <option value="1">제목+본문</option>
                <option value="2">제목</option>
            </select> -->
            <div class="select-element">
                <span class="active-option">제목</span>
                <!-- <div class="option-list" style="max-height: 205px; height: 84px;">
                    <ul>
                        <li data-value="1">제목+본문</li>
                        <li data-value="2">제목</li>
                    </ul>
                </div> -->
            </div>
        </div>
    </div>
    <div class="bs_ipt">
        <input
            type="text"
            id="searchKeyword"
            bind:value={ searchInput }
            class="search_input"
            autocomplete="off"
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
        >
        <a class="btn_del" style:display={ searchInput ? 'block' : 'none' } on:click={ clearSearch }>삭제</a>
        <label id="searchButton" on:click={ handleSearch }></label>
    </div>
</div>


<style lang="scss">
    * {
        margin: 0;
        box-sizing: border-box;
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

    /* select {
        display: none;
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
    } */

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
</style>