import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        //set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if(error.response.status === 401){
        // clear storage if unauthorized
        localStorage.clear();
        // redirect to login
        navigate('/login');
      }
    }
  };

  useEffect(()=>{
    getUserInfo();
    return () => {};
  },[]);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1"></div>

          <div className="w-[320px]"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
