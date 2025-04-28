<template>
    <view class="RegistrationLayout">
		 <view class="back-btn" @click="goBack">
		            <uni-icons type="left" size="24" color="#fff"></uni-icons>
		        </view>
        <view class="title">
            <text>Welcome to FoodCourt</text>
        </view>
        <view class="content">
            <view class="registration-title">
                <text class="text" style="padding-left: 50rpx;">注册</text>
                <view class="" style="width:48px; height: 5px; background: rgb(77, 190, 200);margin-top: 25rpx; margin-left: 50rpx;"></view>
            </view>
            <view class="form">
                <uni-forms class="form-items" v-model="formData">
                    <uni-forms-item  name="username">
                        <input type="text" placeholder="用户名" style="padding-left: 20rpx;  height: 80rpx;" v-model="formData.username"/>
                    </uni-forms-item>
                    <uni-forms-item  name="password">
                        <input type="safe-password" placeholder="密码" style="padding-left: 20rpx;  height: 80rpx;" v-model="formData.password"/>
                    </uni-forms-item>
                    <uni-forms-item  name="twopassword">
                        <input type="safe-password" placeholder="确认密码" style="padding-left: 20rpx;  height: 80rpx;" v-model="formData.twopassword"/>
                    </uni-forms-item>
                    <uni-forms-item>
                        <button type="primary" style=" background-color: rgb(77, 190, 200); color: #fff; border-radius: 50rpx; margin-top: 30rpx;" @click="register">注册</button>
                    </uni-forms-item>
                </uni-forms>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
// 绑定对象
import { ref, reactive } from "vue";
import { RegisterApi } from "../../API/apis";
const goBack = () => {
    uni.reLaunch({
    	url:'/pages/Login/Login'
    })
};

// 新建表单对象
const formData = reactive({
    username: '',
    password: '',
    twopassword: ''
});

// 调用后端接口
const register = async () => {
	console.log("1111111111111111111111111111")
    if (formData.password!== formData.twopassword) {
        uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'fail',
            duration: 1000
        });
        return;
    }
    const result = await RegisterApi(formData);
    console.log('注册响应', result);
    if (result.code === 200) {
        // 提示注册成功
        uni.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1000
        });
        // 路径跳转至登录页
        uni.reLaunch({
            url: '/pages/Login/Login'
        });
    } else {
        uni.showToast({
            title: '注册失败，请重新输入信息',
            icon: 'fail',
            duration: 1000
        });
        // 清空表单数据
        formData.username = "";
        formData.password = "";
        formData.twopassword = "";
    }
};
</script>

<style scoped lang="scss">

.RegistrationLayout {
    position: relative;
    width: 100vw;
    height: calc(100vh - 7vh);
    background: linear-gradient(70deg, rgb(42, 164, 175), rgb(118, 217, 222));
    overflow: hidden;
	.back-btn {
	        position: absolute;
	        top: 60rpx;
	        left: 30rpx;
	        z-index: 10;
	        width: 60rpx;
	        height: 60rpx;
	        display: flex;
	        align-items: center;
	        justify-content: center;
	        background-color: rgba(255, 255, 255, 0.2);
	        border-radius: 50%;
	    }
	    
	    // 调整标题位置，避免与返回按钮重叠
	    .title {
	        margin-left: 30rpx;
	        font-size: 80rpx;
	        color: #fff;
	        font-weight: 600;
	        position: absolute;
	        left: 0;
	        bottom: 450px;
	        padding-top: 100rpx; // 新增，为返回按钮留出空间
	    }
	
   // .title {
   //      margin-left: 30rpx;
   //      font-size: 80rpx;
   //      color: #fff;
   //      font-weight: 600;
   //      position: absolute;
   //      left: 0;
   //      bottom: 450px;
   //  }

    // 主体内容
   .content {
        width: 100vw;
        height: 400px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        border-radius: 30px 30px 0 0 ;
       .registration-title {
            margin-top: 50rpx;
            margin-left: 30rpx;

           .text {
                color:rgb(68, 91, 88);
                font-size: 40rpx;
                font-weight: 600;
            }
        }
       .form {
            width: 100%;
            height: 100%;
            // margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-content: center;
            margin: 20px auto;
            overflow: hidden;
           .form-items {
                display: flex;
                flex-direction: column;
                align-items: center; // 让子元素水平居中
                input {
                    padding: 10rpx;
                    width: 80vw;
                    height: 50rpx;
                    border: 1px solid #ccc;
                    border-radius: 30px ;
                }
            }
        }
    }
}
</style>    