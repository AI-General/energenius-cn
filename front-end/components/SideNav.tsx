"use client";
import { useState, FC, useEffect } from "react";
import { TiLocation } from "react-icons/ti";
import { FaAngleDown } from "react-icons/fa6";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "./ui/separator";
import { sideNavItems } from "@/data";
import NavLink from "./NavLink";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BiLogOutCircle } from "react-icons/bi";
import { FaPlusCircle } from "react-icons/fa";
import AddLocationPopUp from "./AddLocationPopUp";
import axios from "axios";
import UploadBuildingData from "@/components/UploadBuildingData";
import { FaTrashAlt } from "react-icons/fa";
import { FaArrowsSpin } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";

interface Props {
  setSideNavVisible: React.Dispatch<React.SetStateAction<boolean>>;
  sideNavVisible: boolean;
  setGlobeCenterCoOrdinates: React.Dispatch<React.SetStateAction<[number, number]>>;
  globeCenterCoOrdinates: [number, number];
  currentActiveBuilding: any;
  setcurrentActiveBuilding: any;
  setisBuildingActive: any;
  isBuildingActive: any;
  showAddNewBuild: boolean;
  setShowAddNewBuild: React.Dispatch<React.SetStateAction<boolean>>;
  buildings: any;
  parsedLocations: any;
  geoLocations: any;
  setGeoLocations: any;
}

const SideNav: FC<Props> = ({
  setSideNavVisible,
  sideNavVisible,
  globeCenterCoOrdinates,
  setGlobeCenterCoOrdinates,
  currentActiveBuilding,
  isBuildingActive,
  setcurrentActiveBuilding,
  setisBuildingActive,
  setShowAddNewBuild,
  showAddNewBuild,
  buildings,
  parsedLocations,
  geoLocations,
  setGeoLocations,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [isAllDropdownOpen, setIsAllDropdownOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [buildingsData, setBuildingsData] = useState<any>([]);
  const [allLocations, setAllLocations] = useState<any>([]);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [currentActiveBuildingFloorMap, setCurrentActiveBuildingFloorMap] = useState<any>(false);
  const [currentActiveBuildingCSV, setCurrentActiveBuildingCSV] = useState<any>(false);
  const [currentBuildingObj, setcurrentBuildingObj] = useState<any>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (currentActiveBuilding) {
      buildings.map((item: any) => {
        if (item.name === currentActiveBuilding.properties.name) {
          setcurrentBuildingObj(item);
        }
      });
    }
  }, [currentActiveBuilding]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setSideNavVisible(false);
    } else {
      setIsMobile(false);
      setSideNavVisible(true);
    }
  }, []);
  useEffect(() => {
    if ((sideNavVisible === false || isDropdownOpen === false) && window.innerWidth > 768) {
      setisBuildingActive(false);
    }
    if ((sideNavVisible === false || isAllDropdownOpen === false) && window.innerWidth > 768) {
      setisBuildingActive(false);
    }
  }, []);

  const logOut = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("buildingsData");
    window.localStorage.removeItem("locations");
    // router.push(`/${params.lang}/sign-in`);
    window.location.href = `/${params.lang}/sign-in`;
  };
  const userLocalStorage = window.localStorage.getItem("user");
  const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;
  // const buildingsLocalStorage = window.localStorage.getItem("buildingsData");
  // const buildings = buildingsLocalStorage ? JSON.parse(buildingsLocalStorage) : [];
  // const allLocationsLocalStorage = window.localStorage.getItem("locations");
  // const parsedLocations = allLocationsLocalStorage ? JSON.parse(allLocationsLocalStorage) : [];
  useEffect(() => {
    if (buildings) {
      buildings.map((item: any) => {
        if (item.name === currentActiveBuilding?.properties?.name) {
          if (item.floorMap !== null) {
            setCurrentActiveBuildingFloorMap(true);
          } else {
            setCurrentActiveBuildingFloorMap(false);
          }

          if (item.csvDataFile !== null) {
            setCurrentActiveBuildingCSV(true);
          } else {
            setCurrentActiveBuildingCSV(false);
          }
        }
      });
    }
  }, [currentActiveBuilding, buildings, isBuildingActive]);

  useEffect(() => {
    try {
      if (parsedUser && parsedUser.id) {
        if (Array.isArray(buildings)) {
          setBuildingsData(
            buildings.map((item) => ({
              title: item.name,
              time: item.timeZone,
              color: "#D9D9D9",
              href: `/building-data/${item.name.split(" ").join("-")}`,
              building: true,
              type: item.type,
              id: item.id,
            }))
          );
        }

        if (Array.isArray(parsedLocations)) {
          setAllLocations(
            parsedLocations.map((item) => ({
              title: item.name,
              time: item.timeZone,
              color: "#D9D9D9",
              href: `#`,
              building: true,
              type: item.type,
              id: item.id,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
    }
  }, [parsedLocations, buildings]);

  const deleteCurrentLocation = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this location?");
    const token = window.localStorage.getItem("token");
    const filteredBuildings = buildings.filter((item: any) => item.name !== currentActiveBuilding.properties.name);
    if (confirmDelete) {
      setIsDeleting(true);
      await axios
        .delete(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/users/${parsedUser?.id}/locations/${currentBuildingObj.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          window.localStorage.setItem("buildingsData", JSON.stringify(res.data.userLocations));
          window.localStorage.setItem("locations", JSON.stringify(res.data.allLocations));

          setIsDeleting(false);
          alert("location deleted successfully");
          window.location.reload();
        })
        .catch((error) => {
          alert("something went wrong. Please try again");
          setIsDeleting(false);
          console.log("error", error);
        });
    } else {
      return;
    }
  };

  const adminDeleteCurrentLocation = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this location?");
    const token = window.localStorage.getItem("token");
    let currentLocation: any;
    parsedLocations.map((item: any) => {
      if (item.name == currentActiveBuilding.properties.name) {
        currentLocation = item;
      }
    });
    if (confirmDelete) {
      setIsDeleting(true);
      await axios
        .delete(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/users/${parsedUser.id}/locations/${currentLocation.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          window.localStorage.setItem("buildingsData", JSON.stringify(res.data.userLocations));
          window.localStorage.setItem("locations", JSON.stringify(res.data.allLocations));

          setIsDeleting(false);
          alert("location deleted successfully");
          window.location.reload();
        })
        .catch((error) => {
          alert("something went wrong. Please try again");
          setIsDeleting(false);
          console.log("error", error);
        });
    } else {
      return;
    }
  };

  return (
    <NavigationMenu
      className={`fixed top-0 ${
        sideNavVisible ? "left-0" : "left-[-100%]"
      }  w-[100vw] md:w-[20vw] min-h-[100vh] z-[650] bg-dark-blue pt-[80px] pb-[50px] transition-all duration-300`}
    >
      {/* <AddLocationPopUp /> */}
      <div className="mt-[45px] md:mt-[10px] mb-0 flex items-center justify-start px-4 py-0 cursor-pointer">
        <NavLink
          geoLocations={geoLocations}
          setGeoLocations={setGeoLocations}
          setSideNavVisible={setSideNavVisible}
          globeCenterCoOrdinates={globeCenterCoOrdinates}
          setGlobeCenterCoOrdinates={setGlobeCenterCoOrdinates}
          currentActiveBuilding={currentActiveBuilding}
          isBuildingActive={isBuildingActive}
          setcurrentActiveBuilding={setcurrentActiveBuilding}
          setisBuildingActive={setisBuildingActive}
          href={"/"}
          textColor={"#D9D9D9"}
          title={"Global metrics"}
          time={"none"}
          building={false}
        />
      </div>
      <NavigationMenuList className="w-full">
        <NavigationMenuItem className="w-full relative h-full pt-0 md:pt-0">
          <NavigationMenuTrigger
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[rgba(0,0,0,0)] w-full mt-3 text-white flex items-center justify-start transition-all duration-300"
          >
            <TiLocation className="mr-2 text-[1.2rem]" /> <span>My Locations</span>{" "}
            <span className="ml-auto text-[1rem]">
              <FaAngleDown className={`transition duration-200 ${isDropdownOpen && "rotate-180"}`} />
            </span>
          </NavigationMenuTrigger>
          {isDropdownOpen && (
            <ul className="flex overflow-y-auto max-h-[35vh] sideNavLinks items-center px-4 flex-col mt-2 py-4 border-t-[1.8px] w-full z-50 transition-all duration-200">
              {buildingsData.map((item: any, i: any) => (
                <NavLink
                  geoLocations={geoLocations}
                  setGeoLocations={setGeoLocations}
                  setSideNavVisible={setSideNavVisible}
                  globeCenterCoOrdinates={globeCenterCoOrdinates}
                  setGlobeCenterCoOrdinates={setGlobeCenterCoOrdinates}
                  currentActiveBuilding={currentActiveBuilding}
                  isBuildingActive={isBuildingActive}
                  setcurrentActiveBuilding={setcurrentActiveBuilding}
                  setisBuildingActive={setisBuildingActive}
                  key={i}
                  href={item.href}
                  textColor={item.color}
                  title={item.title}
                  time={item.time}
                  building={item.building}
                  type={item.type}
                />
              ))}
            </ul>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>

      <Separator className="mt-[0]" />
      {parsedUser?.role == "admin" && (
        <NavigationMenuList className="w-full">
          <NavigationMenuItem className="w-full relative h-full pt-0">
            <NavigationMenuTrigger
              onClick={() => setIsAllDropdownOpen(!isAllDropdownOpen)}
              className="bg-[rgba(0,0,0,0)] w-full mt-3 text-white flex items-center justify-start transition-all duration-300"
            >
              <TiLocation className="mr-2 text-[1.2rem]" /> <span>All Locations</span>{" "}
              <span className="ml-auto text-[1rem]">
                <FaAngleDown className={`transition duration-200 ${isAllDropdownOpen && "rotate-180"}`} />
              </span>
            </NavigationMenuTrigger>
            {isAllDropdownOpen && (
              <ul className="flex overflow-y-auto max-h-[35vh] sideNavLinks items-center px-4 flex-col mt-2 py-4 border-t-[1.8px] w-full z-50 transition-all duration-200">
                {allLocations
                  .map((item: any, i: any) => (
                    <NavLink
                      geoLocations={geoLocations}
                      setGeoLocations={setGeoLocations}
                      setSideNavVisible={setSideNavVisible}
                      globeCenterCoOrdinates={globeCenterCoOrdinates}
                      setGlobeCenterCoOrdinates={setGlobeCenterCoOrdinates}
                      currentActiveBuilding={currentActiveBuilding}
                      isBuildingActive={isBuildingActive}
                      allLocationsLink={true}
                      setcurrentActiveBuilding={setcurrentActiveBuilding}
                      setisBuildingActive={setisBuildingActive}
                      key={i}
                      href={item.href}
                      textColor={item.color}
                      title={item.title}
                      time={item.time}
                      building={item.building}
                      type={item.type}
                    />
                  ))
                  .reverse()}
              </ul>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      )}

      <Separator className="mt-[0]" />

      {parsedUser?.role !== "admin" ? (
        (currentActiveBuildingFloorMap === false && currentActiveBuildingCSV === false && isBuildingActive === true) ||
        (isBuildingActive === true && currentActiveBuildingFloorMap === false && currentActiveBuildingCSV === true) ||
        (isBuildingActive === true && currentActiveBuildingFloorMap === true && currentActiveBuildingCSV === false) ? (
          <UploadBuildingData
            currentActiveBuilding={currentActiveBuilding}
            onClick={() => {
              setGlobeCenterCoOrdinates([-99, 38]);
              setcurrentActiveBuilding(null);
              setisBuildingActive(false);
            }}
          />
        ) : isBuildingActive === true && currentActiveBuildingFloorMap === true && currentActiveBuildingCSV === true ? (
          <Card
            className={`fixed bg-dark-blue top-[20%] md:top-[30%] ${
              isMobile && sideNavVisible ? "left-[60%] md:left-[10%]" : "left-[10%] md:left-[10%]"
            } text-[20px] md:text-[30px]`}
          >
            {/* <Card className="fixed bg-dark-blue top-[20%] left-[7%] text-[20px] md:text-[30px]"> */}
            <CardContent className="relative pt-[20px] text-[16px] flex flex-col">
              {/* <IoIosCloseCircle
                onClick={() => setisBuildingActive(false)}
                className="cursor-pointer absolute top-2 right-2 mb-[8px]"
              /> */}
              <div className="flex items-center gap-x-3 mt-[15px]">
                <h1>{currentActiveBuilding?.properties?.name}</h1>
                {isDeleting ? (
                  <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />
                ) : (
                  <FaTrashAlt onClick={deleteCurrentLocation} className="text-[14px] cursor-pointer" />
                )}
              </div>
              <Button
                onClick={() => {
                  router.push(`/${params.lang}/${currentActiveBuilding?.properties?.href}`), setisBuildingActive(false);
                }}
                className="mt-[20px] py-[5px] px-[10px]"
              >
                <Link
                  className="text-[12px] p-0 m-0"
                  href={`/${params.lang}/${currentActiveBuilding?.properties?.href}`}
                >
                  More Details
                </Link>
              </Button>
              <Button
                onClick={() => {
                  router.push(`/${params.lang}/${currentActiveBuilding?.properties?.href}/floor/1`),
                    setisBuildingActive(false);
                }}
                className="mt-[20px] py-[5px] px-[10px]"
              >
                <Link
                  className="text-[12px] p-0 m-0"
                  href={`/${params.lang}/${currentActiveBuilding?.properties?.href}/floor/1`}
                >
                  Floor plan
                </Link>
              </Button>
              <Button
                onClick={() => {
                  router.push(`/${params.lang}/${currentActiveBuilding?.properties?.href}/operations`),
                    setisBuildingActive(false);
                }}
                className="mt-[20px] py-[5px] px-[10px]"
              >
                <Link
                  className="text-[12px] p-0 m-0"
                  href={`/${params.lang}/${currentActiveBuilding?.properties?.href}/operations`}
                >
                  Operations
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <></>
        )
      ) : parsedUser.role === "admin" && currentActiveBuilding !== null && isBuildingActive === true ? (
        <Card
          className={`fixed bg-dark-blue top-[20%] md:top-[30%] ${
            isMobile && sideNavVisible ? "left-[60%] md:left-[10%]" : "left-[10%] md:left-[10%]"
          } text-[20px] md:text-[30px]`}
        >
          {/* <Card className="fixed bg-dark-blue top-[20%] left-[7%] text-[20px] md:text-[30px]"> */}
          <CardContent className="relative pt-[20px] text-[16px] flex flex-col">
            {/* <IoIosCloseCircle
              onClick={() => setisBuildingActive(false)}
              className="cursor-pointer absolute top-2 right-2 mb-[8px]"
            /> */}
            <div className="flex items-center gap-x-3 mt-[15px]">
              <h1>{currentActiveBuilding?.properties?.name}</h1>
              {isDeleting ? (
                <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />
              ) : (
                <FaTrashAlt onClick={adminDeleteCurrentLocation} className="text-[14px] cursor-pointer" />
              )}
            </div>
            <Button
              onClick={() => {
                router.push(`/${params.lang}/${currentActiveBuilding?.properties?.href}`), setisBuildingActive(false);
              }}
              className="mt-[20px] py-[5px] px-[10px]"
            >
              <Link className="text-[12px] p-0 m-0" href={`/${params.lang}/${currentActiveBuilding?.properties?.href}`}>
                More Details
              </Link>
            </Button>
            <Button
              onClick={() => {
                router.push(`/${params.lang}/${currentActiveBuilding?.properties?.href}/floor/1`),
                  setisBuildingActive(false);
              }}
              className="mt-[20px] py-[5px] px-[10px]"
            >
              <Link
                className="text-[12px] p-0 m-0"
                href={`/${params.lang}/${currentActiveBuilding?.properties?.href}/floor/1`}
              >
                Floor plan
              </Link>
            </Button>
            <Button
              onClick={() => {
                router.push(`/${params.lang}/${currentActiveBuilding?.properties?.href}/operations`),
                  setisBuildingActive(false);
              }}
              className="mt-[20px] py-[5px] px-[10px]"
            >
              <Link
                className="text-[12px] p-0 m-0"
                href={`/${params.lang}/${currentActiveBuilding?.properties?.href}/operations`}
              >
                Operations
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}

      <div
        onClick={() => {
          if (isMobile) {
            setSideNavVisible(false);
          }
          setShowAddNewBuild(true);
          setcurrentActiveBuilding(null);
          setisBuildingActive(false);
        }}
        className="mt-[10px] flex items-center justify-start px-4 py-2 cursor-pointer"
      >
        <FaPlusCircle className="mr-2 text-[1.2rem]" /> <span>Add New Location</span>
      </div>
      <div onClick={logOut} className="mt-[0] flex items-center justify-start px-4 py-2 cursor-pointer">
        <BiLogOutCircle className="mr-2 text-[1.2rem]" /> <span>Log Out</span>
      </div>
    </NavigationMenu>
  );
};

export default SideNav;
