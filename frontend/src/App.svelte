<script>
	import { Router, Route } from 'svelte-routing'
	import { PATHS } from './constants/paths'

	import Home from './routes/Home.svelte'
	import SiteSettingInsert from './routes/site_setting/SiteSettingInsert.svelte'
	import SiteSettingEdit from './routes/site_setting/SiteSettingEdit.svelte'

	import Login from './routes/account/Login.svelte'
	import Join from './routes/account/Join.svelte'

	import AccessLevelList from './routes/access_level/AccessLevelList.svelte'
	import AccessLevelInsert from './routes/access_level/AccessLevelInsert.svelte'
	import AccessLevelEdit from './routes/access_level/AccessLevelEdit.svelte'
</script>


<Router>
	<!-- 홈, 홈페이지 설정 관련 -->
	<Route path={ PATHS.HOME } component= { Home }/>
	<Route path={ PATHS.SITE_SETTING.INSERT } component= { SiteSettingInsert }/>
	<Route path={ PATHS.SITE_SETTING.EDIT_TEMPLATE } component= { SiteSettingEdit }/>

	<!-- 로그인 관련 -->
	<Route path={ PATHS.ACCOUNT.LOGIN } component= { Login }/>
	<Route path={ PATHS.ACCOUNT.JOIN }  component= { Join }/>

	<!-- 권한 부여 -->
	<Route path={ PATHS.ACCESS_LEVEL.LIST } component= { AccessLevelList }/>
	<Route path={ PATHS.ACCESS_LEVEL.INSERT } component= { AccessLevelInsert }/>
	<Route path={ PATHS.ACCESS_LEVEL.EDIT_TEMPLATE } component= { AccessLevelEdit }/>
</Router>


<style>

</style>
