<template>
  <view class="food-management">
	  <!-- 头部 -->
	  <view class="header">
		<uni-icons class="icons-ui" type="left" size="25" color="#333" @click="goBack"></uni-icons>
	    <text class="title">食品管理</text>
	  </view>
    <view 
      v-for="(food, index) in foodList" 
      :key="index"
      class="food-item"
      @touchstart="handleTouchStart(index)"
      @touchend="handleTouchEnd(index)"
      @click="handleItemClick(index)"
    >
      <view class="food-content" :class="{ 'active': activeIndex === index }">
        <view class="food-header">
          <text class="food-name">{{ food.name }}</text>
          <text v-if="food.recommended" class="recommend-tag">推荐</text>
        </view>
        <text class="food-desc">{{ food.description }}</text>
        <view class="food-footer">
          <text class="food-calories">{{ food.calories }}千卡</text>
          <text class="food-time">{{ food.time }}分钟</text>
        </view>
      </view>
      
      <view v-if="activeIndex === index" class="delete-btn" @click.stop="deleteItem(index)">
        <uni-icons type="trash" size="24" color="#fff"></uni-icons>
      </view>
    </view>
    
    <view class="add-btn" @click="showAddDialog = true">
      <uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
    </view>
    
    <!-- 添加食品对话框 -->
    <uni-popup ref="addDialog" type="dialog">
      <uni-popup-dialog 
        mode="input" 
        title="添加食品" 
        placeholder="请输入食品信息"
        @confirm="addFoodItem"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const goBack = ()=>{
	uni.reLaunch({
		url:"/pages/index/index"
	});
}

const foodList = ref([
  {
    name: '地中海沙拉',
    recommended: true,
    description: '富含抗氧化物质，有助于心血管健康',
    calories: 320,
    time: 15
  },
  {
    name: '蓝莓燕麦粥',
    recommended: true,
    description: '富含膳食纤维，有助于肠道健康',
    calories: 280,
    time: 10
  },
  {
    name: '烤三文鱼',
    recommended: true,
    description: '富含Omega-3脂肪酸，有助于大脑健康',
    calories: 420,
    time: 25
  }
]);

const activeIndex = ref(-1);
const longPressTimer = ref(null);
const showAddDialog = ref(false);

const handleTouchStart = (index) => {
  longPressTimer.value = setTimeout(() => {
    activeIndex.value = index;
  }, 800); // 800毫秒长按触发
};

const handleTouchEnd = (index) => {
  clearTimeout(longPressTimer.value);
};

const handleItemClick = (index) => {
  if (activeIndex.value === index) {
    activeIndex.value = -1;
  }
};

const deleteItem = (index) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该食品吗？',
    success: (res) => {
      if (res.confirm) {
        foodList.value.splice(index, 1);
        activeIndex.value = -1;
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
      }
    }
  });
};

const addFoodItem = (value) => {
  if (!value) return;
  
  // 这里简单处理，实际应用中需要更复杂的表单
  const newFood = {
    name: value,
    recommended: false,
    description: '请输入食品描述',
    calories: 0,
    time: 0
  };
  
  foodList.value.push(newFood);
  showAddDialog.value = false;
  uni.showToast({
    title: '添加成功',
    icon: 'success'
  });
};
</script>

<style lang="scss">
.header {
	  background-color: rgba(255, 255, 255, 0.8);
	  backdrop-filter: blur(10px);
	  -webkit-backdrop-filter: blur(10px);
	  padding: 35rpx 20px;
	  position: sticky;
	  top: 0;
	  z-index: 10;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  
		  
	  .icons-ui{
		  position: absolute;
		  top:17;
		  left:0;
		  background: rgba(248, 248, 248, 0.5);
		  display: inline-block;
		  width: 30px;
		  height: 30px;
	  }
	  
	  .title {
	    font-size: 20px;
	    font-weight: bold;
	  }
	  
	}
.food-management {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.food-item {
  display: flex;
  margin-bottom: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.food-content {
  flex: 1;
  padding: 24rpx;
  background-color: #fff;
  
  &.active {
    background-color: #f0f0f0;
  }
}

.food-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.food-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.recommend-tag {
  margin-left: 16rpx;
  padding: 4rpx 12rpx;
  background-color: #4CAF50;
  color: #fff;
  font-size: 24rpx;
  border-radius: 20rpx;
}

.food-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.food-footer {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #888;
}

.delete-btn {
  width: 100rpx;
  background-color: #4CAF50;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-btn {
  position: fixed;
  right: 40rpx;
  bottom: 80rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #4CAF50;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(78, 154, 241, 0.4);
  
  &:active {
    transform: scale(0.95);
  }
}
</style>