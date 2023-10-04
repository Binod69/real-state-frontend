'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Input, Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { BiSolidPaperPlane } from 'react-icons/bi';
import axiosInstance from '../../config/axios.config';
import apiEndpoints from '../../config/apiEndpoints';
import OAuth from '../0Auth/0Auth';

const Register = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const router = useRouter();

  // console.log(error);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post(apiEndpoints.REGISTER, formData, {
        withCredentials: true,
      });
      const data = res;
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      router.push('/sign-in');
    } catch (error) {
      if (error && error.message) {
        dispatch(signInFailure(error.message));
        toast.error(error.message);
      } else {
        dispatch(signInFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <>
      <div className=" my-10 grid place-content-center">
        <h2 className=" font-bold text-2xl text-center text-slate-500">
          Register
        </h2>
        <Card radius="sm" shadow="sm" className="lg:w-[25rem] mt-5">
          <CardBody>
            <form onSubmit={handleSubmit} className="max-w-[100%]">
              <Input
                isClearable
                id="username"
                name="username"
                size="sm"
                type="text"
                label="Username"
                variant="bordered"
                onChange={handleChange}
              />
              <Input
                isClearable
                id="email"
                name="email"
                size="sm"
                type="email"
                label="Email"
                variant="bordered"
                className="my-4"
                onChange={handleChange}
              />
              <Input
                size="sm"
                id="password"
                name="password"
                label="Password"
                variant="bordered"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isPasswordVisible ? (
                      <PiEyeClosedBold className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <PiEyeBold className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isPasswordVisible ? 'text' : 'password'}
                className="my-4"
                onChange={handleChange}
              />

              <Button
                disabled={loading}
                radius="sm"
                color="primary"
                type="submit"
                endContent={<BiSolidPaperPlane size={20} />}
                className=" disabled:opacity-80 w-[100%]"
              >
                {loading ? 'loading...' : 'Register'}
              </Button>
              <OAuth />
            </form>

            <div className="flex mt-4">
              <p>Have an account?</p>
              <Link href="/sign-in" className="text-blue-500 ms-2 underline">
                Login
              </Link>
            </div>
          </CardBody>
        </Card>
        {error && <p>{error.message}</p>}
      </div>
    </>
  );
};

export default Register;
