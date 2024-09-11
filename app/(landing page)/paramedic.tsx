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

const Paramedic: React.FC = () => {
    return (
        <section id="paramedic" className="min-h-fit py-12 p-8 md:p-16 bg-barn_red">
            <h1 className="text-3xl font-bold font-cinzel text-white text-center mb-8">OUR PARAMEDIC COURSES</h1>
            <div className="flex flex-col items-center gap-8">
                <div className="flex flex-wrap justify-center gap-8">
                    <CourseCard
                        type="DEGREE"
                        title="PARAMEDIC DEGREE"
                        duration="3 Years"
                        qualification="10+2 (Science)"
                        imageSrc="/images/paramedic-degree.jpg"
                    />
                    <CourseCard
                        type="DIPLOMA"
                        title="PARAMEDIC DIPLOMA"
                        duration="2 Years"
                        qualification="10+2 (Science)"
                        imageSrc="/images/paramedic-diploma.jpg"
                    />
                </div>
                <div className="flex flex-col items-center gap-8">
                    <CourseCard
                        type="DIPLOMA"
                        title="PARAMEDIC DIPLOMA"
                        duration="2 Years"
                        qualification="10+2 (Science)"
                        imageSrc="/images/paramedic-diploma.jpg"
                    />
                </div>
            </div>
        </section>
    );
}

export default Paramedic;
