<template>
  <view class="home-container">
<!-- 顶部信息栏 - 毛玻璃透明版 -->
    <view class="top-bar">
      <view class="top-bar-bg"></view> <!-- 毛玻璃背景层 -->
      <view class="top-bar-content">
        <view class="location-info">
          <uni-icons type="location-filled" size="20" color="#4CAF50"></uni-icons>
          <text class="location-text">重庆市</text>
        </view>
		<!-- 搜索栏 -->
		<view class="search-content">
		</view>
		<view class="weather-info">
		  <uni-icons type="partly-cloudy" size="15" color="#4CAF50"></uni-icons>
		  <text class="weather-text">28°C 晴</text>
		</view>
      </view>
    </view>

    <view class="content-container">
      <!-- 轮播图 - 使用uni-swiper -->
      <swiper class="carousel" :autoplay="true" :interval="3000" :circular="true">
        <swiper-item v-for="(item, index) in carouselItems" :key="index">
          <view class="carousel-item">
            <image
              :src="item.image"
              mode="aspectFill"
              class="carousel-image"
            ></image>
            <view class="carousel-overlay">
              <text class="carousel-title">{{ item.title }}</text>
              <text class="carousel-subtitle">{{ item.subtitle }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <!-- 快捷功能区 -->
      <view class="quick-actions">
        <view
          v-for="(item, index) in quickActions"
          :key="index"
          class="quick-action-item"
          @click="handleQuickAction(index)"
        >
          <view
            class="action-icon-container"
            :style="{ backgroundColor: item.bgColor }"
          >
            <uni-icons :type="item.icon" size="24" :color="item.iconColor"></uni-icons>
          </view>
          <text class="action-label">{{ item.label }}</text>
        </view>
      </view>

      <!-- 每日推荐 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">每日推荐</text>
		  <uni-icons type="loop" size="20" color="#4CAF50" @click="refresh"></uni-icons>
          <!-- <text class="section-more" @click="navigateTo('/pages/recommend/index')"></text> -->
        </view>

        <view class="recommendation-list">
          <view
            v-for="(item, index) in formDataDailyRecommendations"
            :key="index"
            class="recommendation-card"
            @click="navigateToDetail(item.id)"
          >
            <image
              :src="item.picture"
              mode="aspectFill"
              class="recommendation-image"
            ></image>
            <view class="recommendation-content">
              <view class="recommendation-header">
                <text class="recommendation-title">{{ item.foodName }}</text>
                <text class="status-safe">推荐</text>
              </view>
              <text class="recommendation-desc">{{ item.desc }}</text>
              <view class="recommendation-meta">
                <view class="meta-item">
                  <uni-icons type="fire-filled" size="14" color="#FB923C"></uni-icons>
                  <text class="meta-text">{{ item.kilo +"千卡"}}</text>
                </view>
                <view class="meta-item">
                  <uni-icons type="clock-filled" size="14" color="#60A5FA"></uni-icons>
                  <text class="meta-text">{{ }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 健康资讯 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title" >健康资讯</text>
		  <uni-icons class="section-more" type="chat-filled" size="20" color="#4CAF50"></uni-icons>
          <!-- <text class="section-more" @click="navigateTo('/pages/news/index')">{{"查看"}}</text>-->
        </view>

        <view class="news-grid">
          <view
            v-for="(item, index) in healthNews"
            :key="index"
            class="news-card"
            @click="navigateTo(`/pages/news/detail?id=${item.id}`)"
          >
            <image
              :src="item.image"
              mode="aspectFill"
              class="news-image"
            ></image>
            <text class="news-title">{{ item.title }}</text>
            <text class="news-subtitle">{{ item.subtitle }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getFoodInfoApi } from '../../API/apis'

//对接管理接口
onMounted(()=>{
	getFoodInfo();
})

const refresh = ()=>{
	getFoodInfo();
}

//编写跳转函数
const navigateToDetail = (id)=>{
	uni.setStorageSync("foodId",id);
	uni.reLaunch({
		url:`/pages/DaytoDay/DaytoDay`
	});
}

// 当前日期
const currentDate = computed(() => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
  return `${month}月${day}日 星期${week}`
})

// 轮播图数据
const carouselItems = ref([
  {
    image: 'https://food-court.oss-cn-hangzhou.aliyuncs.com/46.png',
    title: '健康饮食新主张',
    subtitle: '了解如何通过饮食提升免疫力'
  },
  {
    image: 'https://food-court.oss-cn-hangzhou.aliyuncs.com/65.png',
    title: '食品安全指南',
    subtitle: '掌握食品安全基本知识'
  },
  {
    image: 'https://food-court.oss-cn-hangzhou.aliyuncs.com/72.png',
    title: '营养搭配建议',
    subtitle: '均衡饮食的科学方法'
  }
])

// 快捷功能区数据
const quickActions = ref([
  {
    icon: 'scan',
    iconColor: '#4CAF50',
    bgColor: '#C8E6C9',
    label: '扫码查询',
	
  },
  {
    icon: 'paperplane',
    iconColor: '#8B5CF6',
    bgColor: '#EDE9FE',
    label: '运动计划',
	
  },
  {
    icon: 'chat',
    iconColor: '#F97316',
    bgColor: '#FFEDD5',
    label: 'AI助手',
	
  }
])

//每日推介的表单数据
const formDataDailyRecommendations = reactive([{
	id: 0,
	foodName: "",
	picture: "",
	desc: "",
	compose: "",
	benifit: "",
	protein: "",
	carbohydrate: "",
	fat: "",
	bmi: 22.0,
	disease: "无",
	age: 29,
	allergy: null,
    target: null,
	composeList: [],
	benifitList: [],
	kilo: 48.0
}])

//调用后端接口
const getFoodInfo = async()=>{
	const result = await getFoodInfoApi();
	// console.log(result);
	if(result.code===200){
		 Object.assign(formDataDailyRecommendations,result.data);
	}else{
		uni.showToast({
			title: '获取推荐列表失败',
			icon: 'fail',
			duration: 1000
		})
	}
}

// 健康资讯数据
const healthNews = ref([
  {
    id: 1,
    image: 'https://food-court.oss-cn-hangzhou.aliyuncs.com/87.png',
    title: '常见食品添加剂安全指南',
    subtitle: '了解哪些添加剂是安全的'
  },
  {
    id: 2,
    image: 'https://food-court.oss-cn-hangzhou.aliyuncs.com/91.png',
    title: '有机食品真的更健康吗？',
    subtitle: '科学解析有机食品的优势'
  }
])

// 获取定位信息
const getLocation = () => {
  // uni.getLocation({
  //   type: 'wgs84',
  //   success: (res) => {
  //     console.log('当前位置：', res)
  //     // 这里可以调用天气API获取天气信息
  //   },
  //   fail: (err) => {
  //     console.error('获取位置失败：', err)
  //   }
  // })
}

// 处理快捷功能点击
const handleQuickAction = (index) => {
  const actions = [
    '/pages/camera/camera',
    '/pages/playing/playing',
    '/pages/chating/chating'
  ]
  if(index==0){
	  uni.navigateTo({
	    url: actions[index]
	  })
  }else{
	  uni.reLaunch({
	  	url:actions[index]
	  })
  }
  // uni.navigateTo({
  //   url: actions[index]
  // })
}

// 通用导航方法
const navigateTo = (url) => {
  uni.navigateTo({
    url
  })
}

onShow(() => {
  // getLocation()
})
</script>

<style lang="scss">
// 颜色变量
$primary: #4CAF50;
$primary-dark: #388E3C;
$primary-light: #C8E6C9;
$white: #ffffff;
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-400: #9ca3af;
$gray-500: #6b7280;

.home-container {
  background-color: $gray-50;
  padding-bottom: 80px;
  position: relative;
}

// 顶部信息栏样式 - 毛玻璃透明版
.top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 80px;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: rgba($primary, 0.1);
  }
}

.top-bar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($white, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: -1;
}

.top-bar-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px;
  height: 100%;
  position: relative;
}

.location-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1px;
}

.location-text {
  font-size: 15px;
  font-weight: 600;
  color: $primary-dark;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 12px;
  padding: 4px 4px;
  background-color: rgba($primary, 0.1);
  border-radius: 12px;
}

.weather-text {
  font-size: 14px;
  color: $primary-dark;
}

.date-notification {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-text {
  font-size: 14px;
  color: $primary-dark;
}

// 内容容器
.content-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
// 轮播图样式
.carousel {
  height: 192px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.carousel-item {
  position: relative;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  padding: 16px;
}

.carousel-title {
  color: $white;
  font-size: 20px;
  font-weight: bold;
}

.carousel-subtitle {
  color: $white;
  font-size: 14px;
  opacity: 0.9;
}

// 快捷功能区样式
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.action-label {
  font-size: 12px;
}

// 区块通用样式
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
}

.section-more {
  color: $primary;
  font-size: 14px;
}

// 每日推荐样式
.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-card {
  background-color: $white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
}

.recommendation-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
}

.recommendation-content {
  margin-left: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
}

.recommendation-title {
  font-weight: 500;
}

.status-safe {
  background-color: rgba($primary, 0.1);
  color: $primary-dark;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 9999px;
}

.recommendation-desc {
  color: $gray-500;
  font-size: 14px;
  margin-top: 4px;
}

.recommendation-meta {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.meta-text {
  font-size: 12px;
  margin-left: 4px;
}

// 健康资讯样式
.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.news-card {
  background-color: $white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.news-image {
  width: 100%;
  height: 128px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.news-title {
  font-weight: 500;
  font-size: 14px;
}

.news-subtitle {
  color: $gray-500;
  font-size: 12px;
  margin-top: 4px;
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>