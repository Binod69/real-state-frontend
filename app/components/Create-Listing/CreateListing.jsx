'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  Input,
  Textarea,
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
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/app/firebase';
import { PiTrashLight } from 'react-icons/pi';
import axiosInstance from '@/app/config/axios.config';
import apiEndpoints from '@/app/config/apiEndpoints';

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(files);

  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log(formData);

  //image submission func
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

  //upload image to firebase
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

  //delete image
  const handleDeleteImage = (id) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== id),
    });
  };

  //input changes
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return toast.error('You must upload at least one image!');

      if (+formData.regularPrice < +formData.discountedPrice)
        return toast.error('Discount price must be lower than regular price!');
      setLoading(true);
      setError(false);

      const dataToSend = {
        ...formData,
        userRef: currentUser.data._id,
      };

      const res = await axiosInstance.post(
        apiEndpoints.CREATE_LISTING,
        dataToSend,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setLoading(false);

      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
      } else {
        toast.success('Property added successfully');
      }
      router.push(`/listing/${res.data._id}`);
      console.log('id', res.data._id);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error(error.message);
    }
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
          <form onSubmit={handleSubmit} className="flex  justify-between">
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
                    id="name"
                    onChange={handleChange}
                    value={formData.name}
                  />
                  <Textarea
                    isRequired
                    isMultiline
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    className=" w-[100%] my-3"
                    size="sm"
                    id="description"
                    onChange={handleChange}
                    value={formData.description}
                  />
                  <Input
                    isRequired
                    isClearable
                    type="text"
                    variant="bordered"
                    className="w-[100%]"
                    label="Address"
                    size="sm"
                    id="address"
                    onChange={handleChange}
                    value={formData.address}
                  />

                  <div className="flex flex-wrap gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="sale"
                      className="w-5 cursor-pointer"
                      onChange={handleChange}
                      checked={formData.type === 'sale'}
                    />
                    <span>Sell</span>
                    <input
                      type="checkbox"
                      id="rent"
                      className="w-5 cursor-pointer"
                      onChange={handleChange}
                      checked={formData.type === 'rent'}
                    />
                    <span>Rent</span>
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    <span>Parking spot</span>
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    <span>Furnished</span>
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    <span>Offer</span>
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-4">
                    <Input
                      startContent={<BiBed />}
                      type="number"
                      variant="bordered"
                      className="w-[100%]"
                      label="Beds"
                      size="sm"
                      id="bedrooms"
                      onChange={handleChange}
                      value={formData.bedrooms}
                    />

                    <Input
                      type="number"
                      variant="bordered"
                      className="w-[100%]"
                      label="Baths"
                      size="sm"
                      onChange={handleChange}
                      value={formData.bathrooms}
                      id="bathrooms"
                      startContent={<FaBath />}
                    />
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-4">
                    <Input
                      type="number"
                      variant="bordered"
                      className="w-[100%]"
                      label="Regular Price"
                      size="sm"
                      startContent={<HiOutlineCurrencyRupee />}
                      onChange={handleChange}
                      value={formData.regularPrice}
                      id="regularPrice"
                    />
                    {formData.offer && (
                      <Input
                        startContent={<HiOutlineCurrencyRupee />}
                        type="number"
                        variant="bordered"
                        className="w-[100%]"
                        label="Discounted Price"
                        size="sm"
                        onChange={handleChange}
                        value={formData.discountedPrice}
                        id="discountedPrice"
                      />
                    )}
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
                    isLoading={loading}
                    type="submit"
                    className="mt-4"
                    variant="ghost"
                    color="danger"
                    endContent={<BsCloudUpload size={17} />}
                  >
                    {loading ? 'Creating...' : 'Create Listing'}
                  </Button>
                </CardBody>
              </Card>
              {error && <p>{error.message}</p>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateListing;
