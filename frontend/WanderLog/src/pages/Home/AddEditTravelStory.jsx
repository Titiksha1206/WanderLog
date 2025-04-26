import React from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";

const AddEditTravelStory = ({ 
    storyInfo,
    type,
    onClose,
    getAllTravelStories, 
}) => {

    const [title,setTitle] = useState("");
    const [storyImg, setStoryImg] = UseState(null);
    const [story, setStory] = useState("");
    const [visitedLocation, setVisitedLocation] = useState(null);
    const [visitedDate, setVisitedDate] = useState(null);
    
    const handleAddOrUpdateClick = () => {};
        return  
        <div>
            <div className="flex items-center justify-between">  
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div>
                    <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                        {type === 'add' ? <button className="btn-small" onCLick={()=>{}}>
                      <MdAdd className="text-lg" /> ADD STORY
                    </button> : <>
                    <button className="btn-small" onClick={handleAddOrUpdateClick}>
                       <MdUpdate className="text-lg" /> UPDATE STORY
                    </button>

                       /* <button className ="btn-small btn-delete" onClick={onClose}>
                            <MdDeleteOutline className="text-lg" /> DELETE 
                        </button> */
                    </>}

                    <button className="" onCLick={onCLose}>
                      <MdAdd className="text-xl text-slate-400" /> 
                    </button>
                </div>
            </div>  
                <div className = "flex-1 flex flex-col gap-2 pt-4">
                <label className="input-label"> TITLE </label>
                <input 
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder=" A Day at the Great Wall"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    />
                    
                    <div className="my-3">
                    <DateSelector date= {visitedDate} setDate={setvisitedDate} />
                      </div>

                    <ImageSelector image={storyImg} setImage={setStoryImg} />
                        
                        <div className="flex flex-col gap-2 mt-4">
                        <label classsName="input-label">STORY</label>
                        <textarea
                            type="text"
                            className="text-sm text-slate-950 outline-nonne bg-slate-50 pt-2 rounded"
                            placeholder="Your Story"
                            rows={10}
                            value={story}
                            onChange={({ target }) => setStory(target.value)}
                            />
                        </div>
                    </div>
                </div>
        </div>;
    };
    };

    export default AddEditTravelStory;
