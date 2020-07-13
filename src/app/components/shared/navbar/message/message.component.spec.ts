import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let spectator: Spectator<MessageComponent>;
  const createComponent = createComponentFactory(MessageComponent);

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
