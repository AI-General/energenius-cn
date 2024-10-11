import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { IoIosCloseCircle } from "react-icons/io";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select as AntSelect } from "antd";
import moment from "moment-timezone";
import axios from "axios";
import { FaArrowsSpin } from "react-icons/fa6";
import Cities from "cities.json";
import tzlookup from "tz-lookup";
import { init } from "next/dist/compiled/webpack/webpack";

const AddLocationPopUp = ({
  title,
  setShowAddNewBuild,
  showAddNewBuild,
}: {
  title?: string;
  showAddNewBuild: boolean;
  setShowAddNewBuild: any;
}) => {
  const [cityName, setCityName] = useState<any>("");
  const [cityCoords, setCityCoords] = useState<any>([]);
  const [cityTimezone, setCityTimezone] = useState<any>("");
  const [locationType, setLocationType] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  function getRandomOffset() {
    return (Math.random() - 0.5) * 0.9;
  }
  const handleCityNameChange = (e: any) => {
    setCityName(e.split("_")[0]);
    //@ts-ignore
    Cities.forEach((city: any) => {
      if (city.name === e.split("_")[0] && city.country === e.split("_")[2]) {
        setCityCoords([Number(city.lat) + getRandomOffset(), Number(city.lng) + getRandomOffset()]); // [city.lat, city.lng]);
        setCityTimezone(city.timezone);
        const timeZone = tzlookup(city.lat, city.lng);
        setCityTimezone(timeZone);
      }
    });
  };

  const handleTypeChange = (e: any) => {
    setLocationType(e);
  };

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    // if (!cityTimezone) {
    //   alert("please include date and time zone");
    //   setSubmitting(false);
    //   return;
    // }
    if (!cityName) {
      alert("please include city name");
      setSubmitting(false);
      return;
    }
    if (!locationType) {
      alert("please include location type");
      setSubmitting(false);
      return;
    }
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("buildingName"),
      timezone: cityTimezone,
      longitutde: cityCoords[1],
      latitude: cityCoords[0],
    };

    const userLocalStorage: any = window.localStorage.getItem("user");
    const token = window.localStorage.getItem("token");
    const userId = JSON.parse(userLocalStorage).id;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/users/${userId}/locations`,
        JSON.stringify({
          name: data.name,
          timeZone: data.timezone,
          location: [data.latitude, data.longitutde],
          cityName: cityName,
          type: locationType,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.localStorage.setItem("buildingsData", JSON.stringify(response.data.buildings));
      setSubmitting(false);
      alert("location added successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      alert(`something went wrong: ${error}`);
    }
    // try {
    //   const reponse = await axios.post(
    //     `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/create/buildings/${userId}`,
    //     JSON.stringify({
    //       name: data.name,
    //       timeZone: data.timezone,
    //       location: [data.latitude, data.longitutde],
    //       cityName: cityName,
    //     }),
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   window.localStorage.setItem("buildingsData", JSON.stringify(reponse.data.buildings));
    //   setSubmitting(false);
    //   alert("building added successfully.");
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 300);
    // } catch (error) {
    //   console.error(error);
    //   setSubmitting(false);
    //   alert(`something went wrong: ${error}`);
    // }
  };

  return (
    <>
      {/* add new building card */}
      <Card
        className={`fixed z-[610] mt-[5%] bg-dark-blue top-1/2 w-[95vw] md:w-[30vw] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] md:text-[30px]`}
      >
        <CardContent className="pt-[20px] text-[16px] flex flex-col">
          <div className="flex justify-between w-full mb-[10px]">
            <h1 className="text-white font-bold">Add new location</h1>
            <IoIosCloseCircle className="cursor-pointer text-[20px]" onClick={() => setShowAddNewBuild(false)} />
          </div>
          <form onSubmit={formSubmit}>
            <label className="text-text-gray text-[14px] mb-[5px]">Type</label>
            <AntSelect
              // showSearch
              className="w-full mt-[5px]"
              placeholder="Building"
              optionFilterProp="label"
              onChange={handleTypeChange}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  label: "Building",
                  value: "building",
                },
                {
                  label: "Data Center",
                  value: "Data Center",
                },
              ]}
            />

            <div className="my-[10px]">
              <label className="text-text-gray text-[14px] mb-[5px]">Location Name</label>
              <Input
                placeholder="location 1 (unique)"
                required
                name="buildingName"
                className="bg-white text-black mt-[5px]"
              />
            </div>

            <label className="text-text-gray text-[14px] mb-[5px]">City</label>
            <AntSelect
              showSearch
              className="w-full mt-[5px]"
              placeholder="Search City"
              optionFilterProp="label"
              onChange={handleCityNameChange}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
              }
              //@ts-ignore
              options={[...new Set(Cities)].map((item: any, i: number) => ({
                label: `${String(item.name)}, ${new Intl.DisplayNames("en", { type: "region" }).of(
                  item.country.toUpperCase()
                )}`,
                value: `${item.name}_${i}_${item.country}`,
              }))}
            />

            {/* <label className="text-text-gray text-[14px] mb-[5px]">Timezone</label>
            <AntSelect
              showSearch
              className="w-full mt-[5px]"
              placeholder="Select timezone"
              optionFilterProp="label"
              onChange={(v) => setCityTimezone(v)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={moment.tz.names().map((tz) => ({
                label: tz,
                value: tz,
              }))}
            /> */}
            {/* <div className="mt-[10px]">
              <label className="text-text-gray text-[14px] mb-[5px]">
                Building Co-ordinates <span></span>
              </label>

              <Input
                placeholder="latitude (38)"
                required
                type="number"
                name="latitude"
                step={0.000001}
                className="bg-white text-black mt-[5px]"
              />
              <Input
                placeholder="longitude (-99)"
                required
                name="longitude"
                type="number"
                step={0.000001}
                className="bg-white text-black mt-[15px]"
              />
            </div> */}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-bright-blue text-white font-bold hover:text-black"
            >
              {submitting ? (
                <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

const InputDiv = ({ label, name, placeholder }: { label: string; name: string; placeholder: string }) => {
  return (
    <div className="mb-[10px]">
      <label className="text-text-gray text-[14px] mb-[5px]">{label}</label>
      <Input placeholder={placeholder} name={name} className="bg-white text-black mt-[5px]" />
    </div>
  );
};

export default AddLocationPopUp;
