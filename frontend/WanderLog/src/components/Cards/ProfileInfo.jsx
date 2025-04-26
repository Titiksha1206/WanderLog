import React from 'react'

const ProfileInfo = ({userInfo, onLogout}) => { 
  return (
    userInfo && (
    <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full font-medium text-slate-950 bg-slate-100'>
         {/* {getInitials(userInfo ? userInfo.fullName : "")} */} wj
        </div>

        <div>
            <p className='text-sm font-medium'>{userInfo.username || ""}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>
                Logout
            </button>
        </div>
    </div>
    )
  );
};

export default ProfileInfo