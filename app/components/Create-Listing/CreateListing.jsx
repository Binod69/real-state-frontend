'use client';
import React, { useState } from 'react';
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
  Progress,
  Image,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Divider,
} from '@nextui-org/react';
import { BiBed } from 'react-icons/bi';
import { FaBath } from 'react-icons/fa';
import { BsCloudUpload } from 'react-icons/bs';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { AiOutlineArrowLeft, AiOutlineEdit } from 'react-icons/ai';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/app/firebase';
import { PiTrashLight } from 'react-icons/pi';

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  // console.log(files);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log(formData);
  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      setImageUploadError(false);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError('Image upload failed (2mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setFilePerc(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (id) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== id),
    });
  };
  return (
    <>
      <div className="grid place-content-center my-10">
        <div className="flex mb-5">
          <Button
            startContent={<AiOutlineArrowLeft />}
            variant="ghost"
            as={Link}
            href="/profile"
          >
            Go to Profile
          </Button>
          <h2 className="text-2xl text-center m-auto font-semibold text-slate-500 ">
            Create Listing
          </h2>
        </div>
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
                      onChange={(e) => setFiles(e.target.files)}
                      size="md"
                    />
                    <Button
                      isLoading={uploading}
                      type="button"
                      onClick={handleImageSubmit}
                      color="success"
                      variant="ghost"
                    >
                      {uploading ? 'Uploading...' : ' Upload'}
                    </Button>
                  </div>
                  {imageUploadError && imageUploadError ? (
                    toast.error(imageUploadError)
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <>
                      <Progress
                        aria-label="Uploading..."
                        size="sm"
                        value={filePerc}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md my-5"
                      />
                    </>
                  ) : filePerc === 100 ? (
                    <>
                      <Progress
                        aria-label="Uploading..."
                        size="sm"
                        value={filePerc}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md my-5"
                      />
                    </>
                  ) : (
                    ''
                  )}
                  {formData.imageUrls.length > 0 &&
                    formData.imageUrls.map((url, id) => (
                      <div key={id}>
                        <div className="flex justify-between items-center">
                          <Image
                            width={100}
                            height={100}
                            src={url}
                            alt="listing-image"
                            className="my-2"
                          />

                          <div className="flex gap-3">
                            <Tooltip showArrow={true} content="edit image">
                              <Button isIconOnly>
                                <AiOutlineEdit size={17} />
                              </Button>
                            </Tooltip>

                            <Button color="danger" onPress={onOpen} isIconOnly>
                              <PiTrashLight size={17} />
                            </Button>
                            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                              <ModalContent>
                                {(onClose) => (
                                  <>
                                    <ModalHeader className="flex flex-col gap-1">
                                      Delete image?
                                    </ModalHeader>
                                    <ModalFooter>
                                      <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        type="button"
                                        color="danger"
                                        onPress={onClose}
                                        onClick={() => handleDeleteImage(id)}
                                      >
                                        Delete
                                      </Button>
                                    </ModalFooter>
                                  </>
                                )}
                              </ModalContent>
                            </Modal>
                          </div>
                        </div>
                        <Divider className="my-2" />
                      </div>
                    ))}
                  <Button
                    type="submit"
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
