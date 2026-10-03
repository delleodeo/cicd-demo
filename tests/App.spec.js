import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('Launchpad dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('switches between light and dark themes and persists the choice', async () => {
    const wrapper = mount(App)
    const toggle = wrapper.get('.theme-toggle')

    expect(wrapper.get('.app-shell').classes()).not.toContain('dark')
    expect(toggle.attributes('aria-label')).toBe('Switch to dark mode')

    await toggle.trigger('click')

    expect(wrapper.get('.app-shell').classes()).toContain('dark')
    expect(toggle.attributes('aria-label')).toBe('Switch to light mode')
    expect(localStorage.getItem('launchpad-theme')).toBe('dark')

    await toggle.trigger('click')

    expect(wrapper.get('.app-shell').classes()).not.toContain('dark')
    expect(localStorage.getItem('launchpad-theme')).toBe('light')
  })

  it('progresses through the deployment and increments the build number', async () => {
    const wrapper = mount(App)

    await wrapper.get('.deploy-button').trigger('click')
    expect(wrapper.get('.deploy-button').text()).toContain('Deploying...')
    expect(wrapper.get('.status-pill').text()).toContain('Deploying now')

    jest.advanceTimersByTime(650 * 5)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.deploy-button').text()).toContain('Deploy latest')
    expect(wrapper.get('.status-pill').text()).toContain('Deployment successful')
    expect(wrapper.get('.footer').text()).toContain('#129')
    expect(wrapper.findAll('.step-marker.complete')).toHaveLength(4)
  })
})
