"use client";
import { useState, useEffect, useRef } from "react";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup, MapContainer, TileLayer } from "react-leaflet";
import Image from "next/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="relative flex items-center justify-center h-[100vh] w-full">
      <div className="w-[100vw] h-[100vh] fixed top-0 right-0 bg-[rgba(19,28,39,0.8)] z-10"></div>
      <MapBackGround />
      <Card className="z-30 w-[95vw] md:w-[30vw] py-[30px] bg-[#131c27c9]">
        <h1 className="text-4xl text-center font-bold">Choose type</h1>
        <div className="flex items-center justify-between w-[70%] mx-auto mt-[40px]">
          <Button onClick={() => router.push(`/${params.lang}/`)}>Data Center</Button>
          <Button onClick={() => router.push(`/${params.lang}/`)}>Building Side</Button>
        </div>
      </Card>
    </div>
  );
};

export default Page;

const MapBackGround = () => {
  const [geoLocations, setGeoLocations] = useState<any>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    // if (!geoLocations) {
    //   fetch("/maps/locations.geojson")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setGeoLocations(
    //         data.features.map((d: any, i: number) => ({
    //           lat: d.geometry.coordinates[1],
    //           lng: d.geometry.coordinates[0],
    //           size: 30,
    //           type: i % 2 !== 0 ? "datacenter" : "building",
    //           properties: {
    //             ...d.properties,
    //           },
    //         }))
    //       );
    //     });
    // }
    const buildingsData = window.localStorage.getItem("buildingsData");
    if (buildingsData) {
      const buildings = JSON.parse(buildingsData);

      if (buildings) {
        setGeoLocations(
          buildings.map((b: any) => {
            return {
              lat: b.location[0],
              lng: b.location[1],
              size: 30,
              type: "building",
              properties: {
                name: b.name,
                href: `/building-data/${String(b?.name).split(" ").join("-")}`,
              },
            };
          })
        );
      }
    } else {
      const fetchBuildingData = async () => {
        // @ts-ignore
        const userId = JSON.parse(window.localStorage.getItem("user"))?.id;
        if (!userId) return;
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/user-buildings-data/${userId}`, {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          });
          window.localStorage.setItem("buildingsData", JSON.stringify(response.data.buildings));
          setGeoLocations(
            response.data.buildings.map((b: any) => {
              return {
                lat: b.location[0],
                lng: b.location[1],
                size: 30,
                type: "building",
                properties: {
                  name: b.name,
                  href: `/building-data/${String(b?.name).split(" ").join("-")}`,
                },
              };
            })
          );
        } catch (error: any) {
          console.error(error);
          if (error.response) {
            alert(`${error.response?.data?.message}`);
          }
        }
      };
      fetchBuildingData();
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 w-[100vw] h-[100vh] z-[2]">
      <MapContainer center={[0, 0]} zoom={2.4} className="w-full h-full z-1" zoomControl={false} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoLocations ? (
          geoLocations.map((location: any) => (
            <Marker
              key={location.properties.id}
              position={[location.lat, location.lng]}
              icon={
                location.type == "datacenter"
                  ? L.icon({
                      iconSize: [20, 25],
                      iconUrl: "/SVG/datacentermarker.png",
                    })
                  : L.icon({
                      iconSize: [20, 25],
                      iconUrl: "/SVG/buildingmarker.png",
                    })
              }
            >
              <Popup>{location.properties.name}</Popup>
            </Marker>
          ))
        ) : (
          <></>
        )}
      </MapContainer>
    </div>
  );
};
