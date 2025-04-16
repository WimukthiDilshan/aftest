import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

jest.useFakeTimers();

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockStorage });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('renders search input', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByPlaceholderText(/search for a country\.\.\./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/voice search/i)).toBeInTheDocument();
  });

  test('handles search input changes', async () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  test('handles search on enter key', async () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  test('shows search history', async () => {
    // Mock localStorage
    const mockHistory = ['previous search'];
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockHistory));
    
    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    await act(async () => {
      fireEvent.focus(searchInput);
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument();
      expect(screen.getByText('previous search')).toBeInTheDocument();
    });
  });

  test('handles voice search button click', () => {
    // Mock the SpeechRecognition API
    const mockStart = jest.fn();
    window.webkitSpeechRecognition = jest.fn().mockImplementation(() => ({
      start: mockStart,
      continuous: false,
      interimResults: false,
      onresult: jest.fn(),
      onerror: jest.fn(),
    }));

    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const voiceButton = screen.getByLabelText(/voice search/i);
    fireEvent.click(voiceButton);

    expect(mockStart).toHaveBeenCalled();
  });

  test('handles voice search result', () => {
    // Mock the SpeechRecognition API
    const mockStart = jest.fn();
    let recognition;
    
    window.webkitSpeechRecognition = jest.fn().mockImplementation(() => {
      recognition = {
        start: mockStart,
        continuous: false,
        interimResults: false,
        onresult: null,
        onerror: null,
      };
      return recognition;
    });

    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const voiceButton = screen.getByLabelText(/voice search/i);
    fireEvent.click(voiceButton);

    // Simulate voice recognition result
    act(() => {
      recognition.onresult({
        results: [[{ transcript: 'test country' }]]
      });
    });

    expect(mockOnSearch).toHaveBeenCalledWith('test country');
  });

  test('handles voice search error', () => {
    // Mock the SpeechRecognition API
    const mockStart = jest.fn();
    let recognition;
    
    window.webkitSpeechRecognition = jest.fn().mockImplementation(() => {
      recognition = {
        start: mockStart,
        continuous: false,
        interimResults: false,
        onresult: null,
        onerror: null,
      };
      return recognition;
    });

    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const voiceButton = screen.getByLabelText(/voice search/i);
    fireEvent.click(voiceButton);

    // Simulate voice recognition error
    act(() => {
      recognition.onerror();
    });

    // The isListening state should be set to false
    expect(voiceButton).not.toHaveClass('text-red-500');
  });

  test('handles dark mode', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        darkMode={true}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    expect(searchInput).toHaveClass('bg-gray-800');
  });

  test('handles dark mode in suggestions', async () => {
    // Mock localStorage with search history
    window.localStorage.getItem.mockReturnValue(JSON.stringify(['test']));
    
    render(
      <SearchBar
        onSearch={mockOnSearch}
        darkMode={true}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    await act(async () => {
      fireEvent.focus(searchInput);
    });

    await waitFor(() => {
      const suggestionsContainer = screen.getByText('Recent Searches').parentElement.parentElement;
      expect(suggestionsContainer).toHaveClass('bg-gray-800');
    });
  });

  test('syncs with external searchTerm prop', () => {
    const { rerender } = render(
      <SearchBar
        onSearch={mockOnSearch}
        searchTerm="initial"
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    expect(searchInput.value).toBe('initial');

    // Update the searchTerm prop
    rerender(
      <SearchBar
        onSearch={mockOnSearch}
        searchTerm="updated"
      />
    );

    expect(searchInput.value).toBe('updated');
  });

  test('handles blur event for suggestions', async () => {
    // Mock localStorage with search history
    window.localStorage.getItem.mockReturnValue(JSON.stringify(['test']));
    
    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    
    // Focus to show suggestions
    await act(async () => {
      fireEvent.focus(searchInput);
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    });

    // Blur to hide suggestions
    await act(async () => {
      fireEvent.blur(searchInput);
      jest.advanceTimersByTime(200);
    });
    
    expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument();
  });

  test('handles search history item click', async () => {
    // Mock localStorage with search history
    const mockHistory = ['test country'];
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockHistory));
    
    render(
      <SearchBar
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search for a country\.\.\./i);
    await act(async () => {
      fireEvent.focus(searchInput);
    });

    await waitFor(() => {
      const historyItem = screen.getByText('test country');
      fireEvent.click(historyItem);
    });

    expect(mockOnSearch).toHaveBeenCalledWith('test country');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'searchHistory',
      JSON.stringify(['test country'])
    );
  });
}); 