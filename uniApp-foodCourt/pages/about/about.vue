<template>
  <view class="container">
    <!-- 波浪背景 -->
    <view class="wave-bg">
      <svg viewBox="0 0 500 150" preserveAspectRatio="none">
        <path d="M0,80 C150,180 350,0 500,80 L500,150 L0,150 Z" fill="currentColor"></path>
      </svg>
    </view>

    <!-- 头部信息 -->
    <view class="header">
      <image 
        class="logo" 
        src="/static/images/user.png" 
        mode="aspectFit"
        :style="{transform: logoScale}"
        @touchstart="logoScale = 'scale(0.95)'"
        @touchend="logoScale = 'scale(1)'"
      />
      <text class="app-name">安食阁</text>
      <text class="slogan">让食品健康更美好</text>
      <view class="version-box">
        <text class="version">v1.0.0</text>
      </view>
    </view>

    <!-- 信息卡片 -->
    <view class="card">
      <uni-list class="info-list">
        <uni-list-item 
          v-for="(item, index) in contactList"
          :key="index"
          :title="item.title"
          :show-arrow="item.action"
          @click="handleAction(item)"
        >
          <template v-slot:header>
            <uni-icons 
              :type="item.icon" 
              size="20" 
              :color="themeColor"
              class="list-icon"
            />
          </template>
          <template v-slot:footer>
            <text class="info-text">{{ item.value }}</text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>

    <!-- 社交链接 -->
    <view class="social-links">
      <view 
        v-for="(item, index) in socialMedia"
        :key="index"
        class="social-item"
        @click="openSocial(item.link)"
      >
        <uni-icons 
          :type="item.icon" 
          size="28" 
          :color="themeColor"
        />
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="copyright">
      <text class="copyright-text">©2025 LiTUTU科技</text>
      <view class="divider"></view>
      <text class="copyright-text">创造美好体验</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';

const themeColor = ref('#5A7EF7');
const logoScale = ref('scale(1)');

const contactList = reactive([
  { 
    icon: 'link', 
    title: '官方网站', 
    value: 'https://www.example.com',
    action: () => openWebsite('https://www.example.com')
  },
  {
    icon: 'phone',
    title: '客服电话',
    value: '400-123-4567',
    action: () => makePhoneCall('400-123-4567')
  },
  {
    icon: 'weixin',
    title: '微信公众号',
    value: 'ExampleApp'
  },
  {
    icon: 'compose',
    title: '用户协议',
    action: () => navigateTo('/pages/agreement/user')
  },
  {
    icon: 'locked',
    title: '隐私政策',
    action: () => navigateTo('/pages/agreement/privacy')
  }
]);

const socialMedia = reactive([
  { icon: 'weixin', link: '#' },
  { icon: 'weibo', link: '#' },
  { icon: 'phone', link: '#' },
  { icon: 'qq', link: '#' }
]);

const handleAction = (item) => {
  if(item.action) item.action();
};

// 保持原有功能方法...
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.wave-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300rpx;
  color: v-bind(themeColor);
  opacity: 0.15;
  z-index: 0;
}

.header {
  position: relative;
  z-index: 1;
  padding: 60rpx 0 40rpx;
  text-align: center;
  
  .logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 32rpx;
    box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .app-name {
    display: block;
    font-size: 42rpx;
    font-weight: 700;
    color: #2c3e50;
    margin-top: 30rpx;
    letter-spacing: 2rpx;
  }

  .slogan {
    font-size: 28rpx;
    color: #95a5a6;
    margin-top: 15rpx;
  }

  .version-box {
    display: inline-block;
    padding: 8rpx 24rpx;
    background: rgba(255,255,255,0.9);
    border-radius: 50rpx;
    margin-top: 20rpx;
    
    .version {
      font-size: 24rpx;
      color: v-bind(themeColor);
      font-weight: 500;
    }
  }
}

.card {
  position: relative;
  z-index: 1;
  margin: 30rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05);
  overflow: hidden;
  
  .list-icon {
    margin-right: 20rpx;
  }
  
  .info-text {
    font-size: 28rpx;
    color: #7f8c8d;
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin: 50rpx 0;
  
  .social-item {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5rpx 15rpx rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.9);
    }
  }
}

.copyright {
  text-align: center;
  padding: 40rpx 0;
  
  .copyright-text {
    font-size: 24rpx;
    color: #bdc3c7;
  }
  
  .divider {
    width: 40rpx;
    height: 2rpx;
    background: #ddd;
    margin: 20rpx auto;
  }
}

/* 动画效果 */
uni-list-item {
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
}
</style>