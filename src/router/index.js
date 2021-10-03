import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

// 登录页面
const login =() =>import("@/page/login/login")
// 内容
const postArticle =() => import("@/page/content/post-article")
const manageArticle =() => import("@/page/content/manage-article")
const manageComment =() => import("@/page/content/manage-comment")
const manageReplay =() => import("@/page/content/manage-replay")
const manageImage =() => import("@/page/content/manage-image")
//仪表盘（首页）
const index =() => import("@/page/dashboard/index")
//运营
const category =() => import("@/page/operation/category")
const loop =() => import("@/page/operation/loop")
//设置
const email =() => import("@/page/settings/email")
const info =() => import("@/page/settings/info")
const friendLink =() => import("@/page/settings/friend-link")
const websiteInfo =() => import("@/page/settings/website-info")
//用户
const list =() => import("@/page/user/list")
//布局
const baseView =() => import("@/layout/base-view")
const rightView =() => import("@/layout/right-content")

export const routes = [
    {
        path: '',
        component: baseView,
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: '首页',
                icon: 'el-icon-s-home',
                component: index,
                hidden: false,
            },
            {
                path: '/content',
                name: '内容',
                icon: 'el-icon-menu',
                component: rightView,
                hidden: false,
                children: [
                    {
                        path: 'post-article',
                        name: '发表文章',
                        icon: 'el-icon-document',
                        hidden: false,
                        component: postArticle
                    },
                    {
                        path: 'manage-article',
                        name: '文章管理',
                        icon: 'el-icon-folder',
                        hidden: false,
                        component: manageArticle
                    },
                    {
                        path: 'manage-comment',
                        name: '评论管理',
                        icon: 'el-icon-chat-dot-round',
                        hidden: false,
                        component: manageComment
                    },
                    {
                        path: 'manage-replay',
                        name: '回复管理',
                        icon: 'el-icon-chat-dot-round',
                        hidden: false,
                        component: manageReplay
                    },
                    {
                        path: 'manage-image',
                        name: '图片管理',
                        icon: 'el-icon-picture',
                        hidden: false,
                        component: manageImage
                    }
                ]
            },
            {
                path: '/user',
                name: '用户',
                icon: 'el-icon-s-custom',
                component: rightView,
                hidden: false,
                children: [
                    {
                        path: 'list',
                        name: '用户列表',
                        icon: 'el-icon-user-solid',
                        hidden: false,
                        component: list,
                    }
                ]
            },
            {
                path: '/operation',
                name: '运营',
                icon: 'el-icon-s-goods',
                component: rightView,
                hidden: false,
                children: [
                    {
                        path: 'category',
                        name: '分类',
                        icon: 'el-icon-s-data',
                        hidden: false,
                        component: category,
                    },
                    {
                        path: 'loop',
                        name: '轮播图',
                        icon: 'el-icon-picture-outline',
                        hidden: false,
                        component: loop
                    }
                ]
            },
            {
                path: '/settings',
                name: '设置',
                icon: 'el-icon-s-tools',
                component: rightView,
                hidden: false,
                children: [
                    {
                        path: 'email',
                        name: '邮箱设置',
                        icon: 'el-icon-tickets',
                        hidden: false,
                        component: email,
                    },
                    {
                        path: 'info',
                        name: '用户信息',
                        icon: 'el-icon-user',
                        hidden: false,
                        component: info,
                    },
                    {
                        path: 'friend-link',
                        name: '友情链接',
                        icon: 'el-icon-s-promotion',
                        hidden: false,
                        component: friendLink,
                    },
                    {
                        path: 'website-info',
                        name: '网站信息',
                        icon: 'el-icon-s-platform',
                        hidden: false,
                        component: websiteInfo
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: login
    }
]


const router = new VueRouter({
    routes
})

export default router;