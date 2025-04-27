import React, { useState } from 'react';  // Importing useState from React
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector" ; // Assuming these are the correct paths
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';  // Assuming these are the correct paths

const AddEditTravelStory = ({ 
    storyInfo,
    type,
    onClose,
    getAllTravelStories, 
}) => {
    const [title, setTitle] = useState("");
    const [storyImg, setStoryImg] = useState(null);
    const [story, setStory] = useState("");
    const [visitedLocation, setVisitedLocation] = useState([]);
    const [visitedDate, setVisitedDate] = useState(null);
    const [error, setError] = useState("");

    // Add new travel story
    const addNewTravelStory = async () => {
        console.log("Adding new story", { title, storyImg, story, visitedLocation, visitedDate });
        // Your logic to add a new story goes here
    };

    // Update travel story
    const updateTravelStory = async () => {
        console.log("Updating story", { title, storyImg, story, visitedLocation, visitedDate });
        // Your logic to update the travel story goes here
    };

    const handleAddOrUpdateClick = () => {
        console.log("Input Data:", { title, storyImg, story, visitedLocation, visitedDate });
        
        if (!title) {
            setError("Please enter the title");
            return;
        }

        if (!story) {
            setError("Please enter the story");
            return;
        }

        setError("");
        
        if (type === "edit") {
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    };

    // Delete story image and update the story
    const handleDeleteStoryImg = async () => {
        console.log("Deleting story image");
        // Your logic to delete the story image goes here
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                    {type === 'add' ? (
                        <button className="btn-small" onClick={handleAddOrUpdateClick}>
                            <MdAdd className="text-lg" /> ADD STORY
                        </button>
                    ) : (
                        <>
                            <button className="btn-small" onClick={handleAddOrUpdateClick}>
                                <MdUpdate className="text-lg" /> UPDATE STORY
                            </button>
                            {/* Uncomment and update the logic if you want a delete button */}
                            {/* <button className="btn-small btn-delete" onClick={onClose}>
                                <MdDeleteOutline className="text-lg" /> DELETE 
                            </button> */}
                        </>
                    )}

                    <button className="" onClick={onClose}>
                        <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>

                {error && (
                    <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-2 pt-4">
                <label className="input-label"> TITLE </label>
                <input 
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="A Day at the Great Wall"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
                    
                <div className="my-3">
                    <DateSelector date={visitedDate} setDate={setVisitedDate} />
                </div>

                <ImageSelector 
                    image={storyImg} 
                    setImage={setStoryImg} 
                    handleDeleteImg={handleDeleteStoryImg} 
                />
                    
                <div className="flex flex-col gap-2 mt-4">
                    <label className="input-label">STORY</label>
                    <textarea
                        className="text-sm text-slate-950 outline-none bg-slate-50 pt-2 rounded"
                        placeholder="Your Story"
                        rows={10}
                        value={story}
                        onChange={({ target }) => setStory(target.value)}
                    />
                </div>

                <div className="pt-3">
                    <label className="input-label">VISITED LOCATIONS</label>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                </div>
            </div>
        </div>
    );
};

export default AddEditTravelStory;
