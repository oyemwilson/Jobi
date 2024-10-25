import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

interface LayoutComponentProps {
  children: React.ReactNode; // Specifies children as a React node
}

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      const backdropElement = document.querySelector('.modal-backdrop');
      if (backdropElement) {
        backdropElement.remove();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return <>{children}</>;
};

export default LayoutComponent;