"use client";

import {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {usePageTransition} from "@/components/TransitionLink";
import {useIsClient} from "@/hooks/useIsClient";

const VideoContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const BackgroundVideo = styled.div`
    position: relative;
    max-width: 1920px;
    max-height: 1080px;
    width: 100%;
    height: auto;
    z-index: 2;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;

    &.running {
        &::after {
            animation-play-state: running;
        }
    }

    &::after {
        z-index: 2;
        display: block;
        content: '';
        width: 100vw;
        height: 100vh;
        position: absolute;
        animation: loop 15s 1500ms linear infinite;
        animation-play-state: paused;
        background: rgba(0, 0, 0, 0);
    }


    @keyframes loop {
        87% {
            background: rgba(0, 0, 0, 0);
        }

        94% {
            background: rgba(0, 0, 0, 1);
        }

        100% {
            background: rgba(0, 0, 0, 0);
        }
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        z-index: 1;
    }
`;

const ParticlesWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const EarthVideoLayer = () => {
    const [videoSrc, setVideoSrc] = useState("");
    const backgroundVideoRef = useRef(null);
    const videoElementRef = useRef(null);
    const isMounted = useIsClient();
    const {transitionState} = usePageTransition();

    const selectVideoResolution = () => {
        const width = window.innerWidth;

        if (width >= 1920) {
            return "/videos/earth/earth_1080.mp4";
        } else if (width >= 1280) {
            return "/videos/earth/earth_720.mp4";
        } else {
            return "/videos/earth/earth_540.mp4";
        }
    };

    useEffect(() => {
        const handleVideoResize = () => {
            const selectedVideo = selectVideoResolution();
            setVideoSrc(selectedVideo);
        };

        handleVideoResize();
        window.addEventListener("resize", handleVideoResize);

        return () => window.removeEventListener("resize", handleVideoResize);
    }, []);

    useEffect(() => {
        if (backgroundVideoRef.current && videoSrc !== '') {
            backgroundVideoRef.current.classList.add('running');
        }
    }, [backgroundVideoRef, videoSrc]);

    // Synchronisation lors des transitions
    useEffect(() => {
        if (videoElementRef.current) {
            if (transitionState === 'entering') {
                // Réinitialise et joue la vidéo lors de l'entrée sur une nouvelle page
                videoElementRef.current.currentTime = 0;
                videoElementRef.current.play();
            }
        }
    }, [transitionState]);

    if (!isMounted) {
        return null;
    }

    const isExiting = transitionState === 'exiting';

    return (
        <div className={`earth-video-layer ${isExiting ? 'exiting' : ''}`} style={{position: 'fixed', top: 0}}>
            <VideoContainer>
                <BackgroundVideo ref={backgroundVideoRef}>
                    {videoSrc && (
                        <video
                            ref={videoElementRef}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{background: "black"}}
                        >
                            <source src={videoSrc} type="video/mp4"/>
                        </video>
                    )}
                </BackgroundVideo>
            </VideoContainer>
        </div>
    );
};

export default EarthVideoLayer;
