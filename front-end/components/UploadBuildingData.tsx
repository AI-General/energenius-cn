"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { IoIosCloseCircle } from "react-icons/io";
import { Button } from "./ui/button";
import { FaArrowsSpin } from "react-icons/fa6";
import axios from "axios";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import * as XLSX from "xlsx";

const UploadBuildingData = ({ onClick, currentActiveBuilding }: { onClick: any; currentActiveBuilding: any }) => {
  const [uploadingFloorMap, setuploadingFloorMap] = useState<boolean>(false);
  const [uploadingBuildingData, setuploadingBuildingData] = useState<boolean>(false);
  const [uploadedFloorMap, setuploadedFloorMap] = useState<boolean>(false);
  const [uploadedBuildingData, setuploadedBuildingData] = useState<boolean>(false);
  const [errorFloorMap, seterrorFloorMap] = useState<boolean>(false);
  const [errorBuildingData, seterrorBuildingData] = useState<boolean>(false);
  const [currentBuildingObj, setcurrentBuildingObj] = useState<any>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [downloadCsvFormat, setDownloadCsvFormat] = useState<boolean>(false);
  const [wrongFileFormatErrorMessage, setWrongFileFormatErrorMessage] = useState<boolean>(false);
  const [isColumnsSame, setIsColumnsSame] = useState<boolean>(false);
  // const [englishColumns, setEnglishColumns] = useState<any>([]);
  // const [chineseColumns, setChineseColumns] = useState<any>([]);
  const floorMapRef = useRef<any>();
  const buildingDataRef = useRef<any>();
  const userLocalStorage: any = window.localStorage.getItem("user");
  const user = JSON.parse(userLocalStorage);
  const token = window.localStorage.getItem("token");
  const buildingsLocalStorage: any = window.localStorage.getItem("buildingsData");
  const buildings = JSON.parse(buildingsLocalStorage);
  // const downloadFloorMapUrlBase = `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/file/floorMap/${
  //   user.id
  // }/${currentActiveBuilding.properties.name.split(" ").join("-")}`;
  const downloadFloorMapUrlBase = `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.${
    process.env.NEXT_PUBLIC_REGION
  }.amazonaws.com/${user.email}/${currentActiveBuilding.properties.name.split(" ").join("-")}/floorMap.png`;
  const downloadBuildingDataUrlBase = `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.${
    process.env.NEXT_PUBLIC_REGION
  }.amazonaws.com/${user.email}/${currentActiveBuilding.properties.name.split(" ").join("-")}/csvData.csv`;
  // const downloadBuildingDataUrlBase = `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/file/floorMap/${
  //   user.id
  // }/${currentActiveBuilding.properties.name.split(" ").join("-")}`;

  useEffect(() => {
    console.log("downloadFloorMapUrlBase", downloadFloorMapUrlBase);
    console.log("downloadBuildingDataUrlBase", downloadBuildingDataUrlBase);
    if (currentActiveBuilding) {
      buildings.map((item: any) => {
        if (item.name === currentActiveBuilding.properties.name) {
          if (item.floorMap !== null) {
            setuploadedFloorMap(true);
          } else {
            setuploadedFloorMap(false);
          }
          if (item.csvDataFile !== null) {
            setuploadedBuildingData(true);
          } else {
            setuploadedBuildingData(false);
          }
          setcurrentBuildingObj(item);
        }
      });
    }
  }, [currentActiveBuilding]);

  useEffect(() => {
    if (uploadedFloorMap && uploadedBuildingData) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, []);

  useEffect(() => {
    uploadedFloorMap && uploadedBuildingData
      ? setTimeout(() => {
          window.location.reload();
        }, 500)
      : null;
  }, [uploadedBuildingData, uploadedFloorMap]);

  async function uploadFloorPlan(file: any) {
    setuploadingFloorMap(true);
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      const { data, status } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/upload/file/${user.email}/${currentActiveBuilding.properties.name
          .split(" ")
          .join("-")}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      seterrorFloorMap(false);

      if (status === 200) {
        await axios
          .put(
            `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/users/${user.email}/locations/${currentBuildingObj.id}`,
            JSON.stringify({
              floorMap: downloadFloorMapUrlBase,
            }),
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .catch((error) => console.log("error", error));
        setuploadedFloorMap(true);
        setuploadingFloorMap(false);
      } else {
        throw new Error("error uploading file");
      }
    } catch (error) {
      console.log("error uploading file", error);
      seterrorFloorMap(true);
      setuploadingFloorMap(false);
    }
  }

  const checkCsvFormat = (file: any): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Load the existing file from the public folder
        const response = await fetch("/Building Data Dump Format File.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        let englishColumns;
        let chineseColumns;

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // @ts-ignore
        englishColumns = Object.keys(jsonData[0]);
        // @ts-ignore
        chineseColumns = Object.values(jsonData[0]);

        const reader = new FileReader();

        reader.onload = (event: any) => {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          // @ts-ignore
          const uploadedFileColumns = Object.keys(jsonData[0]);
          console.log("uploadedFileColumns", uploadedFileColumns);

          // Check if the columns match either the English or Chinese columns
          if (
            uploadedFileColumns.every((column, index) => column === englishColumns[index]) ||
            uploadedFileColumns.every((column, index) => column === chineseColumns[index])
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(false);
        };

        reader.readAsBinaryString(file);
      } catch (error) {
        console.error("Error in processing:", error);
        reject(false);
      }
    });
  };

  async function uploadBuildingData(file: any) {
    setuploadingBuildingData(true);
    const varifyFileFormat = await checkCsvFormat(file);
    console.log("varifyFileFormat", varifyFileFormat);
    if (varifyFileFormat === false) {
      buildingDataRef.current.value = null;
      setuploadingBuildingData(false);
      setWrongFileFormatErrorMessage(true);
      return;
    }
    setWrongFileFormatErrorMessage(false);
    console.log("test if it continues");
    const formdata = new FormData();
    formdata.append("file", file);
    const { status } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/upload/file/${user.id}/${currentActiveBuilding.properties.name
        .split(" ")
        .join("-")}`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (status === 200) {
      seterrorBuildingData(false);
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_API_ROUTE_V2}/users/${user.id}/locations/${currentBuildingObj.id}`,
          JSON.stringify({
            buildingData: downloadBuildingDataUrlBase,
          }),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("res", res);
        })
        .catch((error) => console.log("error", error));
      setuploadedBuildingData(true);
      setuploadingBuildingData(false);
      setDownloadCsvFormat(false);
    } else {
      alert("something went wrong, please try again");
      seterrorBuildingData(true);
      setuploadingBuildingData(false);
    }
  }

  const deleteCurrentLocation = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this location?");
    const filteredBuildings = buildings.filter((item: any) => item.name !== currentActiveBuilding.properties.name);
    if (confirmDelete) {
      setIsDeleting(true);
      await axios
        .delete(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/users/${user.id}/locations/${currentBuildingObj.id}`, {
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
    <Card
      className={`fixed bg-dark-blue ${
        uploadedFloorMap && uploadedBuildingData
          ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          : "top-1/2 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-[50px] -translate-y-1/2"
      } text-[20px] z-[610] md:text-[30px]`}
    >
      {uploadedFloorMap && uploadedBuildingData ? (
        <CardContent className="relative pt-[20px] text-[16px]  md:w-[30vw] flex flex-col">
          <div className="flex justify-between items-start w-full mb-[10px]">
            <h1 className="text-white font-bold text-[18px] text-center">
              We have received your Information and you can get the Service.
            </h1>
            <IoIosCloseCircle onClick={onClick} className="cursor-pointer absolute top-[8%] right-[2%] text-[18px]" />
          </div>
        </CardContent>
      ) : (
        <CardContent className="pt-[20px] text-[16px] min-w-[95vw] md:min-w-[30vw] flex flex-col">
          {downloadCsvFormat ? (
            <>
              <div className="flex justify-between items-center w-full">
                <FaArrowLeft
                  className="text-white font-bold text-xl cursor-pointer"
                  onClick={() => {
                    setDownloadCsvFormat(false);
                    setWrongFileFormatErrorMessage(false);
                  }}
                />
              </div>
              {wrongFileFormatErrorMessage ? (
                <p className="text-red-500 text-wrap text-[16px] mt-[30px]">
                  Invalid csv format, please check the file format.
                </p>
              ) : (
                <></>
              )}
              <div className="flex items-center justify-between gap-x-3 w-full mx-auto mt-[30px]">
                <div>
                  <input
                    type="file"
                    accept="text/csv,application/vnd.ms-excel,.xlsx"
                    ref={buildingDataRef}
                    className="hidden"
                    // @ts-ignore
                    onChange={(e) => uploadBuildingData(e.target.files[0])}
                  />
                  {currentBuildingObj?.csvDataFile === null ? (
                    <Button
                      disabled={uploadingBuildingData || uploadedBuildingData ? true : false}
                      onClick={() => buildingDataRef.current.click()}
                    >
                      {uploadingBuildingData ? (
                        <>
                          <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />
                          Uploading CSV
                        </>
                      ) : (
                        "Upload CSV"
                      )}
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  <a
                    href="/Building Data Dump Format File.xlsx"
                    // download="/Building Data Dump Format File.xlsx"
                    className="text-[14px] underline hover:text-bright-blue cursor-pointer"
                  >
                    Show CSV file format.
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center w-full mb-[10px]">
                <h1 className="text-white font-bold text-xl">Location Data</h1>
                <IoIosCloseCircle onClick={onClick} className="cursor-pointer" />
              </div>
              <div className="flex items-center gap-x-2">
                <h3>{currentActiveBuilding.properties.name}</h3>
                {isDeleting ? (
                  <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />
                ) : (
                  <FaTrashAlt onClick={deleteCurrentLocation} className="text-[16px] cursor-pointer" />
                )}
              </div>
              <div className="flex items-center justify-between gap-x-3 w-full mx-auto mt-[30px]">
                <div>
                  <input
                    type="file"
                    accept="text/csv"
                    ref={buildingDataRef}
                    className="hidden"
                    // @ts-ignore
                    onChange={(e) => uploadBuildingData(e.target.files[0])}
                  />
                  {currentBuildingObj?.csvDataFile === null ? (
                    <Button
                      disabled={uploadingBuildingData || uploadedBuildingData ? true : false}
                      onClick={() => setDownloadCsvFormat(true)}
                    >
                      Upload CSV
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={floorMapRef}
                    className="hidden"
                    // @ts-ignore
                    onChange={(e) => uploadFloorPlan(e.target.files[0])}
                  />
                  {currentBuildingObj?.floorMap === null ? (
                    <Button
                      disabled={uploadingFloorMap || uploadedFloorMap ? true : false}
                      onClick={() => floorMapRef.current.click()}
                    >
                      {uploadingFloorMap ? (
                        <>
                          <FaArrowsSpin className="animate-spin" style={{ animationDuration: "2s" }} size={15} />{" "}
                          Uploading Floor Map
                        </>
                      ) : (
                        "Upload Floor Map"
                      )}
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default UploadBuildingData;
