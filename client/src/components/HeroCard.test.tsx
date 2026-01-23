import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { superheroesApi } from '../features/superheroesApi';
import HeroCard from './HeroCard';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { type Superhero } from '../features/superheroesApi';

const mockHero: Superhero = {
  _id: '123',
  nickname: 'Spider-Man',
  real_name: 'Peter Parker',
  origin_description: 'Bitten by a spider',
  superpowers: 'Wall-clinging',
  catch_phrase: 'With great power...',
  images: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const createMockStore = () =>
  configureStore({
    reducer: { [superheroesApi.reducerPath]: superheroesApi.reducer },
    middleware: (gDM) => gDM().concat(superheroesApi.middleware),
  });

describe('HeroCard Component', () => {
  let mockOnEdit: Mock<(hero: Superhero) => void>;
  let mockOnView: Mock<(id: string) => void>;

  beforeEach(() => {
    mockOnEdit = vi.fn();
    mockOnView = vi.fn();
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={createMockStore()}>
        <HeroCard hero={mockHero} onEdit={mockOnEdit} onView={mockOnView} />
      </Provider>
    );

  it('should render the hero nickname', () => {
    renderComponent();
    expect(screen.getByText('Spider-Man')).toBeDefined();
  });

  it('should call onView when the card is clicked', () => {
    renderComponent();

    const nickname = screen.getByText('Spider-Man');
    const card = nickname.closest('div');
    if (card) fireEvent.click(card);
    
    expect(mockOnView).toHaveBeenCalledWith('123');
  });

  it('should call onEdit when edit button is clicked', () => {
    renderComponent();
    
    const nickname = screen.getByText('Spider-Man');
    const cardContainer = nickname.closest('div');
    if (cardContainer) fireEvent.mouseEnter(cardContainer);

    const editBtn = screen.getByText('Edit');
    fireEvent.click(editBtn);

    expect(mockOnEdit).toHaveBeenCalledWith(mockHero);
  });
});