import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import AddEditTravelStory from "../Home/AddEditTravelStory"

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        //set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
        if (error.response.status === 401) {
          //clear storage if unauthorized.
          localStorage.clear();
          navigate("/login"); // redirect to login
        }
        else if (error.request) {
         console.error("No response received from server:", error.request);
        }  
        else {
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
      console.log("An unexpected error occur, please try again");
      // console.log(error);
    }
  };

  // handle edit story clicks
  const handleEdit = (data) => {
    navigate(`/edit-story/${data.id}`);
  };

  // handle travel story click
  const handleViewStory = (data) => {
    navigate(`/travel-story/${data.id}`);
  };

  // handle update favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        { isFavourite: !storyData.isFavourite }
      );
      if (response.data && response.data.story) {
        toast.success("story updated successfully");
        getAllTravelStories();

        //update favourite status
        setFavouriteStatus(response.data.success);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
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
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
      No Travel Stories Found!
    </div>
            )}
          </div>

          <div className="w-[320px]"></div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory 
        type={openAddEditModal.type}
        storyInfo={openAddEditModal.data}
        onClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        getAllTravelStories= {getAllTravelStories}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10  bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer></ToastContainer>
    </>
  );
};

export default Home;
