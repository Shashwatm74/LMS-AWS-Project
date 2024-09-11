import React from "react";
import Image from "next/image";
import hometxt from "@/public/images/hometext.svg"
import { Button } from "@/components/ui/button";
const Home: React.FC = () => {
    return (
        <section id="home" className="flex min-h-fit flex-col items-center px-12 py-12">
            <Image src='' alt='landing image' className="h-96  w-11/12 max-w-screen-2xl  mb-10 " />
            <div className="font-cinzel flex flex-col gap-2 p-0 max-w-screen-2xl text-xl items-center text-center">
                <h4 className="text-barn_red font-normal size-5 w-80 font-roboto">WELCOME TO</h4>
                <Image src={hometxt} alt="home text" className="h-16" />
                <p className="my-2">
                    <i>
                        Building a child is like building the Nation, F. I. College of Nursing was laid by Late Mr. Iqbal Ahmad sir, in his guidance F.I. College of Nursing
                        encouraging the upcoming young generation and started developing the new strength in the upcoming nation builders.
                    </i>
                </p>
                <Button className="rounded-none w-40 h-11 bg-barn_red font-roboto hover:bg-red-900">ABOUT US</Button>
            </div>
        </section>
    )
}
export default Home;