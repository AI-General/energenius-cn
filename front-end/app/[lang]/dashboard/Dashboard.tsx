"use client";
import { useState, useEffect } from "react";
import { FaCompressArrowsAlt } from "react-icons/fa";
import AddLocationPopUp from "@/components/AddLocationPopUp";
import NavBar from "@/components/NavBar";
import SideNav from "@/components/SideNav";
import Content from "@/components/Content";
import axios from "axios";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useParams, useRouter } from "next/navigation";
const WorldGlobe = dynamic(() => import("@/components/Globe"), { ssr: false });

const Dashboard = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [sideNavVisible, setSideNavVisible] = useState(false);
  const [globeCenterCoOrdinates, setGlobeCenterCoOrdinates] = useState<[number, number]>([-99, 38]);
  const [isBuildingActive, setisBuildingActive] = useState<boolean>(false);
  const [currentActiveBuilding, setcurrentActiveBuilding] = useState<any>(null);
  const [showAddNewBuild, setShowAddNewBuild] = useState<boolean>(false);
  const [buildingData, setBuildingData] = useState<any>(null);
  const [locations, setLocations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [geoLocations, setGeoLocations] = useState<any>(null);
  const [userIp, setUserIp] = useState<any>(null);

  useEffect(() => {
    const user: any = window.localStorage.getItem("user");
    if (1 == 1) {
      const userId = JSON.parse(user)?.id;
      if (userId) {
        const fetchAllLocations = async () => {
          try {
            const locations = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/locations/${userId}`, {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
            });
            window.localStorage.setItem("locations", JSON.stringify(locations.data.locations));
            setLocations(locations.data.locations);
          } catch (error) {
            console.log("error from fetch all locations:", error);
          }
        };
        fetchAllLocations();
        const fetchBuildingData = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/users/${userId}/locations`, {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
            });
            window.localStorage.setItem("buildingsData", JSON.stringify(response.data.locations));
            setBuildingData(response.data.locations);
            setLoading(false);
          } catch (error: any) {
            console.error(error);
            if (error.response) {
              alert(`${error.response?.data?.message}`);
            }
          }
        };
        // const fetchBuildingData = async () => {
        //   try {
        //     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/user-buildings-data/${userId}`, {
        //       headers: {
        //         Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        //       },
        //     });
        //     window.localStorage.setItem("buildingsData", JSON.stringify(response.data.buildings));
        //     setLoading(false);
        //   } catch (error: any) {
        //     console.error(error);
        //     if (error.response) {
        //       alert(`${error.response?.data?.message}`);
        //     }
        //   }
        // };
        fetchBuildingData();
      }
    }
  }, [pathname, params.lang, router]);
  return (
    <>
      <NavBar showWarningAlerts={true} setSideNavVisible={setSideNavVisible} sideNavVisible={sideNavVisible} />
      <SideNav
        buildings={buildingData}
        parsedLocations={locations}
        globeCenterCoOrdinates={globeCenterCoOrdinates}
        setGlobeCenterCoOrdinates={setGlobeCenterCoOrdinates}
        setSideNavVisible={setSideNavVisible}
        sideNavVisible={sideNavVisible}
        currentActiveBuilding={currentActiveBuilding}
        isBuildingActive={isBuildingActive}
        setcurrentActiveBuilding={setcurrentActiveBuilding}
        setisBuildingActive={setisBuildingActive}
        setShowAddNewBuild={setShowAddNewBuild}
        showAddNewBuild={showAddNewBuild}
        geoLocations={geoLocations}
        setGeoLocations={setGeoLocations}
      />
      <WorldGlobe
        geoLocations={geoLocations}
        setGeoLocations={setGeoLocations}
        buildings={buildingData}
        parsedLocations={locations}
        centerCoordinates={globeCenterCoOrdinates}
        currentActiveBuilding={currentActiveBuilding}
        isBuildingActive={isBuildingActive}
        setcurrentActiveBuilding={setcurrentActiveBuilding}
        setisBuildingActive={setisBuildingActive}
        setCenterCoordinates={setGlobeCenterCoOrdinates}
      />
      {showAddNewBuild ? (
        <AddLocationPopUp
          setShowAddNewBuild={setShowAddNewBuild}
          showAddNewBuild={showAddNewBuild}
          title="Add New Location"
        />
      ) : (
        <></>
      )}
      <FaCompressArrowsAlt
        onClick={() => {
          // recenterGlobe();
          setGlobeCenterCoOrdinates([-99, 38]);
          setisBuildingActive(false);
        }}
        className="fixed bottom-[45%] md:bottom-10 right-5 cursor-pointer text-[20px] md:text-[30px] z-[600]"
      />
      <Content title="Global metrics" />
    </>
  );
};

export default Dashboard;
