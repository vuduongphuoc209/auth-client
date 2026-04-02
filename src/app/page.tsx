"use client";
import { useEffect } from "react";
import { requestGet } from "@/config/request";
import Header from "@/components/Header/header";

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await requestGet();
      console.log(response);
    };
    fetchData();
  }, []);
  return (
    <div>
      <header>
        <Header />
      </header>
    </div>
  );
};

export default Home;
