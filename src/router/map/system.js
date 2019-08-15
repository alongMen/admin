export default {
  path: 'system',
  name: 'system',
  component: () => import('@/views/system/index'),
  children: [
    {
      path: 'site-setting',
      name: 'site-setting',
      component: () => import('@/views/system/site-setting/index'),
      children: [
        {
          name: 'site-manage',
          path: 'site-manage',
          component: () =>
            import('@/views/system/site-setting/site-manage/index'),
        },
        {
          name: 'mail-manage',
          path: 'mail-manage',
          component: () =>
            import('@/views/system/site-setting/mail-manage/index'),
        },
      ],
    },
    {
      name: 'safe-setting',
      path: 'safe-setting',
      component: () => import('@/views/system/safe-setting/index'),
      children: [
        {
          name: 'bank-card-black-list',
          path: 'bank-card-black-list',
          component: () =>
            import('@/views/system/safe-setting/bank-card-black-list/index'),
        },
      ],
    },
    {
      name: 'staff-mamage',
      path: 'staff-mamage',
      component: () => import('@/views/system/staff-manage/index'),
      children: [
        {
          name: 'role-manage',
          path: 'role-manage',
          component: () =>
            import('@/views/system/staff-manage/role-manage/index'),
        },
        {
          name: 'account-manage',
          path: 'account-manage',
          component: () =>
            import('@/views/system/staff-manage/account-manage/index'),
        },
      ],
    },
    {
      name: 'system-log',
      path: 'system-log',
      component: () => import('@/views/system/system-log/index'),
      children: [
        {
          name: 'login-log',
          path: 'login-log',
          component: () => import('@/views/system/system-log/login-log/index'),
        },
        {
          name: 'operation-log',
          path: 'operation-log',
          component: () =>
            import('@/views/system/system-log/operation-log/index'),
        },
      ],
    },
    {
      name: 'ip-setting',
      path: 'ip-setting',
      component: () => import('@/views/system/ip-setting/index'),
    },
  ],
};
