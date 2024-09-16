import React from "react";
import Image from "next/image";
import hometxt from "@/public/images/hometext.svg";
import { Button } from "@/components/ui/button";

const About: React.FC = () => {
    return (
        <section id="about" className="flex min-h-fit flex-col items-center px-14 pt-32 pb-14">
            <Image src="" alt="about image" className="h-96 w-11/12 max-w-screen-2xl mb-10" />
            <div className="flex flex-col gap-2 p-0 max-w-screen-2xl text-xl items-center text-center">

                <h1 className="text-3xl font-bold font-cinzel text-barn_red text-center mb-8">ABOUT US</h1>
                <p className="my-2 font-helvetica size-blockquote text-justify-center md:px-32">
                    <i>
                        Building a child is like building the Nation, F. I. College of Nursing was laid by Late Mr. Iqbal Ahmad sir, in his guidance F.I. College of Nursing
                        encouraging the upcoming young generation and started developing the new strength in the upcoming nation builders.
                    </i>
                </p>
            </div>
        </section>
    );
};

export default About;