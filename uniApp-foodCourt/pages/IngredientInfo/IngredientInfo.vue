<template>
  <view class="ingredient-page">

    <view class="ingredient-list">
      <view
        v-for="(item, index) in ingredients"
        :key="index"
        class="ingredient-card"
        @click="toggleExpand(index)"
      >
        <view class="card-header">
          <image :src="item.icon" class="ingredient-icon" />
          <view class="ingredient-info">
            <view class="name">{{ item.name }}</view>
            <view class="summary">{{ item.summary }}</view>
          </view>
        </view>

        <view v-if="item.expanded" class="card-detail">
          {{ item.detail }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const ingredients = ref([
  {
    name: '山梨酸钾',
    summary: '常用防腐剂，安全剂量下不会对健康造成影响。',
    detail: '山梨酸钾是一种常见的食品防腐剂，用于防止食品霉变、延长保质期。根据国家标准，摄入量在规定范围内是安全的。',
    icon: '/static/images/avatar.jpg',
    expanded: false
  },
  {
    name: '柠檬酸',
    summary: '天然存在于柑橘类水果中，用作酸味剂。',
    detail: '柠檬酸广泛用于饮料、糖果等食品中，帮助调节口感，具有良好的安全性。',
    icon: '/static/images/avatar.jpg',
    expanded: false
  },
  {
    name: '谷氨酸钠（味精）',
    summary: '用于提升鲜味，适量使用无害。',
    detail: '味精能增强食品鲜味，过量摄入可能影响某些人群的身体反应（如头晕），但总体安全。',
    icon: '/static/images/avatar.jpg',
    expanded: false
  }
]);

function toggleExpand(index) {
  ingredients.value[index].expanded = !ingredients.value[index].expanded;
}
</script>

<style scoped lang="scss">
.ingredient-page {
  padding: 20rpx;
  background-color: #f9f9f9;
  min-height: 100vh;
}
.page-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  text-align: center;
}
.ingredient-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.ingredient-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}
.card-header {
  display: flex;
  align-items: center;
}
.ingredient-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}
.ingredient-info {
  flex: 1;
}
.name {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
}
.summary {
  font-size: 26rpx;
  color: #666;
}
.card-detail {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #444;
  line-height: 1.6;
}
</style>
