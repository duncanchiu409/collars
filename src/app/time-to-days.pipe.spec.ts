import { TimeToDaysPipe } from './time-to-days.pipe';

describe('TimeToDaysPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeToDaysPipe();
    expect(pipe).toBeTruthy();
  });
});
