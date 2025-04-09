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
				<swiper-item v-for="item in 4">
					<image :src="`/common/images/banner`+item+`.jpg`" mode=""></image>
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
			<view class="funcs-right" @click="opencanvas">
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
			<view class="content" v-for="(item,index) in formData" :key="index" @click="clickToBaidu(item.baiduLink)">
				<!-- 左图 -->
				<view class="left">
					<image class="image" :src="item.image" mode="aspectFill"></image>
				</view>
				<!-- 右内容 -->
				<view class="right">
					<!-- 上文字 -->
					<view class="top">
						<text class="text">名称: </text>
						<text >{{item.name}}</text>
					</view>
					<!-- 下文字 -->
					<view class="bottom">
						<text class="text">内容： </text>
						<text>{{item.content}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// 模拟数据
const formData = reactive([
 {
    image: '/static/images/fruit.jpg', // 模拟的图片路径
    name: '水果',
    content: '水果是指那些富含水分、糖分和维生素的植物产物，有助于保持身体健康。',
    baiduLink: 'https://baike.baidu.com/item/水果', // 百度百科链接
  },
  {
    image: '/static/images/vegetable.jpg', // 模拟的图片路径
    name: '蔬菜',
    content: '蔬菜是指可以食用的植物的绿色部分，含有丰富的纤维素、维生素和矿物质。',
    baiduLink: 'https://baike.baidu.com/item/蔬菜', // 百度百科链接
  },
  {
    image: '/static/images/egg.jpg', // 模拟的图片路径
    name: '鸡蛋',
    content: '鸡蛋是鸟类（如鸡）产下的卵，是高蛋白的食物，富含人体所需的多种营养成分。',
    baiduLink: 'https://baike.baidu.com/item//鸡蛋', // 百度百科链接
  },
  {
    image: '/static/images/rice.jpg', // 模拟的图片路径
    name: '米饭',
    content: '米饭是人类日常生活中最常见的主食之一，含有丰富的碳水化合物。',
    baiduLink: 'https://baike.baidu.com/item/米饭', // 百度百科链接
  },
  {
    image: '/static/images/bread.jpg', // 模拟的图片路径
    name: '面包',
    content: '面包是一种由面粉、酵母和水等制成的食品，通常通过烘焙的方法制作。',
    baiduLink: 'https://baike.baidu.com/item/面包', // 百度百科链接
  },
  {
    image: '/static/images/milk.jpg', // 模拟的图片路径
    name: '牛奶',
    content: '牛奶是来自母牛的乳液，富含蛋白质、钙、维生素D等营养成分。',
    baiduLink: 'https://baike.baidu.com/item/牛奶', // 百度百科链接
  }
])
	
const ClicktoFood = () =>{
	// 实现页面跳转
	uni.navigateTo({
		url:"/pages/IngredientInfo/IngredientInfo",
	})
}

const clickToBaidu = (url)=>{
	uni.navigateTo({
		url:'/pages/web-view/web-view?url='+url
	})
}

const opencanvas = () =>{
	uni.chooseImage({
	    count: 1, // 默认选择1张图片
	    sourceType: ['camera'], // 限制只能从相机拍摄
	    success: function(res) {
	      const filePath = res.tempFilePaths[0]; // 获取图片路径
	      // uploadImage(filePath); // 上传图片进行识别
		  console.log("hello  "+filePath)
	    },
	    fail: function(error) {
	      console.log('选择图片失败', error);
	    }
	  });
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
			border: 2px solid #fff;
			box-shadow: 2px 2px 1px #ccc;
			border-radius: 30rpx;
			padding: 10rpx;
			width: 100%;
			margin: 50rpx 20rpx;
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
					border-radius: 10px;
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
