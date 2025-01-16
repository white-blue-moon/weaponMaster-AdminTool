<script>
	import { Router, Route } from 'svelte-routing';
	import { PATHS } from './constants/paths';

	import Home from './routes/Home.svelte';
	import Login from './routes/account/Login.svelte';
	import Join from './routes/account/Join.svelte';
</script>

<Router>
	<Route path={ PATHS.HOME } component= { Home }/>
	<Route path={ PATHS.ACCOUNT.LOGIN } component= { Login }/>
	<Route path={ PATHS.ACCOUNT.JOIN } component= { Join }/>
</Router>

<style>
</style>
