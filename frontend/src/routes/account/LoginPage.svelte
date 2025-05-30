<script>
    import { API } from '../../constants/api'
    import { apiFetch, handleApiError } from '../../utils/apiFetch'
    import { handleCapsLock, authLogin } from "../../utils/auth"
    import { PATHS } from "../../constants/paths"

    import Gnb from "../../components/Gnb.svelte"
    import VisualBanner from "../../components/VisualBanner.svelte"
    import Footer from "../../components/Footer.svelte"
    import BoldLink from '../../components/BoldLink.svelte'
    import CapsLockWarning from '../../components/CapsLockWarning.svelte'

    let userId   = ""
    let password = ""

    let capsLockWarning = false

    function isValidForm() {
        if (userId == "") {
            alert("아이디를 입력하여 주세요")
            return false
        }

        if (password == "") {
            alert("비밀번호를 입력하여 주세요")
            return false
        }

        return true
    }

    async function onSubmitLogin(event) {
        event.preventDefault()
        if (!isValidForm()) {
            return
        }

        const response = await apiFetch(API.ACCOUNT.LOGIN, {
            method: 'POST',
            body: JSON.stringify({
                "loginInfo": {
                    "userId" : userId,
                    "userPw" : password,
                },
            }),
        }).catch(handleApiError)

        if (response.success) {
            authLogin(userId, response.token)
            alert(`로그인에 성공하였습니다.\n${userId} 님 안녕하세요.`)
            window.location.href = PATHS.HOME
            return
        }

        alert('로그인에 실패하였습니다.\n아이디와 비밀번호를 다시 한번 확인해 주세요.')
        return
    }
</script>


<Gnb />
<VisualBanner background="/img/svisual1.jpg" title="로그인"/>

<section class="content">
    <h3>아이디와 비밀번호를 입력하여 로그인해 주시기 바랍니다.</h3>

    <article class="login">
        <form id="loginForm" on:submit={ onSubmitLogin }>
            <ul class="login_normal">
                <li>
                    <label for="id">아이디</label>
                    <input type="text" id="id" name="id" placeholder="아이디" bind:value={ userId } autofocus="" maxlength="24">
                </li>
                <li>
                    <label for="password">비밀번호</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="비밀번호" 
                        bind:value={ password }
                        on:keypress={ (event) => handleCapsLock(event, (value) => capsLockWarning = value) }
                    >
                    {#if capsLockWarning}
                        <CapsLockWarning />
                    {/if}
                </li>

                <li class="msg" id="validationMsg">
                </li>

                <li class="btn">
                    <button type="submit" id="login">로그인</button>
                </li>
                
                <li class="find">
                    <a href={ PATHS.ACCOUNT.JOIN }>회원가입</a>
                </li>  
            </ul>

            <ul class="login_admin">
                <li class="logo" id="weaponMasterLogo"></li>
                <li>페이지 열람은 가능하지만, 로그인 및 회원가입은 제한되어 있습니다.</li>
                <li>
                    <a href={ PATHS.ACCOUNT.JOIN }>회원가입</a>
                </li>
                <li>
                    <span>
                        <BoldLink href={ PATHS.WEAPON_MASTER } text="웨펀마스터" /> 관리자 권한은 이곳에서 부여되며, 공지 작성 등의 기능이 제공됩니다.
                    </span>
                </li>
            </ul>
        </form>
    </article>
</section>
<Footer />


<style>
    a {
        text-decoration: none;
    }

    .content {
        position: relative;
        padding-bottom: 100px;
        margin: 0 auto;
        width: 660px;
    }

    .content h3 {
        position: relative;
        margin-top: 60px;
        color: #6a6e76;
        font-size: 16px;
        font-weight: 400;
        text-align: center;
        line-height: 25px;
    }
    
    .login {
        position: relative;
        margin: 0 auto;
        width: 560px;
    }

    .login .login_normal {
        position: relative;
        margin-top: 65px;
    }

    .login .login_normal li label {
        display: none;
    }

    .login ul {
        list-style: none;
        padding: 0;
    } 

    .login_normal li {
        margin-bottom: 10px;
    }

    .login_normal li.find {
        margin-top: 17px;
        font-size: 0;
        text-align: center;
    }

    .login_normal li.find a {
        margin-top: 5px;
        display: inline-block;
        color: #6a6e76;
        font-size: 14px;
    }

    .login_normal li.find a::after {
        content: '';
        display: inline-block;
        margin: -2px 11px 0 12px;
        width: 1px;
        height: 13px;
        background: #bec5cc;
        vertical-align: middle;
    }

    .login_normal li.find a:last-child::after {
        display: none;
    }
    
    .login_normal input {
        border: 1px solid #e1e6ee;
        background: #f8f9fb;
    }
    
    input[type="text"], input[type="password"] {
        display: block;
        width: 100%;
        height: 54px;
        color: #6a6e76;
        font-size: 16px;
        line-height: 53px;
        text-indent: 15px; /* 플레이스홀더 포함, 텍스트 입력 시작점 조정 */
        outline: none; /* 기본 포커스 스타일 제거 */
        box-sizing: border-box; /* 테두리와 패딩을 포함한 크기 계산 */
    }

    input:focus {
      border: #e0aa00 solid 1.5px; /* 포커스 시 테두리 색상 */
      border-radius: 5px;
    }

    input::placeholder {
        color: #bec5cc;
    }

    .login .login_normal li.btn button {
        all: unset; /* 모든 기본 스타일 제거 */
        margin-top: 30px;
        display: block;
        width: 560px;
        height: 61px;
        background: #e0aa00;
        line-height: 60px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
    }
 
    /* Nexon Login 스타일 */
    .login .login_admin {
        position: relative;
        margin-top: 76px;
        padding: 39px 0;
        border-radius: 4px;
        border: 1px solid #eeedf2;
        background: #f8f9fb;
        text-align: center;
    }

    .login .login_admin li.logo {
        margin: 0 auto;
        width: 114px;
        height: 42px;
        background: url(/admin-front/images/logo_blue_moon_img.png) no-repeat;
    }

    .login .login_admin li {
        margin-top: 15px;
        color: #6a6e76;
        font-size: 15px;
    }

    .login_admin span {
        display: block;
        margin-top: 10px;
        font-size: 12px;
        color: #999;
    }

    .login .login_admin li a {
        display: block;
        margin: 0 auto;
        width: 480px;
        height: 50px;
        background: #5c6377;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
    }

    .login .login_admin li span {
        color: #a2a5ac;
        font-size: 14px;
        letter-spacing: -.4px;
    }
</style>
