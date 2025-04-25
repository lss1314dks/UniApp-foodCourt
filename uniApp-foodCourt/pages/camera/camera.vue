<template>
  <view class="scan-container">
    <!-- 头部导航栏 -->
    <uni-nav-bar title="食品扫描" :border="false"></uni-nav-bar>
    
     <!-- 扫描视图 -->
    <view class="scan-view" v-if="!showResult">
      <!-- 相机视图 -->
      <view class="camera-view">
        <camera 
          v-if="cameraActive"
          :device-position="currentDevice"
          :flash="flashStatus"
          class="camera"
          @error="cameraError"
        ></camera>
        <view class="camera-overlay">
          <view class="scan-frame">
            <view class="scan-line" :class="{'animate-scan': scanning}"></view>
          </view>
          <text class="scan-tip">将食品包装对准框内</text>
        </view>
        <view class="camera-controls">
          <view class="camera-btn" @click="switchCamera">
            <uni-icons type="reload" size="24" color="#fff"></uni-icons>
          </view>
          <view class="camera-btn capture" @click="captureImage">
            <uni-icons type="camera" size="28" color="#4CAF50"></uni-icons>
          </view>
          <view class="camera-btn" @click="toggleFlash">
            <uni-icons :type="flashStatus === 'on' ? 'bolt-filled' : 'bolt'" size="24" color="#fff"></uni-icons>
          </view>
        </view>
      </view>
      
      <!-- 上传区域 -->
      <view class="upload-section">
        <text class="section-title">上传食品图片</text>
        <view class="upload-area" @click="chooseImage">
          <uni-icons type="cloud-upload" size="40" color="#4CAF50"></uni-icons>
          <text class="upload-text">点击上传图片或拍照</text>
          <text class="upload-hint">支持JPG、PNG格式</text>
        </view>
      </view>
      
      <!-- 历史记录 -->
      <view class="history-section">
        <view class="section-header">
          <text class="section-title">扫描历史</text>
          <text class="view-all" @click="navigateTo('scan-history')">查看全部</text>
        </view>
        
        <view class="history-item" v-for="(item, index) in scanHistory" :key="index" @click="showResultDetail(item)">
          <image :src="item.image" class="history-image" mode="aspectFill"></image>
          <view class="history-info">
            <text class="history-title">{{ item.name }}</text>
            <view class="history-meta">
              <text :class="['safety-tag', `tag-${item.safetyLevel}`]">{{ item.safetyLabel }}</text>
              <text class="history-date">{{ item.date }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 分析结果视图 -->
    <view class="result-view" v-else>
      <view class="result-header">
        <image :src="currentResult.image" class="result-image" mode="aspectFill"></image>
        <view class="result-meta">
          <text class="result-title">{{ currentResult.name }}</text>
          <view class="safety-score">
            <text>安全指数</text>
            <view class="score-bar">
              <view class="score-fill" :style="{width: currentResult.score + '%'}"></view>
            </view>
            <text class="score-value">{{ currentResult.score }}%</text>
          </view>
          <text :class="['safety-tag', `tag-${currentResult.safetyLevel}`]">{{ currentResult.safetyLabel }}</text>
        </view>
      </view>
      
      <!-- 营养成分分析 -->
      <uni-card>
        <text class="card-title">营养成分分析</text>
        <view class="nutrition-grid">
          <view class="nutrition-item" v-for="(item, index) in currentResult.nutrition" :key="index">
            <text class="nutrition-label">{{ item.label }}</text>
            <text class="nutrition-value">{{ item.value }}</text>
            <text class="nutrition-tip" :class="`tip-${item.status}`">{{ item.tip }}</text>
          </view>
        </view>
      </uni-card>
      
      <!-- 配料安全分析 -->
      <uni-card>
        <text class="card-title">配料安全分析</text>
        <view class="ingredient-list">
          <view class="ingredient-item" v-for="(item, index) in currentResult.ingredients" :key="index">
            <view class="ingredient-name">
              <view :class="['safety-dot', `dot-${item.safetyLevel}`]"></view>
              <text>{{ item.name }}</text>
            </view>
            <text :class="['safety-label', `label-${item.safetyLevel}`]">{{ item.safetyLabel }}</text>
          </view>
        </view>
      </uni-card>
      
      <!-- 健康建议 -->
      <uni-card>
        <text class="card-title">健康建议</text>
        <uni-collapse>
          <uni-collapse-item title="适宜人群">
            <text class="advice-text">{{ currentResult.advice.suitable }}</text>
          </uni-collapse-item>
          <uni-collapse-item title="不适宜人群">
            <text class="advice-text">{{ currentResult.advice.unsuitable }}</text>
          </uni-collapse-item>
          <uni-collapse-item title="食用建议">
            <text class="advice-text">{{ currentResult.advice.suggestion }}</text>
          </uni-collapse-item>
        </uni-collapse>
      </uni-card>
      
      <!-- 底部按钮 -->
      <view class="action-buttons">
        <button class="secondary-btn" @click="backToScan">返回</button>
        <button class="primary-btn" @click="saveFood">保存到我的食品</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 状态管理
const cameraActive = ref(true)
const showResult = ref(false)
const scanning = ref(false)
const currentDevice = ref('back')
const flashStatus = ref('off')

// 扫描历史数据
const scanHistory = ref([
  {
    id: 1,
    name: '有机酸奶',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    safetyLevel: 'safe',
    safetyLabel: '安全',
    date: '今天 10:30',
    score: 85,
    nutrition: [
      { label: '蛋白质', value: '5.6g', status: 'good', tip: '高于平均水平' },
      { label: '脂肪', value: '3.2g', status: 'good', tip: '低于平均水平' },
      { label: '碳水化合物', value: '12g', status: 'normal', tip: '适中' },
      { label: '钙', value: '240mg', status: 'good', tip: '高于平均水平' }
    ],
    ingredients: [
      { name: '有机生牛乳', safetyLevel: 'safe', safetyLabel: '安全' },
      { name: '活性乳酸菌', safetyLevel: 'safe', safetyLabel: '安全' },
      { name: '白砂糖', safetyLevel: 'warning', safetyLabel: '适量食用' },
      { name: '明胶', safetyLevel: 'safe', safetyLabel: '安全' }
    ],
    advice: {
      suitable: '适合大多数人群食用，尤其适合需要补充钙质的人群，如青少年、孕妇和老年人。含有丰富的益生菌，对肠道健康有益。',
      unsuitable: '乳糖不耐受人群应谨慎食用。含有一定量的糖分，糖尿病患者应控制食用量。',
      suggestion: '建议在早餐或加餐时食用，可搭配水果或坚果增加营养多样性。每日食用量建议不超过200g。'
    }
  },
  {
    id: 2,
    name: '巧克力饼干',
    image: 'https://images.unsplash.com/photo-1534965352460-d38caa0a56f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    safetyLevel: 'warning',
    safetyLabel: '注意',
    date: '昨天 15:45',
    score: 65,
    nutrition: [
      { label: '蛋白质', value: '4.2g', status: 'normal', tip: '适中' },
      { label: '脂肪', value: '18g', status: 'bad', tip: '偏高' },
      { label: '碳水化合物', value: '65g', status: 'bad', tip: '偏高' },
      { label: '钠', value: '320mg', status: 'warning', tip: '偏高' }
    ],
    ingredients: [
      { name: '小麦粉', safetyLevel: 'safe', safetyLabel: '安全' },
      { name: '白砂糖', safetyLevel: 'warning', safetyLabel: '适量食用' },
      { name: '植物油', safetyLevel: 'warning', safetyLabel: '适量食用' },
      { name: '可可粉', safetyLevel: 'safe', safetyLabel: '安全' },
      { name: '食品添加剂', safetyLevel: 'warning', safetyLabel: '适量食用' }
    ],
    advice: {
      suitable: '适合作为偶尔的零食，不建议作为日常主食。',
      unsuitable: '肥胖、糖尿病患者应限制食用。',
      suggestion: '建议每次食用不超过2块，搭配无糖饮品更健康。'
    }
  }
])

// 当前分析结果
const currentResult = ref({})

// 切换摄像头
const switchCamera = () => {
  currentDevice.value = currentDevice.value === 'back' ? 'front' : 'back'
  cameraActive.value = false
  setTimeout(() => {
    cameraActive.value = true
  }, 100)
}

// 切换闪光灯
const toggleFlash = () => {
  flashStatus.value = flashStatus.value === 'off' ? 'on' : 'off'
}

// 拍照
const captureImage = () => {
  scanning.value = true
  uni.showLoading({
    title: '正在扫描...'
  })
  
  setTimeout(() => {
    scanning.value = false
    uni.hideLoading()
    showResultDetail(scanHistory.value[0])
  }, 2000)
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uni.showLoading({
        title: '正在分析...'
      })
      
      setTimeout(() => {
        uni.hideLoading()
        showResultDetail(scanHistory.value[0])
      }, 1500)
    }
  })
}

// 显示结果详情
const showResultDetail = (item) => {
  currentResult.value = item
  showResult.value = true
  cameraActive.value = false
}

// 返回扫描界面
const backToScan = () => {
  showResult.value = false
  cameraActive.value = true
}

// 保存食品
const saveFood = () => {
  uni.showToast({
    title: '已保存到我的食品',
    icon: 'success'
  })
  setTimeout(() => {
    backToScan()
  }, 1500)
}

// 导航到其他页面
const navigateTo = (page) => {
  uni.navigateTo({
    url: `/pages/${page}`
  })
}

// 相机错误处理
const cameraError = (e) => {
  console.error('相机错误:', e.detail)
  uni.showModal({
    title: '提示',
    content: '无法访问相机，请检查权限设置',
    showCancel: false
  })
}
</script>

<style lang="scss">
.scan-container {
  background-color: #f5f5f7;
  min-height: 100vh;
  padding-bottom: 20px;
  
  .scan-view {
    padding: 15px;
  }
  
/* 相机视图 */
.camera-view {
  width: 100%;
  height: 70vh;
  max-height: 500px;
  background-color: #000;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.camera {
  width: 100%;
  height: 100%;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding-bottom: 80px; /* 为控制按钮留出空间 */
}

.scan-frame {
  width: 220px;
  height: 220px;
  border: 2px solid #4CAF50;
  border-radius: 20px;
  position: relative;
}

.scan-frame::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
}

.scan-line {
  position: absolute;
  height: 2px;
  background-color: #4CAF50;
  left: 0;
  right: 0;
  top: 0;
  box-shadow: 0 0 8px #4CAF50;
  opacity: 0;
}

.scan-line.animate-scan {
  opacity: 1;
  animation: scanAnimation 2s linear infinite;
}

.scan-tip {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 相机控制按钮 */
.camera-controls {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 10px 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 50px;
  width: 90%;
  margin: 0 auto;
}

.camera-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.camera-btn:active {
  transform: scale(0.9);
  background-color: rgba(255, 255, 255, 0.3);
}

.camera-btn.capture {
  width: 60px;
  height: 60px;
  background-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.camera-btn.capture:active {
  transform: scale(0.95);
}
  
  .upload-section {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      display: block;
      text-align: center;
      margin-bottom: 10px;
    }
    
    .upload-area {
      border: 2px dashed #e0e0e0;
      border-radius: 12px;
      padding: 30px 20px;
      margin: 15px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease;
      
      &:active {
        border-color: #4CAF50;
        background-color: rgba(76, 175, 80, 0.05);
      }
    }
    
    .upload-text {
      font-size: 14px;
      margin-top: 10px;
    }
    
    .upload-hint {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }
  }
  
  .history-section {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
    }
    
    .view-all {
      font-size: 12px;
      color: #4CAF50;
    }
    
    .history-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .history-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      margin-right: 12px;
    }
    
    .history-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .history-title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .history-meta {
      display: flex;
      justify-content: space-between;
    }
    
    .safety-tag {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      
      &.tag-safe {
        background-color: #E8F5E9;
        color: #2E7D32;
      }
      
      &.tag-warning {
        background-color: #FFF8E1;
        color: #FF8F00;
      }
      
      &.tag-danger {
        background-color: #FFEBEE;
        color: #C62828;
      }
    }
    
    .history-date {
      font-size: 12px;
      color: #999;
    }
  }
  
  .result-view {
    padding: 15px;
    
    .result-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .result-image {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      margin-right: 16px;
    }
    
    .result-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .safety-score {
      display: flex;
      align-items: center;
      margin: 8px 0;
      font-size: 14px;
    }
    
    .score-bar {
      height: 8px;
      flex: 1;
      background-color: #e0e0e0;
      border-radius: 4px;
      margin: 0 10px;
      position: relative;
      overflow: hidden;
    }
    
    .score-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background-color: #4CAF50;
      border-radius: 4px;
    }
    
    .score-value {
      font-weight: bold;
    }
    
    .card-title {
      font-size: 16px;
      font-weight: bold;
      display: block;
      margin-bottom: 12px;
	  border-radius: 30px;
    }
    
    .nutrition-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .nutrition-item {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
    }
    
    .nutrition-label {
      font-size: 12px;
      color: #666;
      display: block;
    }
    
    .nutrition-value {
      font-size: 16px;
      font-weight: bold;
      display: block;
      margin: 4px 0;
    }
    
    .nutrition-tip {
      font-size: 10px;
      display: block;
      
      &.tip-good {
        color: #4CAF50;
      }
      
      &.tip-normal {
        color: #2196F3;
      }
      
      &.tip-warning {
        color: #FF9800;
      }
      
      &.tip-bad {
        color: #F44336;
      }
    }
    
    .ingredient-list {
      .ingredient-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        
        &:last-child {
          border-bottom: none;
        }
      }
      
      .ingredient-name {
        display: flex;
        align-items: center;
      }
      
      .safety-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 8px;
        
        &.dot-safe {
          background-color: #4CAF50;
        }
        
        &.dot-warning {
          background-color: #FF9800;
        }
        
        &.dot-danger {
          background-color: #F44336;
        }
      }
      
      .safety-label {
        font-size: 12px;
        
        &.label-safe {
          color: #4CAF50;
        }
        
        &.label-warning {
          color: #FF9800;
        }
        
        &.label-danger {
          color: #F44336;
        }
      }
    }
    
    .advice-text {
      font-size: 14px;
      line-height: 1.5;
      color: #666;
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      
      button {
        flex: 1;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border-radius: 12px;
        font-size: 16px;
        
        &:first-child {
          margin-right: 10px;
        }
      }
      
      .secondary-btn {
        background-color: white;
        border: 1px solid #ddd;
        color: #333;
      }
      
      .primary-btn {
        background-color: #4CAF50;
        color: white;
      }
    }
  }
  
  @keyframes scanAnimation {
    0% { top: 0; }
    50% { top: 100%; }
    100% { top: 0; }
  }
}
</style>