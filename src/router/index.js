import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                //活动管理
                {
                    path: '/activity',
                    component: resolve => require(['../components/page/activity/Activity.vue'], resolve),
                    meta: { title: '活动发布' }
                },
                {
                    path: '/add_activity',
                    component: resolve => require(['../components/page/activity/AddActivity.vue'], resolve),
                    meta: { title: '新增活动' }
                },
                {
                    path: '/add_activity_add',
                    component: resolve => require(['../components/page/activity/CreateActivity.vue'], resolve),
                    meta: { title: '创建活动' }
                },
                {
                    path: '/export_goods',
                    component: resolve => require(['../components/page/activity/ExportGoods.vue'], resolve),
                    meta: { title: '导入产品' }
                },
                {
                    path: '/type_list',
                    component: resolve => require(['../components/page/activity/TypeList.vue'], resolve),
                    meta: { title: '活动类型' }
                },
                // 商家管理
                {
                    path: '/merchat',
                    component: resolve => require(['../components/page/merchat/MerchatList.vue'], resolve),
                    meta: { title: '商家列表' }
                },
                {
                    path: '/distributor',
                    component: resolve => require(['../components/page/merchat/DistributorList.vue'], resolve),
                    meta: { title: '分销商列表' }
                },
                // 系统管理
                {
                    path: '/account',
                    component: resolve => require(['../components/page/system/Account.vue'], resolve),
                    meta: { title: '账号管理' }
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/system/Role.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/model',
                    component: resolve => require(['../components/page/system/Model.vue'], resolve),
                    meta: { title: '模块管理' }
                },
                // 营销管理
                {
                    path: '/coupons',
                    component: resolve => require(['../components/page/marketing/Coupons.vue'], resolve),
                    meta: { title: '优惠券管理' }
                },
                {
                    path: '/coupon_goods',
                    component: resolve => require(['../components/page/marketing/CouponGoods.vue'], resolve),
                    meta: { title: '优惠券产品' }
                },
                {
                    path: '/groups',
                    component: resolve => require(['../components/page/marketing/Groups.vue'], resolve),
                    meta: { title: '拼团管理' }
                },
                {
                    path: '/groups_editor',
                    component: resolve => require(['../components/page/marketing/GroupsEditor.vue'], resolve),
                    meta: { title: '拼团编辑' }
                },
                //复制拼团
                {
                    path: '/groups_copy_editor',
                    component: resolve => require(['../components/page/marketing/GroupsCopyEditor.vue'], resolve),
                    meta: { title: '拼团复制编辑' }
                },
               //产品管理
                {
                path: '/goods_upload',
                component: resolve => require(['../components/page/goods/GoodsUpload.vue'], resolve),
                meta: { title: '上传管理' }
                },
                //首页推荐
                {
                    path: '/labelOne',
                    component: resolve => require(['../components/page/home/LabelOne.vue'], resolve),
                    meta: { title: '一级标签' }
                    },
                {
                        path: '/labelTwo',
                        component: resolve => require(['../components/page/home/LabelTwo.vue'], resolve),
                        meta: { title: '二级标签' }
                },
                // 推荐产品
                {
                    path: '/label_goods',
                    component: resolve => require(['../components/page/home/LabelGoods.vue'], resolve),
                    meta: { title: '标签产品' }
                },
                // 统计管理
                {
                    path: '/register_reward',
                    component: resolve => require(['../components/page/count/RegisterReward.vue'], resolve),
                    meta: { title: '用户领奖统计' }
                },
                {
                    path: '/brand_statistic',
                    component: resolve => require(['../components/page/statistic/BrandStatistic.vue'], resolve),
                    meta: { title: '活动统计' }
                },
                {
                    path: '/activity_statistic',
                    component: resolve => require(['../components/page/statistic/ActivityStatistic.vue'], resolve),
                    meta: { title: '促销统计' }
                },
                {
                    path: '/test',
                    component: resolve => require(['../components/page/test.vue'], resolve),
                    meta: { title: '测试专用' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                // 学院管理
                {
                    path: '/article',
                    component: resolve => require(['../components/page/article/Articles.vue'], resolve),
                    meta: { title: '栏目发布' }
                },
                {
                    path: '/fund',
                    component: resolve => require(['../components/page/article/Fund.vue'], resolve),
                    meta: { title: '基金发布' }
                },
                {
                    path: '/editor_fund',
                    component: resolve => require(['../components/page/article/EditorFund.vue'], resolve),
                    meta: { title: '基金编辑' }
                },
                {
                    path: '/editor_article',
                    component: resolve => require(['../components/page/article/EditorArticle.vue'], resolve),
                    meta: { title: '文章编辑' },
                    name:'文章编辑'
                },
                {
                    path: '/article_class',
                    component: resolve => require(['../components/page/article/ClassArticle.vue'], resolve),
                    meta: { title: '基金分类' }
                },
                {
                    path: '/column_class',
                    component: resolve => require(['../components/page/article/ClassColumn.vue'], resolve),
                    meta: { title: '栏目分类' }
                },


                {
                    path: '/video_class',
                    component: resolve => require(['../components/page/article/ClassVideo.vue'], resolve),
                    meta: { title: '视频分类' }
                },
                {
                    path: '/video',
                    component: resolve => require(['../components/page/article/Video.vue'], resolve),
                    meta: { title: '视频发布' }
                },
                {
                    path: '/video_editor',
                    component: resolve => require(['../components/page/article/EditorVideo.vue'], resolve),
                    meta: { title: '视频编辑' }
                },
 
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '统计' }
                },
              
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve),
                //     meta: { title: '拖拽列表' }
                // },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
