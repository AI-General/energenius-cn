"use client";
import { useEffect, useState, useRef, FC } from "react";
import Globe from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { useRouter } from "next/navigation";
import { GlobeMethods } from "react-globe.gl";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

interface Props {
  centerCoordinates: [number, number];
  setCenterCoordinates: React.Dispatch<React.SetStateAction<[number, number]>>;
  currentActiveBuilding: any;
  setcurrentActiveBuilding: any;
  setisBuildingActive: any;
  isBuildingActive: any;
  parsedLocations: any;
  buildings: any;
  geoLocations: any;
  setGeoLocations: any;
}
const WorldGlobe: FC<Props> = ({
  centerCoordinates,
  setCenterCoordinates,
  isBuildingActive,
  setisBuildingActive,
  currentActiveBuilding,
  setcurrentActiveBuilding,
  buildings,
  parsedLocations,
  geoLocations,
  setGeoLocations,
}) => {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("sideNav");
  const globeRef = useRef<GlobeMethods | undefined>();
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const [globeAltitude, setGlobeAltitude] = useState(0);
  const [isZoomOutOfActive, setIsZoomOutOfActive] = useState(true);
  const userLocalStorage = window.localStorage.getItem("user");
  const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;

  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="grey" cx="14" cy="14" r="7"></circle>
  </svg>`;

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);

    if (!geoJsonData) {
      fetch("/maps/countries.geojson")
        .then((response) => response.json())
        .then((data) => setGeoJsonData(data));
    }

    if (!geoLocations) {
      // fetch("/maps/locations.geojson")
      //   .then((response) => response.json())
      //   .then((data) =>
      //     setGeoLocations(
      //       data.features.map((d: any) => ({
      //         lat: d.geometry.coordinates[1],
      //         lng: d.geometry.coordinates[0],
      //         size: 30,
      //         properties: {
      //           ...d.properties,
      //         },
      //       }))
      //     )
      //   );
    }

    if (currentActiveBuilding && geoLocations) {
      try {
        if (parsedUser && parsedUser.id) {
          // const buildingsLocalStorage = window.localStorage.getItem("buildingsData");
          // const buildings = buildingsLocalStorage ? JSON.parse(buildingsLocalStorage) : [];
          // const allLocationsLocalStorage = localStorage.getItem("locations");
          // const parsedLocations = allLocationsLocalStorage ? JSON.parse(allLocationsLocalStorage) : [];
          if (Array.isArray(buildings) && Array.isArray(parsedLocations)) {
            const newArr = [
              ...buildings?.map((item: any, _i: number) => ({
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
              ...parsedLocations?.map((item: any, _i: number) => ({
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
              (item: any) =>
                Math.abs(item.lat - currentActiveBuilding.lat) >= 1 ||
                Math.abs(item.lng - currentActiveBuilding.lng) === 0
            );
            setGeoLocations(filteredDifference);
          }
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    } else {
      try {
        if (parsedUser && parsedUser.id) {
          // const buildingsLocalStorage = window.localStorage.getItem("buildingsData");
          // const buildings = buildingsLocalStorage ? JSON.parse(buildingsLocalStorage) : [];
          // const allLocationsLocalStorage = localStorage.getItem("locations");
          // const parsedLocations = allLocationsLocalStorage ? JSON.parse(allLocationsLocalStorage) : [];
          if (Array.isArray(buildings) && Array.isArray(parsedLocations)) {
            const newArr = [
              ...buildings?.map((item: any, _i: number) => ({
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
              ...parsedLocations?.map((item: any, _i: number) => ({
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
            setGeoLocations(newArr.filter((item) => item !== null));
          }
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [buildings, parsedLocations, currentActiveBuilding]);

  const recenterGlobe = () => {
    if (globeRef.current) {
      if (windowWidth > 768) {
        globeRef.current.pointOfView({ lat: 38, lng: -99, altitude: 2.5 }, 600);
        setCenterCoordinates([-99, 38]);
        setWindowHeight(window.innerHeight);
      } else {
        globeRef.current.pointOfView({ lat: 38, lng: -99, altitude: 3.5 }, 600);
        setCenterCoordinates([-99, 38]);
        setWindowHeight(window.innerHeight * 0.7);
      }
    }
  };
  // useEffect(() => {
  //   if (geoLocations && params?.slug) {
  //     if (globeRef.current) {
  //       geoLocations.map((d: any) => {
  //         if (d.properties.href.includes(params.slug)) {
  //           globeRef.current?.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.7 }, 600);
  //         }
  //       });
  //     }
  //   } else if (!params?.slug) {
  //     recenterGlobe();
  //   }
  // }, [params, geoLocations]);

  useEffect(() => {
    const centecoords = [-99, 38];
    if (centerCoordinates.every((coord, index) => coord === centecoords[index])) {
      if (Array.isArray(buildings) && Array.isArray(parsedLocations)) {
        if (buildings) {
          const newArr = [
            ...buildings?.map((item: any, _i: number) => ({
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
            ...parsedLocations?.map((item: any, _i: number) => ({
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
          setGeoLocations(newArr.filter((item) => item !== null));
        }
      }
    }
  }, [centerCoordinates]);

  const locationClick = (d: any) => {
    if (parsedUser.role !== "admin") {
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.7 }, 600);
        setCenterCoordinates([d.lng, d.lat]);
        if (d?.properties.type === "owner") {
          setisBuildingActive(true);
          setcurrentActiveBuilding(d);
        } else {
          setisBuildingActive(false);
          setcurrentActiveBuilding(null);
        }
      }
    } else {
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.7 }, 600);
        setCenterCoordinates([d.lng, d.lat]);
        setisBuildingActive(true);
        setcurrentActiveBuilding(d);
      }
    }
  };

  useEffect(() => {
    if (centerCoordinates[0] !== -99 && centerCoordinates[1] !== 38) {
      globeRef.current?.pointOfView({ lat: centerCoordinates[1], lng: centerCoordinates[0], altitude: 0.7 }, 600);
    } else {
      globeRef.current?.pointOfView({ lat: 38, lng: -99, altitude: 3.5 }, 600);
    }
  }, [centerCoordinates, globeRef.current]);

  return (
    <div className="fixed w-[100vw] h-[100vh] z-[-1] flex items-start justify-start top-[10px] left-0">
      <Globe
        width={windowWidth}
        height={windowHeight}
        atmosphereAltitude={0.45}
        backgroundColor="rgba(19,28,39,0)"
        animateIn={true}
        ref={globeRef}
        // @ts-ignore
        polygonsData={geoJsonData ? geoJsonData.features : []}
        polygonAltitude={0.01}
        polygonCapColor={() => "#07B5E6"}
        polygonSideColor={() => "#07B5E6"}
        polygonStrokeColor={() => "#fff"}
        // @ts-ignore
        polygonLabel={({ properties }) => `
          <b>${properties.NAME}</b>
        `}
        polygonsTransitionDuration={300}
        globeMaterial={
          new MeshPhongMaterial({
            color: 0x003468,
          })
        }
        htmlElementsData={geoLocations ? geoLocations : []}
        htmlElement={(d: any) => {
          if (d.properties.locationType === "building") {
            const el = document.createElement("div");
            el.innerHTML = `${markerSvg}`;
            if (d.properties.type === "other") {
              el.classList.add("marker");
            } else {
              el.classList.add("markerRed");
            }
            el.style.width = `20px`;
            // @ts-ignore
            el.style["pointer-events"] = "auto";
            el.style.cursor = "pointer";
            el.onclick = () => locationClick(d);
            return el;
          } else {
            const el = document.createElement("div");
            if (d.properties.type === "other") {
              // el.innerHTML = `<img src="/SVG/datacentermarker.png" alt="marker" /> <p>${d.properties.name}</p>`;
              el.innerHTML = `<img src="/SVG/datacentermarker.png" alt="marker" />`;
            } else {
              el.innerHTML = `<img src="/SVG/datacentermarkerowner.png" alt="marker" />`;
            }
            el.classList.add("marker");
            el.style.width = `20px`;
            // @ts-ignore
            el.style["pointer-events"] = "auto";
            el.style.cursor = "pointer";
            el.onclick = () => locationClick(d);
            return el;
          }
        }}
      />
      {/* <FaCompressArrowsAlt
        onClick={() => {
          recenterGlobe();
          setisBuildingActive(false);
        }}
        className="fixed bottom-[45%] md:bottom-10 right-5 cursor-pointer text-[20px] md:text-[30px] z-[600]"
      /> */}
    </div>
  );
};

export default WorldGlobe;
