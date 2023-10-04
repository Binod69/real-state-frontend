import React, { useState, useRef, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Avatar, Input, Button, Progress } from '@nextui-org/react';
import NextImage from 'next/image';
import { useSelector } from 'react-redux';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { RxUpdate } from 'react-icons/rx';
import { app } from '@/app/firebase';

const Form = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  //   const handleFileUpload = (file) => {
  //     const storage = getStorage(app);
  //     const fileName = new Date().getTime() + file.name;
  //     const storageRef = ref(storage, fileName);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log('Upload is' + progress + '% done');
  //         setFilePerc(Math.round(progress));
  //       },
  //       (error) => {
  //         setFileUploadError(true);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
  //           setFormData({ ...formData, avatar: downloadURL })
  //         );
  //       }
  //     );
  //   };

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
  return (
    <>
      <div>
        <form>
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
            Update
          </Button>
        </form>
      </div>
    </>
  );
};

export default Form;
