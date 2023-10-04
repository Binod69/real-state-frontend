import React from 'react';
import Private from '../components/Private/Private';
import ProfileScreen from '../screen/Profile.screen';

const page = () => {
  return (
    <>
      <Private>
        <ProfileScreen />
      </Private>
    </>
  );
};

export default page;
