import { shallowMount } from '@vue/test-utils';
import Index from '@/pages/index';

describe('Pages | Index', () => {
  it('should render all workouts', () => {
    const wrapper = shallowMount(Index, {
      data() {
        return {
          workouts: [
            { id: 1, title: 'WOD1', content: '100 push-ups' },
            { id: 2, title: 'WOD2', content: '200 squats' },
          ],
        };
      },
    });

    const foundWorkouts = wrapper.findAll('.workout');
    expect(foundWorkouts.length).toBe(2);
    expect(foundWorkouts.at(0).find('h2').text()).toBe('WOD1');
    expect(foundWorkouts.at(0).find('pre').text()).toBe('100 push-ups');
    expect(foundWorkouts.at(1).find('h2').text()).toBe('WOD2');
    expect(foundWorkouts.at(1).find('pre').text()).toBe('200 squats');
  });
});
