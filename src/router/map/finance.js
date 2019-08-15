export default {
  name: 'finance',
  path: 'finance',
  component: () => import('@/views/finance/index'),
  children: [
    {
      name: 'finance-info',
      path: 'finance-info',
      component: () => import('@/views/finance/finance-info/index'),
      children: [
        {
          name: 'member-finance-info',
          path: 'member-finance-info',
          component: () =>
            import('@/views/finance/finance-info/member-finance-info/index'),
        },
        {
          name: 'balance-adjust-verify',
          path: 'balance-adjust-verify',
          component: () =>
            import('@/views/finance/finance-info/balance-adjust-verify/index'),
        },
      ],
    },
    {
      name: 'charge-verify',
      path: 'charge-verify',
      component: () => import('@/views/finance/charge-verify/index'),
      children: [
        // {
        //   name: 'online-charge-verify',
        //   path: 'online-charge-verify',
        //   component: () =>
        //     import('@/views/finance/charge-verify/online-charge-verify/index'),
        // },
        // {
        //   name: 'offline-charge-verify',
        //   path: 'offline-charge-verify',
        //   component: () =>
        //     import('@/views/finance/charge-verify/offline-charge-verify/index'),
        // },
      ],
    },
    {
      name: 'draw-verify',
      path: 'draw-verify',
      component: () => import('@/views/finance/draw-verify/index'),
    },
    {
      name: 'draw-account-manage',
      path: 'draw-account-manage',
      component: () => import('@/views/finance/draw-account-manage/index'),
    },
    {
      name: 'charge-setting',
      path: 'charge-setting',
      component: () => import('@/views/finance/charge-setting/index'),
    },
    {
      name: 'draw-setting',
      path: 'draw-setting',
      component: () => import('@/views/finance/draw-setting/index'),
    },
    {
      name: 'activity-draw-setting',
      path: 'activity-draw-setting',
      component: () => import('@/views/finance/activity-draw-setting/index'),
    },
  ],
};
