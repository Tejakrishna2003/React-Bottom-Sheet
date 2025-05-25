import { useState, useEffect, useRef } from 'react';

// BottomSheet component implementing a draggable bottom sheet with snap points and custom spring animations
const BottomSheet = () => {
  const sheetRef = useRef(null);
  const [position, setPosition] = useState('closed'); // Current snap point state
  const [translateY, setTranslateY] = useState(0); // Y translation for sheet position
  const [isDragging, setIsDragging] = useState(false); // Tracks drag state
  const [startY, setStartY] = useState(0); // Starting Y position of drag
  const [currentY, setCurrentY] = useState(0); // Current Y position during drag
  const animationFrame = useRef(null); // Reference for animation frame

  // Snap points as percentages of window height for responsive behavior
  const snapPoints = {
    closed: 90, // Shows only handle
    half: 50, // Shows partial content
    open: 10, // Shows full content
  };

  // Spring animation parameters for smooth, physics-based motion
  const spring = {
    stiffness: 300, // Controls bounce
    damping: 30, // Controls friction
    mass: 1, // Controls inertia
  };

  // Custom function to find the closest snap point based on current Y position
  const getClosestSnapPoint = (currentY) => {
    const windowHeight = window.innerHeight;
    const currentPercentage = (currentY / windowHeight) * 100;
    let closest = 'closed';
    let minDiff = Math.abs(currentPercentage - snapPoints.closed);

    Object.keys(snapPoints).forEach((key) => {
      const diff = Math.abs(currentPercentage - snapPoints[key]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = key;
      }
    });
    return closest;
  };

  // Custom spring animation implementation using requestAnimationFrame
  const animateSpring = (start, target, callback) => {
    let current = start;
    let velocity = 0;
    const targetPx = (target / 100) * window.innerHeight;

    const animate = () => {
      const dx = targetPx - current;
      const acceleration = (spring.stiffness * dx - spring.damping * velocity) / spring.mass;
      velocity += acceleration / 60;
      current += velocity / 60;

      callback(current);

      if (Math.abs(dx) > 0.1 || Math.abs(velocity) > 0.1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);
  };

  // Handle drag start for both mouse and touch inputs
  const handleDragStart = (e) => {
    setIsDragging(true);
    const y = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setStartY(y);
    setCurrentY(translateY);
    cancelAnimationFrame(animationFrame.current);
  };

  // Handle drag movement, updating position dynamically
  const handleDragMove = (e) => {
    if (!isDragging) return;
    const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = y - startY;
    const newTranslate = Math.max(0, Math.min(window.innerHeight, currentY + deltaY));
    setTranslateY(newTranslate);
  };

  // Handle drag end, snapping to the closest point with animation
  const handleDragEnd = () => {
    setIsDragging(false);
    const newPosition = getClosestSnapPoint(translateY);
    setPosition(newPosition);
    animateSpring(translateY, snapPoints[newPosition], (value) => {
      setTranslateY(value);
    });
  };

  // Handle button clicks to move to specific snap points
  const handleButtonClick = (targetPosition) => {
    setPosition(targetPosition);
    animateSpring(translateY, snapPoints[targetPosition], (value) => {
      setTranslateY(value);
    });
  };

  // Handle keyboard navigation for accessibility (Arrow Up/Down)
  const handleKeyDown = (e) => {
    const positions = ['closed', 'half', 'open'];
    const currentIndex = positions.indexOf(position);
    if (e.key === 'ArrowUp' && currentIndex < positions.length - 1) {
      handleButtonClick(positions[currentIndex + 1]);
    } else if (e.key === 'ArrowDown' && currentIndex > 0) {
      handleButtonClick(positions[currentIndex - 1]);
    }
  };

  // Initialize sheet position on mount
  useEffect(() => {
    setTranslateY((snapPoints.closed / 100) * window.innerHeight);
    return () => cancelAnimationFrame(animationFrame.current);
  }, []);

  // Handle window resize for responsive snap points
  useEffect(() => {
    const handleResize = () => {
      setTranslateY((snapPoints[position] / 100) * window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  return (
    <div
      ref={sheetRef}
      role="region"
      aria-label="Bottom sheet"
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-w-2xl mx-auto"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        touchAction: 'none',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="h-1 bg-gray-400 rounded-full w-16 mx-auto my-2" aria-hidden="true"></div>
      <div className="p-4">
        <div className="flex justify-around mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleButtonClick('closed')}
            aria-label="Close bottom sheet"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleButtonClick('half')}
            aria-label="Set bottom sheet to half-open"
          >
            Half
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleButtonClick('open')}
            aria-label="Open bottom sheet fully"
          >
            Open
          </button>
        </div>
        <div className="h-[600px] overflow-auto">
          <h2 className="text-xl font-bold mb-2">Bottom Sheet Content</h2>
          <p className="text-gray-600">
            This is a sample content area for the bottom sheet. Drag the handle, use the buttons, or press Arrow Up/Down keys to navigate between snap points.
          </p>
          <div className="mt-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-2 border-b">
                Item {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;