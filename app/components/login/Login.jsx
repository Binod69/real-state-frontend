'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Input, Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { BiSolidPaperPlane } from 'react-icons/bi';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user.slice';
import axiosInstance from '../../config/axios.config';
import apiEndpoints from '../../config/apiEndpoints';

const Login = () => {
  const [formData, setFormData] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await axiosInstance.post(
        apiEndpoints.LOGIN,
        JSON.stringify(formData)
      );
      const data = res;
      console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      router.push('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <div className=" my-10 grid place-content-center">
        <h2 className=" font-bold text-2xl text-center text-slate-500">
          Login
        </h2>
        <Card radius="sm" shadow="sm" className="lg:w-[25rem] mt-5">
          <CardBody>
            <form onSubmit={onSubmit} className="max-w-[100%]">
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
                // aria-invalid={error.message.email ? 'true' : 'false'}
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
                    {isVisible ? (
                      <PiEyeClosedBold className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <PiEyeBold className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                className="my-4"
                onChange={handleChange}
                // aria-invalid={errors.password ? 'true' : 'false'}
              />
              <Button
                disabled={loading}
                radius="sm"
                color="primary"
                type="submit"
                endContent={<BiSolidPaperPlane />}
                className=" disabled:opacity-80 w-[100%]"
              >
                {loading ? 'loading...' : 'Login'}
              </Button>
            </form>

            <div className="flex mt-4">
              <p>Dont Have an account?</p>
              <Link href="/signup" className="text-blue-500 ms-2 underline">
                Register
              </Link>
            </div>
          </CardBody>
        </Card>
        {error && <p className="text-red-500 mt-10">{error}</p>}
      </div>
    </>
  );
};

export default Login;
