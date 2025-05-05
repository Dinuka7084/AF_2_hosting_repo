import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './SignIn';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Create mock functions
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

// Mock useAuth and useNavigate
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignIn Component - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('renders email and password fields and sign in button', () => {
    render(<SignIn />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('calls login function with entered credentials', async () => {
    mockLogin.mockResolvedValue({});

    render(<SignIn />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message if login fails', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { error: 'Login failed' } },
    });

    render(<SignIn />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument();
    });
  });
});
