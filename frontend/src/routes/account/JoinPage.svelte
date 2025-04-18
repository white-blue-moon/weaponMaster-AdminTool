<script>
    import { API } from '../../constants/api'
    import { PATHS } from '../../constants/paths'
    
    import Gnb from '../../components/Gnb.svelte'
    import VisualBanner from '../../components/VisualBanner.svelte'
    import Footer from '../../components/Footer.svelte'


    let userId          = ""
    let isUserIdExist   = true
    let password        = ""
    let confirmPassword = ""

    // TODO 유저 아이디, 혹은 password 를 다시 입력하는 경우 관련 valid 변수 다시 false 로 바꾸는 함수 필요
    async function checkDuplicateId() {
        const response = await apiFetch(API.ACCOUNT.ID_CHECK(userId), {
            method: 'GET',
        }).catch(handleApiError)

        if (response.success) {
            alert('사용 가능한 아이디입니다')
            isUserIdExist = false
            return
        }

        alert('이미 존재하는 아이디입니다')
        isUserIdExist = true
        return
    }

    function isValidForm() {
        if (userId.trim() == "" || password.trim() == "" || confirmPassword.trim() == "") {
            alert('비어 있는 입력칸을 입력 후 다시 시도해 주세요.')
            return false
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다. 다시 확인해 주세요.")
            return false
        }

        if (isUserIdExist) {
            alert("이미 존재하는 유저아이디입니다. 새로운 아이디로 시도해 주세요.")
            return false
        }

        return true
    }

    async function onSubmitJoin(event) {
        event.preventDefault()
        if (!isValidForm()) {
            return
        }

        const response = await apiFetch(API.ACCOUNT.JOIN, {
            method: 'POST',
            body: JSON.stringify({
                "userId": userId,
                "userPw": password,
            }),
        }).catch(handleApiError)

        if (response.success) {
            alert('회원가입이 완료되었습니다.')
            window.location.href = PATHS.HOME
            return
        }

        alert('회원가입에 실패하였습니다.')
        return
    }
</script>

<Gnb />
<VisualBanner background="/img/svisual2.jpg" title="회원가입"/>
<main>
    <form on:submit={ onSubmitJoin }>
        <div class="form-row">
            <label for="userId">아이디<span class="required">*</span></label>
            <input id="userId" type="text" bind:value={ userId } placeholder="6자 이상 영문 및 숫자 조합" />
            <button type="button" class="secondary-button" on:click={ checkDuplicateId }>중복확인</button>
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
            <button type="submit" class="submit-button">가입하기</button>
        </div>
    </form>
</main>
<Footer />


<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: #f9f9f9;
        padding: 40px;
    }

    form {
        width: 560px;
        background: #fff;
        padding: 20px 30px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    label {
        height: auto;
        font-size: 14px;
        color: #6a6e76;
        width: 120px; /* 고정된 레이블 너비 */
    }

    input {
        flex: 1;
        height: 54px;
        padding: 0 10px;
        font-size: 16px;
        border: 1px solid #e1e6ee;
        background: #f8f9fb;
        color: #6a6e76;
        box-sizing: border-box;
        outline: none; /* 기본 포커스 스타일 제거 */
    }

    input:focus {
      border: #e0aa00 solid 2px; /* 포커스 시 테두리 색상 */
      border-radius: 5px;
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
        white-space: nowrap; /* 텍스트 줄바꿈 방지 */
    }

    button:hover {
        background: #e0aa00;
    }

    .secondary-button {
        margin-left: 10px;
        background: #fff;
        color: #e0aa00;
        border: 1px solid #e0aa00;
        height: 54px;
    }

    .secondary-button:hover {
        background: #e0aa00;
        color: #fff;
    }

    .submit-button {
        background: #e0aa00;
        color: #fff;
        width: 100%;
        text-align: center;
    }

    .required {
        color: red;
        margin-left: 5px;
    }
</style>

