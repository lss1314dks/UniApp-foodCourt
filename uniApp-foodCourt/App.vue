<template>
	<view id="app">
		<router-view></router-view>
	</view>
</template>
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 应用启动时检查登录状态
			        const isLoggedIn = uni.getStorageSync('userToken');
			        if (!isLoggedIn) {
			            // 如果未登录，跳转到登录页
			            uni.reLaunch({
			                url: '/pages/Login/Login'
			            });
			        }
		},
		onShow: function() {
			// 页面显示时检查登录状态
			        const isLoggedIn = uni.getStorageSync('userToken');
			        const currentPages = getCurrentPages();
			        const currentPage = currentPages[currentPages.length - 1];
			        if (isLoggedIn && currentPage.route === 'pages/Login/Login') {
			            // 如果已登录且当前页面是登录页，跳转到首页
			            uni.reLaunch({
			                url: '/pages/index/index'
			            });
			        }
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
/*每个页面公共css */
@import "common/style/common-style.scss"
</style>
