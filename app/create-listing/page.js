import React from 'react';
import CreateListing from '../components/Create-Listing/CreateListing';
import Private from '../components/Private/Private';

const page = () => {
  return (
    <>
      <Private>
        <CreateListing />
      </Private>
    </>
  );
};

export default page;
