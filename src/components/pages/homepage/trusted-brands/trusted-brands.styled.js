import styled from "styled-components";

export const TrustedBrandsContainer = styled.section`
    position: relative;
    width: 100%;
    min-height: 30vh;
    padding: 8vh 0;
`;

export const SectionTitle = styled.h2.attrs({
    className: "fluid-type-4",
})`
    text-align: center;
    margin-bottom: 8vh;
    color: #ffffff;
    font-weight: 600;
`;

export const LogoContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    gap: calc(5vh + 3vw);

    @media screen and (min-width: 1200px) {
        gap: 2.5vw;
        max-width: 60vw;
        margin: 0 auto;
    }
`;

export const LogoWrapper = styled.div`
    --size: clamp(180px, calc(120px + 6vw), 70vw);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    animation: fadeIn 0.6s ease-out forwards;
    animation-delay: ${(props) => props.index * 0.2}s;
    position: relative;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    box-shadow: 0 -4px 2px rgba(50, 50, 100, 0.45),
    inset 0 5px 4px rgba(50, 50, 100, 0.6),
    inset -1px -1px 4px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(6px);
    background: rgb(150, 185, 249, 0.05);

    @media screen and (min-width: 1200px) {
        --size: clamp(160px, calc(130px + 5vw), 9vw);
    }

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(
                to bottom,
                rgba(200, 200, 200, 0.1),
                rgba(255, 255, 255, 0.001) 90%
        );
        opacity: 0.5;
        z-index: 1;
    }

    &::after {
        content: "";
        position: absolute;
        width: 85%;
        height: 85%;
        top: 7.5%;
        left: 7.5%;
        border-radius: 50%;
        background: transparent;
        z-index: 0;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    img {
        position: relative;
        z-index: 3;
        max-width: 75%;
        height: auto;
        object-fit: contain;
        transition: transform 0.3s ease;
        filter: brightness(1.05);
        @media (max-width: 768px) {
            max-width: 70%;
        }
    }
`;
