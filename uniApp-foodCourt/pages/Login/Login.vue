<template>
    <view class="LoginLayout">
        <view class="title">
            <text>Welcome to FoodCourt</text>
        </view>
        <view class="content">
            <view class="login-title">
                <text class="text" style="padding-left: 50rpx;">登录</text>
				<view class="" style="width:48px; height: 5px; background: rgb(77, 190, 200);margin-top: 25rpx; margin-left: 50rpx;"></view>
            </view>
            <view class="form">
                <uni-forms class="form-items" v-model="formData">
                    <uni-forms-item  name="username">
                        <input type="text" placeholder="用户名" style="padding-left: 20rpx;  height: 80rpx;" v-model="formData.username"/>
                    </uni-forms-item>
                    <uni-forms-item  name="password">
                        <input class="uni-input" type="safe-password" placeholder="密码" style="padding-left: 20rpx;  height: 80rpx;" v-model="formData.password"/>
						<!-- uni-input -->
					</uni-forms-item>
					<!-- 注册按钮 -->
					<uni-forms-item>
					    <uni-text @click="goRegister" style="float: right; color:rgb(77, 190, 200) ; border-bottom: 1px solid rgb(77, 190, 200); font-size: 16px;">注册账户</uni-text>
					</uni-forms-item>
                    <uni-forms-item>
                        <button type="primary" style=" background-color: rgb(77, 190, 200); color: #fff; border-radius: 50rpx; margin-top: 30rpx;" @click="login">登录</button>
                    </uni-forms-item>
					<!-- 注册按钮 -->
                </uni-forms>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
// 绑定对象
import {ref,reactive} from "vue"
import { LoginApi } from "../../API/apis";

//新建表单对象
const formData = reactive({
	username:'',
	password:''
});

//调用后端接口
const login = async()=>{
		//路径跳转
		// uni.reLaunch({
		//   url: '/pages/index/index'
		// });
	const result = await LoginApi(formData);
	// const result = await uni.request({
	//   url: "http://localhost:8081/user/user/login", // 修改为正确的后端地址
	//   method: "POST",
	//   data:formData,
	//   header:{
	// 	  // 'X-Session-ID':'123'
	//   }
	// });
	console.log('登录响应',result);
	if(result.code===200){
		//设置token
		uni.setStorageSync('userToken',result.data.token);
		console.log(result.data.token);
		//存储用户信息
		uni.setStorageSync("userInfo",result.data);
		console.log(result.data);
		uni.setStorageSync("userId",result.data.id);
		
		//路径跳转
		uni.reLaunch({
		  url: '/pages/index/index'
		});
		//提示登录成功
		uni.showToast({
			title: '登录成功',
			icon: 'success',
			duration: 1000
		})
	}else{
		uni.showToast({
			title: '登录失败,请重新输入用户名和密码',
			icon: 'fail',
			duration: 1000
		})
		//清空表单数据
		formData.username = ""
		formData.password = ""
	}
	
}

const goRegister = ()=>{
	console.log("wenben")
	uni.reLaunch({
		url:"/pages/register/register"
	})
}

</script>

<style scoped lang="scss">

.LoginLayout{
    position: relative;
    width: 100vw;
    height: calc(100vh - 7vh);
    background: linear-gradient(70deg, rgb(42, 164, 175), rgb(118, 217, 222));
    overflow: hidden;
	.title{
		margin-left: 30rpx;
		font-size: 80rpx;
		color: #fff;
		font-weight: 600;
		position: absolute;
		left: 0;
		bottom: 450px;
	}

    // 主体内容
    .content{
        width: 100vw;
        height: 400px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        border-radius: 30px 30px 0 0 ;
        .login-title{
            margin-top: 50rpx;
            margin-left: 30rpx;

            .text{
                color:rgb(68, 91, 88);
                font-size: 40rpx;
                font-weight: 600;
            }
        }
        .form{
            width: 100%;
            height: 100%;
            // margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-content: center;
            margin: 20px auto;
			overflow: hidden;
            .form-items{
                display: flex;
                flex-direction: column;
                align-items: center; // 让子元素水平居中
                input{
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