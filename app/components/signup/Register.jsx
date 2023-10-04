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

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(null);
  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  console.log(errors);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(apiEndpoints.REGISTER, data);
      const result = res.data;
      console.log(result);
      if (result.success === false) {
        setLoading(false);
        // setError(result.message);
        return;
      }
      setLoading(false);
      //   setError(null);
      router.push('/sign-in');
      return;
    } catch (error) {
      setLoading(false);
      //   setError(error.message);
      console.log(error.message);
    }
  };
  //   console.log(watch('email'));

  return (
    <>
      <div className=" my-10 grid place-content-center">
        <h2 className=" font-bold text-2xl text-center text-slate-500">
          Register
        </h2>
        <Card radius="sm" shadow="sm" className="lg:w-[25rem] mt-5">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-[100%]">
              <Input
                isClearable
                size="sm"
                type="text"
                label="Username"
                variant="bordered"
                {...register('username', {
                  required: 'username is a required filed',
                })}
                aria-invalid={errors.username ? 'true' : 'false'}
                // errorMessage={errors.username.message}
              />
              <Input
                isClearable
                size="sm"
                type="email"
                label="Email"
                variant="bordered"
                className="my-4"
                {...register('email', { required: true })}
                aria-invalid={errors.email ? 'true' : 'false'}
                // errorMessage={errors.email.message}
              />
              <Input
                size="sm"
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
                {...register('password', { required: true })}
                aria-invalid={errors.password ? 'true' : 'false'}
                // errorMessage={errors.password.message}
              />
              <Input
                size="sm"
                label="confirm Password"
                variant="bordered"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? (
                      <PiEyeClosedBold className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <PiEyeBold className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                className="my-4"
                {...register('passwordConfirm', { required: true })}
                aria-invalid={errors.password ? 'true' : 'false'}
                // errorMessage={errors.passwordConfirm.message}
              />
              <Button
                disabled={loading}
                radius="sm"
                color="primary"
                type="submit"
                endContent={<BiSolidPaperPlane />}
                className=" disabled:opacity-80 w-[100%]"
              >
                {loading ? 'loading...' : 'Register'}
              </Button>
            </form>

            <div className="flex mt-4">
              <p>Have an account?</p>
              <Link href="/signin" className="text-blue-500 ms-2 underline">
                Login
              </Link>
            </div>
          </CardBody>
        </Card>
        {errors && <p>{errors.message}</p>}
      </div>
    </>
  );
};

export default Register;
