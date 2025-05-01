<template>
  <view class="result-view">
    <!-- 返回按钮 -->
    <uni-icons 
      type="arrowleft" 
      size="24" 
      class="back-icon" 
      @click="$emit('back')"
    ></uni-icons>

    <!-- 头部信息 -->
    <view class="result-header">
      <image 
        :src="productData.image_url" 
        class="result-image" 
        mode="aspectFit"
      />
      <view class="header-info">
        <text class="result-title">{{ productData.product_name }}</text>
        <text class="brand-text">{{ productData.brands }}</text>
        <text class="category-text">{{ productData.categories }}</text>
      </view>
    </view>

    <!-- 营养信息 -->
    <view class="info-card">
      <text class="card-title">营养信息（每100g）</text>
      <view class="nutrition-grid">
        <view class="nutrition-item">
          <text class="nutrition-label">热量</text>
          <text class="nutrition-value">{{ productData.nutriments['energy-kcal'] }}kcal</text>
        </view>
        <view class="nutrition-item">
          <text class="nutrition-label">蛋白质</text>
          <text class="nutrition-value">{{ productData.nutriments.proteins }}g</text>
        </view>
        <view class="nutrition-item">
          <text class="nutrition-label">碳水</text>
          <text class="nutrition-value">{{ productData.nutriments.carbohydrates }}g</text>
        </view>
        <view class="nutrition-item">
          <text class="nutrition-label">脂肪</text>
          <text class="nutrition-value">{{ productData.nutriments.fat }}g</text>
        </view>
      </view>
    </view>

    <!-- 成分分析 -->
<view class="info-card">
    <text class="card-title">成分分析</text>
    <view class="ingredient-list">
      <view 
        v-for="(index,item) in productData.ingredients_text.split('\n')[0].split('，||,')"
        class="ingredient-item"
      >
        <uni-icons 
          type="circle-filled" 
          size="12" 
          color="#4CAF50"
          class="ingredient-icon"
        ></uni-icons>
        <text class="ingredient-name">{{ index }}</text>
      </view>
    </view>
  </view>
	
	<!-- 成分分析 -->
	<view class="info-card">
	  <text class="card-title">建议</text>
	  <view class="ingredient-box">
	    <text class="ingredient-text">{{productData.ingredients_text.split("\n")[2]||productData.ingredients_text.split("\n")[3]}}</text>
	  </view>
	</view>

    <!-- 过敏警告 -->
    <view class="warning-card" v-if="productData.allergens">
      <uni-icons type="info" size="18" color="#ff9800"></uni-icons>
      <text class="warning-text">过敏原警告：本产品包含 {{ productData.allergens }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app' 
defineProps({
  productData: {
    type: Object,
    required: true
  }
});

//对product进行处理
const suggest = ref("");

const ingTest = productData.ingredients_text;
suggest.value = ingTest.value.split('\n')[1];


console.log(ingredientsList)


</script>
<style lang="scss">
.header {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 15rpx 0;
	}	
	
.result-view {
  padding: 20px;
  background: linear-gradient(180deg, #f8fff9 0%, #ffffff 100%);
  min-height: 100vh;
  
  
  .ingredient-list {
    background: white;
    border-radius: 8px;
    padding: 12px;
  }
  
  .ingredient-item {
    display: flex;
    align-items: center;
    padding: 10px 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    
    &:last-child {
      border-bottom: none;
    }
  
    .ingredient-icon {
      margin-right: 10px;
      flex-shrink: 0;
    }
  
    .ingredient-name {
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
  }


  .back-icon {
    margin-bottom: 20px;
    padding: 10px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:active {
      background: rgba(76, 175, 80, 0.2);
    }
  }

  .result-header {
    display: flex;
    margin-bottom: 25px;
    position: relative;
    padding: 15px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .result-image {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      margin-right: 15px;
      border: 2px solid #f0f0f0;
      object-fit: contain;
      background: white;
      padding: 8px;
    }

    .header-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .result-title {
      font-size: 20px;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .brand-text {
      color: #4CAF50;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      padding: 4px 8px;
      background: rgba(76, 175, 80, 0.1);
      border-radius: 4px;
      display: inline-block;
    }

    .category-text {
      color: #95a5a6;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
  }

  .info-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;

    &:active {
      transform: translateY(2px);
    }

    .card-title {
      font-weight: 700;
      font-size: 16px;
      color: #34495e;
      margin-bottom: 16px;
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: #4CAF50;
        border-radius: 2px;
      }
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;

      .nutrition-item {
        background: rgba(76, 175, 80, 0.05);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        border: 1px solid rgba(76, 175, 80, 0.1);
		display: flex;
		align-items: center;
		flex-direction: column;

        .nutrition-label {
          color: #7f8c8d;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .nutrition-value {
          color: rgb(76, 175, 80);
          font-weight: 700;
          font-size: 18px;
          margin-top: 8px;
          position: relative;
          
          &::after {
            content: '';
            display: block;
            width: 24px;
            height: 2px;
            background: rgba(76, 175, 80, 0.3);
            margin: 8px auto 0;
          }
        }
      }
    }

    .ingredient-box {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      line-height: 1.8;
      color: #34495e;
      font-size: 14px;
      position: relative;
      
      &::before {
        content: '📝';
        position: absolute;
        right: 16px;
        top: -12px;
        font-size: 24px;
        opacity: 0.1;
      }
    }
  }

  .warning-card {
    background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-left: 4px solid #ff9800;
    animation: pulse 1.5s infinite;

    .warning-text {
      color: #ff6f00;
      font-size: 14px;
      font-weight: 500;
      flex: 1;
    }
  }

  @keyframes pulse {
    0% { opacity: 0.9; }
    50% { opacity: 1; }
    100% { opacity: 0.9; }
  }

  @media (min-width: 768px) {
    padding: 30px;
    
    .result-header {
      padding: 24px;
      
      .result-image {
        width: 160px;
        height: 160px;
      }
      
      .result-title {
        font-size: 24px;
      }
    }
    
    .info-card {
      padding: 24px;
      
      .nutrition-grid {
        gap: 20px;
        
        .nutrition-item {
          padding: 20px;
        }
      }
    }
  }
}
</style>