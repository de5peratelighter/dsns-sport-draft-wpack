import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/MainView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   component: () => import('../views/AdminView.vue'),
  // },
  {
    path: '/selectCompetition',
    name: 'selectCompetition',
    component: () => import('../views/CompetitionSelectView.vue'),
  },
  {
    path: '/competitionSettings',
    name: 'competitionSettings',
    component: () => import('../views/CompetitionSettings.vue'),
  },  
  {
    path: '/editCompetition/:id',
    name: 'editCompetition',
    component: () => import('../views/CompetitionEditView.vue'),
  },
  {
    path: '/configByType/:id',
    name: 'configByType',
    component: () => import('../views/ConfigByTypeView.vue'),
  },
  {
    path: '/configJudges/:id',
    name: 'configJudges',
    component: () => import('../views/ConfigJudgesView.vue'),
  },
  {
    path: '/configMain/:id?',
    name: 'configMain',
    component: () => import('../views/ConfigMain.vue'),
  },
  {
    path: '/configLogos/:id',
    name: 'configLogos',
    component: () => import('../views/ConfigLogosView.vue'),
  },
  {
    path: '/configAchievements/:id',
    name: 'configAchievements',
    component: () => import('../views/ConfigAchievementsView.vue'),
  },
  {
    path: '/configNormatives/:id',
    name: 'configNormatives',
    component: () => import('../views/ConfigNormativesView.vue'),
  },
  {
    path: '/registerTeams/:id',
    name: 'registerTeams',
    component: () => import('../views/RegisterTeamsView.vue'),
  },
  {
    path: '/registerParticipants/:id',
    name: 'registerParticipants',
    component: () => import('../views/RegisterParticipantsView.vue'),
  },
  {
    path: '/protocols/:id/:type',
    name: 'protocols',
    component: () => import('../views/ProtocolsView.vue'),
  },
]

const router = new VueRouter({
  routes
})

export default router
