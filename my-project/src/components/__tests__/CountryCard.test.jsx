import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryCard from '../CountryCard';

const mockCountry = {
  name: {
    common: 'Test Country',
    official: 'Test Country Official',
  },
  capital: ['Test Capital'],
  region: 'Test Region',
  population: 1000000,
  flags: {
    png: 'test-flag.png',
    svg: 'test-flag.svg',
  },
  languages: {
    eng: 'English',
  },
  currencies: {
    USD: {
      name: 'US Dollar',
      symbol: '$',
    },
  },
};

const defaultProps = {
  country: mockCountry,
  onClick: jest.fn(),
  darkMode: false,
  isFavorite: false,
  onToggleFavorite: jest.fn(),
  compareMode: false,
  isSelected: false,
  index: 0,
};

const renderCountryCard = (props = {}) => {
  return render(
    <BrowserRouter>
      <CountryCard {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('CountryCard Component', () => {
  test('renders country information correctly in light mode', () => {
    renderCountryCard();

    expect(screen.getByText('Test Country')).toBeInTheDocument();
    expect(screen.getByText('Test Region')).toBeInTheDocument();
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
    expect(screen.getByText('Test Capital')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  test('renders country information correctly in dark mode', () => {
    renderCountryCard({ darkMode: true });

    const card = screen.getByTestId('country-card');
    expect(card).toHaveClass('from-gray-800');
  });

  test('displays country flag with correct attributes', () => {
    renderCountryCard();

    const flagImage = screen.getByRole('img');
    expect(flagImage).toHaveAttribute('src', 'test-flag.png');
    expect(flagImage).toHaveAttribute('alt', 'Test Country flag');
  });

  test('handles main card click event', () => {
    const mockOnClick = jest.fn();
    renderCountryCard({ onClick: mockOnClick });

    const card = screen.getByTestId('country-card');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledWith(mockCountry);
  });

  test('handles favorite toggle', () => {
    const mockOnToggleFavorite = jest.fn();
    renderCountryCard({ onToggleFavorite: mockOnToggleFavorite });

    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);

    expect(mockOnToggleFavorite).toHaveBeenCalled();
  });

  test('displays favorite button as active when country is favorite', () => {
    renderCountryCard({ isFavorite: true });

    const favoriteButton = screen.getByLabelText('Remove from favorites');
    expect(favoriteButton).toHaveClass('bg-yellow-400');
  });

  test('renders in compare mode correctly', () => {
    renderCountryCard({ compareMode: true });

    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
    expect(screen.getByText('Add to Comparison')).toBeInTheDocument();
  });

  test('shows selected state in compare mode', () => {
    renderCountryCard({ compareMode: true, isSelected: true });

    expect(screen.getByText('Selected for Comparison')).toBeInTheDocument();
    const card = screen.getByTestId('country-card');
    expect(card).toHaveClass('ring-2', 'ring-blue-500');
  });

  test('handles missing data gracefully', () => {
    const incompleteCountry = {
      name: {
        common: 'Test Country',
      },
      flags: {
        png: 'test-flag.png',
      },
      population: 0,
      region: '',
      capital: [],
    };

    renderCountryCard({ country: incompleteCountry });

    expect(screen.getByText('Test Country')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument(); // Capital should show N/A
  });
}); 