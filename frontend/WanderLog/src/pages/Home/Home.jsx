import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import AddEditTravelStory from "../Home/AddEditTravelStory";
import ViewTravelStory from "../Home/ViewTravelStory";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const[dateRange, setDateRange] = useState({form: null, to: null});

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
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
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  // handle travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data});
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
        toast.success("Favorites Updated");
        getAllTravelStories();

        //update favourite status
        setFavouriteStatus(response.data.success);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // delete travel story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
        const response = await axiosInstance.delete("/delete-story/" + storyId);

        if (response.data && !response.data.error) {
            toast.error("Story Deleted Successfully");

            setOpenViewModal((prevState) => ({
                ...prevState,
                isShown: false,
            }));

            getAllTravelStories(); // Refresh the stories list
        }
    } catch (error) {
        console.error("An unexpected error occurred. Please try again.", error);
    }
};

  // search story
  const onSearchStory = async (query) =>{
    try {
      const response = await axiosInstance.get("/search",{
        params:{
          query,
        },
    });

    if(response.data && response.data.stories){
      setFilterType("search");
      setAllStories(response.data.stories);
    }
    } catch(error){
      console.log("An unexpected error occurred. Please try again.");
    }

  }

  const handleClearSearch = () =>{
     setFilterType("");
     getAllTravelStories();

  }
  
  //handle filter travel stories by date range
  const filterStoriesByDate = async (day) => {
try{
  const startDate = day.from ? moment(day.from).valueOf() : null;
  const endDate = day.to ? moment(day.to).valueOf() : null;

  if(startDate && endDate){
    const response  = await axiosInstance.get("/travel-stories/filter", {
      params: {startDate, endDate},
    });

    if(response.data && response.data.stories){
      setFilterType("date");
      setAllStories(response.data.stories);
    }
  }
}catch(error){
  console.log("An unexpected error occurred. Please try again.");
}
  };
  
  //handle date range select
  const handleDayClick = (day)=> {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = ()=> {
    setDateRange ({ from: null , to: null });
    setFilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSearchStory} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto py-10

        <FilterInfoTitle
         filterType = {filterType}
        filterDates= {dateRange}
        onClear={() =>{
        resetFilter();
        }}
        />
        
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

          <div className="w-[320px]">
            <div className= "bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                  />
                </div></div>
          </div>
        </div>
      </div>

{/* add and edit travel story model */}
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
{/* view story model */}
      <Modal
        isOpen={openViewModal.isShown}
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
        <ViewTravelStory 
        storyInfo = {openViewModal.data || null}
        onClose = {()=>{
          setOpenViewModal((prevState) => ({...prevState, isShown: false}));
        }}
        onEditClick = {()=>{
          setOpenViewModal((prevState) => ({...prevState, isShown: false}));
          handleEdit(openViewModal.data || null);
        }}
        onDeleteClick = {()=>{
          deleteTravelStory(openViewModal.data || null);
        }}
        >
        </ViewTravelStory>
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
