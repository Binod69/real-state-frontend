'use client';
import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Tabs, Tab, Card, CardBody, Image, Button } from '@nextui-org/react';
import Form from '../components/Form/Form';

import { BsHouseAdd } from 'react-icons/bs';

const ProfileScreen = () => {
  return (
    <>
      <div className="my-5">
        <h2 className="text-2xl font-semibold text-center text-slate-500">
          Profile
        </h2>
        <div className="flex w-[50%] items-center justify-center m-auto flex-col my-10">
          <Tabs aria-label="Options">
            <Tab key="profile" title="Profile">
              <Card radius="sm" shadow="sm">
                <CardBody>
                  <Form />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="List Property" title="List Property">
              <Card radius="sm" shadow="sm">
                <CardBody>
                  <Image
                    as={NextImage}
                    width={300}
                    height={300}
                    src="/images/property.svg"
                    alt="property-image"
                  />
                  <Button
                    as={Link}
                    href="/create-listing"
                    variant="ghost"
                    className="mt-5"
                    endContent={<BsHouseAdd size={17} />}
                  >
                    Create Listing
                  </Button>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="videos" title="Videos">
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProfileScreen;
