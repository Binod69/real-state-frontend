'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  Avatar,
  Input,
  Button,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import NextImage from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { RxUpdate } from 'react-icons/rx';
import { BiTrashAlt } from 'react-icons/bi';
import { app } from '@/app/firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../../redux/user.slice';
import axiosInstance from '@/app/config/axios.config';
import apiEndpoints from '@/app/config/apiEndpoints';

const Form = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(formData);

  const dispatch = useDispatch();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleFileUpload = (file) => {
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
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: [e.target.value] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axiosInstance.put(
        `${apiEndpoints.UPDATE_USER}/${currentUser.data.data.user._id}`,
        formData
      );
      const data = res;
      if (data.status === false) {
        dispatch(updateUserFailure(data.data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success('Profile updated!');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error('Error updating profile!');
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <Avatar
            isBordered
            color="warning"
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.data.data.user.avatar}
            className="text-tiny cursor-pointer m-auto mt-3 mb-5"
            alt={currentUser.data.data.user.username}
            size="lg"
          />
          <div className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <Progress
                aria-label="Uploading..."
                size="sm"
                value={filePerc}
                color="success"
                showValueLabel={true}
                className="max-w-md my-5"
              />
            ) : filePerc === 100 ? (
              <Progress
                aria-label="Uploading..."
                size="sm"
                value={filePerc}
                color="success"
                showValueLabel={true}
                className="max-w-md my-5"
              />
            ) : (
              ''
            )}
          </div>
          <Input
            isClearable
            id="username"
            className="w-[25rem]"
            type="text"
            variant="bordered"
            // label="Username"
            size="md"
            radius="sm"
            defaultValue={currentUser.data.data.user.username}
            onChange={handleChange}
          />
          <Input
            isClearable
            id="email"
            className="w-[25rem] my-4"
            type="email"
            variant="bordered"
            // label="Email"
            size="md"
            radius="sm"
            defaultValue={currentUser.data.data.user.email}
            onChange={handleChange}
          />
          <Input
            className="w-[25rem]"
            id="password"
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            label="Password"
            size="sm"
            radius="sm"
            onChange={handleChange}
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
            Update
          </Button>
        </form>
        <div className="mt-2">
          <Button
            onPress={onOpen}
            variant="bordered"
            endContent={<BiTrashAlt size={20} />}
          >
            Delete account
          </Button>
          <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Delete the account ?
                  </ModalHeader>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      endContent={<BiTrashAlt />}
                      color="primary"
                      onPress={onClose}
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
    </>
  );
};

export default Form;
