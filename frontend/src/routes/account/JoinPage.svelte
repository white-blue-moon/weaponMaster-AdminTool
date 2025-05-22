<script>
    import { API } from '../../constants/api'
    import { PATHS } from '../../constants/paths'
    import { apiFetch, handleApiError } from '../../utils/apiFetch'
    
    import Gnb from '../../components/Gnb.svelte'
    import VisualBanner from '../../components/VisualBanner.svelte'
    import Footer from '../../components/Footer.svelte'
    import AgreeBox from '../../components/AgreeBox.svelte'
    import YellowButton from '../../components/YellowButton.svelte'
    import Spinner from '../../components/Spinner.svelte'


    let userId          = ""
    let password        = ""
    let confirmPassword = ""
    let token           = ""

    let isUserIdAvailable = false
    let isChecking        = false
    let isSubmitting      = false

    let agree      = false
    let agreeOk    = false
    let joinOk     = false

    async function checkDuplicateId() {
        if (!isUserIdVaild()) {
            alert("아이디는 영문자와 숫자만 조합해서 입력해 주세요")
            return
        }

        isChecking = true

        const response = await apiFetch(API.ACCOUNT.ID_CHECK(userId), {
            method: 'GET',
        }).catch(handleApiError)

        isUserIdAvailable = response.success
        if (isUserIdAvailable) {
            isChecking = false
            alert('사용 가능한 아이디입니다')
            return
        }

        isChecking = false
        alert('이미 존재하는 아이디입니다')
        return
    }

    function isUserIdVaild() {
        const userIdRegex = /^[A-Za-z0-9]+$/
        if (userIdRegex.test(userId)) {
            return true
        }

        return false
    }

    function isValidForm() {
        if (userId.trim() == "" || password.trim() == "" || confirmPassword.trim() == "" || token.trim() == "") {
            alert('비어 있는 입력칸을 입력 후 시도해 주세요')
            return false
        }
        
        if (!isUserIdAvailable) {
            alert("ID 중복 확인 후 다시 시도해 주세요")
            return false
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다 다시 확인해 주세요")
            return false
        }

        return true
    }

    async function onSubmitJoin(event) {
        event.preventDefault()
        if (!isValidForm()) {
            return
        }

        isSubmitting = true

        const response = await apiFetch(API.ACCOUNT.JOIN, {
            method: 'POST',
            body: JSON.stringify({
                "userInfo": {
                    "userId": userId,
                    "userPw": password,
                    "token":  token,
                },
            }),
        }).catch(handleApiError)

        if (response.success) {
            isSubmitting = false
            alert('회원가입이 완료되었습니다.')
            window.location.href = PATHS.HOME
            return
        }

        isSubmitting = false
        alert('회원가입에 실패하였습니다.')
        return
    }

    function onClick() {
        if (!agree) {
            alert('서비스 이용을 위해 동의가 필요합니다.')
            return
        }

        agreeOk = true
        return
    }
</script>


<Gnb />
<VisualBanner background="/img/svisual2.jpg" title="회원가입"/>

<section class="step">
    <p class="{ (!agreeOk && !joinOk) ? "active" : "" }">약관동의</p>
    <p class="{ (agreeOk  && !joinOk) ? "active" : "" }">가입하기</p>
</section>
<section class="content">
    <main>
        {#if !agreeOk && !joinOk}
            <AgreeBox bind:agree={ agree } />
            <YellowButton text="확인" on:click={ onClick } />
        {:else if agreeOk && !joinOk}
            <form on:submit={ onSubmitJoin }>
                <div class="form-row">
                    <label for="userId">아이디<span class="required">*</span></label>
                    <input id="userId" type="text" 
                        bind:value= { userId } 
                        placeholder="영문 및 숫자 조합" 
                        on:input={ () => isUserIdAvailable = false }
                    />

                    <button type="button" class="secondary-button" on:click={ checkDuplicateId }>
                        {#if isChecking} <Spinner colorTheme="white"/> {/if} 중복확인 
                    </button>
                </div>

                <div class="form-row">
                    <label for="password">비밀번호<span class="required">*</span></label>
                    <input id="password" type="password" bind:value={ password } placeholder="비밀번호를 입력하세요" />
                </div>

                <div class="form-row">
                    <label for="confirmPassword">비밀번호 확인<span class="required">*</span></label>
                    <input id="confirmPassword" type="password" bind:value={ confirmPassword } placeholder="비밀번호를 다시 입력하세요" />
                </div>

                <div class="form-row">
                    <label for="adminToken">관리자 토큰<span class="required">*</span></label>
                    <input id="adminToken" type="password" bind:value={ token } placeholder="관리자 전용 토큰을 입력해 주세요" />
                </div>

                <div class="form-row">
                    <button type="submit" class="submit-button">
                        {#if isSubmitting} <Spinner colorTheme="white"/> {/if} 가입하기  
                    </button>
                </div>
            </form>
        {/if}
    </main>
</section>

<Footer />


<style lang="scss">
    * {
        margin: 0;
        padding: 0;

    }

    .step {
        position: relative;
        width: 100%;
        height: 120px;
        background: #f8f9fb;
        border-bottom: 1px solid #e0e2ec;
        font-size: 0;
        text-align: center;
        line-height: 118px;
    }

    .step p.active {
        color: #151518;
    }

    .step p {
        display: inline-block;
        padding-right: 25px;
        margin-right: 19px;
        color: #bec5cc;
        font-size: 20px;
        background: url(#{$DF_UI}/img/mem/ico_arrow.png) no-repeat 100% 53px;
    }

    .step p:last-child {
        margin-right: 0;
        padding-right: 0;
        background: none;
    }

    .content {
        position: relative;
        padding-bottom: 100px;
        margin: 0 auto;
        width: 660px;
    }

    main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 40px;
    }

    form {
        width: 560px;
        background: #fff;
        padding: 20px 30px;
    }

    /* 각 항목 줄 간격 */
    .form-row {
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;
        width: 100%;
    }

    label {
        height: auto;
        font-size: 14px;
        color: #6a6e76;
        margin-bottom: 6px;
        width: auto;
    }

    input {
        font-size: 16px;
        padding: 12px 8px;
        border: none;
        border-bottom: 2px solid #e1e6ee;
        background: transparent;
        color: #333;
        box-sizing: border-box;
        transition: border-color 0.3s ease;
    }

    input:focus {
        outline: none;
        border-bottom: 2px solid #e0aa00;
    }

    input::placeholder {
        color: #aaa;
        opacity: 0.7;
    }

    button {
        height: 54px;
        padding: 0 20px;
        font-size: 16px;
        color: #fff;
        border: none;
        cursor: pointer;
        background: #e0aa00;
        white-space: nowrap;
    }

    /* 중복확인 버튼 */
    .secondary-button {
        margin-top: 10px;
        background: #fff;
        color: #e0aa00;
        border: 1px solid #e0aa00;
        height: 48px;
        align-self: flex-start;
    }

    .secondary-button:hover {
        background: #e0aa00;
        color: #fff;
    }

    /* 가입 버튼 */
    .submit-button {
        background: #e0aa00;
        color: #fff;
        width: 100%;
        text-align: center;
        height: 52px;
    }

    .required {
        color: red;
        margin-left: 5px;
    }
</style>

