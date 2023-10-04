import React from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Button } from '@nextui-org/react';
import { useDispatch } from 'react-redux';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { app } from '@/app/firebase';
import axiosInstance from '@/app/config/axios.config';
import apiEndpoints from '@/app/config/apiEndpoints';
import { signInSuccess } from '@/app/redux/user.slice';

const OAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const requestBody = {
        name: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
      };

      const res = await axiosInstance.post(apiEndpoints.GOOGLE, requestBody);
      const data = await res.json();
      dispatch(signInSuccess(data));
      router.push('/');
    } catch (error) {
      console.log('Error sign in with google', error);
    }
  };
  return (
    <>
      <Button
        className="w-[100%] mt-4"
        color="secondary"
        endContent={<AiFillGoogleCircle size={20} />}
        radius="sm"
        type="button"
        onClick={handleGoogleClick}
      >
        Continue with Google
      </Button>
    </>
  );
};

export default OAuth;
