<script>
    export let agree  = false;
    export let height = "185px";

    export let subTitle  = "Admin Tool 서비스 제공을 위해 필요한 최소한의 개인정보입니다.";
    export let table1    = "서비스 제공 및 개선, 서비스 이용분석";
    export let table2    = "Admin Tool ID, 비밀번호, 서비스 이용 기록, 이용 콘텐츠 및 활동 정보";
    export let table3    = "사용자가 삭제를 요청하거나, Admin Tool 서비스 종료 시까지";
    export let bottomTip = "동의를 거부할 권리가 있으나, 동의를 거부할 경우 서비스 이용이 불가능 합니다.";
</script>


<article class="agreebox">
    <dl>
        <dt>
            <input
                class="agrees"
                type="checkbox"
                name="privacyCheck"
                id="privacyCheck"
                bind:checked={ agree }
            />
            <label for="privacyCheck">
            <span></span>개인정보 수집 및 이용 동의
            </label>
        </dt>
        <dt class="stxt">
            { subTitle }
        </dt>
        <dd style="height:{ height };">
            <p>다음과 같이 개인정보를 수집 및 이용하고 있습니다.</p>
            <table class="table-agreement">
            <thead>
                <tr>
                <th class="table-left">수집 및 이용 목적</th>
                <th>항목</th>
                <th class="table-left">보유 및 이용기간</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td rowspan="2" class="table-center">
                    { @html table1 }
                </td>
                <td class="table-left">
                    { @html table2 }
                </td>
                <td rowspan="2" class="table-left">
                    <strong>
                        { @html table3 }
                    </strong>
                </td>
                </tr>
            </tbody>
            </table>
            <p>&nbsp;</p>
            <p>{ bottomTip }</p>
        </dd>
    </dl>
</article>


<style lang="scss">
    p {
        margin: 0 !important;
    }

    .agreebox {
        position: relative;
    }

    .agreebox dl {
        position: relative;
        margin-top: 55px;
    }

    .agreebox dl dt.stxt {
        margin-top: 7px;
        color: #6a6e76;
        font-size: 14px;
    }

    .stxt {
        margin-top: 7px;
        color: #6a6e76;
        font-size: 14px;
    }

    .agreebox dl dd {
        margin-top: 26px;
        margin-left: 0;
        padding: 15px 20px;
        overflow-y: scroll;
        background: #f8f9fb;
        border: 1px solid #eeedf2;
        border-radius: 4px;
        color: #6a6e76;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: -0.35px
    }

    .agreebox dl dd b {
        font-weight: 500;
    }

    .agreebox table {
        margin: 10px 0;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc
    }

    .agreebox table td {
        padding: 5px 10px;
        border-top: 1px solid #ccc;
        font-size: 13px;
        line-height: 150%;
        text-align: center;
    }

    input[type="checkbox"] {
        display: none;
    }

    input[type="checkbox"] + label {
        color: #151518;
        font-size: 21px;
        letter-spacing: -.9px;
        line-height: 28px;
        cursor: pointer;
    }

    input[type="checkbox"] + label span {
        display: inline-block;
        margin: -6px 8px 0 0;
        width: 24px;
        height: 24px;
        background: url("#{$DF_UI}/img/form/chkbox.png") no-repeat;
        vertical-align: middle;
        cursor: pointer
    }

    input[type="checkbox"]:checked + label span {
        background: url("#{$DF_UI}/img/form/chkbox.png") no-repeat 0 -100px
    }

    /* 공통 테이블 스타일 */
    .table-agreement {
        border: 1px solid #c7c7c7;
        border-collapse: collapse;
        width: 100%;
        font-size: 13px;
        color: #666;
    }

    /* 셀 스타일 */
    .table-agreement th,
    .table-agreement td {
        padding: 3px 20px 2px;
        border: 1px solid #e7e7e7;
        text-align: center;
        vertical-align: middle;
        line-height: 1.4;
    }

    /* 헤더 셀 스타일 */
    .table-agreement thead th {
        background-color: #f3f3f3;
        font-weight: bold;
    }

    /* 일반 셀 */
    .table-agreement td {
        background-color: #fff;
    }

    /* 좌측 정렬 텍스트 */
    .table-agreement .align-left {
        text-align: left;
    }

    /* 우측 병합된 셀 스타일 */
    .table-agreement .rowspan-cell {
        font-weight: bold;
    }

    .agreebox p {
        margin: 8px 0;
        line-height: 1.6;
        color: #666;
    }
</style>