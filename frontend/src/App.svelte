<script>
	import { Router, Route } from 'svelte-routing';
	import { PATHS } from './constants/paths';

	import Home from './routes/Home.svelte';
</script>

<Router>
	<Route path={ PATHS.HOME } component= { Home }/>
</Router>

<style>
</style>
