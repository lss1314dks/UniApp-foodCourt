<template>
  <view class="result-view">
    <view class="result-header">
      <image :src="result.image" class="result-image" mode="aspectFill"></image>
      <view class="result-meta">
        <text class="result-title">{{ result.name }}</text>
        <view class="safety-score">
          <text>安全指数</text>
          <view class="score-bar">
            <view class="score-fill" :style="{ width: result.score + '%' }"></view>
          </view>
          <text class="score-value">{{ result.score }}%</text>
        </view>
        <text :class="['safety-tag', `tag-${result.safetyLevel}`]">{{ result.safetyLabel }}</text>
      </view>
    </view>

    <!-- 营养成分分析 -->
    <uni-card>
      <text class="card-title">营养成分分析</text>
      <view class="nutrition-grid">
        <view class="nutrition-item" v-for="(item, index) in result.nutrition" :key="index">
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
        <view class="ingredient-item" v-for="(item, index) in result.ingredients" :key="index">
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
          <text class="advice-text">{{ result.advice.suitable }}</text>
        </uni-collapse-item>
        <uni-collapse-item title="不适宜人群">
          <text class="advice-text">{{ result.advice.unsuitable }}</text>
        </uni-collapse-item>
        <uni-collapse-item title="食用建议">
          <text class="advice-text">{{ result.advice.suggestion }}</text>
        </uni-collapse-item>
      </uni-collapse>
    </uni-card>

    <!-- 底部按钮 -->
    <view class="action-buttons">
      <button class="secondary-btn" @click="onBack">返回</button>
      <button class="primary-btn" @click="onSave">保存到我的食品</button>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义组件接收的属性
const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

// 定义组件发出的事件
const emit = defineEmits(['back', 'save']);

// 返回按钮事件处理
const onBack = () => {
  emit('back');
};

// 保存按钮事件处理
const onSave = () => {
  emit('save');
};
</script>

<style lang="scss">
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
</style>