import React from "react";
import Image from "next/image";
const Founder: React.FC = () => {
    return (
        <section id="founder" className="min-h-fit px-10 py-12">
            <div className="flex flex-col items-center p-8 gap-10">
                <h1 className="text-3xl font-bold font-cinzel text-barn_red text-center mb-8">OUR FOUNDER</h1>
                <Image src='' alt='founder-image' className="w-96 h-96" />
                <h1 className="text-3xl font-bold font-cinzel text-barn_red text-center">Late Mr. Iqbal Ahmed</h1>
                <p className=" text-lg w-full md:w-3/4 text-center">
                    Building a child is like building the Nation, F. I. College of Nursing was laid by
                    Late Mr. Iqbal Ahmad sir, in his guidance F.I. College of Nursing encouraging
                    the upcoming young generation and started developing the new strength in
                    the upcoming nation builders. The architecture of the Institute provides very
                    wide, airy and spacious classrooms.
                </p>
            </div>
        </section>
    )
}
export default Founder;