import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import toast from 'react-hot-toast';
import Favourites from './Favourites';

// Mock modules
vi.mock('axios');
vi.mock('react-hot-toast');

// Simulate useAuth from context
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' }, // simulate logged-in user
  }),
}));

// Mock data
const mockCountries = [
  {
    cca3: 'USA',
    name: { common: 'United States' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    population: 331002651,
    languages: { eng: 'English' },
    flags: { svg: 'https://flagcdn.com/us.svg' },
  },
  {
    cca3: 'FRA',
    name: { common: 'France' },
    capital: ['Paris'],
    region: 'Europe',
    population: 65273511,
    languages: { fra: 'French' },
    flags: { svg: 'https://flagcdn.com/fr.svg' },
  },
];

const mockFavourites = {
  favourites: ['USA'],
};

describe('Favourites Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays favourite countries', async () => {
    // Mock axios calls
    axios.get
      .mockResolvedValueOnce({ data: mockCountries }) // countries API
      .mockResolvedValueOnce({ data: mockFavourites }); // favourites API

    render(<Favourites />);

    // Wait for API to resolve and UI to update
    await waitFor(() =>
      expect(screen.getByText('Your Favourite Countries')).toBeInTheDocument()
    );

    // Check favourite country appears
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.queryByText('France')).not.toBeInTheDocument();
  });

  it('displays error toast if fetching fails', async () => {
    // Simulate API failure
    axios.get.mockRejectedValueOnce(new Error('API error'));

    render(<Favourites />);

    // Wait for toast to appear
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load favourites');
    });

    // Check fallback UI (optional)
    expect(
      screen.getByText(/no favourites added yet/i)
    ).toBeInTheDocument();
  });

  it('displays message when no favourites exist', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockCountries }) // countries
      .mockResolvedValueOnce({ data: { favourites: [] } }); // no favourites

    render(<Favourites />);

    await waitFor(() => {
      expect(
        screen.getByText('No favourites added yet.')
      ).toBeInTheDocument();
    });
  });
});
