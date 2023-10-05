'use client';
import React from 'react';
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Checkbox,
  Select,
  SelectSection,
  SelectItem,
  CardHeader,
  Button,
} from '@nextui-org/react';
import { BiBed } from 'react-icons/bi';
import { FaBath } from 'react-icons/fa';
import { BsCloudUpload } from 'react-icons/bs';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';

const CreateListing = () => {
  return (
    <>
      <div className="grid place-content-center my-5">
        <h2 className="text-2xl text-center font-semibold text-slate-500 ">
          Create Listing
        </h2>
        <div>
          <form className="flex  justify-between">
            <div className="me-20 my-5">
              <Card shadow="sm" radius="sm">
                <CardBody>
                  <Input
                    isRequired
                    isClearable
                    type="text"
                    variant="bordered"
                    className="w-[100%]"
                    label="Name"
                    size="sm"
                  />
                  <Textarea
                    isRequired
                    isMultiline
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    className=" w-[100%] my-3"
                    size="sm"
                  />
                  <Input
                    isRequired
                    isClearable
                    type="text"
                    variant="bordered"
                    className="w-[100%]"
                    label="Address"
                    size="sm"
                  />
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Checkbox id="sell">Sell</Checkbox>
                    <Checkbox defaultSelected id="rent">
                      Rent
                    </Checkbox>
                    <Checkbox id="parking">Parking spot</Checkbox>
                    <Checkbox id="furnished">Furnished</Checkbox>
                    <Checkbox id="offer">Offer</Checkbox>
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-4">
                    <Select
                      startContent={<BiBed />}
                      variant="bordered"
                      label="Beds"
                      size="sm"
                      isRequired
                    >
                      <SelectItem>1</SelectItem>
                    </Select>
                    <Select
                      size="sm"
                      variant="bordered"
                      label="Baths"
                      className=""
                      startContent={<FaBath />}
                    >
                      <SelectItem>1</SelectItem>
                    </Select>
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-4">
                    <Input
                      isClearable
                      type="number"
                      variant="bordered"
                      className="w-[100%]"
                      label="Regular Price"
                      size="sm"
                      startContent={<HiOutlineCurrencyRupee />}
                    />
                    <Input
                      startContent={<HiOutlineCurrencyRupee />}
                      isClearable
                      type="number"
                      variant="bordered"
                      className="w-[100%]"
                      label="Discounted Price"
                      size="sm"
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="my-5">
              <Card shadow="sm" radius="sm">
                <CardBody>
                  <CardHeader className="text-slate-500">
                    Images:{' '}
                    <span className="text-gray-400 ms-1 text-sm">
                      {' '}
                      The first image will be the cover(max-6)
                    </span>
                  </CardHeader>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      accept="image/*"
                      multiple
                      isClearable
                      type="file"
                      variant="bordered"
                      className="w-[100%]"
                      size="md"
                    />
                    <Button color="success" variant="ghost">
                      Upload
                    </Button>
                  </div>
                  <Button
                    className="mt-4"
                    variant="ghost"
                    color="danger"
                    endContent={<BsCloudUpload size={17} />}
                  >
                    Create Listing
                  </Button>
                </CardBody>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateListing;
