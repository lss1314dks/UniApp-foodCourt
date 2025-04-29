<template>
  <view class="scan-container">
	  <view class="header">
	  	<view>
	  		<button class="back-button" @click="handleBack">
	  		  <uni-icons type="left" size="20" color="#4CAF50"></uni-icons>
	  		</button>
	  	</view>
	    <view class="item" style="">
	  	  <view class="title" style="color:#4CAF50; font-weight: 600;">
	  		  <text>扫码识别</text>
	  	  </view>
	    </view>
	    <view class="right" style="width: 50px;"> 
	    </view>
	  </view>
	  
	  
    <!-- 扫描界面 -->
    <view v-if="!showResult">
      <!-- APP端扫描功能 -->
      //#ifdef APP-PLUS
      <view class="camera-view">
        <!-- 相机视图实现 -->
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
          <view class="camera-btn capture" @click="startScan">
            <uni-icons type="camera" size="28" color="#4CAF50"></uni-icons>
          </view>
          <view class="camera-btn" @click="toggleFlash">
            <uni-icons :type="flashStatus === 'on' ? 'bolt-filled' : 'bolt'" size="24" color="#fff"></uni-icons>
          </view>
        </view>
      </view>
      //#endif

      <!-- H5端上传功能 -->
      //#ifdef H5
      <view class="upload-section">
        <text class="section-title">上传食品图片</text>
        <view class="upload-area" @click="chooseImage">
          <uni-icons type="cloud-upload" size="40" color="#4CAF50"></uni-icons>
          <text class="upload-text">点击上传图片或拍照</text>
          <text class="upload-hint">支持JPG、PNG格式</text>
        </view>
      </view>
      //#endif
    </view>

    <!-- 结果显示 -->
    <ResultView v-if="showResult" :productData="productData" @back="showResult = false"/>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import ResultView from '@/pages/ResultView/ResultView.vue';
import { onLoad } from '@dcloudio/uni-app' 

const scanning = ref(false);
const flashStatus = ref('off');
const showResult = ref(false);
const productData = ref(null);

// 通用数据获取方法
const fetchProductData = async (barcode) => {
  try {
    uni.showLoading({ title: '分析中...' });
    
    // 真实接口调用
    const { data: res } = await uni.request({
      url: `http://localhost:8081/api/food/${barcode}`,
      method: 'GET',
	  header:{
		  "userToken":uni.getStorageSync("userToken")
	  }
    });

    // 状态码验证
    if (res.status != 1) {
      uni.showToast({ 
        title:  '产品信息获取失败',
        icon: 'none'
      });
      return;
    }

    // 数据映射处理
    const formatData = {
      product_name: res.product.product_name?.replace(/，/g, ", ") || "未知产品",
      brands: res.product.brands?.split(', ')[0] || "未知品牌",
      categories: res.product.categories?.split(', ')[0] || "未分类",
      ingredients_text: res.product.ingredients_text?.replace(/;/g, ";\n") || "无成分信息",
      allergens: res.product.allergens?.replace('en:', '')?.split(',')[0] || "无过敏原",
      nutriments: {
        'energy-kcal': res.product.nutriments['energy-kcal']?.toFixed(1) || 0,
        proteins: res.product.nutriments.proteins?.toFixed(1) || 0,
        carbohydrates: res.product.nutriments.carbohydrates?.toFixed(1) || 0,
        fat: res.product.nutriments.fat?.toFixed(1) || 0,
        // 新增其他营养字段
        sugars: res.product.nutriments.sugars?.toFixed(1) || 0,
        fiber: res.product.nutriments.fiber?.toFixed(1) || 0,
        salt: res.product.nutriments.salt?.toFixed(1) || 0
      },
      image_url: res.product.image_url || '/static/default-food.png'
    };

    productData.value = formatData;
    showResult.value = true;
  } catch (error) {
    console.error('接口请求失败:', error);
    uni.showToast({ 
      title: error.errMsg || '请求失败，请检查网络',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// APP端扫描方法
const startScan = async () => {
  scanning.value = true;
  try {
    const res = await uni.scanCode({ onlyFromCamera: true, scanType: ['barCode'] });
    if(res.result)
	 uni.showToast({
	 	title:"扫描成功",
		icon:"success",
		duration:1000
	 })
	// fetchProductData(res.result);
  } catch (error) {
    uni.showToast({ title: '扫描失败', icon: 'none' });
  } finally {
    scanning.value = false;
  }
};

// H5端图片上传
const chooseImage =  () => {
   uni.chooseImage({
          count: 1,
          success: (res) => {
              // 选择图片成功后的处理
              fetchProductData('3046920029759'); // 使用模拟条码
          },
          fail: (err) => {
              console.error('选择图片失败:', err);
          }
      });
};

onLoad(()=>{
	// fetchProductData('6920152460061');
})

// 返回上一页
const handleBack = () => {
  uni.reLaunch({
  	url:'/pages/index/index'
  })
}
</script>
<style lang="scss">
	
	.header {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 15rpx 0;
	
	  
	  .back-button {
		display: flex;
	    background: none;
		width: 100rpx;
		height: 100rpx;
		align-items: center;
	    // padding: 10rpx;
	  }
	}
.scan-container {
  background-color: #f5f5f7;
  min-height: 100vh;
  padding-bottom: 20px;

  /* 公共扫描视图样式 */
  .scan-view {
    padding: 15px;
  }

  /* APP端相机样式 */
  .camera-view {
    width: 100%;
    height: 70vh;
    max-height: 500px;
    background-color: #000;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;

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
      padding-bottom: 80px;
    }

    .scan-frame {
      width: 220px;
      height: 220px;
      border: 2px solid #4CAF50;
      border-radius: 20px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
      }
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

      &.animate-scan {
        opacity: 1;
        animation: scanAnimation 2s linear infinite;
      }
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
      width: 90%;
      margin: 0 auto;
      border-radius: 50px;

      .camera-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;

        &:active {
          transform: scale(0.9);
          background-color: rgba(255, 255, 255, 0.3);
        }

        &.capture {
          width: 60px;
          height: 60px;
          background-color: white;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);

          &:active {
            transform: scale(0.95);
          }
        }
      }
    }
  }

  /* H5上传样式 */
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
  }

  @keyframes scanAnimation {
    0% { top: 0; }
    50% { top: 100%; }
    100% { top: 0; }
  }
}
</style>