<template>
	<view class="content">
		<ChatPage title="ChatFoodCustomer" :selfAvatar= "avater" otherAvatar="https://food-court.oss-cn-hangzhou.aliyuncs.com/62.png"></ChatPage>
	</view>
</template>

	
<script setup lang="ts">
import {onMounted, ref} from "vue"
import ChatPage from '@/components/hatPagec/hatPagec.vue'
import { getUserInfoApi } from "../../API/apis";
const avater = ref("");

onMounted(async()=>{
	const result =await getUserInfoApi();
	if (result.code === 200) {
	    avater.value = result.data.avatar;
	} else {
	    uni.showToast({
	        title: '请求失败',
	        icon: 'fail',
	        duration: 1000
	    });
	    avater.value = "/static/images/avatar.jpg"
	}
})
// const result = getUserInfoApi();
</script>

<style scope lang="scss">

</style>
