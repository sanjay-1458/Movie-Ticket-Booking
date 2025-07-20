/* eslint-env jest */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TrailersSection from '../components/TrailersSection';

jest.mock('react-player', () => props => (
  <video
    data-testid="player"
    src={props.src}
    {...(props.controls ? { controls: true } : {})}
  />
));

jest.mock('../assets/assets', () => ({
  dummyTrailers: [{ image: '1.jpg', videoUrl: 'https://test-url/video.mp4' }],
}));


jest.mock('../components/BlurCircle', () => () => <div data-testid="blur" />);
jest.mock('lucide-react', () => ({ PlayCircleIcon: () => <div /> }));

describe('TrailersSection (basic)', () => {
  it('renders the video player with correct src and is playable', () => {
    render(
      <MemoryRouter>
        <TrailersSection />
      </MemoryRouter>
    );

    const player = screen.getByTestId('player');
    expect(player).toBeInTheDocument();

    expect(player).toHaveAttribute('src', 'https://test-url/video.mp4');

    expect(typeof player.play).toBe('function');
  });
});
