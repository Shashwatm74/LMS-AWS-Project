import React from "react";
import Image from "next/image";
import redLogo from "@/public/images/redlogo.svg"
import yt from "@/public/images/yt.svg"
import x from "@/public/images/x.svg"
import facebook from "@/public/images/facebook.svg"
import insta from "@/public/images/insta.svg"

const Contact: React.FC = () => {
    return (
        <section id="about" className="min-h-fit flex flex-col md:flex-row bg-ivory pt-12 px-16 text-white font-helvetica ">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <div className="flex justify-center md:justify-start">
                    <Image src={redLogo} alt='about-page-image' className="w-96" />
                </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-row text-black ">
                <div className="flex flex-col w-full md:w-1/2 text-sm mb-8 md:mb-4 md:pl-24 md:pt-2  ">
                    <h2 className="text-barn_red font-semibold mb-4">
                        QUICK LINKS
                    </h2>
                    <a className="block mb-2" href="">HOME</a>
                    <a className="block mb-2" href="">ABOUT US</a>
                    <a className="block mb-2" href="">COURSES</a>
                    <a className="block mb-2" href="">NOTICE</a>
                    <a className="block mb-2" href="">GALLERY</a>
                </div>
                <div className="flex flex-col w-full md:w-1/2 mb-8 md:mb-16">
                    <p className="mb-4">1223, Khand Dev, Banthra, Lucknow</p>
                    <h2 className="text-barn_red font-semibold mb-4">
                        CONTACT US:
                    </h2>
                    <p className="mb-2">
                        +91 9044050480
                    </p>
                    <p className="mb-2">
                        finursingcollege@hotmail.com
                    </p>
                    <p className="mb-4">
                        www.finursingcollege.com
                    </p>
                    <div className="flex gap-6 mt-4">
                        <Image className="h-6 hover:cursor-pointer" src={facebook} alt="facebook-img" />
                        <Image className="h-6 hover:cursor-pointer" src={insta} alt="instagram-img" />
                        <Image className="h-6 hover:cursor-pointer" src={yt} alt="youtube-img" />
                        <Image className="h-6 hover:cursor-pointer" src={x} alt="x-img" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact;
