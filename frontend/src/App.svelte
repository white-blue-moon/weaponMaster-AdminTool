<script>
	import { Router, Route } from 'svelte-routing'
	import { PATHS } from './constants/paths'
	import { isLoggedIn } from './utils/auth'
	import { onMount } from 'svelte'

	import Home              from './routes/Home.svelte'
	import SettingInsertPage from './routes/site_setting/SettingInsertPage.svelte'
	import SettingEditPage   from './routes/site_setting/SettingEditPage.svelte'

	import LoginPage from './routes/account/LoginPage.svelte'
	import JoinPage  from './routes/account/JoinPage.svelte'

	import AccessListPage from './routes/access_level/AccessListPage.svelte'
	import AccessEditPage from './routes/access_level/AccessEditPage.svelte'

	import InspectionListPage   from './routes/inspection/InspectionListPage.svelte'
	import InspectionInsertPage from './routes/inspection/InspectionInsertPage.svelte'
	import InspectionEditPage   from './routes/inspection/InspectionEditPage.svelte'


	onMount(() => {
		const publicPaths = [PATHS.ACCOUNT.LOGIN, PATHS.ACCOUNT.JOIN]
		const currentPath = window.location.pathname
		const isPublic    = publicPaths.some(path => currentPath.startsWith(path))

		if (!$isLoggedIn && !isPublic) {
			// 로그인 안 된 상태인데, 비공개 페이지 접근하면 리디렉트
			window.location.href = PATHS.ACCOUNT.LOGIN
		}
	})
</script>


<Router>
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
	<Route path={ PATHS.INSPECTION.LIST } 		   component={ InspectionListPage }/>
	<Route path={ PATHS.INSPECTION.INSERT } 	   component={ InspectionInsertPage }/>
	<Route path={ PATHS.INSPECTION.EDIT_TEMPLATE } component={ InspectionEditPage }/>
</Router>


<style>

</style>
