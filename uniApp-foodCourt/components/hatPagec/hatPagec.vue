<template>
  <view class="chat-page">
    <!-- 顶部 -->
	<view class="header">
	  <text class="title">ChatFoodCourt</text>
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

    <view class="input-area">
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

const getMessage = async (prompt) => {
  try {
	isTyping.value = true;
    const { data } = await uni.request({
      url: "http://47.109.139.91:8081/chat/context", // 修改为正确的后端地址
      method: "POST",
	  data:{prompt},
	  header:{
		  'X-Session-ID':'123'
	  }
    });
    if (data.success) {
	  isTyping.value = false;
      chatMessages.value.push({ type: 'other', content: data.data });
      scrollToBottom();
    } else {
      console.error('聊天请求失败:', data.message);
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
};

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
  { type: 'other', content: '你好呀！' }
]);

const inputMessage = ref('');
const scrollTop = ref(0);
const safeAreaInsets = ref(0);
const tabbarHeight = ref(50);
const contentHeight = ref(0);
const isTyping = ref(false);

// 自动回复内容池
// const replyList = [
//   '我收到啦，聊聊吧！',
//   '好的，你说的很有道理。',
//   '哈哈哈，笑死我了😂',
//   '我在的，有什么需要帮忙的吗？',
//   '等一下我看看。',
//   '真不错，继续说~',
//   '我这边也差不多',
//   '那我们约个时间？'
// ];

onMounted(() => {
  initLayout();
});

function initLayout() {
  const systemInfo = uni.getSystemInfoSync();
  
  // 计算内容区域高度 = 屏幕高度 - 头部高度 - 输入框高度
  contentHeight.value = systemInfo.windowHeight - 44 - 60;
  
  // 确保安全区域在iOS设备上正确处理
  safeAreaInsets.value = systemInfo.safeAreaInsets?.bottom || 0;
  
  // 初始滚动到底部
  scrollToBottom();
}

// 调整滚动到底部函数
function scrollToBottom() {
  nextTick(() => {
    scrollTop.value = 999999; // 使用足够大的值确保滚动到底部
  });
}

function sendMessage() {
  const msg = inputMessage.value.trim();
  if (msg) {
    chatMessages.value.push({ type: 'self', content: msg });
    inputMessage.value = '';
    scrollToBottom();
    triggerVibrate();// 👈 发送后模拟回复
	getMessage(msg);
  }
}



// // 模拟自动回复
// function simulateReply() {
//   isTyping.value = true;

//   setTimeout(() => {
//     scrollToBottom();
//     const reply = replyList[Math.floor(Math.random() * replyList.length)];
//     chatMessages.value.push({ type: 'other', content: reply });
//     isTyping.value = false;
//     nextTick(() => scrollToBottom());
//   }, 1500);
// }

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
.chat-page {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 15px 20px;
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

.chat-content {
  flex: 1;
  overflow: hidden;
  padding: 10px 15px;
  box-sizing: border-box;
}

.message-list {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* 为输入框留出空间 */
}

.message-item {
  margin-bottom: 15px;
}

.other-message,
.self-message {
  margin-top: 10px;
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
    border-radius: 50%;
  }
}

.message-content {
  max-width: 70%;
  min-height: 40px;
  padding: 10px 15px;
  border-radius: 18px;
  word-break: break-word;
  
  &.other {
    background: #fff;
    margin-left: 10px;
    border-bottom-left-radius: 4px;
  }
  
  &.self {
    background: #4CAF50;
    color: #fff;
    margin-right: 10px;
    border-bottom-right-radius: 4px;
  }
  
  .message-text {
    font-size: 16px;
    line-height: 1.5;
  }
}

.typing-tip {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin: 10px 0;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-top: 1px solid #eee;
  box-sizing: border-box;
  z-index: 10;
  
  .input {
    flex: 1;
    height: 40px;
    padding: 0 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    margin-right: 10px;
    font-size: 16px;
  }
  
  .send-btn {
    width: 80px;
    height: 40px;
    background: #4CAF50;
    color: #fff;
    font-size: 16px;
    border-radius: 20px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    
    &:active {
      opacity: 0.8;
    }
  }
}
</style>
