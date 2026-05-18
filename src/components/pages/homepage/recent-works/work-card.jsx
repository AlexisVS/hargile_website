// src/components/pages/homepage/recent-works/work-card.jsx
import {useEffect, useRef} from "react";
import {motion, useAnimation, useInView} from "motion/react";
import {CardContainer, CardContent, CardDescription, CardImage, CardTitle, ImageContainer} from "./work-card.styled";

const WorkCard = ({work, index, inView}) => {
    const cardRef = useRef(null);
    const cardControls = useAnimation();
    const imageRef = useRef(null);

    const cardInView = useInView(cardRef, {
        amount: 0.2,
        once: false
    });

    useEffect(() => {
        if (cardInView || inView) {
            cardControls.start("visible");
        } else {
            cardControls.start("hidden");
        }
    }, [cardInView, inView, cardControls]);

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut"
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const {clientX, clientY} = e;
        const {left, top, width, height} = cardRef.current.getBoundingClientRect();

        // Calculate mouse position relative to card (from -0.5 to 0.5 in both axes)
        const xPos = (clientX - left) / width - 0.5;
        const yPos = (clientY - top) / height - 0.5;

        // Apply parallax effect to image
        imageRef.current.style.transform = `
      scale(1.05) 
      translate(${xPos * 10}px, ${yPos * 10}px)
    `;
    };

    const handleMouseLeave = () => {
        if (!imageRef.current) return;
        imageRef.current.style.transform = "scale(1) translate(0, 0)";
    };

    return (
        <motion.div
            ref={cardRef}
            variants={cardVariants}
            initial="hidden"
            animate={cardControls}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`work-card work-card--${work.id}`}
        >
            <CardContainer href={work.link}>
                <ImageContainer>
                    <CardImage
                        style={{width: '100%', maxWidth: '100%', maxHeight: '40vh', objectPosition: 'left'}}
                        ref={imageRef}
                        src={work.image}
                        alt={work.title}
                        width={640}
                        height={960}
                    />
                </ImageContainer>
                <CardContent>
                    <CardTitle>{work.title}</CardTitle>
                    <CardDescription>{work.description}</CardDescription>
                </CardContent>
            </CardContainer>
        </motion.div>
    );
};

export default WorkCard;
