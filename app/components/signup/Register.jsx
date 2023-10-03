'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, Input, Button } from '@nextui-org/react';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { BiSolidPaperPlane } from 'react-icons/bi';

const Register = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <div className=" my-10 grid place-content-center">
        <h2 className=" font-bold text-2xl text-center text-slate-500">
          Register
        </h2>
        <Card radius="sm" shadow="sm" className="lg:w-[25rem] mt-5">
          <CardBody>
            <form className="max-w-[100%]">
              <Input isClearable size="sm" type="text" label="Username" />
              <Input
                isClearable
                size="sm"
                type="email"
                label="Email"
                className="my-4"
              />
              <Input
                size="sm"
                label="Password"
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
              />
              <Button
                color="primary"
                type="submit"
                endContent={<BiSolidPaperPlane />}
                className=" disabled:opacity-80 w-[100%]"
              >
                Submit
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
      </div>
    </>
  );
};

export default Register;
