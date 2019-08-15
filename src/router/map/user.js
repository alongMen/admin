export default {
  name: 'user',
  path: 'user',
  component: () => import('@/views/user/index'),
  children: [
    {
      name: 'member-level',
      path: 'member-level',
      component: () => import('@/views/user/member-level/index'),
    },
    {
      name: 'member-list',
      path: 'member-list',
      component: () => import('@/views/user/member-list/index'),
    },
    {
      name: 'agent-level',
      path: 'agent-level',
      component: () => import('@/views/user/agent-level/index'),
    },
    {
      name: 'agent-list',
      path: 'agent-list',
      component: () => import('@/views/user/agent-list/index'),
    },
    {
      name: 'agent-apply-verify',
      path: 'agent-apply-verify',
      component: () => import('@/views/user/agent-apply-verify/index'),
    },
  ],
};
