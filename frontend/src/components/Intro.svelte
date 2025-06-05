<script>
    import { onMount, onDestroy } from 'svelte'
    import { navigate } from 'svelte-routing'
    import { API } from '../constants/api'
    import { apiFetch, handleApiError } from '../utils/apiFetch'
    import { PATHS } from '../constants/paths'
    import { canAccessAdminPage } from '../utils/auth'
    import { ADMIN_ASSETS } from '../constants/resourcePath';


    let introOn     = false
    let removeIntro = false
    let isLoading   = false
    let skillScene

    let defaultLoadingPercent = 0    // 고정 시간 동안 진행될 로딩바 진행 상태 (0 → 100%)
    let loadingDelayPercent   = 0    // 실제 통신 진척도 로딩바 진행 상태 (0 → 100%)
    let delayProgressTimer
    
    let loadingDataAniTime  = 2200 // 기본 연출 시간 (로딩바 + 커버 전환 시간)

    let origiViewportContent;
  
    onMount(async () => {
        disableMobileZoom()
        document.addEventListener('mousedown', handleClickOutside)
        setDefaultLoadingBar()
    })

    onDestroy(() => {
        restoreMobileZoom()
        document.removeEventListener('mousedown', handleClickOutside)
    })

    // 화면을 가로지르는 초기 기본 로딩 바 연출 함수
    function setDefaultLoadingBar() {
        const loadingDataTimer = setInterval(() => {
            if (defaultLoadingPercent < 100) {
                defaultLoadingPercent += 4.545; // 2200ms 동안 100% 로 끝내기 위한 비율)
            } else {
                clearInterval(loadingDataTimer);
            }
        }, 22); // 약 2200ms
    }

    function disableMobileZoom() {
        if (!isMobile()) return

        const viewportMeta = document.querySelector('meta[name="viewport"]')
        if (viewportMeta) {
            origiViewportContent = viewportMeta.content
            viewportMeta.content = 'width=device-width, initial-scale=0.35, user-scalable=no'
            return
        }

        return
    }

    function isMobile() {
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            return true
        }

        return false
    }

    function restoreMobileZoom() {
        if (!isMobile()) return

        const viewportMeta = document.querySelector('meta[name="viewport"]')
        if (viewportMeta && origiViewportContent !== null) {
            viewportMeta.content = origiViewportContent
            return
        }

        return
    }

    // 배경 클릭 시 비밀 코드 포커스를 유지하기 위한 함수
    function handleClickOutside() {
        if (focusedIndex !== -1) {
            const input = document.getElementById(`code-${focusedIndex}`)
            requestAnimationFrame(() => input?.focus())
        }
    }

    async function fetchPassWordCheck() {
        isLoading = true
        startDelayProgress()
        
        const response = await apiFetch(API.VERIFY_ACCESS_GATE, {
            method: 'POST',
            body: JSON.stringify({
                "password": code,
            }),
        }).catch(handleApiError)

        stopDelayProgress()

        if (response.success) {
            loadingDelayPercent = 100

            // 기본 연출 시간 동안 대기 후 cover 분리 애니메이션 시작
            setTimeout(() => {
                playSkillScene()
            }, loadingDataAniTime)
            
            return
        }

        isLoading = false
        code      = ['', '', '', '', '', '']
        loadingDelayPercent = 0
        alert('잘못된 비밀번호 코드입니다.\n다시 입력해 주세요.')
        return
    }

    async function playSkillScene() {
        await skillScene.play()

        introOn = true

        setTimeout(() => {
            removeIntro = true
            canAccessAdminPage.set(true)
            sessionStorage.setItem('fromAccessGate', 'true')
            navigate(PATHS.HOME)
        }, 6450)
    }

    function startDelayProgress() {
        function loop() {
            if (loadingDelayPercent < 80) {
                loadingDelayPercent += 0.6
                delayProgressTimer = requestAnimationFrame(loop)
            }
        }

        delayProgressTimer = requestAnimationFrame(loop)
    }

    function stopDelayProgress() {
        cancelAnimationFrame(delayProgressTimer)
    }

    let code = ['', '', '', '', '', '']

    function handleInput(e, index) {
        code[index] = e.target.value

        // 현재 입력값이 있으면, 다음 칸으로 포커스 이동
        if (e.target.value && index < 5) {
            const next = document.getElementById(`code-${index + 1}`)
            next?.focus()
            return
        }

        // 값이 지워졌다면, 이전 칸으로 포커스 이동
        if (!e.target.value && index > 0) {
            const prev = document.getElementById(`code-${index}`)
            prev?.focus()
            return
        }

        // 마지막 칸 값 입력하면 API 호출
        if (index === 5 && e.target.value) {
            e.target.blur()
            fetchPassWordCheck()
            return
        }
    }

    // Backspace 키 눌렀을 때, 현재 칸이 비어 있으면 이전 칸으로 포커스 이동
    function handleKeyDown(e, index) {
        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                const prev = document.getElementById(`code-${index - 1}`)
                prev?.focus()
                return
            }
        }
    }

    // input 각각의 disabled 상태를 담는 배열
    let disabledInputs = []
    $: disabledInputs  = code.map((_, i) => isDisabled(i))

    function isDisabled(i) {
        if (isLoading) { return true }

        // 첫 번째 칸은 항상 활성화
        if (i === 0) { return false }

        // 이전 칸이 비어 있으면 비활성화
        if (code[i - 1] === '') { return true }

        return false
    }

    let focusedIndex = -1

    function handleFocus(index) {
        focusedIndex = index
    }
</script>


{#if !removeIntro}
    <div class="intro {introOn ? 'on' : ''}">
        <div class="cover1 cover"></div>
        <div class="cover2 cover">  
            <div class="code-inputs">
                {#each code as _, i}
                    <input
                        id="code-{i}"
                        class="code-box"
                        maxlength="1"
                        autocomplete="off"
                        inputmode="numeric"
                        disabled={ disabledInputs[i] }
                        bind:value={ code[i] }
                        on:input={ (e) => handleInput(e, i) }
                        on:keydown={ (e) => handleKeyDown(e, i) }
                        on:focusin={ () => handleFocus(i) }
                    />
                {/each}
            </div>
            {#if $canAccessAdminPage}
                <div class="authenticated-message">
                    <p>접근 권한이 이미 확인되었습니다.</p>
                </div>
            {/if}
        </div>
        <div class="loading_data" style="width: {defaultLoadingPercent}vw;"></div>
        <div class="loading_delay" style="width: {loadingDelayPercent}vw;"></div>
    </div>
{/if}
<!-- muted: 음소거, playsinline: 모바일에서 전체화면 방지 -->
<video
    bind:this={ skillScene }
    src="{ADMIN_ASSETS}/video/skill_scene_medic.mp4"
    preload="auto"
    muted
    playsinline
    class="skill-scene"
></video>

  
<style>
.intro{position:fixed;left:0;top:0;height:100vh;background:url('/admin-front/images/intro_logo.png') 50% 50% no-repeat #151922;z-index:200}
.intro .cover1{position:absolute;left:0;top:0;width:100vw;height:50vh;background:#151922;z-index:100}
.intro .cover2{position:absolute;left:0;top:50%;width:100vw;height:50vh;background:#151922;overflow:hidden}
.intro .cover:after{content:'';display:block;position:absolute;left:calc(50% - 121px);bottom:-69px;width:242px;height:125px;background:url('/admin-front/images/intro_logo.png') 50% 0 no-repeat}
.intro .cover2:after{bottom:auto;top:69px;height:81px;background-position:50% 100%}
.intro .loading_data{transition:1s;position:absolute;left:0;top:50%;width:0vw;height:1px;background:#e0aa00;opacity:0.4}
.intro .loading_delay{transition:2s;position:absolute;left:0;top:50%;width:0vw;height:1px;background:#e0aa00;opacity:1}
.intro.on .loading_data{transition:0.3s;opacity:0;}
.intro.on .loading_delay{transition:0.3s;opacity:0;}
.intro.on .cover1{transition:1s;top:-61vh}
.intro.on .cover2{transition:1s;top:111vh}

.authenticated-message {
    text-align: center;
    margin-top: 10vh;
    color: #b0b0b0;
}

.authenticated-message p {
    padding-left: 9px;
}

.code-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-top: 48px;
}

.code-box {
  width: 40px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 6px;
  background: #1a1a1a;
  color: white;
  outline: none;
}

.code-box:focus {
  border-color: #e0aa00;
}

.skill-scene {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: 10;
    pointer-events: none;
}
</style>
  