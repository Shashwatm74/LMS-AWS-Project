import React from "react";
import Image from "next/image";
import hometxt from "@/public/images/hometext.svg"
import { Button } from "@/components/ui/button";
const Home: React.FC = () => {
    return (
        <section id="home" className="flex min-h-fit flex-col items-center px-14 pt-32 pb-14">
            <Image src='' alt='landing image' className="h-96  w-11/12 max-w-screen-2xl  mb-10 " />
            <div className="flex flex-col gap-2 p-0 max-w-screen-2xl text-xl items-center text-center">

                <Image src={hometxt} alt="home text" className="h-24" />
                <p className="my-2 font-helvetica size-blockquote text-justify-center md:px-32">
                    <i>
                        Building a child is like building the Nation, F. I. College of Nursing was laid by Late Mr. Iqbal Ahmad sir, in his guidance F.I. College of Nursing
                        encouraging the upcoming young generation and started developing the new strength in the upcoming nation builders.
                    </i>
                </p>
                <Button className="rounded-none w-40 h-11 bg-barn_red font-helvetica size-blockquote hover:bg-charcoal ">ABOUT US</Button>
            </div>
        </section>
    )
}
export default Home;