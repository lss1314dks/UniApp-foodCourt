<template>
  <view class="user-container">
    <!-- 个人信息头部 -->
    <view class="profile-header">
      <view class="avatar-box">
        <image :src="userInfo.avatar" mode="aspectFill" class="avatar"></image>
        <text class="iconfont icon-camera camera-icon"></text>
      </view>
      <view class="user-info">
        <text class="username">{{ userInfo.username }}</text>
        <text class="vip-tag">VIP{{ userInfo.vipLevel }}</text>
      </view>
      <text class="user-desc">{{ userInfo.slogan }}</text>
    </view>

    <!-- 基本信息 -->
    <view class="info-card">
      <view class="info-item">
        <text class="info-label">手机号</text>
        <text class="info-value">{{ userInfo.phone }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">注册时间</text>
        <text class="info-value">{{ userInfo.registerTime }}</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="navigateTo('browseHistory')">
        <view class="menu-left">
          <text class="iconfont icon-history menu-icon"></text>
          <text>浏览记录</text>
        </view>
        <text class="iconfont icon-arrow-right"></text>
      </view>
      
      <view class="menu-item" @click="navigateTo('settings')">
        <view class="menu-left">
          <text class="iconfont icon-setting menu-icon"></text>
          <text>账号设置</text>
        </view>
        <text class="iconfont icon-arrow-right"></text>
      </view>
      
      <view class="menu-item" @click="navigateTo('about')">
        <view class="menu-left">
          <text class="iconfont icon-info menu-icon"></text>
          <text>关于我们</text>
        </view>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @click="handleLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 用户信息
const userInfo = reactive({
  avatar: '/static/images/avatar.jpg',
  username: '张小三',
  vipLevel: 3,
  slogan: '这个人很懒，什么都没留下~',
  phone: '138****5678',
  registerTime: '2022-08-15'
})

// 功能菜单配置
const menuItems = [
  { 
    icon: 'icon-history',
    text: '浏览记录',
    page: 'browseHistory'
  },
  {
    icon: 'icon-setting',
    text: '账号设置',
    page: 'settings'
  },
  {
    icon: 'icon-info',
    text: '关于我们',
    page: 'about'
  }
]

// 页面显示时触发
onShow(() => {
  // 可以在这里添加数据刷新逻辑
})

// 导航跳转
const navigateTo = (page) => {
  const routes = {
    browseHistory: '/pages/history/history',
    settings: '/pages/settings/settings',
    about: '/pages/about/about'
  }
  uni.navigateTo({
    url: routes[page]
  })
}

// 退出登录处理
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.user-container {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.profile-header {
  text-align: center;
  padding: 40rpx 0;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;

  .avatar-box {
    position: relative;
    width: 150rpx;
    height: 150rpx;
    margin: 0 auto 30rpx;

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4rpx solid #f0f0f0;
    }

    .camera-icon {
      position: absolute;
      right: 0;
      bottom: 0;
      background: #007aff;
      color: #fff;
      padding: 8rpx;
      border-radius: 50%;
      font-size: 36rpx;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;

    .username {
      font-size: 40rpx;
      font-weight: bold;
      margin-right: 20rpx;
    }

    .vip-tag {
      background: linear-gradient(45deg, #ffd700, #ffa500);
      color: #fff;
      padding: 6rpx 20rpx;
      border-radius: 30rpx;
      font-size: 24rpx;
    }
  }

  .user-desc {
    color: #999;
    font-size: 28rpx;
  }
}

.info-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .info-label {
      color: #666;
      font-size: 30rpx;
    }

    .info-value {
      color: #333;
      font-size: 30rpx;
    }
  }
}

.menu-list {
  background: #fff;
  border-radius: 20rpx;
  padding: 0 30rpx;

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .menu-left {
      display: flex;
      align-items: center;

      .menu-icon {
        margin-right: 20rpx;
        font-size: 40rpx;
        color: #007aff;
      }
    }

    .icon-arrow-right {
      color: #999;
      font-size: 36rpx;
    }
  }
}

.logout-btn {
  margin-top: 50rpx;
  background: #fff;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4444;
  font-size: 34rpx;
  font-weight: bold;
}
</style>