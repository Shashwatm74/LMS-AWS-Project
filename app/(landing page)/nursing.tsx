import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface CourseCardProps {
    type: string;
    title: string;
    duration: string;
    qualification: string;
    imageSrc: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ type, title, duration, qualification, imageSrc }) => (
    <Card className="flex flex-col rounded-none w-80 h-96 mb-4">
        <div className="relative h-3/4 w-full">
            <Image
                src={imageSrc}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="rounded-t"
            />
            <div className="absolute bottom-2 left-2 px-3 py-1 text-white bg-barn_red">
                {type}
            </div>
        </div>
        <div className="p-4 bg-gray-100 flex-grow flex flex-col justify-between">
            <h2 className="text-xl font-bold text-barn_red">{title}</h2>
            <p className="text-sm">Duration - {duration}</p>
            <p className="text-sm">Min. Qualification - {qualification}</p>
        </div>
    </Card>
);

const Nursing: React.FC = () => {
    return (
        <section id="nursing" className="min-h-fit py-12 p-8 md:p-16">
            <h1 className="text-3xl font-bold font-cinzel text-barn_red text-center mb-8">OUR NURSING COURSES</h1>
            <div className="flex flex-col items-center gap-8">
                <div className="flex flex-wrap justify-center gap-8">
                    <CourseCard
                        type="DEGREE"
                        title="BSC NURSING"
                        duration="4 Years"
                        qualification="10+2 (PCBE)"
                        imageSrc="/images/bsc-nursing.jpg"
                    />
                    <CourseCard
                        type="DEGREE"
                        title="POST BASIC BSC NURSING"
                        duration="2 Years"
                        qualification="GNM"
                        imageSrc="/images/post-basic-bsc.jpg"
                    />
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    <CourseCard
                        type="DIPLOMA"
                        title="GNM"
                        duration="3 Years"
                        qualification="10+2 (Art/Sci/Comm)"
                        imageSrc="/images/gnm.jpg"
                    />
                    <CourseCard
                        type="DIPLOMA"
                        title="ANM"
                        duration="2 Years"
                        qualification="10+2 (Art/Sci/Comm)"
                        imageSrc="/images/anm.jpg"
                    />
                </div>
            </div>
        </section>
    );
}

export default Nursing;
