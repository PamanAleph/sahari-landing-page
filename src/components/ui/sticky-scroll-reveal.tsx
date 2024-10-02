import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: string | React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "var(--slate-900)",
    "var(--black)",
    "var(--neutral-900)",
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
    "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
    "linear-gradient(to bottom right, var(--purple-500), var(--teal-500))",
    "linear-gradient(to bottom right, var(--teal-400), var(--cyan-400))",
    ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
<motion.div
  animate={{
    backgroundColor: backgroundColors[activeCard % backgroundColors.length],
  }}
  className="h-[20rem] md:h-screen w-full overflow-y-auto flex justify-center relative space-x-32 p-10 scrollbar-hide text-justify"
  ref={ref}
>
  <div className="relative flex items-start px-4">
    <div className="max-w-2xl w-full">
      {content.map((item, index) => (
        <div key={item.title + index} className="my-20">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: activeCard === index ? 1 : 0.3 }}
            className="text-2xl font-bold text-slate-100"
          >
            {item.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: activeCard === index ? 1 : 0.3 }}
            className="text-lg text-slate-300 max-w-sm mt-10"
          >
            {item.description}
          </motion.p>
        </div>
      ))}
      <div className="h-40" />
    </div>
  </div>
  <div
    style={{ background: backgroundGradient }}
    className={cn(
      "hidden lg:block h-[30rem] w-[35rem] text-center rounded-md bg-white sticky top-10 overflow-hidden",
      contentClassName
    )}
  >
    {typeof content[activeCard].content === "string" ? (
      <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white">
        {content[activeCard].content}
      </div>
    ) : (
      <div className="h-full w-full">{content[activeCard].content}</div>
    )}
  </div>
</motion.div>
  );
};
