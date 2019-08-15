export default {
  name: 'game',
  path: 'game',
  component: () => import('@/views/game/index'),
  children: [
    {
      name: 'game-switch',
      path: 'game-switch',
      component: () => import('@/views/game/game-switch/index'),
    },
    {
      name: 'game-record',
      path: 'game-record',
      component: () => import('@/views/game/game-record/index'),
    },
  ],
};
