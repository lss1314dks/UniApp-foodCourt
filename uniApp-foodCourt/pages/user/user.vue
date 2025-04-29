<template>
  <view class="page-container">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">个人中心</text>
    </view>
    
    <!-- 个人资料头部 -->
    <view class="profile-header">
      <view class="avatar-container">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <view class="edit-avatar" @click="editAvatar">
          <uni-icons type="camera-filled" size="16" color="#4CAF50"></uni-icons>
        </view>
      </view>
      <view class="username">{{ userInfo.name }}</view>
      <view class="settings-btn" @click="showSettingsModal">
        <uni-icons type="gear-filled" size="20" color="#fff"></uni-icons>
      </view>
    </view>
    
    <!-- 账号信息 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">账号信息</text>
        <text class="text-primary" @click="showEditProfileModal">编辑</text>
      </view>
      <view class="section-content">
        <view class="info-item">
          <view class="info-label">用户名</view>
          <view class="info-value">{{ userInfo.username }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">手机号</view>
          <view class="info-value">{{ userInfo.phone }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">性别</view>
          <view class="info-value">{{ userInfo.sex==0?'男':'女' }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">注册时间</view>
          <view class="info-value">{{ userInfo.createTime }}</view>
        </view>
      </view>
    </view>
    
    <!-- 健康数据 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">健康数据</text>
        <text class="text-primary" @click="showEditHealthDataModal">编辑</text>
      </view>
      <view class="section-content">
        <view class="health-data-grid">
          <view class="health-data-item">
            <view class="data-value">{{ userInfo.tail }}</view>
            <view class="data-label">身高 (cm)</view>
          </view>
          <view class="health-data-item">
            <view class="data-value">{{ userInfo.weight }}</view>
            <view class="data-label">体重 (kg)</view>
          </view>
          <view class="health-data-item">
            <view class="data-value">{{ userInfo.bim }}</view>
            <view class="data-label">BMI</view>
          </view>
          <view class="health-data-item">
            <view class="data-value">{{ healthData.bloodPressure }}</view>
            <view class="data-label">血压 (mmHg)</view>
          </view>
        </view>
        
        <view class="mt-4">
          <view class="info-item">
            <view class="info-label">过敏源</view>
            <view class="info-value">{{ userInfo.allergy }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">慢性病史</view>
            <view class="info-value">{{ userInfo.disease }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">健康目标</view>
            <view class="info-value">{{ healthData.healthGoal }}</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 编辑个人资料模态框 -->
    <uni-popup ref="editProfileModal" type="center" :mask-click="false">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">编辑个人资料</text>
          <uni-icons type="closeempty" size="20" @click="closeModal"></uni-icons>
        </view>
        
        <view class="form-group">
          <label class="form-label">用户名</label>
          <input class="form-input" v-model="userInfo.username" type="text">
        </view>
        
        <view class="form-group">
          <label class="form-label">手机号</label>
          <input class="form-input" v-model="userInfo.phone" type="tel">
        </view>
        
        <view class="modal-footer">
          <button class="btn-secondary" @click="closeModal">取消</button>
          <button class="btn-primary" @click="saveProfile">保存</button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 编辑健康数据模态框 -->
    <uni-popup ref="editHealthDataModal" type="center" :mask-click="false">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">编辑健康数据</text>
          <uni-icons type="closeempty" size="20" @click="closeModal"></uni-icons>
        </view>
        
        <view class="form-group">
          <label class="form-label">身高 (cm)</label>
          <input class="form-input" v-model="userInfo.tail" type="number">
        </view>
        
        <view class="form-group">
          <label class="form-label">体重 (kg)</label>
          <input class="form-input" v-model="userInfo.weight" type="number">
        </view>
        
        <view class="form-group">
          <!-- <label class="form-label">血压 (mmHg)</label>
          <view class="flex gap-2">
            <input class="form-input" v-model="editHealthDataForm.systolic" placeholder="收缩压" type="number">
            <input class="form-input" v-model="editHealthDataForm.diastolic" placeholder="舒张压" type="number">
          </view> -->
        </view>
        
        <view class="form-group">
          <label class="form-label">过敏源</label>
          <input class="form-input" v-model="userInfo.allergy" type="text">
        </view>
        
        <view class="form-group">
          <label class="form-label">慢性病史</label>
          <picker class="form-select" :range="chronicDiseasesOptions" >
            <view>{{ userInfo.disease || '请选择' }}</view>
          </picker>
        </view>
        
       <view class="form-group">
          <label class="form-label">健康目标</label>
          <picker class="form-select" :range="healthGoalOptions" >
            <view>{{ userInfo.target || '请选择' }}</view>
          </picker>
        </view>
        
        <view class="modal-footer">
          <button class="btn-secondary" @click="closeModal">取消</button>
          <button class="btn-primary" @click="saveHealthData">保存</button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 设置模态框 -->
    <uni-popup ref="settingsModal" type="bottom">
      <view class="settings-modal">
        <view class="modal-header">
          <text class="modal-title">设置</text>
          <uni-icons type="closeempty" size="20" @click="closeModal"></uni-icons>
        </view>
        
        <view class="settings-item">
          <view class="settings-label">通知提醒</view>
          <switch :checked="settings.notification" @change="toggleNotification" color="#4CAF50"></switch>
        </view>
        
        <view class="settings-item">
          <view class="settings-label">深色模式</view>
          <switch :checked="settings.darkMode" @change="toggleDarkMode" color="#4CAF50"></switch>
        </view>
        
        <view class="settings-item">
          <view class="settings-label">语言</view>
          <picker :range="languageOptions">
            <view>{{ languageOptions[settings.language] }}</view>
          </picker>
        </view>
        
        <view class="settings-item" @click="clearCache">
          <view class="settings-label">清除缓存</view>
          <uni-icons type="forward" size="16" color="#999"></uni-icons>
        </view>
        
        <view class="settings-item" @click="navigateToAbout">
          <view class="settings-label">关于我们</view>
          <uni-icons type="forward" size="16" color="#999"></uni-icons>
        </view>
        
        <view class="settings-item" @click="navigateToPrivacy">
          <view class="settings-label">隐私政策</view>
          <uni-icons type="forward" size="16" color="#999"></uni-icons>
        </view>
        
        <view class="settings-item" @click="navigateToAgreement">
          <view class="settings-label">用户协议</view>
          <uni-icons type="forward" size="16" color="#999"></uni-icons>
        </view>
        
        <button class="logout-btn" @click="logout">退出登录</button>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue'
import { EditUserApi, getUserInfoApi, uploadUrl } from '../../API/apis'
// 用户信息
const userInfo = reactive({
			id: 3,
	        username: "",
	        name: "",
	        password: "",
	        age: 0,
	        phone: "",
	        sex: 0,
	        idNumber: "",
	        avatar: "",
	        status: "",
	        tail: 0,
	        weight: 0,
	        allergy: "",
	        disease: "",
	        target: "",
	        createTime: null,
			bim:0
})

// 账号信息
const accountInfo = reactive({
  username: 'zhang_xiaojian',
  phone: '138****5678',
  email: 'xiaojian@example.com',
  registerTime: '2023-01-15',
})

// 健康数据
const healthData = reactive({
  height: 175,
  weight: 68,
  bmi: 22.2,
  bloodPressure: '120/80',
  allergies: '海鲜、花生',
  chronicDiseases: '无',
  healthGoal: '减重5kg'
})

// 健康成就
// const achievements = ref([
//   {
//     icon: 'paperplane-filled',
//     name: '健步如飞',
//     desc: '连续7天达成10000步目标'
//   },
//   {
//     icon: 'star-filled',
//     name: '蔬果达人',
//     desc: '一周内摄入15种不同蔬果'
//   },
//   {
//     icon: 'compose-filled',
//     name: '食品学者',
//     desc: '阅读10篇食品安全科普文章'
//   }
// ])

const getUserInfo = async()=>{
	const result = await getUserInfoApi();
	console.log(result.data)
	if (result.code === 200) {
	    Object.assign(userInfo, result.data);
		    // 计算 BMI 并赋值
		      if (userInfo.weight && userInfo.tail) {
		        // BMI = 体重(kg) / (身高(m)的平方)
		        const heightInMeters = userInfo.tail / 100;
		        userInfo.bim = (userInfo.weight / (heightInMeters * heightInMeters)).toFixed(2);
		      } else {
		        userInfo.bim = 0;
		      }
		      
		      console.log('计算后的BMI:', userInfo.bim);
	} else {
	    uni.showToast({
	        title: '请求失败',
	        icon: 'fail',
	        duration: 1000
	    });
	    // 清空表单数据
		userInfo = {};
	}
}

onMounted(()=>{
	getUserInfo();
})

// 编辑表单
const editProfileForm = reactive({ ...accountInfo, bio: userInfo.bio })
const editHealthDataForm = reactive({
  height: healthData.height,
  weight: healthData.weight,
  systolic: 120,
  diastolic: 80,
  allergies: healthData.allergies,
  chronicDiseases: healthData.chronicDiseases,
  healthGoal: healthData.healthGoal
})

// 设置选项
const settings = reactive({
  notification: true,
  darkMode: false,
  language: 0
})

// 选择器选项
const chronicDiseasesOptions = ref(['无', '高血压', '糖尿病', '心脏病', '其他'])
const healthGoalOptions = ref(['减重5kg', '增肌', '改善睡眠', '控制血压', '均衡营养'])
const languageOptions = ref(['简体中文', 'English'])

// 模态框引用
const editProfileModal = ref(null)
const editHealthDataModal = ref(null)
const settingsModal = ref(null)

// 显示模态框
const showEditProfileModal = () => {
  editProfileModal.value.open()
}

const showEditHealthDataModal = () => {
  editHealthDataModal.value.open()
}

const showSettingsModal = () => {
  settingsModal.value.open()
}

// 关闭模态框
const closeModal = () => {
  editProfileModal.value.close()
  editHealthDataModal.value.close()
  settingsModal.value.close()
}

// 保存个人资料
const saveProfile = async() => {
  Object.assign(userInfo, userInfo)
  //调用后端接口
  const result = await EditUserApi(userInfo);
  if(result.code===200){
	   uni.showToast({ title: '个人资料已更新', icon: 'success' })
	   getUserInfo()
  }
  // uni.showToast({ title: '个人资料已更新', icon: 'success' })
  closeModal()
}

// 保存健康数据
const saveHealthData = async() => {
	const result = await EditUserApi(userInfo);
	if(result.code===200){
		   uni.showToast({ title: '个人资料已更新', icon: 'success' })
		   getUserInfo()
	}
  uni.showToast({ title: '健康数据已更新', icon: 'success' })
  closeModal()
}

// 编辑头像
const editAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const filePath = res.tempFilePaths[0]; // 获取图片路径
      
      // 显示上传中提示
      uni.showLoading({
        title: '上传中...'
      });
      
      // 只保留一个上传请求
      uni.uploadFile({
        url: "http://localhost:8081/admin/common/upload",
        header: {
          "userToken": uni.getStorageSync("userToken")
        },
        method: 'post',
        filePath: filePath,
        name: 'file',
        success: (uploadRes) => {
          // 隐藏加载提示
          uni.hideLoading();
          
          console.log('上传响应:', uploadRes);
          
          // 正确解析返回的数据
          try {
            // 服务器返回的数据是字符串，需要解析为JSON
            const data = JSON.parse(uploadRes.data);
            console.log('解析后的数据:', data);
            
            if (data.code === 200 && data.data) {
              // 更新用户头像
              userInfo.avatar = data.data;
              
              uni.showToast({
                title: '头像已更新',
                icon: 'success',
                duration: 2000
              });
              
              // 可以在这里调用更新用户信息的API
              // updateUserInfo({ avatar: data.data });
            } else {
              uni.showToast({
                title: data.msg || '上传失败',
                icon: 'none',
                duration: 2000
              });
            }
          } catch (e) {
            console.error('解析响应数据失败:', e);
            uni.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: (err) => {
          console.error('上传失败:', err);
          uni.hideLoading();
          uni.showToast({
            title: '上传失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
      
      // 删除这行代码，避免重复上传
      // const result = uploadUrl(res);
      // console.log(result)
    },
    fail: (err) => {
      console.error('选择图片失败:', err);
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  });
}

// 切换设置
const toggleNotification = (e) => {
  settings.notification = e.detail.value
}

const toggleDarkMode = (e) => {
  settings.darkMode = e.detail.value
  // 这里应该实现深色模式的切换逻辑
}

// 清除缓存
const clearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    }
  })
}

// 导航
const navigateToAbout = () => {
  uni.navigateTo({ url: '/pages/about/index' })
}

const navigateToPrivacy = () => {
  uni.navigateTo({ url: '/pages/privacy/index' })
}

const navigateToAgreement = () => {
  uni.navigateTo({ url: '/pages/agreement/index' })
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除登录状态
        uni.removeStorageSync('userToken')
        // 跳转到登录页
        uni.switchTab({ url: '/pages/Login/Login' })
      }
    }
  })
}
</script>

<style lang="scss">
.page-container {
  background-color: #f5f5f7;
  padding-bottom: 100rpx;
}

.header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  padding: 35rpx 40rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
}

.profile-header {
  background-color: #4CAF50;
  padding: 60rpx 40rpx;
  color: white;
  text-align: center;
  position: relative;
}

.avatar-container {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 32rpx;
  border: 8rpx solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.avatar {
  width: 100%;
  height: 100%;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4CAF50;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.username {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.user-info {
  font-size: 28rpx;
  opacity: 0.9;
}

.settings-btn {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  color: white;
}

.section-card {
  background-color: white;
  border-radius: 16rpx;
  margin: 32rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-weight: 600;
  font-size: 32rpx;
}

.section-content {
  padding: 32rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 28rpx;
}

.info-value {
  font-weight: 500;
}

.health-data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.health-data-item {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
}

.data-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 8rpx;
}

.data-label {
  font-size: 24rpx;
  color: #666;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.achievement-item:last-child {
  border-bottom: none;
}

.achievement-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4CAF50;
  margin-right: 24rpx;
}

.achievement-name {
  font-weight: 600;
  margin-bottom: 4rpx;
}

.achievement-desc {
  font-size: 24rpx;
  color: #666;
}

.modal-content {
  background-color: white;
  border-radius: 16rpx;
  width: 80vw;
  // heigh:100vh;
  max-width: 800rpx;
  padding: 30rpx;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
}

.form-group {
  margin-bottom: 32rpx;
}

.form-label {
  display: block;
  margin-bottom: 16rpx;
  font-weight: 600;
  font-size: 28rpx;
}

.form-input {
  width: 85%;
  padding: 24rpx 32rpx;
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
  font-size: 32rpx;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 4rpx rgba(76, 175, 80, 0.2);
}

.form-select {
  width: 80%;
  padding: 24rpx 32rpx;
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
  font-size: 32rpx;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  // width: 200px;
  // height: 50px;
  // align-content: center;
  // align-items: center;
}

.btn-secondary {
  // padding: 20rpx 40rpx;
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
  color: #333;
  width: 190rpx;
  height: 100rpx;
  line-height: 100rpx;
  background-color: white;
}

.btn-primary {
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
  color: white;
  width: 190rpx;
  height: 100rpx;
  line-height: 100rpx;
  align-content: center;
  background-color: #4CAF50;
}

.settings-modal {
  background-color: white;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  padding: 40rpx;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.settings-label {
  font-size: 30rpx;
}

.logout-btn {
  margin-top: 60rpx;
  width: 100%;
  padding: 30rpx;
  color: #ff4d4f;
  background-color: white;
  border: 1rpx solid #ff4d4f;
  border-radius: 16rpx;
}

.text-primary {
  color: #4CAF50;
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 8rpx;
}

.mt-4 {
  margin-top: 16rpx;
}
</style>