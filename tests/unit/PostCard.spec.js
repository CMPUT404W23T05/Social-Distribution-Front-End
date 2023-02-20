import {shallowMount, mount } from '@vue/test-utils'
import PostCard from '@/components/PostCard.vue'

describe('PostCard.vue', () => {

    const author = {
        id: 123456,
        displayName: 'Yotsuba',
        profileImage: 'https://i.pinimg.com/736x/2e/77/8a/2e778a785656f8c6c50f3e88f76d1139.jpg'
    };

    //A real post will have not have postSource and content together
    function makePost(type) {
        return {
            type: type,
            title: 'Duralumin',
            postId: 30,
            postSource: 'https://images.unsplash.com/photo-1672541214674-3df733c7ea6b',
            content: '**Chomp *chomp*** Delicious'
        };
    };

  it('renders an image when prop "type" is image', () => {
    const post = makePost("image");
    const wrapper = shallowMount(PostCard, {
        props: {author, post}
    })

    const imageContent = wrapper.get('.card-img-top')
    expect(imageContent.attributes().src).toBe('https://images.unsplash.com/photo-1672541214674-3df733c7ea6b')
  });

  it('does not render text when prop "type" is image', () => {
    const post = makePost("image");
    const wrapper = shallowMount(PostCard, {
        props: {author, post}
    })

    expect(wrapper.find('.card-body').exists()).toBeFalsy()
  });

  it('renders text when prop "type" is text', () => {
    const post = makePost("text");
    const wrapper = shallowMount(PostCard, {
        props: {author, post}
    })

    const textContent = wrapper.find('.card-body')
    expect(textContent.text()).toBe('**Chomp *chomp*** Delicious')
  });

  it('does not render image when prop "type" is plain text', () => {
    const post = makePost("text");
    const wrapper = shallowMount(PostCard, {
        props: {author, post}
    })

    expect(wrapper.find('.card-img-top').exists()).toBeFalsy()
  });

  it('correctly renders commonmark', () => {
    const post = makePost("markdown");
    const wrapper = mount(PostCard, {
        props: {author, post}
    })
    const textContent = wrapper.find('.card-body')
    expect(textContent.html()).toContain('<strong>Chomp <em>chomp</em></strong>')
  });

  it('renders the profile picture of the author', () => {
    const post = makePost("text");
    const wrapper = shallowMount(PostCard, {
        props: {author, post}
    })
    
    expect(wrapper.find('#profile-picture').attributes().src).toBe('https://i.pinimg.com/736x/2e/77/8a/2e778a785656f8c6c50f3e88f76d1139.jpg')
  })
})