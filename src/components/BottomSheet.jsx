import { useState, useEffect, useRef } from 'react';

const BottomSheet = () => {
  const sheetRef = useRef(null);
  const [position, setPosition] = useState('closed');
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const animationFrame = useRef(null);

  // Snap points (in percentage of window height)
  const snapPoints = {
    closed: 90,
    half: 50,
    open: 10,
  };

  // Spring animation parameters
  const spring = {
    stiffness: 300,
    damping: 30,
    mass: 1,
  };

  // Get closest snap point
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

  // Spring animation implementation
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

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    const y = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setStartY(y);
    setCurrentY(translateY);
    cancelAnimationFrame(animationFrame.current);
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;
    const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = y - startY;
    const newTranslate = Math.max(0, Math.min(window.innerHeight, currentY + deltaY));
    setTranslateY(newTranslate);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    const newPosition = getClosestSnapPoint(translateY);
    setPosition(newPosition);
    animateSpring(translateY, snapPoints[newPosition], (value) => {
      setTranslateY(value);
    });
  };

  // Handle button clicks
  const handleButtonClick = (targetPosition) => {
    setPosition(targetPosition);
    animateSpring(translateY, snapPoints[targetPosition], (value) => {
      setTranslateY(value);
    });
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      const positions = ['closed', 'half', 'open'];
      const currentIndex = positions.indexOf(position);
      if (currentIndex < positions.length - 1) {
        handleButtonClick(positions[currentIndex + 1]);
      }
    } else if (e.key === 'ArrowDown') {
      const positions = ['closed', 'half', 'open'];
      const currentIndex = positions.indexOf(position);
      if (currentIndex > 0) {
        handleButtonClick(positions[currentIndex - 1]);
      }
    }
  };

  // Initialize position
  useEffect(() => {
    setTranslateY((snapPoints.closed / 100) * window.innerHeight);
    return () => cancelAnimationFrame(animationFrame.current);
  }, []);

  // Handle window resize
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
      <div className="h-1 bg-gray-400 rounded-full w-16 mx-auto my-2"></div>
      <div className="p-4">
        <div className="flex justify-around mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleButtonClick('closed')}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleButtonClick('half')}
          >
            Half
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleButtonClick('open')}
          >
            Open
          </button>
        </div>
        <div className="h-[600px] overflow-auto">
          <h2 className="text-xl font-bold mb-2">Bottom Sheet Content</h2>
          <p className="text-gray-600">
            This is a sample content area for the bottom sheet. Drag the handle or use the buttons to move between snap points. Use arrow keys for keyboard navigation.
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