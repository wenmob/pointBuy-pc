<template>
	<div id="app" v-cloak>
		<router-view/>
		<div class="shadow">
			<register v-show="changeShadowShow=='register'" ref="register"></register>
			<login v-show="changeShadowShow=='login'" ref="login"></login>
		</div>
	</div>
</template>

<script>
	import Register from '@/components/user/register';
	import Login from '@/components/user/login';
	export default {
	    name: 'App',
	    data () {
	      return {
	
	      }
	    },
	    computed: {
	      changeShadowShow() {
	        return this.$store.state.signpop;
	      }
	    },
		components: {
			Register,
			Login,
		},
	}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
[v-cloak] {
    display: none;
  }
</style>

