<template>
  <view class="map-container">
    <!-- WebView容器用于加载高德地图 -->
    <web-view 
      v-if="mapUrl" 
      :src="mapUrl" 
      @message="handleWebViewMessage"
       style="width: 100%; height: 100%;"
    ></web-view>
    
    <!-- 定位状态显示 -->
    <view class="status-info" v-if="statusMessage">
      {{ statusMessage }}
    </view>
    
    <!-- 自定义控件容器 -->
   <view class="controls">
        <!--  <view class="control-btn" @click="refreshLocation">
            <uni-icons type="refresh" size="24" color="#4CAF50"></uni-icons>
          </view> -->
        </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 高德地图配置
const aMapKey = 'b8b1f09933ae7cf96535e9e265117082';
const aMapSecurityCode = '766d0e1839a4cfb75304069351c383e2';
const mapUrl = ref('');
const statusMessage = ref('');

// 初始化地图
onMounted(() => {
  initAMap();
});

// 初始化高德地图
const initAMap = () => {
  // 生成包含地图HTML的内容 - 修正script标签问题
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>高德地图</title>
      <style>
        body, html { margin:0; padding:0; width:100%; height:100%; }
        #container { width:100%; height:100%; }
      </style>
    </head>
    <body>
      <div id="container"></div>
      <script>
        window._AMapSecurityConfig = {
          securityJsCode: '${aMapSecurityCode}'
        };
      <` + `/script>
      <script src="https://webapi.amap.com/maps?v=2.0&key=${aMapKey}"><` + `/script>
      <script>
        var map = new AMap.Map('container', {
          viewMode: '3D',
          zoom: 15,
          center: [116.397428, 39.90923], // 默认北京中心点
          resizeEnable: true
        });
        
        // 添加控件
        AMap.plugin(['AMap.Scale', 'AMap.ToolBar', 'AMap.Geolocation'], function() {
          
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
            buttonPosition: 'RB',
            zoomToAccuracy: true
          });
          map.addControl(geolocation);
          
          // 自动定位
          geolocation.getCurrentPosition(function(status, result) {
            if (status === 'complete') {
              // 定位成功，发送消息到uniapp
              window.postMessage({
                type: 'locationSuccess',
                data: {
                  longitude: result.position.lng,
                  latitude: result.position.lat,
                  accuracy: result.accuracy
                }
              });
            } else {
              // 定位失败
              window.postMessage({
                type: 'locationError',
                data: result.message
              });
            }
          });
        });
        
        // 地图点击事件
        map.on('click', function(e) {
          window.postMessage({
            type: 'mapClick',
            data: {
              lng: e.lnglat.getLng(),
              lat: e.lnglat.getLat()
            }
          });
        });
      <` + `/script>
    </body>
    </html>
  `;
  
  // 生成Blob URL
  const blob = new Blob([htmlContent], { type: 'text/html' });
  mapUrl.value = URL.createObjectURL(blob);
};

// 处理WebView消息
const handleWebViewMessage = (e) => {
  const message = e.detail.data[0];
  switch (message.type) {
    case 'locationSuccess':
      statusMessage.value = `定位成功\n经度: ${message.data.longitude.toFixed(6)}\n纬度: ${message.data.latitude.toFixed(6)}`;
      setTimeout(() => statusMessage.value = '', 3000);
      break;
    case 'locationError':
      statusMessage.value = `定位失败: ${message.data}`;
      setTimeout(() => statusMessage.value = '', 3000);
      break;
    case 'mapClick':
      console.log('地图点击坐标:', message.data);
      break;
  }
};

// 刷新定位
const refreshLocation = () => {
  if (mapUrl.value) {
    const newUrl = mapUrl.value + '&t=' + Date.now();
    mapUrl.value = '';
    setTimeout(() => mapUrl.value = newUrl, 50);
  }
};

// 地图缩放
const zoomIn = () => {
  postMessageToWebView({ type: 'zoomIn' });
};

const zoomOut = () => {
  postMessageToWebView({ type: 'zoomOut' });
};

// 向WebView发送消息
const postMessageToWebView = (message) => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const webView = currentPage.$getAppWebview().children()[0];
  webView.evalJS(`window.postMessage(${JSON.stringify(message)})`);
};
</script>

<style lang="scss">
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.controls {
  position: absolute;
  right: 10px;
  bottom: 60px; /* 给叠加层留出空间 */
  z-index: 99;
  
  .control-btn {
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    margin-bottom: 8px;
  }
}
</style>