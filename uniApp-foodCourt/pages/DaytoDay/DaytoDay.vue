<template>
  <view class="container">
    <view class="header">
		<view>
			<button class="back-button" @click="handleBack">
			  <uni-icons type="left" size="20" color="#4CAF50"></uni-icons>
			</button>
		</view>
	  <view class="item" style="">
		  <view class="title" style="color:#4CAF50; font-weight: 600;">
			  <text>每日推荐</text>
		  </view>
	  </view>
	  <view class="right" style="width: 50px;"> 
	  </view>
    </view>
    
    <view class="content">
      <text class="food-title">
        地中海沙拉
        <text class="badge">推荐</text>
      </text>
      
      <image class="food-image" src="https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" mode="aspectFill"></image>
      
      <text class="food-description">
        富含抗氧化物质，有助于心血管健康。这道沙拉融合了新鲜蔬菜、橄榄和菲达奶酪，淋上特制橄榄油酱汁，是地中海饮食的代表作。
      </text>
      
      <view class="prep-time">
        <uni-icons type="time" size="16" color="#FF9800"></uni-icons>
        <text>准备时间: 15分钟</text>
      </view>
      
      <view class="nutrition-info">
        <view class="nutrition-item">
          <text class="nutrition-value">320</text>
          <text class="nutrition-label">千卡</text>
        </view>
        <view class="nutrition-item">
          <text class="nutrition-value">18g</text>
          <text class="nutrition-label">蛋白质</text>
        </view>
        <view class="nutrition-item">
          <text class="nutrition-value">22g</text>
          <text class="nutrition-label">碳水化合物</text>
        </view>
        <view class="nutrition-item">
          <text class="nutrition-value">15g</text>
          <text class="nutrition-label">脂肪</text>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">主要食材</view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in ingredients" :key="index">
            <uni-icons :type="item.icon" size="16" color="#4CAF50"></uni-icons>
            <text>{{ item.name }}</text>
          </view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">健康益处</view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in benefits" :key="index">
            <uni-icons :type="item.icon" size="16" color="#4CAF50"></uni-icons>
            <text>{{ item.name }}</text>
          </view>
        </view>
      </view>
      
      <view class="action-buttons">
        <button class="secondary-button" @click="handleFavorite">
          <uni-icons type="star" size="16" color="#4CAF50"></uni-icons>
          <text>确定</text>
        </button>
        <!-- <button class="primary-button" @click="handleStartCooking">
          <uni-icons type="spoon" size="16" color="#ffffff"></uni-icons>
          <text>开始制作</text>
        </button> -->
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDailyRecommendations } from '../../API/apis'


// 模拟数据
const ingredients = ref([
  { icon: 'circle', name: '混合生菜 (100g)' },
  { icon: 'circle', name: '樱桃番茄 (50g)' },
  { icon: 'circle', name: '菲达奶酪 (30g)' },
  { icon: 'circle', name: '卡拉马塔橄榄 (20g)' },
  { icon: 'circle', name: '特级初榨橄榄油 (15ml)' }
])

const benefits = ref([
  { icon: 'heart', name: '降低心血管疾病风险' },
  { icon: 'person', name: '改善认知功能' },
  { icon: 'fire', name: '促进新陈代谢' }
])


//获得食品id
// console.log(foodId)

// 获取页面参数
// const foodId = ref('')
onLoad((options) => {
})

// 返回上一页
const handleBack = () => {
  uni.navigateBack()
}

// 收藏功能
const handleFavorite = () => {
  uni.showToast({
    title: '确定成功',
    icon: 'success'
  })
  uni.reLaunch({
  	url:"/pages/index/index"
  })
}

// 开始制作
const handleStartCooking = () => {
  uni.navigateTo({
    url: '/pages/cooking/index?id=' + foodId.value
  })
}

const getInfo = async(id)=>{
	const result = await getDailyRecommendations(id);
	console.log(result.data);
}

onMounted(()=>{
	// 或同步读取（更推荐）
	  const storedData = uni.getStorageSync('foodId');
	  if (storedData?.data !== undefined) {
	    console.log('同步读取:', storedData.data); // 输出 36
	    getInfo(storedData.data);
	  }
	
})
</script>

<style lang="scss">
$primary-color: #4CAF50;
$secondary-color: #FF9800;
$text-color: #333;
$light-gray: #f5f5f5;
$medium-gray: #e0e0e0;
$dark-gray: #757575;
$white: #ffffff;

.container {
  padding: 20rpx;
  background-color: $white;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15rpx 0;

  
  .back-button {
	display: flex;
    background: none;
	width: 100rpx;
	height: 100rpx;
	align-items: center;
    // padding: 10rpx;
  }
}

.content {
  padding: 0 20rpx;
}

.food-title {
  font-size: 40rpx;
  font-weight: 600;
  color: $text-color;
  display: flex;
  align-items: center;
  margin: 20rpx 0;
  
  .badge {
    background-color: $primary-color;
    color: $white;
    padding: 4rpx 16rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    margin-left: 20rpx;
  }
}

.food-image {
  width: 100%;
  height: 500rpx;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
}

.food-description {
  font-size: 28rpx;
  color: $dark-gray;
  margin-bottom: 40rpx;
  line-height: 1.6;
}

.prep-time {
  display: flex;
  align-items: center;
  color: $dark-gray;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  
  .uni-icons {
    margin-right: 10rpx;
  }
}

.nutrition-info {
  display: flex;
  background-color: $light-gray;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 50rpx;
  justify-content: space-around;
}

.nutrition-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .nutrition-value {
    font-size: 36rpx;
    font-weight: 600;
    color: $primary-color;
  }
  
  .nutrition-label {
    font-size: 24rpx;
    color: $dark-gray;
    margin-top: 10rpx;
  }
}

.section {
  margin: 50rpx 0;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;
    
    &::before {
      content: "";
      display: inline-block;
      width: 8rpx;
      height: 32rpx;
      background-color: $primary-color;
      margin-right: 16rpx;
      border-radius: 4rpx;
    }
  }
}

.list {
  .list-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid $medium-gray;
    
    &:last-child {
      border-bottom: none;
    }
    
    .uni-icons {
      margin-right: 20rpx;
    }
    
    text {
      font-size: 28rpx;
    }
  }
}

.action-buttons {
  display: flex;
  margin: 60rpx 0;
  gap: 30rpx;
  
  button {
    flex: 0.6;
    padding: 28rpx;
    border-radius: 16rpx;
	width: 100px;
	height: 50px;
    font-size: 28rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .uni-icons {
      margin-right: 10rpx;
    }
  }
  
  .primary-button {
    background-color: $primary-color;
    color: $white;
    border: none;
    
    &:active {
      background-color: darken($primary-color, 10%);
    }
  }
  
  .secondary-button {
    background-color: $white;
    color: $primary-color;
    border: 1rpx solid $primary-color;
    
    &:active {
      background-color: $light-gray;
    }
  }
}
</style>A