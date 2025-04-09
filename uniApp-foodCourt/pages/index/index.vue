<template>
	<view class="indexLayout  pageBg">
		<!-- 头部导航 -->
		<custom-nav-bar></custom-nav-bar>
		<!-- banner图 -->
		<view class="banner">
			<swiper indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay>
				<!-- <swiper-item v-for="(item,index) in 3"> 
					<image :src="'/common/images/banner'+index+'.jpg'" mode="aspectFill"></image>
				</swiper-item> -->
				<swiper-item v-for="item in 3">
					<image src="/common/images/banner.jpg" mode=""></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 功能区 -->
		<view class="funcs">
			<!-- 左边功能 -->
			<view class="funcs-left" @click="ClicktoFood()">
				<uni-icons type="color" size="30" color="rgb(242, 173, 83)"></uni-icons>
				<text>配料科普</text>
			</view>
			<!-- 右边功能 -->
			<view class="funcs-right">
				<uni-icons type="camera" size="30" color="rgb(110, 195, 233)"></uni-icons>
				<text>食品扫码</text>
			</view>
		</view>
		<!-- 列表区 -->
		<view class="select">
			<common-title>
				<template #name>每日科普</template>
				<template #custom>
					<view class="date">
						<!-- 日历 -->
						<uni-icons type="calendar" size="18" ></uni-icons>
						<uni-dateformat :date="Date.now()" format="dd"></uni-dateformat>
					</view>
				</template>
			</common-title>
			<view class="content" v-for="item in 10">
				<!-- 左图 -->
				<view class="left">
					<image class="image" src="/common/images/banner.jpg" mode="aspectFill"></image>
				</view>
				<!-- 右内容 -->
				<view class="right">
					<!-- 上文字 -->
					<view class="top">
						<text class="text">名称: </text>
						<text >XXX</text>
					</view>
					<!-- 下文字 -->
					<view class="bottom">
						<text class="text">内容： </text>
						<text>你是大家伙你是大家伙你是大家伙你是大家伙</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
const ClicktoFood = () =>{
	// 实现页面跳转
	uni.navigateTo({
		url:"/pages/IngredientInfo/IngredientInfo",
	})
}
</script>

<style lang="scss">
.indexLayout{
	.banner{
		width: 750rpx;
		padding:30rpx 0;
		swiper{
			width: 750rpx;
			height: 340rpx;
			&-item{
				width: 100%;
				height: 100%;
				padding:0 30rpx;
				image{
					width:100%;
					height: 100%;
					border-radius: 15rpx;
				}
			}
		}
	}
	// 功能区
	.funcs{
		width: 690rpx;
		height: 250rpx;
		line-height:80rpx;
		background: #f9f9f9;
		margin-left: 30rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.funcs-left{
			width: 345rpx;
			margin-left: 0;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: rgb(250, 229, 208);
			color: rgb(242, 173, 83);
			border-radius: 30rpx;
			font-weight: 600;
			
		}
		.funcs-right{
			height: 100%;
			width: 345rpx;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: rgb(213, 235, 246);
			color:rgb(110, 195, 233) ;
			border-radius: 30rpx;
			font-weight: 600;
			
		}
	}
	// 列表区
	.select{
		width: 700rpx;
		padding-top: 50rpx;
		// 内容区
		.content{
			// background-color: #f9f9f9;
			border: 2px solid #ccc;
			padding: 10rpx;
			width: 100%;
			margin: 10rpx 20rpx;
			// background-color: #cacaca;
			display: flex;
			justify-content: space-between;
			justify-content: center;
			align-items: center;
			.left{
				width:200rpx;
				height: 200rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.right{
				width: 490rpx;
				height: 200rpx;
				display: flex;
				flex-direction: column;
				margin-left: 10rpx;
				// margin-top: 10rpx;
				.top{
					margin-top: 10rpx;
					margin-bottom: 30rpx;
					.text{
						color:black;
						font-size: 30rpx;
						font-weight: 600;
					}
				}
				.bottom{
					.text{
						color:black;
						font-size: 30rpx;
						font-weight: 600;
					}
				}
			}
		}
	}
}
</style>
