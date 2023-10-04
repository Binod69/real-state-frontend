'use client';
import React from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import Form from '../components/Form/Form';

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
              <Card radius="sm">
                <CardBody>
                  <Form />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="music" title="Music">
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
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
