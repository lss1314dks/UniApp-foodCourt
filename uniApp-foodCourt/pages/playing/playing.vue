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
			  <MapContainer></MapContainer>
		  </view>
		  <view class="map-gap" style="width: 100%;
		  height: calc(300px - 123px); background-color: white;">
		  </view>
          <cover-view class="map-overlay">
            <cover-view class="flex justify-between items-center">
              <cover-view>
                <cover-view class="text-sm opacity-80">当前位置</cover-view>
                <cover-view class="font-semibold">{{ currentLocation }}</cover-view>
              </cover-view>
              <cover-view class="btn-primary text-sm py-2 px-4" @click="startExercise">
                <cover-view class="fas fa-play mr-1"></cover-view> 开始运动
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
          <view class="stat-value">{{ duration }}</view>
          <view class="stat-label">分钟</view>
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
import { ref, computed, onMounted } from 'vue';
import MapContainer from '@/components/MapContainer/MapContainer.vue'
// 地图相关数据
    const latitude = ref(39.90923);
    const longitude = ref(116.397428);
    const currentLocation = ref('北京市朝阳区');
    const markers = ref([{
      id: 1,
      latitude: 39.90923,
      longitude: 116.397428,
      title: '当前位置'
    }]);
    const polyline = ref([{
      points: [
        {latitude: 39.90923, longitude: 116.397428},
        {latitude: 39.91023, longitude: 116.398428},
        {latitude: 39.91123, longitude: 116.399428},
        {latitude: 39.91223, longitude: 116.400428},
        {latitude: 39.91323, longitude: 116.401428}
      ],
      color: '#4CAF50',
      width: 6,
      arrowLine: true
    }]);
    
    // 计步器相关数据
    const steps = ref(6248);
    const stepGoal = ref(10000);
    const formattedSteps = computed(() => steps.value.toLocaleString());
    
    // 运动数据
    const distance = ref('2.4');
    const calories = ref('186');
    const duration = ref('32');
    
    // 运动计划
    const completedDays = ref(2);
    const totalDays = ref(5);
    const progress = computed(() => Math.round((completedDays.value / totalDays.value) * 100));
    const recentActivities = ref([
      {
        type: 'walking',
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
    
    // 用户数据
    const genders = ref(['男', '女', '其他']);
    const diseases = ref(['高血压', '糖尿病', '心脏病', '关节炎', '其他']);
    const fitnessGoals = ref(['减肥', '增肌', '提高心肺功能', '保持健康']);
    
    const userData = ref({
      height: 175,
      weight: 68,
      age: 32,
      gender: '男',
      medicalHistory: [],
      fitnessGoal: '保持健康'
    });
    
    // 方法
    const getActivityIcon = (type) => {
      const icons = {
        walking: 'footmark',
        running: 'paperplane',
        cycling: 'circle',
        swimming: 'water'
      };
      return icons[type] || 'help';
    };
    
    const startExercise = () => {
      uni.showToast({
        title: '开始运动',
        icon: 'success'
      });
      // 这里可以添加开始运动的逻辑
    };
    
    const zoomIn = () => {
      // 地图放大逻辑
      console.log('zoom in');
    };
    
    const zoomOut = () => {
      // 地图缩小逻辑
      console.log('zoom out');
    };
    
    const locate = () => {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          latitude.value = res.latitude;
          longitude.value = res.longitude;
          markers.value[0].latitude = res.latitude;
          markers.value[0].longitude = res.longitude;
          
          // 这里可以添加逆地理编码获取当前位置名称
        },
        fail: (err) => {
          console.error('获取位置失败', err);
        }
      });
    };
    
    const onGenderChange = (e) => {
      userData.value.gender = genders.value[e.detail.value];
    };
    
    const onGoalChange = (e) => {
      userData.value.fitnessGoal = fitnessGoals.value[e.detail.value];
    };
    
    const toggleDisease = (disease) => {
      const index = userData.value.medicalHistory.indexOf(disease);
      if (index === -1) {
        userData.value.medicalHistory.push(disease);
      } else {
        userData.value.medicalHistory.splice(index, 1);
      }
    };
    
    const saveUserData = () => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
      // 这里可以添加保存数据的逻辑
    };
    
    // 模拟计步器功能
    const simulatePedometer = () => {
      setInterval(() => {
        steps.value += Math.floor(Math.random() * 10);
        
        // 更新其他相关数据
        distance.value = (steps.value * 0.000762).toFixed(1);
        calories.value = Math.floor(steps.value * 0.03);
        duration.value = Math.floor(steps.value / 200);
      }, 3000);
    };
	
    onMounted(() => {
      simulatePedometer();
      locate(); // 尝试获取当前位置
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
  border-radius: var(--card-radius);
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  .map{
	  display: block;
	  width: 100%;
	  height: 123px;
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

.map-controls {
  position: absolute;
  // top: 10px;
  bottom: 70px;
  right: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  // background-color: #4CAF50;
}

.map-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  // gap: 10px;
  margin-top: 20rpx;
}

.map-btn:active {
  transform: scale(0.85);
  color:#4CAF50;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: white;
  border-radius: var(--card-radius);
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color:  #4CAF50;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.plan-card {
  background-color: white;
  border-radius: var(--card-radius);
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
  background-color:  #4CAF50;
  border-radius: 4px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color:  #4CAF50;
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
  color:  #4CAF50;
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
  color:  #4CAF50;
}

.activity-calories {
  font-weight: 600;
  color:  #4CAF50;
}

.pedometer {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: white;
  border-radius:  #4CAF50;
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
// 进度条
.pedometer-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 6px solid transparent;
  border-top: 6px solid  #4CAF50;
  border-right: 6px solid  #4CAF50;
  transform: rotate(45deg);
}

.steps-count {
  font-size: 32px;
  font-weight: 700;
  color:  #4CAF50;
}

.steps-label {
  font-size: 14px;
  color:  #4CAF50;
}

.steps-goal {
  font-size: 13px;
  color:  #4CAF50;
  font-weight: 600;
  margin-top: 4px;
}

.form-section {
  background-color: white;
  border-radius:  #4CAF50;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}


.btn-primary {
  background-color:  #4CAF50;
  color: white;
  border-radius: 20rpx;
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
  color:  #4CAF50;
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

.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.text-sm {
  font-size: 12px;
}

.text-lg {
  font-size: 18px;
}

.font-bold {
  font-weight: bold;
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