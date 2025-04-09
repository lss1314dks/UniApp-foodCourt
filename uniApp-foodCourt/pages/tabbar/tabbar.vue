<template>
  <view class="custom-tabbar">
    <view v-for="(item, index) in tabList" :key="index" :class="currentIndex === index? 'active' : ''" @click="switchTab(index)">
      <image :src="currentIndex === index? item.selectedIconPath : item.iconPath"></image>
      <text>{{ item.text }}</text>
    </view>
    <view class="center-btn" @click="centerBtnClick">
      <image im></image> <!-- 这里的加号图标路径需根据实际情况修改 -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      tabList: [
			{
				text: "首页",
				pagePath: "pages/index/index",
				iconPath: "/static/images/home.png",
				selectedIconPath: "/static/images/home-h.png"
			},
			{
				text: "聊天",
				pagePath: "pages/chating/chating",
				iconPath: "/static/images/classify.png",
				selectedIconPath: "/static/images/classify-h.png"
				
			},{
				text: "我的",
				pagePath: "pages/user/user",
				iconPath: "/static/images/user.png",
				selectedIconPath: "/static/images/user-h.png"
			}
		],
		};
  },
  methods: {
    switchTab(index) {
      this.currentIndex = index;
      uni.switchTab({
        url: this.tabList[index].pagePath
      });
    }
  }
};
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 5px 0;
}
.custom-tabbar view {
  flex: 1;
  text-align: center;
}
.custom-tabbar view image {
  width: 24px;
  height: 24px;
}
.custom-tabbar view text {
  display: block;
  font-size: 12px;
  color: #666;
}
.custom-tabbar view.active text {
  color: #007aff;
}
</style>    