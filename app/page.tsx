'use client';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
export default function Home() {

  return (
    <>
      <Navbar />

      <section className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Welcome to FI Institute</h1>
        <p className="mt-4 text-xl">Explore our courses and learn more about us.</p>
      </section>

      <section className="min-h-screen p-24">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-4 text-lg">Learn more about our mission and values.</p>
      </section>
      <section className="min-h-screen p-24">
        <h1 className="text-4xl font-bold">Nursing Course</h1>
        <p className="mt-4 text-lg">Details about the Nursing course offered by us.</p>
      </section>
      <section className="min-h-screen p-24">
        <h1 className="text-4xl font-bold">Paramedic Course</h1>
        <p className="mt-4 text-lg">Details about the Paramedic course offered by us.</p>
      </section>
      <section className="min-h-screen p-24">
        <h1 className="text-4xl font-bold">Our Founder</h1>
        <p className="mt-4 text-lg">Meet the visionary behind our institution.</p>
      </section>
      <Footer />
    </>
  );
}
