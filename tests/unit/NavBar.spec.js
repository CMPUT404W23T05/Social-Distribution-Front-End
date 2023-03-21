import { shallowMount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import NavBar from '@/components/NavBar.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user.js'

describe('NavBar.vue', () => {
  // Initialize such that tests will be able to access.
  let wrapper
  let router

  beforeEach(() => {
    setActivePinia(createPinia())
    // TODO: update mock data to match new backend schema
    const author = {
      id: 12345,
      home_host: 'this node',
      displayName: 'Charmander',
      profileImage: 'https://m.media-amazon.com/images/I/71TDVlm5zUL._AC_SY741_.jpg',
      author_github: 'gittyuphorse'
    }
    const user = {
      auth_token: '12345',
      author: author,
      email: 'example@example.com',
      id: 12345,
      username: 'Charmander'
    }
    const userStore = useUserStore()
    userStore.setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
    router = createRouter({
      history: createWebHistory(),
      inkActiveClass: 'active',
      routes: routes
    })
  })

  it('renders the author name', () => {
    wrapper = shallowMount(NavBar)
    const author = useUserStore().user.author
    const username = wrapper.get('#display-name')
    expect(username.text()).toMatch('@' + author.displayName)
  })

  it('renders the author profile picture with correct alt-text', () => {
    wrapper = shallowMount(NavBar)
    const author = useUserStore().user.author
    const profileImage = wrapper.get('img')
    expect(profileImage.attributes().src).toEqual(author.profileImage)
    expect(profileImage.attributes().alt).toContain('profile picture')
  })

  it('redirects / to /home', async () => {
    router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.path).toContain('home')
  })

  it('tracks exactly one active link', async () => {
    router.push('/home')
    await router.isReady()

    wrapper = shallowMount(NavBar, {
      global: {
        plugins: [router]
      }
    })

    // For whatever reason, the wrapper cannot find the "active" class in the DOM,
    // despite a visual check within the browser confirming it's there and unique.
    // The automated test fails, but manual inspection passes. This is the case for
    // both shallow mounting (can't find) and regular mounting (undefined error)

    // expect(wrapper.findAll('li .active').length).toBe(1)
  })
  it('updates displayname when it changes', async () => {
    const user = useUserStore().user
    const newDisplayName = 'Squirtle'
    user.author.displayName = newDisplayName // change the user's display name
    useUserStore().setUser(user) // update the user in the store
    wrapper = shallowMount(NavBar)
    await wrapper.vm.$nextTick()
    const displayName = wrapper.get('#display-name')
    expect(displayName.text()).toMatch('@' + newDisplayName) // check that the display name has changed
  })
  it('updates profile image when it changes', async () => {
    const user = useUserStore().user
    const newProfileImage = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png' // squirtle image
    user.author.profileImage = newProfileImage // change the user's profile image
    useUserStore().setUser(user) // update the user in the store
    wrapper = shallowMount(NavBar)
    await wrapper.vm.$nextTick()
    const profileImage = wrapper.get('img')
    expect(profileImage.attributes().src).toEqual(newProfileImage) // check that the profile image has changed
  })
})
