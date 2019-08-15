export default {
  name: 'sheet',
  path: 'sheet',
  component: () => import('@/views/sheet/index'),
  children: [
    {
      name: 'RFinance',
      path: 'RFinance',
      component: () => import('@/views/sheet/RFinance/index'),
      children: [
        {
          name: 'OpRFinance',
          path: 'OpRFinance',
          component: () =>
            import('@/views/sheet/RFinance/OpRFinance/index'),
        },
        {
          name: 'ReRFinance',
          path: 'ReRFinance',
          component: () =>
            import('@/views/sheet/RFinance/ReRFinance/index'),
        },
      ],
    },
    {
      name: 'RMarketing',
      path: 'RMarketing',
      component: () => import('@/views/sheet/RMarketing/index'),
      children: [
        {
          name: 'ActiveReMarketing',
          path: 'ActiveReMarketing',
          component: () =>
            import('@/views/sheet/RMarketing/ActiveReMarketing/index'),
        },
        {
          name: 'MissReMarketing',
          path: 'MissReMarketing',
          component: () =>
            import('@/views/sheet/RMarketing/MissReMarketing/index'),
        },
        {
          name: 'LiveReMarketing',
          path: 'LiveReMarketing',
          component: () =>
            import('@/views/sheet/RMarketing/LiveReMarketing/index'),
        },
      ],
    },
    {
      name: 'RAgent',
      path: 'RAgent',
      component: () => import('@/views/sheet/RAgent/index'),
    },
    {
      name: 'RGame',
      path: 'RGame',
      component: () => import('@/views/sheet/RGame/index'),
    },
  ],
};
