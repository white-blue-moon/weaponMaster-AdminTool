<script>
    // import { API } from '../../constants/api';
    // import { apiFetch, handleApiError } from '../../utils/apiFetch';
    // import { userInfo, isLoggedIn } from "../../utils/auth";
    import { PATHS } from "../../constants/paths";

    import Gnb from "../../components/Gnb.svelte";
    import VisualBanner from "../../components/VisualBanner.svelte";
    import Footer from "../../components/Footer.svelte";

    let userId = "";
    let password = "";

    function isValidForm() {
        if (userId == "") {
            alert("아이디를 입력하여 주세요");
            return false;
        }

        if (password == "") {
            alert("비밀번호를 입력하여 주세요");
            return false;
        }

        return true;
    }

    async function onSubmitLogin(event) {
        event.preventDefault();
        if (!isValidForm()) {
            return;
        }

        // const response = await apiFetch(API.ACCOUNT.LOGIN_NORMAL, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         "userId" : userId,
        //         "userPw" : password,
        //     }),
        // }).catch(handleApiError);

        // if (response.success) {
        //     alert(`로그인에 성공하였습니다. ${userId} 님 안녕하세요.`);
            
        //     // 계정 정보 Store 업데이트
        //     userInfo.set(userId); // TODO 추후 서버에서 받은 사용자 정보로 저장되도록 수정 필요
        //     isLoggedIn.set(true);

        //     window.location.href = "/";
        //     return;
        // }

        alert('로그인에 실패하였습니다. 아이디와 비밀번호를 다시 한번 확인해 주세요.');
        return;
    }
</script>


<Gnb />
<VisualBanner background="/img/svisual1.jpg" title="로그인"/>

<section class="content">
    <!-- <h3>어드민 툴에 오신 것을 환영합니다.</h3> -->

    <article class="login">
        <form action="/account/login" method="post" id="loginForm" on:submit={ onSubmitLogin }>
            <ul class="login_normal">
                <li>
                    <label for="id">아이디</label>
                    <input type="text" id="id" name="id" placeholder="아이디" bind:value={ userId } autofocus="" maxlength="24">
                </li>
                <li>
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" name="password" placeholder="비밀번호" bind:value={ password } maxlength="16">
                </li>

                <li class="msg" id="validationMsg">
                </li>

                <li class="btn">
                    <button type="submit" id="login">로그인</button>
                </li>              
            </ul>

            <ul class="login_admin">
                <li class="logo" id="weaponMasterLogo"></li>
                <li>잠깐! 아이디가 없으신가요? 회원가입 후 로그인할 수 있습니다!</li>
                <li>
                    <a href={ PATHS.ACCOUNT.JOIN }>회원가입</a>
                </li>
                <li><span>관리자 권한은 이곳 어드민 툴에서 부여 가능하며 공지사항 작성 등 권한이 주어집니다.</span></li>
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
    }

    input:focus {
      border: #e0aa00 solid 2px; /* 포커스 시 테두리 색상 */
      border-radius: 5px;
    }

    input::placeholder {
        opacity: 0.5; /* 투명도 조절 */
        margin-left: 0px;
    }

    .login .login_normal li.btn button {
        all: unset; /* 모든 기본 스타일 제거 */
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
        width: 108px;
        height: 42px;
        background: url(https://resource.df.nexon.com/ui/img/login/logo_nx.png) no-repeat;
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
