import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const About: React.FC = () => {
    return (
        <section id="about" className="min-h-fit flex flex-row bg-barn_red p-16 text-white">
            <div className="w-1/2 flex flex-col">
                <h1 className="font-bold font-cinzel text-3xl py-6">TRUSTED BY 10,000+ STUDENTS</h1>
                <p className="mt-4 text-lg w-3/4 pb-6">
                    Nursing is not for everyone. It takes a very strong, intelligent,
                    and compassionate person to take on the ills of the world with
                    passion and purpose and work to maintain the health
                    and well-being of the planet.
                </p>
                <p className="text-lg pt-2">WE PROVIDE THE BEST NURSING AND PARAMEDICAL COURSES</p>
                <div className="py-8 ">
                    <Button className=" w-40 rounded-none text-barn_red bg-white hover:bg-gray-300">VIEW COURSES</Button>
                </div>
            </div>
            <div className="w-1/2">
                <Image src='' alt='about-page-image' className="h-96 w-100" />
            </div>
        </section>
    )
}
export default About;