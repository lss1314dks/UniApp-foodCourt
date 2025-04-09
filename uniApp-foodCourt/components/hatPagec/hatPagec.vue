<template>
  <view class="chat-page">
    <!-- 顶部 -->
    <view class="chat-header fixed-header">
      <view class="back-icon" @click="goBack">
        <text class="iconfont icon-arrow-left"></text>
      </view>
      <view class="chat-title">{{ title }}</view>
      <view class="more-icon">
        <text class="iconfont icon-more"></text>
      </view>
    </view>

    <!-- 聊天内容 -->
    <scroll-view
      class="chat-content"
      scroll-y
      :scroll-top="scrollTop"
      :style="{ height: contentHeight + 'px' }"
    >
      <view class="message-list">
        <view v-for="(message, index) in chatMessages" :key="index" class="message-item">
          <view v-if="message.type === 'other'" class="other-message">
            <view class="avatar-box">
              <image :src="otherAvatar" class="avatar" />
            </view>
            <view class="message-content other">
              <text class="message-text">{{ message.content }}</text>
            </view>
          </view>
          <view v-else class="self-message">
            <view class="message-content self">
              <text class="message-text">{{ message.content }}</text>
            </view>
            <view class="avatar-box">
              <image :src="selfAvatar" class="avatar" />
            </view>
          </view>
        </view>

        <!-- 正在输入中 -->
        <view v-if="isTyping" class="typing-tip">
          <text>对方正在输入中...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 输入框 -->
    <view class="input-area" :style="{ bottom: tabbarHeight + safeAreaInsets + 'px' }">
      <input
        class="input"
        v-model="inputMessage"
        placeholder="请输入消息"
        @confirm="sendMessage"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
      <button class="send-btn" @click="sendMessage">发送</button>
    </view>
  </view>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const props = defineProps({
  title: {
    type: String,
    default: '聊天对象'
  },
  selfAvatar: {
    type: String,
    default: '/static/images/avatar.jpg'
  },
  otherAvatar: {
    type: String,
    default: '/static/images/avatar.jpg'
  }
});

// 聊天数据
const chatMessages = ref([
  { type: 'other', content: '你好呀！' },
  { type: 'self', content: '你好，最近怎么样？' }
]);

const inputMessage = ref('');
const scrollTop = ref(0);
const safeAreaInsets = ref(0);
const tabbarHeight = ref(50);
const contentHeight = ref(0);
const isTyping = ref(false);

// 自动回复内容池
const replyList = [
  '我收到啦，聊聊吧！',
  '好的，你说的很有道理。',
  '哈哈哈，笑死我了😂',
  '我在的，有什么需要帮忙的吗？',
  '等一下我看看。',
  '真不错，继续说~',
  '我这边也差不多',
  '那我们约个时间？'
];

onMounted(() => {
  initLayout();
});

function initLayout() {
  const systemInfo = uni.getSystemInfoSync();
  safeAreaInsets.value = systemInfo.safeAreaInsets?.bottom || 0;
  contentHeight.value =
    systemInfo.windowHeight - 44 - 50 - safeAreaInsets.value - tabbarHeight.value;
  scrollToBottom();
}

function scrollToBottom() {
  setTimeout(() => {
    scrollTop.value = Math.random() * 100000;
  }, 100);
}

function sendMessage() {
  const msg = inputMessage.value.trim();
  if (msg) {
    chatMessages.value.push({ type: 'self', content: msg });
    inputMessage.value = '';
    scrollToBottom();
    triggerVibrate();
    simulateReply(); // 👈 发送后模拟回复
  }
}

// 模拟自动回复
function simulateReply() {
  isTyping.value = true;

  setTimeout(() => {
    scrollToBottom();
    const reply = replyList[Math.floor(Math.random() * replyList.length)];
    chatMessages.value.push({ type: 'other', content: reply });
    isTyping.value = false;
    nextTick(() => scrollToBottom());
  }, 1500);
}

// 震动提示
function triggerVibrate() {
  uni.vibrateShort({
    success: () => {},
    fail: () => {}
  });
}

function onInputFocus() {
  setTimeout(() => scrollToBottom(), 300);
}

function onInputBlur() {
  setTimeout(() => scrollToBottom(), 300);
}

function goBack() {
  uni.navigateBack();
}
</script>


<style scoped lang="scss">
.typing-tip {
	// text-align: left;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 14px;
	color: #888;
	// margin-left: 60px;
	// margin-bottom: 10px;
	  }
.chat-page {
  position: relative;
  height: 100vh;
  background-color: #f5f5f5;
}
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
.chat-header {
  height: 44px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #eee;
  .iconfont {
    font-size: 20px;
  }
}
.chat-content {
  padding-top: 44px;
  // padding-bottom: 70px;
}
.message-item {
  margin-bottom: 15px;
}
.other-message,
.self-message {
  display: flex;
  align-items: flex-start;
  max-width: 100%;
}
.other-message {
  justify-content: flex-start;
}
.self-message {
  justify-content: flex-end;
}
.avatar-box {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin: 0 10px;
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}
.message-content {
  max-width: 70%;
  min-height: 40px;
  padding: 10px 15px;
  border-radius: 5px;
  word-break: break-word;
  &.other {
    background: #fff;
    margin-left: 10px;
  }
  &.self {
    background: rgb(98, 131, 244);
	color: #eee;
    margin-right: 10px;
  }
  .message-text {
    font-size: 16px;
    line-height: 1.5;
  }
}
.input-area {
  position: fixed;
  left: 0;
  right: 0;
  height: 50px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-top: 1px solid #eee;
  box-sizing: content-box;
  .input {
    flex: 1;
    height: 36px;
    padding: 0 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
  }
  .send-btn {
    width: 70px;
    height: 36px;
    background: rgb(98, 131, 244);
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    padding: 0;
  }
}
</style>
