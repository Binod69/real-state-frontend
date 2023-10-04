import React, { useState } from 'react';
import { Avatar, Input, Button } from '@nextui-org/react';
import NextImage from 'next/image';
import { useSelector } from 'react-redux';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { RxUpdate } from 'react-icons/rx';
const Form = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <div>
        <Avatar
          src={currentUser.data.data.user.avatar}
          className="text-tiny cursor-pointer m-auto mt-3 mb-5"
          alt={currentUser.data.data.user.username}
          size="lg"
        />
        <form>
          <Input
            isClearable
            id="username"
            className="w-[25rem]"
            type="text"
            variant="bordered"
            label="Username"
            size="sm"
            radius="sm"
          />
          <Input
            isClearable
            is="email"
            className="w-[25rem] my-4"
            type="email"
            variant="bordered"
            label="Email"
            size="sm"
            radius="sm"
          />
          <Input
            className="w-[25rem]"
            id="password"
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            label="Password"
            size="sm"
            radius="sm"
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
          />
          <Button
            radius="sm"
            color="primary"
            type="submit"
            endContent={<RxUpdate size={20} />}
            className=" disabled:opacity-80 w-[100%] mt-3"
          >
            update
          </Button>
        </form>
      </div>
    </>
  );
};

export default Form;
