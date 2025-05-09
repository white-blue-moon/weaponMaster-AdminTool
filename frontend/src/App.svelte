<script>
	import { Router, Route } from 'svelte-routing'
	import { PATHS } from './constants/paths'
	import { isLoggedIn } from './utils/auth'
	import { onMount } from 'svelte'
	import { canAccessAdminPage } from './utils/auth'
	import { navigate } from 'svelte-routing'

	import AccessGate from './routes/AccessGate.svelte'
	import Home              from './routes/Home.svelte'
	import SettingInsertPage from './routes/site_setting/SettingInsertPage.svelte'
	import SettingEditPage   from './routes/site_setting/SettingEditPage.svelte'

	import LoginPage from './routes/account/LoginPage.svelte'
	import JoinPage  from './routes/account/JoinPage.svelte'

	import AccessListPage from './routes/access_level/AccessListPage.svelte'
	import AccessEditPage from './routes/access_level/AccessEditPage.svelte'

	import MaintenanceListPage   from './routes/maintenance/MaintenanceListPage.svelte'
	import MaintenanceInsertPage from './routes/maintenance/MaintenanceInsertPage.svelte'
	import MaintenanceEditPage   from './routes/maintenance/MaintenanceEditPage.svelte'
  	
	import NotFoundPage from './components/NotFoundPage.svelte';


	onMount(() => {
		// 홈페이지 접근 비밀번호 입력해야 하는 상태면 ACCESS_GATE 로 리다이렉트
		if (!$canAccessAdminPage) {
			navigate(PATHS.ACCESS_GATE, { replace: true })
			return
		}

		const publicPaths = [PATHS.ACCOUNT.LOGIN, PATHS.ACCOUNT.JOIN]
		const currentPath = window.location.pathname
		const isPublic    = publicPaths.some(path => currentPath.startsWith(path))

		// 로그인 안 된 상태인데, 비공개 페이지 접근하면 리다이렉트
		if (!$isLoggedIn && !isPublic) {
			navigate(PATHS.ACCOUNT.LOGIN, { replace: true })
			return
		}
	})
</script>


<Router>
	<!-- 페이지 자체 접근 제한 -->
	<Route path={ PATHS.ACCESS_GATE } component={ AccessGate }/>

	<!-- 홈, 홈페이지 설정 관련 -->
	<Route path={ PATHS.HOME } 						 component={ Home }/>
	<Route path={ PATHS.SITE_SETTING.INSERT } 		 component={ SettingInsertPage }/>
	<Route path={ PATHS.SITE_SETTING.EDIT_TEMPLATE } component={ SettingEditPage }/>

	<!-- 로그인 관련 -->
	<Route path={ PATHS.ACCOUNT.LOGIN } component={ LoginPage }/>
	<Route path={ PATHS.ACCOUNT.JOIN }  component={ JoinPage }/>

	<!-- 권한관리 -->
	<Route path={ PATHS.ACCESS_LEVEL.LIST } 		 component={ AccessListPage }/>
	<Route path={ PATHS.ACCESS_LEVEL.EDIT_TEMPLATE } component={ AccessEditPage }/>

	<!-- 점검 제어 -->
	<Route path={ PATHS.MAINTENANCE.LIST } 		   component={ MaintenanceListPage }/>
	<Route path={ PATHS.MAINTENANCE.INSERT } 	   component={ MaintenanceInsertPage }/>
	<Route path={ PATHS.MAINTENANCE.EDIT_TEMPLATE } component={ MaintenanceEditPage }/>

	<!-- 잘못된 경로 -->
	<Route path="*" component={ NotFoundPage } />
</Router>


<style>

</style>
