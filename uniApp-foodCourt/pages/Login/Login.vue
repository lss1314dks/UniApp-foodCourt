<template>
    <view class="LoginLayout">
        <view class="title">
            <text>Welcome to FoodCourt</text>
        </view>
        <view class="content">
            <view class="login-title">
                <text class="text">Log In</text>
            </view>
            <view class="form">
                <uni-forms class="form-items">
                    <uni-forms-item  name="username">
                        <input type="text" placeholder="username" style="padding-left: 20rpx;  height: 80rpx;"/>
                    </uni-forms-item>
                    <uni-forms-item  name="password">
                        <input type="safe-password" placeholder="password" style="padding-left: 20rpx;  height: 80rpx;"/>
                    </uni-forms-item>
                    <uni-forms-item>
                        <button type="primary" style=" background-color: rgb(77, 190, 200); color: #fff; border-radius: 50rpx; margin-top: 30rpx;">登录</button>
                    </uni-forms-item>
                </uni-forms>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
// 绑定对象
import {ref} from "vue"

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