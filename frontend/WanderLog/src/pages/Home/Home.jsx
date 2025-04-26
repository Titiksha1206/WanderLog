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
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error in setting up the request:", error.message);
      }
    }
  };

  // get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        //set all stories if data exists
        setAllStories(response.data.stories);
      }
    } catch (error) {
      // console.log("An unexpected error occur, please try again");
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
    return () => {};
  }, []);

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

<AddEditTravelStory
  type={openAddEditModel.type}
  storyInfo={openAddEditModel.data}
  onClose={() => {
    setOpenADDEditModel({ isShown: false, type: "add<, date: null }/);
                        }}
    getAllEditTravelStories= {getAllTravelStories}
  />

export default Home;
