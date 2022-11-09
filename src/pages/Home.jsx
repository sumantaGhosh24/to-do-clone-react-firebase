import {useContext, useEffect, useState} from "react";
import {collection, onSnapshot} from "firebase/firestore";

import {PrimaryNavbar, Sidebar, HomeCard} from "../components";

const Home = () => {
  return (
    <>
      <PrimaryNavbar />
      <Sidebar />
      <div>
        <HomeCard />
        <HomeCard />
        <HomeCard />
      </div>
    </>
  );
};

export default Home;
