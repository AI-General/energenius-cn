"use client";
import { useState, useEffect } from "react";

import { usePathname } from "next/navigation";
import { useParams, useRouter } from "next/navigation";
import { FaArrowsSpin } from "react-icons/fa6";

import Background from "@/components/Background";
import { parseCookies, setCookie } from "nookies";

function RootWrapper({ children }: { children: React.ReactNode }) {
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

  const isGlobePage = pathname === "/en-US" || pathname === "/zh" ? false : true;

  useEffect(() => {
    const user: any = window.localStorage.getItem("user");
    if (
      !user &&
      pathname !== `/${params.lang}/sign-in` &&
      pathname !== `/${params.lang}/sign-up` &&
      pathname !== `/${params.lang}/`
    ) {
      router.push(`/${params.lang}/`);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
    if (user) {
      setLoading(false);
    }
  }, [pathname, params.lang, router]);

  const setDefault = () => {
    const cookies = parseCookies();
    const currentLang = cookies["googtrans"];

    if (!currentLang) {
      setCookie(null, "googtrans", "/auto/" + "en", { expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) });
    }
  };

  // const fetchUserIp = async () => {
  //   const { data } = await axios.get("https://api.country.is/");
  //   const cookies = parseCookies();
  //   const currentLang = cookies["googtrans"].split("/")[2];
  //   setUserIp(data.ip);
  //   const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
  //   const userCountry = countryNames.of(data.country);
  //   if (
  //     userCountry == "China" &&
  //     currentLang !== "zh-TW" &&
  //     (window.location.href.includes("https://brick-data.com") ||
  //       window.location.href.includes("https://www.brick-data.com"))
  //   ) {
  //     setCookie(null, "googtrans", "/auto/" + "zh-TW", { expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) });
  //     // window.location.reload();
  //   } else if (
  //     (window.location.href.includes("https://www.ex-cn.brick-data.com") ||
  //       window.location.href.includes("https://ex-cn.brick-data.com")) &&
  //     currentLang !== "en"
  //   ) {
  //     setCookie(null, "googtrans", "/auto/" + "en", { expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) });
  //     // window.location.reload();
  //   } else if (
  //     !window.location.href.includes("https://www.ex-cn.brick-data.com") &&
  //     !window.location.href.includes("https://ex-cn.brick-data.com") &&
  //     userCountry !== "China"
  //   ) {
  //     setCookie(null, "googtrans", "/auto/" + "en", { expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) });
  //     // window.location.href = "https://ex-cn.brick-data.com";
  //   }
  // };

  useEffect(() => {
    setLoading(false);
    // fetchUserIp();
    // setDefault();
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setSideNavVisible(true);
    });

    return () => {
      window.removeEventListener("resize", () => {
        if (window.innerWidth > 768) setSideNavVisible(true);
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="w-[100vw] h-[100vh] bg-dark-blue text-white flex items-center justify-center">
        <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={30} />
      </div>
    );
  }

  return (
    <>
      {/* {!isGlobePage && (
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
        </>
      )} */}
      {children}
      {pathname !== `${params.lang}/` && <Background />}
    </>
  );
}

export default RootWrapper;
