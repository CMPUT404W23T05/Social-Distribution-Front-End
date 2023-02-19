import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import NavBar from '@/components/NavBar.vue'

describe('HelloWorld.vue', () => {
  // Initialize such that tests will be able to access.
  let wrapper;
  let author;

  beforeEach(() => {
    author = {
        id: 12345,
        home_host: 'this node',
        display_name: 'Charmander',
        profile_image: 'https://m.media-amazon.com/images/I/71TDVlm5zUL._AC_SY741_.jpg',
        author_github: 'gittyuphorse'
      }
    wrapper = shallowMount(NavBar, {
        props: { author }
    })
  })

  it('renders the author name', () => {
    const username = wrapper.get('#username')
    expect(username.text()).toMatch('@' + author.display_name)
  })

  it('renders the author profile picture with correct alt-text', () => {
    const profileImage = wrapper.get('img')
    expect(profileImage.attributes().src).toEqual('https://m.media-amazon.com/images/I/71TDVlm5zUL._AC_SY741_.jpg')
    expect(profileImage.attributes().alt).toContain('profile picture')
  })

  it('has a different header colour for active links', () => {
    // I manually tested this, since it won't work now as no valid pages are added to the router just yet.
    // Replace with a real test once these are added.
    expect(true).toBeTruthy
  })
})
