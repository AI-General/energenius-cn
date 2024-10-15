import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaPause, FaPlay } from "react-icons/fa6";
import { IoVolumeMute, IoVolumeHigh } from "react-icons/io5";

const BackgroundVideo = ({ cauroselPosition }: { cauroselPosition: number }) => {
  const mainContainerRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [videoContainerPosition, setVideoContainerPosition] = useState(0);
  const [videoContainerStyes, setVideoContainerStyes] = useState<any>({
    width: "0vw",
    height: "auto",
  });

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    // @ts-ignore
    setVideoContainerPosition(mainContainerRef.current?.getBoundingClientRect().top + window.scrollY);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
      // @ts-ignore
      setVideoContainerPosition(mainContainerRef.current?.getBoundingClientRect().top + window.scrollY);
      // ScrollTrigger.refresh();

      // @ts-ignore
      const containerTop = mainContainerRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const screenWidth = window.innerWidth;

      let startScroll;
      let endScroll;

      // If screen width is less than 768px (mobile), adjust start and end points
      if (screenWidth < 768) {
        startScroll = windowHeight * 0.75; // Start scroll when it's a quarter from the top
        endScroll = windowHeight / 2; // Reach full width near the middle
        if (endScroll === containerTop || endScroll - containerTop < 100) {
          setVideoContainerStyes({
            width: "0vw",
            height: "auto",
          });
        }
      } else {
        if (windowWidth < 900) {
          startScroll = windowHeight / 1.4;
          endScroll = windowHeight;
        } else {
          startScroll = windowHeight / 2.5;
          endScroll = windowHeight;
        }
        if (endScroll === containerTop || endScroll - containerTop < 100) {
          setVideoContainerStyes({
            width: "0vw",
            height: "auto",
          });
        }
      }
      if (containerTop < startScroll && containerTop > -endScroll) {
        // Calculate the percentage based on how far the container has scrolled into view
        let scrollPercentage;
        if (screenWidth < 768) {
          scrollPercentage = (startScroll - containerTop) / (startScroll - endScroll);
        } else {
          scrollPercentage = (startScroll - containerTop) / (endScroll - startScroll);
        }
        let newWidth;

        if (screenWidth < 768) {
          newWidth = Math.min(Math.max(scrollPercentage * 100, 2), 100);
        } else {
          newWidth = Math.min(Math.max(scrollPercentage * 95, 2), 95);
        }

        setVideoContainerStyes({
          ...videoContainerStyes,
          width: `${newWidth}vw`,
        });
      }
    };

    // handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [videoContainerStyes]);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleIsMuted = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      videoRef.current.muted = true;
    } else {
      videoRef.current.muted = false;
    }
  };

  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);
  //   const element = containerRef.current;

  //   gsap.fromTo(
  //     element,
  //     { width: "0vw", height: "0vh" },
  //     {
  //       width: window.innerWidth < 768 ? "100vw" : "95%",
  //       height: window.innerWidth < 768 ? "230px" : "60vh",
  //       // height: "200px",
  //       scrollTrigger: {
  //         trigger: element,
  //         //   pin: true,
  //         start: window.innerWidth <= 768 ? "top bottom" : "top bottom",
  //         end: window.innerWidth <= 768 ? "bottom 450px" : "top 200px",
  //         scrub: 1,
  //         //   scrub: true,
  //       },
  //     }
  //   );
  // }, []);

  return (
    <section
      style={{ ...videoContainerStyes, transition: "width 0.3s ease-in-out" }}
      ref={mainContainerRef}
      className="md:px-[32px] py-1 h-auto px-[0] bg-[#0F0F0F] z-[999999] mx-auto"
    >
      <div
        ref={containerRef}
        style={{
          marginTop:
            cauroselPosition > videoContainerPosition ? `${cauroselPosition + 30 - videoContainerPosition}px` : "40px",
        }}
        className="container px-[10px] md:px-0 w-[100%] !h-auto flex items-start justify-start relative"
      >
        <video
          // src="https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/foundation-digital-canvas/large.mp4"
          // src="/assets/videos/Video.mp4"
          src="https://pvyqszflhydcdxrbznlm.supabase.co/storage/v1/object/public/video/video.mp4"
          muted
          autoPlay
          loop
          ref={videoRef}
          className="w-[100%] relative h-auto object-contain md:object-container rounded-[10px] m-0"
        ></video>
        <div
          onClick={togglePlayPause}
          className="absolute top-[10px] bg-[#eeeeee6b] right-[4%] md:right-[3%] grid place-items-center cursor-pointer w-[30px] h-[30px] rounded-full text-white"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </div>
        <div
          onClick={toggleIsMuted}
          className="absolute top-[50px] bg-[#eeeeee6b] right-[4%] md:right-[3%] grid place-items-center cursor-pointer w-[30px] h-[30px] rounded-full text-white"
        >
          {isMuted ? <IoVolumeHigh /> : <IoVolumeMute />}
        </div>
      </div>
    </section>
  );
};

export default BackgroundVideo;
