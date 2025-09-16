import React from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {OptimizedImage} from "@/components/optimizedImage";

// Using a completely different approach with CSS-only blur
const CardOuterContainer = styled.div`
    height: 100%;
    position: relative;
`;

const CardContainer = styled(motion.div)`
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    height: 100%;
    /* Apply a solid background color instead of blur */
    background-color: rgba(15, 10, 40, 0.85);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
`;

// Optional: Add a subtle gradient overlay to simulate blur aesthetics
const BackgroundEffect = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    background: radial-gradient(
            circle at center,
            rgba(117, 75, 200, 0.08),
            transparent 70%
    );
    pointer-events: none;
`;

const PurpleAccent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 5px;
    width: 20%;
    background: var(--color-accent-mihai);
    border-top-left-radius: 12px;
    z-index: 2;
`;

const CardImage = styled.div`
    width: 100%;
    height: 24rem;
    overflow: hidden;
    position: relative;
    z-index: 1;

    img {
        width: 100%;
        height: 36rem;
        object-fit: contain;
        transition: transform 0.5s ease;
    }

    ${CardContainer}:hover & img {
        transform: scale(1.05);
    }
`;

const CardContent = styled.div`
    padding: 2rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
`;

const CardHeader = styled.div`
    margin-bottom: 1.25rem;
`;

const CardTitle = styled.h3.attrs({
    className: "fluid-type-2",
})`
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
`;

const CardSubtitle = styled.div.attrs({
    className: "fluid-type-1",
})`
    color: #a78bfa;
`;

const CardBody = styled.p.attrs({
    className: "fluid-type-0",
})`
    color: #cbd5e1;
    line-height: 1.7;
    margin-bottom: 1.75rem;
    flex-grow: 1;
`;

const CardFooter = styled.div`
    margin-top: auto;
`;

const CardButton = styled.a.attrs({
    className: "fluid-type-0",
})`
    display: inline-block;
    font-weight: 500;
    color: #cbd5e1;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
        color: #9333ea;
    }
`;

/**
 * Project card component with solid background instead of blur
 * Works reliably across all browsers and scroll positions
 */
export function ProjectCard(
    {
        title,
        subtitle,
        description,
        image,
        alt = "Project image",
        actionText = "Learn More",
        actionUrl = "#",
        index = 0,
    }) {
    return (
        <CardOuterContainer>
            <CardContainer
                initial={{opacity: 0, y: 50}}
                whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        delay: index * 0.15,
                        ease: "easeOut",
                    },
                }}
                viewport={{once: true, amount: 0.01}}
            >
                <BackgroundEffect/>
                <PurpleAccent/>
                <CardImage>
                    <OptimizedImage src={image} alt={alt} width={420} height={594}/>
                </CardImage>
                <CardContent>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardSubtitle>{subtitle}</CardSubtitle>
                    </CardHeader>
                    <CardBody>{description}</CardBody>
                    <CardFooter>
                        <CardButton href={actionUrl} target="_blank" rel="noopener noreferrer">{actionText}</CardButton>
                    </CardFooter>
                </CardContent>
            </CardContainer>
        </CardOuterContainer>
    );
}

export default ProjectCard;
