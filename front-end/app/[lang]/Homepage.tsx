"use client";
import { useState, useEffect, useRef } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import demoImage from "@/assets/images/homepageDemo.png";
import demoImage2 from "@/assets/images/homepageDemo2.png";
import demoImage3 from "@/assets/images/homepageDemo3.png";
import demoImageZh from "@/assets/images/homepageDemoZh.png";
import demoImage2Zh from "@/assets/images/homepageDemo2Zh.png";
import demoImage3Zh from "@/assets/images/homepageDemo3Zh.png";
import profilePicture from "@/assets/images/profilepicture.jpg";
import profilePicture2 from "@/assets/images/profilepicture2.jpg";
import profilePicture3 from "@/assets/images/profilepicture3.jpg";
import profilePicture4 from "@/assets/images/profilepicture4.jpg";
import profilePicture5 from "@/assets/images/profilepicture5.jpg";
import { Card } from "@/components/ui/card";
import ThreeDhandsImage from "@/assets/images/3d-illustrationPuzzle.png";
// import ThreeDPieChart from "@/assets/images/3dpieChart.png";
import ThreeDPieChart from "@/assets/images/piechart.png";
// import ThreeDHorn from "@/assets/images/3dHorn.png";
import ThreeDHorn from "@/assets/images/alerts.png";
import Planningimg from "@/assets/images/planning.jpg";
// import graph from "@/assets/images/graph2.png";
import graph from "@/assets/images/linegraph2.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { Carousel } from "react-responsive-carousel";
import { FcCollaboration } from "react-icons/fc";
import { useRouter, useParams } from "next/navigation";
import Siemens from "@/assets/images/siemens.svg";
import AmericanExpress from "@/assets/images/american-express.svg";
import sunbird from "@/assets/images/Sunbird-Logo.png";
// import plugandplay from "@/assets/images/plug-play.svg";
// import plugandplay from "@/assets/images/plug-ply-logo.svg";
import plugandplay from "@/assets/images/plug-and-play-china.png";
import logothree from "@/assets/images/logo3.jpeg";
import dtdc from "@/assets/images/dtdc.png";
import BackgroundVideo from "@/components/BackgroundVideo";
import { IoCloseCircleSharp } from "react-icons/io5";
import { LanguageSwitcher } from "@/components/lang-switcher";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import { parseCookies } from "nookies";

const HomePage = () => {
  // const navLinks = ["Product", "Testimonial", "About Energenius", "Contact Us", "Institutional partnerships"];
  const navLinks = ["Product", "About Us", "Contact Us"];
  const router = useRouter();
  const params = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isUserFirstTime, setIsUserFirstTime] = useState(false);
  const [showDemoPopUp, setShowDemoPopUp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [submittingDemoRequest, setSubmittingDemoRequest] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [SubscribePopUpText, setSubscribePopUpText] = useState("BE THE FIRST FOR A DEMO!");
  const [showLeavePopUp, setShowLeavePopUp] = useState(false);
  const [isLeavePopUpShown, setIsLeavePopUpShown] = useState(false);
  const heroSectionRef = useRef(null);
  const [cauroselPositionTop, setCauroselPositionTop] = useState(-1000);
  const cauroselDivRef = useRef(null);
  const [cauroselPosition, setCauroselPosition] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<string>();
  const [loggedIn, setLoggedIn] = useState(false);
  const COOKIE_NAME = "googtrans";

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
    // 1. Read the cookie
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue;
    if (existingLanguageCookieValue) {
      // 2. If the cookie is defined, extract a language nickname from there.
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    if (languageValue) {
      setCurrentLanguage(languageValue);
    } else {
      setCurrentLanguage("en");
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const storedIsUserFirstTime = localStorage.getItem("isUserFirstTime");
    if ((!storedIsUserFirstTime || storedIsUserFirstTime !== "false") && isBottom == true) {
      setIsUserFirstTime(true);
    }
  }, [isBottom]);

  useEffect(() => {
    localStorage.removeItem("isUserFirstTime");
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 80) {
        setTimeout(() => {
          localStorage.setItem("isUserFirstTime", "true");
          setShowDemoPopUp(true);
          setIsBottom(true);
        }, 250);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const partners = [
    {
      id: 2,
      href: "https://www.americanexpress.com/",
      image: AmericanExpress,
      svg: true,
    },
    {
      id: 3,
      href: "#",
      image: logothree,
      svg: false,
    },
    {
      id: 4,
      href: "https://www.sunbirddcim.com/",
      image: sunbird,
      svg: false,
    },
    {
      id: 1,
      href: "https://www.plugandplaytechcenter.com/",
      image: plugandplay,
      svg: true,
    },
    {
      id: 5,
      href: "https://www.siemens.com/global/en.html",
      image: Siemens,
      svg: true,
    },
    {
      id: 6,
      href: "https://dtdc.com/",
      image: dtdc,
      svg: false,
    },
  ];

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log("position", position);
  //   });
  // }, []);

  const cauroselImages = [demoImage, demoImage2, demoImage3];
  const cauroselImagesZh = [demoImageZh, demoImage2Zh, demoImage3Zh];

  useEffect(() => {
    // const handleBeforeUnload = (e: any) => {
    //   e.preventDefault();
    //   e.returnValue = "";
    // };
    const handleMouseLeave = (e: any) => {
      if (isLeavePopUpShown === false) {
        if (e.clientY <= 0) {
          setShowLeavePopUp(true);
        }
      }
    };
    // window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [showLeavePopUp]);

  useEffect(() => {
    // @ts-ignore
    setCauroselPositionTop(heroSectionRef.current?.getBoundingClientRect().bottom + window.scrollY + 30);
    const handleResize = () => {
      // @ts-ignore
      setCauroselPositionTop(heroSectionRef.current?.getBoundingClientRect().bottom + window.scrollY + 30);
      // @ts-ignore
      setCauroselPosition(cauroselDivRef.current?.getBoundingClientRect().bottom + window.scrollY);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   if (sessionStorage.getItem("beforeUnloadTriggered") === "true" && isCloseCancel === true) {
  //     setShowDemoPopUp(true);
  //     setIsBottom(true);
  //     setIsCloseCancel(false);
  //     sessionStorage.removeItem("beforeUnloadTriggered");
  //     // Handle the logic when the user clicks "Cancel" here
  //   }
  //   console.log("is user first time", isUserFirstTime);
  // }, [isCloseCancel]);

  const nextSlide = () => {
    if (isMobile) {
      if (currentSlide < 5) {
        setCurrentSlide(currentSlide + 2);
      } else {
        setCurrentSlide(0);
      }
    } else {
      if (currentSlide < 5) {
        setCurrentSlide(currentSlide + 3);
      } else {
        setCurrentSlide(0);
      }
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 2);
      } else {
        setCurrentSlide(5);
      }
    } else {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 4);
      } else {
        setCurrentSlide(5);
      }
    }
  };

  const updateCurrentSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const bookDemo = async (e: any) => {
    e.preventDefault();
    setSubmittingDemoRequest(true);
    const email = e.target.email.value;
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE_V2}/book-demo?email=${email}`)
      .then(() => {
        setShowDemoPopUp(false);
        setSubmittingDemoRequest(false);
        localStorage.setItem("isUserFirstTime", "true");
        setIsUserFirstTime(false);
        alert("Email sent successfully. Please check your mail.");
        e.target.reset();
      })
      .catch(() => {
        alert("An error occurred. Please try again later.");
        setSubmittingDemoRequest(false);
        localStorage.setItem("isUserFirstTime", "true");
        setShowDemoPopUp(false);
      });
  };
  return (
    <div className="bg-[#0F0F0F]">
      <section className="relative">
        <div className="w-full z-50 fixed flex top-0 bg-[#0F0F0F] items-center justify-between py-3 px-2 md:py-4 md:px-[8%] lg:px-[11%]">
          {/* <Image src={"/brickLogo1.svg"} alt="logo" width={4000} height={4000} className="w-auto h-[80px]" /> */}

          <a href="#" className="h-[50px]">
            <Image src={"/brickLogoUpdated.svg"} alt="logo" width={4000} height={4000} className="w-auto h-[100%]" />
          </a>
          {/* {/* <div className="flex items-center">
              <div className="w-6 h-6 mr-2 rounded-full bg-bright-blue flex items-center justify-center text-dark-blue">
                <BsLightningChargeFill />
              </div>
              <h1 className="text-[1.1rem] md:text-[1.3rem] font-bold">Energenius</h1>
            </div> */}
          {isMobile ? (
            <FiMenu className="text-[2rem] cursor-pointer" onClick={() => setShowMobileMenu(true)} />
          ) : (
            <>
              <ul className="flex gap-x-5 list-none text-[15px] text-text-gray">
                {navLinks.map((item, i) => (
                  <Link
                    href={`#${item}`}
                    className="cursor-pointer hover:text-white transition-all duration-200"
                    key={i}
                  >
                    <li>{item}</li>
                  </Link>
                ))}
              </ul>
              <div className="flex items-end gap-x-2">
                <LanguageSwitcher style="rounded-[5rem]" />
                {loggedIn ? (
                  <Button
                    onClick={() => router.push(`/${params.lang}/dashboard`)}
                    className="rounded-[5rem] !m-0 hover:text-[#1D1C20] bg-[#1D1C20] border-[1px] border-[#28272c] text-white"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push(`/${params.lang}/sign-in`)}
                    className="rounded-[5rem] !m-0 hover:text-[#1D1C20] bg-[#1D1C20] border-[1px] border-[#28272c] text-white"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </>
          )}
          {isMobile && showMobileMenu && (
            <div className="fixed  text-[15px] text-text-gray flex gap-y-5 items-center flex-col justify-center top-0 left-0 w-[100vw] h-[100vh] bg-[#0F0F0F] py-[50px] px-[20px] z-[99999]">
              <AiOutlineClose
                className="absolute top-[20px] !text-white right-[15px] text-[2rem]"
                onClick={() => setShowMobileMenu(false)}
              />
              {/* <a href="#" className="h-[20px]"> */}
              <Image src={"/brickLogoUpdated.svg"} alt="logo" width={4000} height={4000} className="w-auto h-[100px]" />
              {/* </a> */}
              {/* <ul className="flex flex-col items-center gap-y-5 list-none text-[15px] text-text-gray"> */}
              {navLinks.map((item, i) => (
                <Link
                  href={`#${item}`}
                  onClick={() => setShowMobileMenu(false)}
                  className="cursor-pointer hover:text-white transition-all duration-200"
                  key={i}
                >
                  <p>{item}</p>
                </Link>
              ))}
              {/* </ul> */}
              {/* <div className="flex flex-col items-center gap-y-5 mt-[10px]"> */}
              <LanguageSwitcher style="rounded-[5rem]" />
              {loggedIn ? (
                <Button
                  onClick={() => router.push(`/${params.lang}/dashboard`)}
                  className="rounded-[5rem] !m-0 hover:text-[#1D1C20] bg-[#1D1C20] border-[1px] border-[#28272c] text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(`/${params.lang}/sign-in`)}
                  className="rounded-[5rem] !m-0 hover:text-[#1D1C20] bg-[#1D1C20] border-[1px] border-[#28272c] text-white"
                >
                  Get Started
                </Button>
              )}
              {/* </div> */}
            </div>
          )}
        </div>

        <div className="w-full pb-[20px] min-h-[100vh] bg-[#1D1C20] relative flex items-center flex-col pt-[25%] md:pt-[15%] lg:pt-[10%]">
          <div className="flex items-center bg-button-blue cursor-pointer text-bright-blue text-[14px] border-[1px] border-[#2dabff98] pl-[4px] pr-2 py-[2px] rounded-[5rem]">
            <div className="w-6 h-6 mr-2 rounded-full bg-bright-blue flex items-center justify-center">🔥</div>
            <h3>Real-time Insight & control &rarr;</h3>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl mt-[20px] w-[95%] md:w-[75%] lg:w-[65%] leading-[1.2] text-center">
            Smart Energy Management at Your Fingertips
          </h1>
          <p className="text-text-gray w-[95%] md:w-[70%] lg:w-[60%] mt-[15px] text-[18px] text-center">
            Revolutionize your energy consumption with cutting-edge AI technology. Gain real-time insight, receive
            instant alerts, and enjoy autonomous system control.
          </p>
          <form
            ref={heroSectionRef}
            onSubmit={bookDemo}
            className="bg-[#18161a] w-[95%] md:w-[60%] lg:w-[35%] px-1 py-[6px] rounded-[5rem] flex items-center justify-between mt-[20px]"
          >
            <input
              className="outline-none border-0 w-[70%] bg-transparent pl-4"
              placeholder="Enter your email address"
              type="email"
              name="email"
              required
            />
            <Button
              type="submit"
              disabled={submittingDemoRequest}
              className="rounded-[5rem] font-bold px-4 md:px-5 py-6"
            >
              {submittingDemoRequest ? "Submitting..." : "Request Demo"}
            </Button>
          </form>
          {/* <div className="w-auto mt-[15px] mx-auto text-[#aaacad]">
            <div className="w-[60%] mx-auto relative h-[25px]">
              <div
                style={{
                  backgroundImage: `url(${profilePicture.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-[25px] h-[25px] rounded-full absolute top-0 left-0 border-[1px] border-white"
              ></div>
              <div
                style={{
                  backgroundImage: `url(${profilePicture2.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-[25px] h-[25px] rounded-full absolute top-0 left-[20%] border-[1px] border-white"
              ></div>
              <div
                style={{
                  backgroundImage: `url(${profilePicture3.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-[25px] h-[25px] rounded-full absolute top-0 left-[40%] border-[1px] border-white"
              ></div>
              <div
                style={{
                  backgroundImage: `url(${profilePicture4.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-[25px] h-[25px] rounded-full absolute top-0 left-[60%] border-[1px] border-white"
              ></div>
            </div>
            <p>100+ reviews (4.7 of 5)</p>
          </div> */}
        </div>
        <div
          ref={cauroselDivRef}
          style={{
            top: `${String(Math.floor(cauroselPositionTop))}px`,
          }}
          className="absolute w-[95%] md:w-[75%] h-auto z-20 rounded-[15px] left-[2.5%] md:left-1/2 md:-translate-x-1/2"
        >
          {currentLanguage === "en" ? (
            <Carousel
              autoPlay={true}
              interval={3000}
              swipeable
              infiniteLoop
              showArrows={false}
              showIndicators={true}
              showThumbs={false}
              showStatus={false}
              // ${
              //   isMobile
              //     ? "bottom-[7%]"
              //     : "[@media(max-height:512px)]:!bottom-[-60%] [@media(max-height:660px)]:!bottom-[-50%] [@media(max-height:670px)]:bottom-[-55%] [@media(max-height:800px)]:bottom-[-40%] [@media(min-height:800px)]:bottom-[-30%] [@media(min-height:900px)]:bottom-[-25%] [@media(min-height:1025px)]:!bottom-[-22%] [@media(min-height:1255px)]:!bottom-[-20%]"
              // }
              className={`h-full w-full`}
              centerMode
              centerSlidePercentage={100}
              selectedItem={1}
              // onChange={updateCurrentSlide}
            >
              {cauroselImages.map((item, i) => (
                <div
                  key={i}
                  // style={{
                  //   backgroundImage: `url(${item.src})`,
                  //   backgroundPosition: "center",
                  //   backgroundSize: "container",
                  //   backgroundRepeat: "no-repeat",
                  // }}
                  className="w-[100%] rounded-[15px]"
                >
                  <img src={item.src} alt="image" className="w-full h-auto rounded-[15px]" />
                </div>
              ))}
            </Carousel>
          ) : (
            <Carousel
              autoPlay={true}
              interval={3000}
              swipeable
              infiniteLoop
              showArrows={false}
              showIndicators={true}
              showThumbs={false}
              showStatus={false}
              // ${
              //   isMobile
              //     ? "bottom-[7%]"
              //     : "[@media(max-height:512px)]:!bottom-[-60%] [@media(max-height:660px)]:!bottom-[-50%] [@media(max-height:670px)]:bottom-[-55%] [@media(max-height:800px)]:bottom-[-40%] [@media(min-height:800px)]:bottom-[-30%] [@media(min-height:900px)]:bottom-[-25%] [@media(min-height:1025px)]:!bottom-[-22%] [@media(min-height:1255px)]:!bottom-[-20%]"
              // }
              className={`h-full w-full`}
              centerMode
              centerSlidePercentage={100}
              selectedItem={1}
              // onChange={updateCurrentSlide}
            >
              {cauroselImagesZh.map((item, i) => (
                <div
                  key={i}
                  // style={{
                  //   backgroundImage: `url(${item.src})`,
                  //   backgroundPosition: "center",
                  //   backgroundSize: "container",
                  //   backgroundRepeat: "no-repeat",
                  // }}
                  className="w-[100%] rounded-[15px]"
                >
                  <img src={item.src} alt="image" className="w-full h-auto rounded-[15px]" />
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </section>
      {isUserFirstTime ? (
        <SubscribePopUp
          submittingDemoRequest={submittingDemoRequest}
          onSubmit={bookDemo}
          setShowDemoPopup={setIsUserFirstTime}
          titleText={"BE THE FIRST FOR A DEMO!"}
          showDemoPopup={showDemoPopUp}
        />
      ) : (
        <></>
      )}

      {showLeavePopUp ? (
        <SubscribePopUp
          submittingDemoRequest={submittingDemoRequest}
          onSubmit={bookDemo}
          setShowDemoPopup={setIsUserFirstTime}
          titleText={"BEFORE YOU GO! PLEASE LEAVE YOUR EMAIL."}
          showDemoPopup={showDemoPopUp}
          setShowLeavePopUp={setShowLeavePopUp}
          setIsLeavePopUpShown={setIsLeavePopUpShown}
        />
      ) : (
        <></>
      )}

      <BackgroundVideo cauroselPosition={cauroselPosition} />
      <section id="About Us" className="w-full bg-[#0f0f0f] z-10 min-h-[100vh] pt-[1%] relative pb-[40px]">
        <div className="w-[95%] md:w-[90%] lg:w-[80%] pt-[100px] mx-auto">
          <h1 className="text-2xl md:text-4xl text-center font-bold mb-5">What we Offer</h1>
          <div className="w-full flex justify-between md:flex-row gap-y-[20px] flex-col flex-grow items-stretch">
            <TopOfferCard
              title="Intelligent Alerts & Warnings"
              image={ThreeDHorn}
              text="Receive instant notifications for any irregularities or potential issues in your energy systems."
            />
            <Card className="w-[100%] md:w-[49%] py-[15px] px-0 text-center bg-[#1b1b1b] border-[1px] border-[#28272c] rounded-[20px]">
              <h3 className="font-bold mt-[5%] text-2xl md:text-[14px]">Real-Time Monitoring</h3>
              <p className="text-text-gray text-[14px] mt-2 w-[96%] md:w-[75%] mx-auto">
                Energenius provides detailed analytics and visualizations to help you understand your energy usage
                patterns and make informed decisions.
              </p>
              <Image src={graph.src} className="!w-[96%] mx-auto !h-auto" width={4000} height={4000} alt="img" />
            </Card>
            <TopOfferCard
              title="Consumption Reports"
              image={ThreeDPieChart}
              text="Generate comprehensive reports that provide in-depth insights into your energy consumption."
            />
          </div>

          <div className="md:mt-[2%] flex gap-y-[20px] mt-[20px] items-stretch justify-between flex-col md:flex-row">
            <Card className="w-[100%] md:text-start text-center md:w-[49%] px-[25px] pt-[4%] pb-[15px] bg-[#1b1b1b] border-[1px] border-[#28272c] rounded-[20px]">
              <h3 className="font-bold text-2xl mt-[2%]">Seamless Integration into Existing Systems</h3>
              <p className="text-text-gray text-[14px] mt-[4%]">
                Easily integrate Energenius with your existing systems and infrastructure. Our platform is designed to
                work harmoniously with various devices and software, ensuring a smooth and hassle-free setup process.
              </p>
              <Image
                src={ThreeDhandsImage.src}
                className="!w-[80%] mx-auto !h-auto"
                width={4000}
                height={4000}
                alt="img"
              />
            </Card>
            <Card className="w-[100%] md:text-start text-center md:w-[49%] px-[25px] pt-[4%] pb-[30px] md:pb-[2%] bg-[#1b1b1b] border-[1px] border-[#28272c] rounded-[20px]">
              <h3 className="font-bold text-2xl mt-[2%]">Autonomous AI Control</h3>
              <p className="mt-[4%] text-[14px] text-text-gray">
                Leverage the power of AI to optimize your energy usage automatically. Energenius&apos;s AI-driven
                control system ensures efficient energy distribution, reduces waste and maximizes cost savings without
                the need for manual intervention.
              </p>

              <Button
                onClick={() => router.push(`/${params.lang}/sign-in`)}
                className="rounded-[5rem] mt-[15%] px-[25px]"
              >
                Explore more
              </Button>
            </Card>
          </div>
        </div>

        <Testimonials isMobile={isMobile} />
      </section>

      <section className="w-full bg-[#1D1C20]">
        <div id="Institutional partnerships" className="w-[95%] md:w-[90%] lg:w-[80%] pt-[120px] mx-auto mb-[50px]">
          <div className="w-[60%] md:w-[30%] lg:w-[30%] flex items-center justify-center gap-x-1 bg-button-blue cursor-pointer text-bright-blue text-[14px] border-[1px] border-[#2dabff98] mx-auto px-1 rounded-[5rem]">
            <FcCollaboration />
            <h3>Institutional partnerships</h3>
          </div>
          <h2 className="text-3xl font-bold mt-[15px] text-center">Meet our partners</h2>

          <div className="mt-[30px] md:mt-[50px] partners">
            <Carousel
              autoPlay={false}
              showArrows={false}
              showIndicators={false}
              showThumbs={false}
              showStatus={false}
              className="w-full"
              centerMode
              centerSlidePercentage={isMobile ? 49 : 25.2}
              selectedItem={currentSlide}
              onChange={updateCurrentSlide}
            >
              {partners.map((partner: any, index: number) => (
                <Link key={index} href={partner.href} target="_blank" rel="noopener noreferrer">
                  <div className="w-full bg-white rounded-[5px] border-[1px] border-[#fafafa] shadow-sm shadow-white">
                    <Image
                      src={partner.image}
                      className="!w-auto mx-auto !h-[80px] md:!h-[70px]"
                      width={4000}
                      height={4000}
                      alt="img"
                    />
                  </div>
                </Link>
              ))}
            </Carousel>

            <div className="w-full flex items-center justify-center gap-2 mt-[20px]">
              <div
                onClick={prevSlide}
                className="flex items-center justify-center w-[34px] h-[34px] transition-all duration-300 rounded-full bg-[#1b1b1b] hover:bg-bright-blue cursor-pointer mt-5 tet-[18px]"
              >
                <FaArrowLeft />
              </div>
              <div
                onClick={nextSlide}
                className="flex items-center justify-center w-[34px] h-[34px] transition-all duration-300 rounded-full bg-[#1b1b1b] hover:bg-bright-blue cursor-pointer mt-5 tet-[18px]"
              >
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
        <div id="Contact Us" className="w-full py-[100px]">
          <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto flex items-center justify-between flex-col md:flex-row rounded-[20px] p-[15px] pl-[25px] bg-[#0f0f0f]">
            <div className="w-[100%] md:w-[70%]">
              <h1 className="text-3xl md:text-4xl lg:text-5xl leading-[1.5] w-[100%] md:w-[70%] mb-[30px] font-bold">
                Ready to Optimize Your Energy Management?
              </h1>
              <Button className="w-[45%] md:w-[35%] lg:w-[25%]  mr-[10px] rounded-[5rem] hover:bg-[#1d73ad] bg-bright-blue text-white font-bold">
                Request Demo
              </Button>
              <Button className="w-[45%] md:w-[35%] lg:w-[25%] rounded-[5rem] bg-white text-black hover:text-black font-bold">
                Contact Us
              </Button>
            </div>
            <div
              style={{
                backgroundImage: `url(${Planningimg.src})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              className="w-[100%] md:w-[40%] h-[300px] md:mt-[0] mt-[20px] md:h-[300px] lg:h-[350px] rounded-[20px]"
            ></div>
          </div>
        </div>
      </section>

      <Footer bookDemo={bookDemo} isSubmittingDemoRequest={submittingDemoRequest} />
    </div>
  );
};

export default HomePage;

const SubscribePopUp = ({
  setShowDemoPopup,
  showDemoPopup,
  onSubmit,
  submittingDemoRequest,
  titleText,
  setShowLeavePopUp,
  setIsLeavePopUpShown,
}: {
  showDemoPopup: boolean;
  setShowDemoPopup: any;
  onSubmit: any;
  submittingDemoRequest: boolean;
  titleText?: string;
  setShowLeavePopUp?: any;
  setIsLeavePopUpShown?: any;
}) => {
  return (
    <Card className="fixed text-center h-auto w-[95%] md:w-[65%] lg:w-[45%] flex items-center justify-center flex-col z-[9999999999] border-none shadow-lg py-[30px] px-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f0f0f]">
      <h1 className="text-2xl md:text-xl lg:text-3xl font-semibold">{titleText}</h1>
      <p
        onClick={() => {
          if (titleText === "BE THE FIRST FOR A DEMO!") {
            localStorage.setItem("isUserFirstTime", "false");
            setShowDemoPopup(false);
          } else {
            setShowLeavePopUp(false);
            setIsLeavePopUpShown(true);
          }
        }}
        className="absolute top-[10px] right-[10px] text-[20px] cursor-pointer"
      >
        <IoCloseCircleSharp />
      </p>
      <p className="my-[10px] text-text-gray">Subscribe now for a demo of our platform.</p>
      <form onSubmit={onSubmit} className="flex justify-center w-auto mt-[15px] mx-auto">
        {/* <input type="text" placeholder="Enter email address" className="" /> */}
        <input
          className="outline-none border-0 w-[60%] bg-[#1D1C20] pl-0 md:pl-4"
          placeholder="Enter your email address"
          type="email"
          name="email"
          required
        />
        <Button
          disabled={submittingDemoRequest}
          className="px-[35px] font-bold bg-bright-blue text-white hover:text-black rounded-none rounded-br-[6px] rounded-tr-[6px]"
        >
          {submittingDemoRequest ? "Submitting..." : "Subscribe"}
        </Button>
      </form>
    </Card>
  );
};

const TopOfferCard = ({ title, text, image }: { title: string; text: string; image: any }) => {
  return (
    <Card className="w-[100%] md:w-[24%] text-center rounded-[20px] bg-[#1b1b1b] border-[1px] border-[#28272c] py-[8px] md:py-[15px] px-[8px]">
      <h3 className="font-bold mt-[10%] text-2xl md:text-[14px]">{title}</h3>
      <p className="text-text-gray mt-2 text-[14px]">{text}</p>
      <Image src={image.src} className="!w-[100%] mx-auto !h-auto" width={4000} height={4000} alt="img" />
    </Card>
  );
};

const Testimonials = ({ isMobile }: { isMobile: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const nextSlide = () => {
    if (isMobile) {
      if (currentSlide < 4) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setCurrentSlide(0);
      }
    } else {
      if (currentSlide < 4) {
        setCurrentSlide(currentSlide + 2);
      } else {
        setCurrentSlide(0);
      }
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      } else {
        setCurrentSlide(4);
      }
    } else {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 2);
      } else {
        setCurrentSlide(4);
      }
    }
  };

  const updateCurrentSlide = (index: number) => {
    setCurrentSlide(index);
  };
  return (
    <div id="Testimonials" className="w-[95%] md:w-[90%] lg:w-[80%] pt-[100px] text-center mx-auto mt-[5%] pb-[5%]">
      <div className="w-[40%] md:w-[20%] lg:w-[15%] flex items-center justify-center gap-x-1 bg-button-blue cursor-pointer text-bright-blue text-[14px] border-[1px] border-[#2dabff98] mx-auto px-1 py-[2px] rounded-[5rem]">
        <FaRegMessage />
        <h3>Testimonials</h3>
        <p></p>
      </div>

      <h2 className="text-2xl font-bold mt-[15px]">Hear From Our Customers</h2>
      <p className="text-text-gray mt-2 w-[98%] md:w-[70%] mx-auto">
        &ldquo;Energenius has completely transformed how we manage our energy usage. Their software has led to
        significant cost savings and improved efficiency. I highly recommend their platform to anyone looking to
        optimize their energy comsumption.&rdquo;
      </p>

      <div className="w-full mt-[40px] testimonials">
        <Carousel
          autoPlay={false}
          showArrows={false}
          showIndicators={false}
          showThumbs={false}
          showStatus={false}
          className="w-full"
          centerMode
          centerSlidePercentage={isMobile ? 100 : 33}
          infiniteLoop={false}
          selectedItem={currentSlide}
          onChange={updateCurrentSlide}
        >
          <Testimonial
            namenTitle="John D. - Sustainability Coordinator"
            profilePicture={profilePicture}
            review="Since integrating Energenius, our energy waste has dropped dramatically. It has been invaluable for our sustainability goals."
            //     review="Since integrating Energenius, we have seen a dramatic reduction in energy waste. It's an invaluable tool
            // for our sustainability effort."
          />
          <Testimonial
            namenTitle="Sarah Martinez. - IT Operations Lead"
            profilePicture={profilePicture4}
            // review="Energenius has completely transformed how we handle energy. We've not only cut down on waste, but we've also saved a ton on costs. It's been a smart move for our business."
            review="Energenius has transformed our energy management, reducing waste and saving us money."
          />
          <Testimonial
            namenTitle="Alex Thompson. - Facility Manager"
            profilePicture={profilePicture2}
            review="Thanks to Energenius, we are now operating at peak efficiency. It's a game-changer for energy optimization."
          />
          <Testimonial
            profilePicture={profilePicture3}
            namenTitle=" Emily Rogers. - Sustainability Director"
            // review="The AI insights from Energenius have taken our energy efficiency to a whole new level. If you're serious about cutting waste and saving money, this tool is a must-have."
            review="The AI insights from Energenius have greatly improved our energy efficiency. Highly recommend for any business."
          />
          <Testimonial
            namenTitle="John Reynolds. - Energy Consultant"
            profilePicture={profilePicture5}
            review="Energenius has drastically cut our energy expenses. The integration with Sunbird made it even more effective."
          />
        </Carousel>

        <div className="w-full flex items-center justify-center gap-2 mt-[40px]">
          <div
            onClick={prevSlide}
            className="flex items-center justify-center w-[34px] h-[34px] transition-all duration-300 rounded-full bg-[#1b1b1b] hover:bg-bright-blue cursor-pointer mt-5 tet-[18px]"
          >
            <FaArrowLeft />
          </div>
          <div
            onClick={nextSlide}
            className="flex items-center justify-center w-[34px] h-[34px] transition-all duration-300 rounded-full bg-[#1b1b1b] hover:bg-bright-blue cursor-pointer mt-5 tet-[18px]"
          >
            <FaArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

import { FaStar } from "react-icons/fa6";
const Testimonial = ({
  review,
  namenTitle,
  profilePicture,
}: {
  review: string;
  profilePicture?: any;
  namenTitle?: string;
}) => {
  return (
    <Card className="w-full h-full flex flex-col bg-[#1b1b1b] border-0 text-left px-[5%] py-[6%]">
      <p className="mb-5 text-[14px] md:text-[14px] lg:text-[16px]">{review}</p>
      <div className="flex items-center gap-2 mt-auto">
        {/* {profilePicture ? (
          <div
            style={{
              backgroundImage: `url(${profilePicture.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="w-[45px] h-[45px] rounded-full border-[1px] border-white"
          ></div>
        ) : (
          <Avatar
            icon={<FaRegUser className="text-black" />}
            className="w-[45px] h-[45px] rounded-full border-[1px] bg-[#ccc] border-white"
          />
        )} */}

        <div>
          <h2 className="text-[14px] md:text-[14px] lg:text-[16px]">{namenTitle}</h2>
          <div className="tet-[14px] text-yellow-500 flex items-center gap-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
        </div>
      </div>
    </Card>
  );
};

const Footer = ({ bookDemo, isSubmittingDemoRequest }: { bookDemo: any; isSubmittingDemoRequest: boolean }) => {
  return (
    <section className="w-full bg-[#0f0f0f]">
      <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto pt-[5%] pb-[2%]">
        <div className="flex items-start gap-y-[25px] md:flex-wrap lg:flex-nowrap flex-nowrap md:items-center flex-col md:flex-row pb-[40px] border-b-2 border-b-[#464646] justify-between">
          <div className="w-[100%] md:w-[35%] md:mr-[20px] mr-0">
            {/* <div className="flex items-start mb-[10px]">
              <div className="w-6 h-6 mr-2 rounded-full bg-bright-blue flex items-center justify-center text-dark-blue">
                <BsLightningChargeFill />
              </div>
              <h1 className="text-[1.1rem] md:text-[1.3rem] font-bold">Energenius</h1>
            </div> */}
            <a href="#" className="h-[60px] mb-[10px]">
              <Image src={"/brickLogoUpdated.svg"} alt="logo" width={4000} height={4000} className="w-auto h-[100%]" />
            </a>

            <p className="text-text-gray">
              Join the revolution in smart energy management. Sign up now and start saving energy and money.
            </p>

            <div className="flex items-center gap-x-2">
              <div className="bg-[#1b1b1b] w-[35px] h-[35px] rounded-full flex items-center justify-center mt-[20px] cursor-pointer hover:bg-bright-blue transition-all duration-300">
                <FaTwitter />
              </div>
              <div className="bg-[#1b1b1b] w-[35px] h-[35px] rounded-full flex items-center justify-center mt-[20px] cursor-pointer hover:bg-bright-blue transition-all duration-300">
                <FaFacebookF />
              </div>
              <div className="bg-[#1b1b1b] w-[35px] h-[35px] rounded-full flex items-center justify-center mt-[20px] cursor-pointer hover:bg-bright-blue transition-all duration-300">
                <FaInstagram />
              </div>
              <div className="bg-[#1b1b1b] w-[35px] h-[35px] rounded-full flex items-center justify-center mt-[20px] cursor-pointer hover:bg-bright-blue transition-all duration-300">
                <FaGithub />
              </div>
            </div>
          </div>

          <div className="md:mr-[20px] lg:mr-[20px] mr-0">
            <h3 className="text-white font-bold mb-[10px]">Company</h3>
            <ul className="text-text-gray flex flex-col gap-2">
              <Link href={"#"}>
                <li>Product</li>
              </Link>
              <Link href={"#About Us"}>
                <li>About Us</li>
              </Link>
              <Link href={"#Contact Us"}>
                <li>Contact Us</li>
              </Link>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-[10px]">Help</h3>
            <ul className="text-text-gray flex flex-col gap-2">
              <Link href={"#"}>
                <li>FAQs</li>
              </Link>
              <Link href={"#"}>
                <li>Terms & Conditions</li>
              </Link>
              <Link href={"#"}>
                <li>Privacy Policy</li>
              </Link>
            </ul>
          </div>

          <div>
            {/* <h3 className="mb-[10px] text-white font-semibold">Request a demo of our platform offering</h3> */}
            <h3 className="mb-[10px] text-white font-semibold">Request a Demo</h3>
            <form onSubmit={bookDemo} className="flex">
              {/* <input type="text" placeholder="Enter email address" className="" /> */}
              <input
                className="outline-none border-0 bg-[#1D1C20] pl-4 pr-[5px]"
                placeholder="Enter your email address"
                type="email"
                name="email"
                required
              />
              <Button
                type="submit"
                disabled={isSubmittingDemoRequest}
                className="px-[18px] md:px-[35px] font-bold bg-bright-blue text-white hover:text-black rounded-none rounded-br-[6px] rounded-tr-[6px]"
              >
                {isSubmittingDemoRequest ? "Submitting..." : "Send"}
              </Button>
            </form>
          </div>
        </div>

        <div className="text-center pt-[20px]">
          &copy; Copyright {new Date().getFullYear()} Brick. All Rights Reserved.
        </div>
      </div>
      {/* <div className="bg-white w-full h-[30px]"></div> */}
    </section>
  );
};
