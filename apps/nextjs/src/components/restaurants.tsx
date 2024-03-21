// import React from "react";
// // import { GlobeIcon, SewingPinFilledIcon } from "@restauwants/ui/icons";
// import {
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//   } from "@restauwants/ui/modal";

// import { api } from "~/trpc/react";

// export default async function RestaurantDetail({
//     params,
//   }: {
//     params: { restName: string };
//   }) {
//     const id = parseInt(params.restName);
//     const restaurants = api.restaurant.all;
//     // const restObj = await api.restaurant.byId({ id });
//     console.log(restaurants);
//     // console.log(restObj?.name);
//     return (
//       <div className="relative h-screen">
//         <div
//           className="h-2/5 py-8"
//           style={{
//             backgroundImage: `url('/pnpm-workspace.jpeg')`,
//             backgroundSize: "cover", // Ensure the image covers the entire container
//             backgroundRepeat: "no-repeat", // Prevent the image from repeating
//             backgroundPosition: "center", // Center the background image
//           }}
//         ></div>
//         <div className="absolute inset-x-0 bottom-0 flex h-2/3 flex-col rounded-t-lg bg-white">
//           <div className="mt-8 flex flex-col items-center justify-center">
//             <h1 className="font-bold">{params.restName}</h1>
//             <div className="mx-auto max-w-md">
//               <p className="mx-4 text-center text-sm">
//                 Pasta dishes & other Italian staples served at this stalwart
//                 eatery with kitschy decor & live music.
//               </p>
//             </div>
//           </div>
//           <div className="relative box-border flex w-full flex-col p-2">
//             <div className="flex flex-col border-b-2 pb-2">
//               <div className="mt-3 flex items-center gap-1 pt-2">
//                 <div className="pl-4 text-left ">
//                   <SewingPinFilledIcon className="h-5 w-5" />
//                 </div>
//                 <p className="text-sm text-gray-500">
//                   1011 Broad St, Victoria, BC V8W 2A1
//                 </p>
//               </div>
//               <div className="mt-1 flex items-center gap-1">
//                 <div className="pl-4 text-left ">
//                   <GlobeIcon className="h-5 w-5" />
//                 </div>
//                 <p className="text-sm text-gray-500">www.restaurant.com</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
