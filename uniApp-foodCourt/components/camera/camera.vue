<template>
  <view class="container">
    <camera
      class="camera"
      ref="camera"
      device-position="{{devicePosition}}"
      flash="{{flash}}"
      @error="cameraError"
    >
      <cover-view class="controls">
        <cover-image 
          class="switch-btn" 
          src="/static/switch.png"
          @click="switchCamera"
        ></cover-image>
        <cover-view class="shutter" @click="takePhoto"></cover-view>
        <cover-image
          class="flash-btn"
          :src="flash === 'on' ? '/static/flash-on.png' : '/static/flash-off.png'"
          @click="toggleFlash"
        ></cover-image>
      </cover-view>
    </camera>
  </view>
</template>

<script>
const camera = uni.requireNativePlugin('camera')
export default {
  data() {
    return {
      devicePosition: 'back',
      flash: 'off'
    }
  },
  methods: {
    // 拍照
    takePhoto() {
      this.$refs.camera.capture({
        quality: 'high',
        success: (res) => {
          uni.$emit('cameraCaptured', res.tempImagePath)
          uni.navigateBack()
        }
      })
    },

    // 切换摄像头
    switchCamera() {
      this.devicePosition = this.devicePosition === 'back' ? 'front' : 'back'
    },

    // 切换闪光灯
    toggleFlash() {
      this.flash = this.flash === 'on' ? 'off' : 'on'
    },

    // 错误处理
    cameraError(e) {
      console.error('相机错误:', e.detail)
    }
  }
}
</script>

<style>
.camera {
  flex: 1;
}
.controls {
  position: absolute;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shutter {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: 5px solid #ddd;
}
.switch-btn, .flash-btn {
  width: 40px;
  height: 40px;
  margin: 0 40px;
}
</style>