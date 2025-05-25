import { render, fireEvent, screen } from '@testing-library/react';
import BottomSheet from './BottomSheet';

// Mock window.innerHeight for consistent testing
Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

describe('BottomSheet Component', () => {
  test('renders with closed snap point by default', () => {
    render(<BottomSheet />);
    const sheet = screen.getByRole('region', { name: /bottom sheet/i });
    expect(sheet).toHaveStyle('transform: translateY(900px)'); // 90% of 1000px
  });

  test('changes to open snap point when Open button is clicked', () => {
    render(<BottomSheet />);
    const openButton = screen.getByRole('button', { name: /open bottom sheet fully/i });
    fireEvent.click(openButton);
    const sheet = screen.getByRole('region', { name: /bottom sheet/i });
    expect(sheet).toHaveStyle('transform: translateY(100px)'); // 10% of 1000px
  });

  test('navigates to half snap point with Arrow Up key', () => {
    render(<BottomSheet />);
    const sheet = screen.getByRole('region', { name: /bottom sheet/i });
    fireEvent.keyDown(sheet, { key: 'ArrowUp' });
    expect(sheet).toHaveStyle('transform: translateY(500px)'); // 50% of 1000px
  });
});