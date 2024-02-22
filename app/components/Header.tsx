"use client";

import { User } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, FC, FormEvent, useState } from "react";

const Header: FC = () => {
  const [user, setUser] = useState<User>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");

  const onClickMetaMask = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const response = await axios.post<User>(
        `${process.env.NEXT_PUBLIC_URL}/api/user`,
        {
          account: accounts[0],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickModalOpen = () => {
    setIsOpen(true);
  };

  const onClickModalClose = () => {
    setIsOpen(false);
  };

  const onSubmitUpdateNickname = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!user || !nickname) return;

      const response = await axios.put<User>(
        `${process.env.NEXT_PUBLIC_URL}/api/user`,
        {
          account: user.account,
          nickname,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !user) return;

      const formData = new FormData();

      formData.append("account", user.account);
      formData.append("imageFile", e.target.files[0]);

      const response = await axios.put<User>(
        `${process.env.NEXT_PUBLIC_URL}/api/user/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="bg-blue-100">
        {user ? (
          <div className="flex justify-end items-center">
            <label className="cursor-pointer" htmlFor="uploadFile">
              <Image
                src={`/images/${user.profileImage}`}
                alt={user.nickname}
                width={32}
                height={32}
              />
            </label>
            <input
              className="hidden"
              id="uploadFile"
              type="file"
              onChange={onChangeUploadImage}
              accept="image/*"
            />
            <button
              className="w-28 ml-2 truncate text-left"
              onClick={onClickModalOpen}
            >
              {user.nickname}
            </button>
          </div>
        ) : (
          <button onClick={onClickMetaMask}>🦊 MetaMask</button>
        )}
      </header>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
          <form
            className="p-8 flex flex-col bg-gray-100"
            onSubmit={onSubmitUpdateNickname}
          >
            <button className="self-end" onClick={onClickModalClose}>
              x
            </button>
            <input
              className="my-4"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input type="submit" value="수정" />
          </form>
        </div>
      )}
    </>
  );
};

export default Header;
