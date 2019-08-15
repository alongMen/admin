export default {
  name: 'operation',
  path: 'operation',
  component: () => import('@/views/operation/index'),
  children: [
    {
      name: 'station-message',
      path: 'station-message',
      component: () => import('@/views/operation/station-message/index'),
      children: [
        {
          name: 'station-config',
          path: 'station-config',
          component: () =>
            import('@/views/operation/station-message/station-config/index'),
        },
      ],
    },
    {
      name: 'mail',
      path: 'mail',
      component: () => import('@/views/operation/mail/index'),
    },
    {
      name: 'content-manage',
      path: 'content-manage',
      component: () => import('@/views/operation/content-manage/index'),
      children: [
        {
          name: 'board',
          path: 'board',
          component: () =>
            import('@/views/operation/content-manage/board/index'),
        },
        {
          name: 'advertise',
          path: 'advertise',
          component: () =>
            import('@/views/operation/content-manage/advertise/index'),
        },
      ],
    },
    {
      name: 'activity',
      path: 'activity',
      component: () => import('@/views/operation/activity/index'),
    },
    {
      name: 'mission',
      path: 'mission',
      component: () => import('@/views/operation/mission/index'),
    },
    {
      name: 'liveness',
      path: 'liveness',
      component: () => import('@/views/operation/liveness/index'),
    },
    {
      name: 'sign-in',
      path: 'sign-in',
      component: () => import('@/views/operation/sign-in/index'),
    },
  ],
};
