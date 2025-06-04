import { useState, useEffect } from 'react';

export function useIsVirtualKeyboardOpen() {
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      // Consider keyboard open if viewport height decreased by more than 150px
      setIsVirtualKeyboardOpen(heightDifference > 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
      };
    } else {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { isVirtualKeyboardOpen };
}