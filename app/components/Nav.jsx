'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Tooltip,
} from '@nextui-org/react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import axiosInstance from '../config/axios.config';
import apiEndpoints from '../config/apiEndpoints';
import {
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from '../redux/user.slice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await axiosInstance.post(apiEndpoints.LOGOUT_USER);
      const data = res;
      if (data.status === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      router.push('/sign-in');
      toast.success('Logout Successfully');
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
      toast.error(data.message);
    }
  };

  return (
    <>
      <Navbar
        shouldHideOnScroll
        isBlurred
        isBordered
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="sm:hidden"
          />
          <NavbarBrand className="mr-4">
            {/* <AcmeLogo /> */}
            <h2 className="hidden sm:block font-bold text-inherit">
              Real
              <span className=" text-slate-500">Estate</span>
            </h2>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-3">
            <NavbarItem>
              <Link color="foreground" href="/">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/about" color="secondary">
                About
              </Link>
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" justify="end">
          <Input
            classNames={{
              base: 'max-w-full sm:max-w-[10rem] w-[10rem] h-10',
              mainWrapper: 'h-full',
              input: 'text-small',
              inputWrapper:
                'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<AiOutlineSearch size={18} />}
            type="search"
          />
          {currentUser ? (
            <>
              <Dropdown placement="bottom">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    alt={currentUser.data.username}
                    size="sm"
                    src={currentUser.data.avatar}
                  />
                </DropdownTrigger>

                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="user" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{currentUser.data.username}</p>
                  </DropdownItem>
                  <DropdownItem as={Link} href="/profile" key="profile">
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    onClick={handleSignOut}
                    key="logout"
                    color="danger"
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <NavbarItem className="hidden lg:flex">
                <Link href="/sign-in">Login</Link>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  color="primary"
                  href="/sign-up"
                  variant="flat"
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <Link href="/">Home</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/about">About</Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default Nav;
