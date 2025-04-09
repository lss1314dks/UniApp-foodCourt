<template>
  <view class="container">
    <!-- 标题 -->
    <view class="header">
      <text class="title">每日科普</text>
    </view>

    <!-- 列表展示 -->
    <view class="list-container">
      <view
        v-for="(item, index) in scienceList"
        :key="index"
        class="list-item"
        @click="goToBaidu(item.url)"
      >
        <image :src="item.image" class="list-image" />
        <view class="list-text">
          <text class="list-title">{{ item.title }}</text>
          <text class="list-description">{{ item.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scienceList: [
        {
          title: '太阳系',
          image: '/static/images/sun.jpg',
          description: '太阳系是我们所在的星系，包含8大行星。',
          url: 'https://baike.baidu.com/item/%E5%A4%AA%E9%98%B3%E7%B3%BB/9077',
        },
        {
          title: '重力',
          image: '/static/images/gravity.jpg',
          description: '重力是使物体相互吸引的力。',
          url: 'https://baike.baidu.com/item/%E9%87%8D%E5%8A%9B/22084',
        },
        {
          title: '光合作用',
          image: '/static/images/photosynthesis.jpg',
          description: '植物利用光能合成有机物的过程。',
          url: 'https://baike.baidu.com/item/%E5%85%89%E5%90%88%E4%BD%9C%E7%94%A8/2266',
        },
        // 添加更多的科普条目
      ]
    };
  },
  methods: {
    // 跳转至百度百科
    goToBaidu(url) {
      uni.navigateTo({
        url: url
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

/* 标题 */
.header {
  background-color: #fff;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
.title {
  font-size: 18px;
  font-weight: bold;
}

/* 列表容器 */
.list-container {
  margin: 10px;
}

/* 每个条目 */
.list-item {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.list-item:hover {
  transform: translateY(-5px);
}

/* 图片 */
.list-image {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 15px;
}

/* 文字部分 */
.list-text {
  flex: 1;
}

.list-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.list-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
