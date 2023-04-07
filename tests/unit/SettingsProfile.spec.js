import { shallowMount, mount } from '@vue/test-utils'
import SettingsProfile from '@/components/settingsComponents/SettingsProfile.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user.js'

describe('SettingsProfile.vue', () => {
  // Initialize such that tests will be able to access.
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    const author = {
      type: 'author',
      id: 'https://social-t30.herokuapp.com/authors/d569cd39-0a2d-411e-8d86-e8a063a18dea',
      _id: 'd569cd39-0a2d-411e-8d86-e8a063a18dea',
      url: 'https://social-t30.herokuapp.com/authors/d569cd39-0a2d-411e-8d86-e8a063a18dea',
      host: 'https://social-t30.herokuapp.com/',
      displayName: 'testuser1',
      github: 'http://github.com/testuser1',
      profileImage: 'https://i.imgur.com/k7XVwp'
    }
    const user = {
      auth_token: '12345',
      author: author,
      username: 'testuser1'
    }
    const userStore = useUserStore()
    userStore.setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  })
  // Basic rendering tests
  it('renders the username', () => {
    wrapper = shallowMount(SettingsProfile)
    const user = useUserStore().user
    const username = wrapper.get('#username-text')
    expect(username.text()).toMatch(user.username)
  })

  it('renders the author name', () => {
    wrapper = shallowMount(SettingsProfile)
    const author = useUserStore().user.author
    const displayName = wrapper.get('#display-name-text')
    expect(displayName.text()).toMatch('@' + author.displayName)
  })
  it('renders the author profile picture', () => {
    wrapper = shallowMount(SettingsProfile)
    const author = useUserStore().user.author
    const profileImage = wrapper.get('.settings-profile-image')
    expect(profileImage.attributes().src).toEqual(author.profileImage)
  })

  it('renders the author GitHub name', () => {
    wrapper = shallowMount(SettingsProfile)
    const author = useUserStore().user.author
    const ghName = wrapper.get('#gh-name-text')
    expect(ghName.text()).toMatch(author.github.split('/').pop())
  })
  it('renders the author uuid', () => {
    wrapper = shallowMount(SettingsProfile)
    const author = useUserStore().user.author
    const uuid = wrapper.get('#uuid-text')
    expect(uuid.text()).toMatch(author.id.split('/').pop())
  })
  it('shows alerts', async () => {
    wrapper = shallowMount(SettingsProfile)
    wrapper.vm.showAlert('test', 'success')
    await wrapper.vm.$nextTick()
    const alert = wrapper.get('#settings-alert')
    expect(alert.text()).toMatch('test')
    expect(alert.classes()).toContain('alert-success')
  })
  // test modals
  it('shows edit display name modal', async () => {
    wrapper = mount(SettingsProfile) // mount is needed for modals
    const modalOpen = wrapper.get('#edit-display-name-button')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#displaynameModal')
    expect(modal.isVisible()).toBe(true)
  })
  it('shows edit username modal', async () => {
    wrapper = mount(SettingsProfile)
    const modalOpen = wrapper.get('#edit-username-button')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#usernameModal')
    expect(modal.isVisible()).toBe(true)
  })
  it('shows edit github modal', async () => {
    wrapper = mount(SettingsProfile)
    const modalOpen = wrapper.get('#edit-github-button')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#githubModal')
    expect(modal.isVisible()).toBe(true)
  })
  it('shows edit profile Image modal', async () => {
    wrapper = mount(SettingsProfile)
    const modalOpen = wrapper.get('.edit-overlay')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#profileImageModal')
    expect(modal.isVisible()).toBe(true)
  })
  it('shows edit password modal', async () => {
    wrapper = mount(SettingsProfile)
    const modalOpen = wrapper.get('#edit-password-button')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#passwordModal')
    expect(modal.isVisible()).toBe(true)
  })
  // test prefilled values in modals
  it('renders prefilled profile image url in modal', async () => {
    wrapper = mount(SettingsProfile)
    const modalOpen = wrapper.get('.edit-overlay')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#profileImageModal')
    const input = modal.get('input')
    expect(input.element.value).toMatch(useUserStore().user.author.profileImage)
  })
  it('renders prefilled github username in modal', async () => {
    wrapper = mount(SettingsProfile)
    const modalOpen = wrapper.get('#edit-github-button')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#githubModal')
    const input = modal.get('input')
    expect(input.element.value).toMatch(useUserStore().user.author.github.split('/').pop())
  })
  it('renders prefilled display name in modal', async () => {
    wrapper = mount(SettingsProfile)
    const modalOpen = wrapper.get('#edit-display-name-button')
    await modalOpen.trigger('click')
    await wrapper.vm.$nextTick()
    const modal = wrapper.get('#displaynameModal')
    const input = modal.get('input')
    expect(input.element.value).toMatch(useUserStore().user.author.displayName)
  })
  // test basic input validation in modals -- doesn't work
  // it('validates passwords match in password modal', async () => {
  //   wrapper = mount(SettingsProfile)
  //   // open modal
  //   const modalOpen = wrapper.get('#edit-password-button')
  //   await modalOpen.trigger('click')
  //   await wrapper.vm.$nextTick()
  //   const modal = wrapper.get('#passwordModal')
  //   // set current password
  //   const currentPassword = modal.get('#currentPassword')
  //   await currentPassword.setValue('testOld')
  //   // set new password
  //   const newPassword = modal.get('#newPassword')
  //   await newPassword.setValue('test')
  //   // set confirm password
  //   const confirmNewPassword = modal.get('#confirmNewPassword')
  //   await confirmNewPassword.setValue('test2')
  //   // click submit
  //   const button = wrapper.get('#submit-password-button')
  //   console.log(button.text())
  //   await button.trigger('click')
  //   await wrapper.vm.$nextTick()
  //   // check alert
  //   console.log(wrapper.vm.errorMsg)
  //   console.log(wrapper.vm.errorMsg)
  //   const alert = modal.get('#passwordModal-alert')
  //   // console.log(wrapper.vm.fields)
  //   expect(alert.text()).toMatch('New passwords do not match.')
  //   expect(alert.classes()).toContain('alert-danger')
  // })
})
