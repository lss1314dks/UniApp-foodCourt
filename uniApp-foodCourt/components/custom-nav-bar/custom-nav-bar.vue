<template>
	<view class="layout">
		<view class="navbar ">
			<view class="statusBar" :style="{height:getStatusBarHeight()+'px'}"></view>
			<view class="titleBar" :style="{height:getTitleBarHeight()+ 'px'}">
				 <view class="title">
					 {{title}}
				 </view>
				 <view class="search">
					 <uni-icons class="icon" type="search" color="#888" size="18"></uni-icons>
					 <text class="text">搜索</text>
				 </view>
			 </view>
		</view>
		<view class="fill" :style="{height:getStatusBarHeight()+getTitleBarHeight()+'px'}">
			
		</view>
	</view>
</template>

<script setup lang="ts">
import {getStatusBarHeight,getTitleBarHeight} from '@/utils/system.js'

defineProps({
	title:{
		type:String,
		default: '首页'
		
		
	}
})

</script>

<style scope lang="scss">
.layout{
	.navbar{
		position: fixed;
		top:0;
		left:0;
		width: 100%;
		z-index: 10;
background: 
	linear-gradient(to bottom,transparent,#fff 400rpx),
	linear-gradient(to right,rgb(247, 242, 223),20%,rgb(222, 243, 234));
		.statusBar{}
		.titleBar{
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			.title{
				font-size: 22px;
				font-weight: 700;
				color: #000;
			}
				
			.search{
				width: 80%;
				height: 50rpx;
				border-radius: 60rpx;
				background: rgba(255, 255, 255, 0.4);
				color: #ccc;
				font-size: 28rpx;
				margin-left: 30rpx;
				display: flex;
				align-items: center;
				.icon{
					margin-left: 10rpx;
				}
				.text{
					padding-left: 10rpx;
					
				}
			}
		}
	}
}

</style>