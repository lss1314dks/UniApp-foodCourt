<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">运动计划</text>
    </view>
    
    <view class="content">
      <!-- 地图区域 -->
      <view class="map-container">
        <view class="map">
          <image  src="/common/images/playings.png" mode=""></image>
		  
		   <!-- <MapContainer/> -->
        </view>
        <view class="map-gap" style="width: 100%; height: calc(300px - 123px); background-color: white;"></view>
        <cover-view class="map-overlay">
          <cover-view class="flex justify-between items-center">
            <cover-view>
              <cover-view class="text-sm opacity-80">当前位置</cover-view>
              <cover-view class="font-semibold">{{ currentLocation }}</cover-view>
            </cover-view>
            <cover-view class="btn-primary text-sm py-2 px-4" @click="toggleExercise">
              <cover-view class="mr-1">
                <uni-icons :type="isExercising ? 'pause' : 'play'" size="20"></uni-icons>
              </cover-view>
              {{ isExercising ? '结束运动' : '开始运动' }}
            </cover-view>
          </cover-view>
        </cover-view>
      </view>
      
      <!-- 计步器 -->
      <view class="pedometer">
        <view class="pedometer-circle">
          <view class="steps-count">{{ formattedSteps }}</view>
          <view class="steps-label">步数</view>
        </view>
        <view class="steps-goal">目标: {{ stepGoal.toLocaleString() }}步</view>
      </view>
      
      <!-- 统计数据 -->
      <view class="stats-container">
        <view class="stat-card">
          <view class="stat-value">{{ distance }}</view>
          <view class="stat-label">公里</view>
        </view>
        <view class="stat-card">
          <view class="stat-value">{{ calories }}</view>
          <view class="stat-label">千卡</view>
        </view>
        <view class="stat-card">
          <view class="stat-value">{{ formattedTime }}</view>
          <view class="stat-label">时间</view>
        </view>
      </view>
      
      <!-- 运动计划 -->
      <view class="plan-card">
        <view class="plan-header">
          <view class="plan-title">每周运动计划</view>
          <view class="tag tag-success">进行中</view>
        </view>
        <view class="progress-container">
          <view class="progress-bar" :style="{width: progress + '%'}"></view>
        </view>
        <view class="progress-text">
          <span>已完成 {{ completedDays }}/{{ totalDays }} 天</span>
          <span>{{ progress }}%</span>
        </view>
        <view class="activity-list">
          <view class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
            <view class="activity-icon">
              <uni-icons :type="getActivityIcon(activity.type)" size="20" color="#4CAF50"></uni-icons>
            </view>
            <view class="activity-info">
              <view class="activity-name">{{ activity.name }}</view>
              <view class="activity-meta">{{ activity.date }} · {{ activity.duration }}分钟</view>
            </view>
            <view class="activity-calories">{{ activity.calories }}千卡</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
// import MapContainer from '@/components/MapContainer/MapContainer.vue'

// 运动相关状态
const isExercising = ref(false);
const startTime = ref(null);
const elapsedTime = ref(0);
const timer = ref(null);
const steps = ref(0);
const distance = ref('0.0');
const calories = ref(0);
const stepGoal = ref(10000);
const currentLocation = ref('重庆市巴南区');

// 格式化显示
const formattedSteps = computed(() =>  Math.floor(steps.value).toLocaleString());
const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60);
  const seconds = elapsedTime.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// 运动计划数据
const completedDays = ref(2);
const totalDays = ref(5);
const progress = computed(() => Math.round((completedDays.value / totalDays.value) * 100));
const recentActivities = ref([
  {
    type: 'running',
    name: '快走',
    date: '昨天',
    duration: 30,
    calories: 120
  },
  {
    type: 'running',
    name: '慢跑',
    date: '前天',
    duration: 20,
    calories: 180
  }
]);

// 开始/结束运动
const toggleExercise = () => {
  if (isExercising.value) {
    // 停止运动
    clearInterval(timer.value);
    isExercising.value = false;
    recordActivity();
    uni.showToast({
      title: '运动已结束',
      icon: 'success'
    });
  } else {
    // 开始运动
    isExercising.value = true;
    startTime.value = new Date();
    steps.value = 0;
    distance.value = '0.0';
    calories.value = 0;
    elapsedTime.value = 0;
    
    // 开始计时器
    timer.value = setInterval(updateExerciseData, 1000);
    uni.showToast({
      title: '运动已开始',
      icon: 'success'
    });
  }
};

// 更新运动数据
const updateExerciseData = () => {
  if (!isExercising.value) return;
  
  // 更新经过的时间(秒)
  elapsedTime.value = Math.floor((new Date() - startTime.value)/1000);
  
  // 模拟步数增加 (约120步/分钟)
  steps.value += 1.2;
  
  // 计算距离(公里): 假设步长0.762米
  distance.value = (steps.value * 0.000762).toFixed(1);
  
  // 计算消耗的卡路里(千卡): 体重(kg)*距离(km)*1.036
  calories.value = Math.floor(70 * parseFloat(distance.value) * 1.036);
};

// 记录运动数据
const recordActivity = () => {
  const newActivity = {
    type: 'running',
	icon:'left',
    name: '步行',
    date: '今天',
    duration: Math.floor(elapsedTime.value / 60),
    calories: calories.value
  };
  
  recentActivities.value.unshift(newActivity);
  if (recentActivities.value.length > 5) {
    recentActivities.value.pop();
  }
  
  // 更新完成天数
  if (elapsedTime.value >= 1800) { 
    completedDays.value = Math.min(completedDays.value + 1, totalDays.value);
  }
};

// 活动图标
const getActivityIcon = (type) => {
  const icons = {
    walking: 'footmark',
    running: 'paperplane',
    cycling: 'circle',
    swimming: 'water'
  };
  return icons[type] || 'help';
};

// 定位功能
const locate = () => {
  // uni.getLocation({
  //   type: 'gcj02',
  //   success: (res) => {
  //     // 这里可以添加逆地理编码获取当前位置名称
  //     currentLocation.value = '重庆市巴南区'; // 实际应用中替换为真实地址
  //   },
  //   fail: (err) => {
  //     console.error('获取位置失败', err);
  //   }
  // });
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});

onMounted(() => {
  // locate();
});
</script>

<style lang="scss">
.container {
  background-color: #f5f5f7;
  padding-bottom: 84px;
}

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
  
  .title {
    font-size: 20px;
    font-weight: bold;
  }
}

.content {
  padding: 0 20px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  .map {
    display: block;
    width: 100%;
    height: 100vh;
	image{
		width: 100%;
		height: 300px;
	}
  }
}

.map-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  color: white;
  z-index: 1;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #4CAF50;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.plan-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plan-title {
  font-weight: 700;
  font-size: 18px;
}

.progress-container {
  height: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #4CAF50;
}

.activity-list {
  margin-top: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4CAF50;
  margin-right: 12px;
}

.activity-info {
  flex: 1;
}

.activity-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.activity-meta {
  font-size: 12px;
  color: #666;
}

.activity-calories {
  font-weight: 600;
  color: #4CAF50;
}

.pedometer {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.pedometer-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.pedometer-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 6px solid transparent;
  border-top: 6px solid #4CAF50;
  border-right: 6px solid #4CAF50;
  transform: rotate(45deg);
}

.steps-count {
  font-size: 32px;
  font-weight: 700;
  color: #4CAF50;
}

.steps-label {
  font-size: 14px;
  color: #666;
}

.steps-goal {
  font-size: 13px;
  color: #666;
  font-weight: 600;
  margin-top: 4px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border-radius: 20px;
  padding: 10px 16px;
  text-align: center;
  font-size: 14px;
  border: none;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tag-success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.text-sm {
  font-size: 12px;
}

.font-semibold {
  font-weight: 600;
}

.opacity-80 {
  opacity: 0.8;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.mr-1 {
  margin-right: 4px;
}
</style>