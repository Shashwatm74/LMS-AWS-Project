import React from "react";
import Image from "next/image";
const Nursing: React.FC = () => {
    return (
        <section id="nursing" className="min-h-screen p-16 items-center">
            <h1 className="text-3xl font-bold font-cinzel text-barn_red text-center">Our Nursing Courses</h1>
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <div className="flex flex-col">
                        <div>
                            <Image src='' alt='' />
                        </div>
                        <div>
                            Degree
                        </div>
                        <div>
                            <h1>
                                Degree name
                            </h1>
                            <p>Degree desc</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <Image src='' alt='' />
                        </div>
                        <div>
                            Degree
                        </div>
                        <div>
                            <h1>
                                Degree name
                            </h1>
                            <p>Degree desc</p>
                        </div>
                    </div>

                </div>


                <div className="flex flex-row">
                    <div className="flex flex-col">
                        <div>
                            <Image src='' alt='' />
                        </div>
                        <div>
                            Degree
                        </div>
                        <div>
                            <h1>
                                Degree name
                            </h1>
                            <p>Degree desc</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <Image src='' alt='' />
                        </div>
                        <div>
                            Degree
                        </div>
                        <div>
                            <h1>
                                Degree name
                            </h1>
                            <p>Degree desc</p>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}
export default Nursing;