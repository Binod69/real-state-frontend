'use client';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const Private = ({ children }) => {
  const router = useRouter();
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    router.push('/sign-in');
    return null;
  }

  return <>{children}</>; // Wrap children in a React fragment
};

export default Private;
