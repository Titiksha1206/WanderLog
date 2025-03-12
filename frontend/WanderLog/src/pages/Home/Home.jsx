import React from 'react'

import Navbar from "../../components/Navbar";

const Home = () => {

  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState(null)

    return (
        <>
          <Navbar />
        </>
    );
};

export default Home
