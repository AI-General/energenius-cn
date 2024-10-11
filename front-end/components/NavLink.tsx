"use client";
import { FC, useEffect, useState } from "react";
import { TfiDownload } from "react-icons/tfi";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaBuilding, FaGlobeAmericas } from "react-icons/fa";
import moment from "moment-timezone";
// import { GrServers } from "react-icons/gr";
import { FaServer } from "react-icons/fa";

interface Props {
  href: string;
  textColor: string;
  title: string;
  time: string;
  setSideNavVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setGlobeCenterCoOrdinates: React.Dispatch<React.SetStateAction<[number, number]>>;
  globeCenterCoOrdinates: [number, number];
  currentActiveBuilding: any;
  setcurrentActiveBuilding: any;
  setisBuildingActive: any;
  isBuildingActive: any;
  building: boolean;
  allLocationsLink?: boolean;
  type?: string;
  geoLocations: any;
  setGeoLocations: any;
}
const NavLink: FC<Props> = ({
  href,
  textColor,
  title,
  time,
  setSideNavVisible,
  allLocationsLink,
  globeCenterCoOrdinates,
  setGlobeCenterCoOrdinates,
  currentActiveBuilding,
  isBuildingActive,
  setcurrentActiveBuilding,
  setisBuildingActive,
  type,
  building,
  geoLocations,
  setGeoLocations,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("sideNav");
  const [timeZn, setTimeZn] = useState("00:00");
  const [timeZnSymbol, setTimeZnSymbol] = useState("");
  const userLocalStorage = window.localStorage.getItem("user");
  const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;
  const buildingsLocalStorage = window.localStorage.getItem("locations");
  const parsedBuildings = buildingsLocalStorage ? JSON.parse(buildingsLocalStorage) : null;
  const allLocationsLocalStorage = window.localStorage.getItem("locations");
  const parsedAllLocations = allLocationsLocalStorage ? JSON.parse(allLocationsLocalStorage) : null;

  useEffect(() => {
    setInterval(() => {
      if (time !== "none") {
        setTimeZn(moment().tz(time).format("HH:mm"));
        setTimeZnSymbol(moment().tz(time).format("Z"));
      } else {
        setTimeZn(moment().format("HH:mm"));
        setTimeZnSymbol(moment().format("Z"));
      }
    }, 1000);
  }, [geoLocations]);

  const handleLinkClick = () => {
    window.innerWidth < 768 && setSideNavVisible(false);

    if (pathname === "/en-US" || pathname === "/zh") {
      setGlobeCenterCoOrdinates([-99, 38]);
      setisBuildingActive(false);
      setcurrentActiveBuilding(null);
    }
    if (parsedUser.role == "admin") {
      const found: boolean = parsedBuildings.some((d: any) => d.name === title);
      const formattedLocations = parsedBuildings.map((item: any) => ({
        lat: item.location[0],
        lng: item.location[1],
        size: 30,
        properties: {
          name: item.name,
          href: `/building-data/${String(item?.name).split(" ").join("-")}`,
          type: `admin`,
        },
      }));
      if (found) {
        formattedLocations.map((d: any) => {
          if (d.properties.name === title) {
            setGlobeCenterCoOrdinates([d.lng, d.lat]);
            setisBuildingActive(true);
            setcurrentActiveBuilding(d);
            const newArr = [
              ...parsedBuildings?.map((item: any, _i: number) => ({
                lat: item.location[0],
                lng: item.location[1],
                size: 30,
                properties: {
                  name: item.name,
                  href: `/building-data/${String(item?.name).split(" ").join("-")}`,
                  type: `owner`,
                  locationType: item?.type,
                  id: item?.id,
                },
              })),
              ,
              ...parsedAllLocations?.map((item: any, _i: number) => ({
                lat: item.location[0],
                lng: item.location[1],
                size: 30,
                properties: {
                  name: item.name,
                  href: `#`,
                  type: `other`,
                  locationType: item?.type,
                  id: item?.id,
                },
              })),
            ];
            const filteredNulls = newArr.filter((item) => item !== null);
            const filteredDifference = filteredNulls.filter(
              (item) => Math.abs(item.lat - d?.lat) >= 1 || Math.abs(item.lng - d?.lng) === 0
            );
            setGeoLocations(filteredDifference);
          }
        });
      } else {
        setGlobeCenterCoOrdinates([-99, 38]);
      }
    } else {
      if (allLocationsLink === true) {
        const found: boolean = parsedAllLocations.some((d: any) => d.name === title);
        if (found) {
          parsedAllLocations.map((d: any) => {
            if (d.name === title) {
              setGlobeCenterCoOrdinates([d.location[1], d.location[0]]);
              setisBuildingActive(false);
              setcurrentActiveBuilding(null);
              const newArr = [
                ...parsedBuildings?.map((item: any, _i: number) => ({
                  lat: item.location[0],
                  lng: item.location[1],
                  size: 30,
                  properties: {
                    name: item.name,
                    href: `/building-data/${String(item?.name).split(" ").join("-")}`,
                    type: `owner`,
                    locationType: item?.type,
                    id: item?.id,
                  },
                })),
                ,
                ...parsedAllLocations?.map((item: any, _i: number) => ({
                  lat: item.location[0],
                  lng: item.location[1],
                  size: 30,
                  properties: {
                    name: item.name,
                    href: `#`,
                    type: `other`,
                    locationType: item?.type,
                    id: item?.id,
                  },
                })),
              ];
              const filteredNulls = newArr.filter((item) => item !== null);
              const filteredDifference = filteredNulls.filter(
                (item) => Math.abs(item.lat - d.location[0]) >= 1 || Math.abs(item.lat - d.location[0]) === 0
              );
              setGeoLocations(filteredDifference);
            }
          });
        } else {
          setGlobeCenterCoOrdinates([-99, 38]);
        }
      } else {
        const buildingsLocalStorage = window.localStorage.getItem("buildingsData");
        const parsedBuildings = buildingsLocalStorage ? JSON.parse(buildingsLocalStorage) : null;
        const found: boolean = parsedBuildings.some((d: any) => d.name === title);
        if (found) {
          parsedBuildings.map((d: any) => {
            if (d.name === title) {
              setGlobeCenterCoOrdinates([d.location[1], d.location[0]]);
              setisBuildingActive(true);
              setcurrentActiveBuilding({
                lat: d.location[0],
                lng: d.location[1],
                size: 30,
                properties: {
                  name: d.name,
                  href: `/building-data/${String(d?.name).split(" ").join("-")}`,
                  type: `owner`,
                  locationType: d?.type,
                  id: d?.id,
                },
              });
              const newArr = [
                ...parsedBuildings?.map((item: any, _i: number) => ({
                  lat: item.location[0],
                  lng: item.location[1],
                  size: 30,
                  properties: {
                    name: item.name,
                    href: `/building-data/${String(item?.name).split(" ").join("-")}`,
                    type: `owner`,
                    locationType: item?.type,
                    id: item?.id,
                  },
                })),
                ,
                ...parsedAllLocations?.map((item: any, _i: number) => ({
                  lat: item.location[0],
                  lng: item.location[1],
                  size: 30,
                  properties: {
                    name: item.name,
                    href: `#`,
                    type: `other`,
                    locationType: item?.type,
                    id: item?.id,
                  },
                })),
              ];
              const filteredNulls = newArr.filter((item) => item !== null);
              const filteredDifference = filteredNulls.filter(
                (item) => Math.abs(item.lat - d.location[0]) >= 1 || Math.abs(item.lat - d.location[0]) === 0
              );
              setGeoLocations(filteredDifference);
            }
          });
          // setTimeout(() => {
          //   router.push(`${params.lang}/${href}`);
          // }, 700);
        } else {
          setGlobeCenterCoOrdinates([-99, 38]);
          // router.push(`${params.lang}/${href}`);
        }
      }
    }
  };

  useEffect(() => {
    // if (!geoLocations) {
    //   fetch("/maps/locations.geojson")
    //     .then((response) => response.json())
    //     .then((data) =>
    //       setGeoLocations(
    //         data.features.map((d: any) => ({
    //           lat: d.geometry.coordinates[1],
    //           lng: d.geometry.coordinates[0],
    //           size: 30,
    //           properties: {
    //             ...d.properties,
    //           },
    //         }))
    //       )
    //     );
    // }
    if (!geoLocations) {
      try {
        if (parsedUser && parsedUser.id) {
          const buildingsLocalStorage = window.localStorage.getItem("buildingsData");
          const buildings = buildingsLocalStorage ? JSON.parse(buildingsLocalStorage) : [];

          if (Array.isArray(buildings)) {
            setGeoLocations(
              buildings.map((item) => ({
                lat: item.location[0],
                lng: item.location[1],
                size: 30,
                properties: {
                  name: item.name,
                  href: `/building-data/${String(item?.name).split(" ").join("-")}`,
                },
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    }
    setGlobeCenterCoOrdinates([-99, 38]);
  }, []);

  return (
    <div onClick={handleLinkClick} className="w-full flex items-start my-[6px] cursor-pointer">
      {/* <TfiDownload className="mt-2" /> */}
      {building && type === "building" ? (
        <FaBuilding style={{ color: allLocationsLink ? textColor : "#025b97" }} className="mt-2 text-text-gray" />
      ) : building && type === "Data Center" ? (
        // <GrServers style={{ color: allLocationsLink ? textColor : "#025b97" }} className="mt-2 text-text-gray" />
        // <Image src={`/SVG/datacentermarker.png`} alt="DC" width={20} height={30} />
        <FaServer style={{ color: allLocationsLink ? textColor : "#025b97" }} className="mt-2 text-text-gray" />
      ) : (
        <FaGlobeAmericas style={{ color: textColor }} className="mt-2 text-text-gray" />
      )}
      <div className="ml-2">
        <h4 style={{ color: textColor }} className={`text-[14px]`}>
          {title}
        </h4>
        <p className="text-text-gray notranslate">{`${timeZn} ${
          time.includes("Asia")
            ? `UTC ${moment.tz(time).format("z")}`
            : time !== "none"
            ? moment.tz(time).format("z")
            : String(new Date().toLocaleTimeString("en-us", { timeZoneName: "short" }).split(" ")[2])
        }`}</p>
      </div>
    </div>
  );
};

export default NavLink;
