export default [
  {
    name: '系统',
    path: 'system',
    icon: 'icon_lgdbs_system',
    children: [
      {
        name: '网站设置',
        path: 'site-setting',
        children: [
          {
            name: '站点管理',
            path: 'site-manage',
          },
          {
            name: '邮箱管理',
            path: 'mail-manage',
          },
        ],
      },
      {
        name: '安全设置',
        path: 'safe-setting',
        children: [
          {
            name: '银行卡黑名单',
            path: 'bank-card-black-list',
          },
        ],
      },
      {
        name: '员工管理',
        path: 'staff-mamage',
        children: [
          {
            name: '角色管理',
            path: 'role-manage',
          },
          {
            name: '账号管理',
            path: 'account-manage',
          },
        ],
      },
      {
        name: '系统日志',
        path: 'system-log',
        children: [
          {
            name: '登录日志',
            path: 'login-log',
          },
          {
            name: '操作日志',
            path: 'operation-log',
          },
        ],
      },
    ],
  },

  {
    name: '游戏',
    path: 'game',
    icon: 'icon_lgdbs_game',
    children: [
      {
        name: '游戏开关',
        path: 'game-switch',
      },
      {
        name: '游戏记录',
        path: 'game-record',
      },
    ],
  },

  {
    name: '用户',
    path: 'user',
    icon: 'icon_lgdbs_user',
    children: [
      {
        name: '会员等级',
        path: 'member-level',
      },
      {
        name: '会员列表',
        path: 'member-list',
      },
      {
        name: '代理等级',
        path: 'agent-level',
      },
      {
        name: '代理列表',
        path: 'agent-list',
      },
      {
        name: '代理申请审核',
        path: 'agent-apply-verify',
      },
    ],
  },

  {
    name: '财务',
    path: 'finance',
    icon: 'icon_lgdbs_finance',
    children: [
      {
        name: '财务信息',
        path: 'finance-info',
        children: [
          {
            name: '会员财务信息',
            path: 'member-finance-info',
          },
          {
            name: '余额调整审核',
            path: 'balance-adjust-verify',
          },
        ],
      },
      {
        name: '充值审核',
        path: 'charge-verify',
        // children: [
        //   {
        //     name: '人工转账审核',
        //     path: 'offline-charge-verify',
        //   },
        //   {
        //     name: '第三方充值审核',
        //     path: 'online-charge-verify',
        //   },
        // ],
      },
      {
        name: '提款审核',
        path: 'draw-verify',
      },
      {
        name: '出款账号管理',
        path: 'draw-account-manage',
      },
      {
        name: '充值设置',
        path: 'charge-setting',
      },
      {
        name: '提款设置',
        path: 'draw-setting',
      },
    ],
  },

  {
    name: '运营',
    path: 'operation',
    icon: 'icon_lgdbs_operation',
    children: [
      // {
      //   name: '站内信',
      //   path: 'station-message',
      //   children: [
      //     {
      //       name:'站内信模版',
      //       path:'station-config'
      //     }
      //   ]
      // },
      {
        name: '邮件',
        path: 'mail',
      },
      {
        name: '内容管理',
        path: 'content-manage',
        children: [
          {
            name: '公告',
            path: 'board',
          },
          {
            name: '广告',
            path: 'advertise',
          },
        ],
      },
      {
        name: '活动管理',
        path: 'activity',
      },
      {
        name: '任务管理',
        path: 'mission',
      },
      {
        name: '活跃度管理',
        path: 'liveness',
      },
      {
        name: '签到管理',
        path: 'sign-in',
      },
    ],
  },
  {
    name: '报表',
    path: 'sheet',
    icon: 'icon_lgdbs_finance',
    children: [
      {
        name: '代理报表',
        path: 'RAgent',
      },
    ],
  },
];
