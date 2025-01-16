<script>
	import { Router, Route } from 'svelte-routing';
	import { PATHS } from './constants/paths';

	import Home from './routes/Home.svelte';
	import Login from './routes/account/Login.svelte';
</script>

<Router>
	<Route path={ PATHS.HOME } component= { Home }/>
	<Route path={ PATHS.ACCOUNT.LOGIN } component= { Login }/>
</Router>

<style>
</style>
