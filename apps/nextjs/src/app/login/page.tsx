import { AuthShowcase } from "../_components/auth-showcase";
import Image from 'next/image'

export default async function Profile() {
  return (
    
    <div className="container min-h-screen py-8"
    style={{
      backgroundImage: `url('/vecteezy_crab-stick-salad_2164000.jpg')`,
      backgroundSize: 'cover', // Ensure the image covers the entire container
      backgroundRepeat: 'no-repeat', // Prevent the image from repeating
      backgroundPosition: 'center', // Center the background image
      
    }}>
      
      <div className="absolute bottom-0 left-0 right-0 md:left-1/2 md:transform md:-translate-x-1/2 rounded-t-3xl bg-secondary object-top p-[20%] pt-[6%] pb-24">
      
      <div className="flex flex-col items-center justify-center w-[100%]">
      <span className="text text-sm pb-4 md:w-[100%] text-center">Welcome back to</span>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text p-4">RestauWants</span>
        </h1>
        <div className="pt-[16%]">
        <AuthShowcase/>
        </div>
      </div>
      </div>
    </div>
  );
}
