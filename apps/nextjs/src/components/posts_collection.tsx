"use client";

import type { RouterOutputs } from "@restauwants/api";

import { Suspense, useState } from "react";

import { CollectionList } from "./collections";
import { ReviewList } from "./reviews";

export function Posts_collection(props: {
  reviews: Promise<RouterOutputs["review"]["all"]>;
  byUserId: string;
}) {
  const [_activeButton, setActiveButton] = useState("posts");
  const [selectedComponent, setSelectedComponent] = useState("posts");

  const handleButton = (buttonName: string) => {
    setActiveButton(buttonName);
    setSelectedComponent(buttonName);
  };

  return (
    <div>
      <div className="grid grid-cols-2 pb-[4%]">
        <button
          className={`h-3 cursor-pointer text-sm font-bold ${
            selectedComponent === "posts" ? "text-primary" : "text-base"
          } ${
            selectedComponent === "posts"
              ? "hover:bg-transparent"
              : "hover:bg-transparent"
          }`}
          onClick={() => handleButton("posts")}
        >
          Posts
        </button>
        <button
          className={`h-3 cursor-pointer text-sm font-bold ${
            selectedComponent === "collections" ? "text-primary" : "text-base"
          } ${
            selectedComponent === "collections"
              ? "hover:bg-transparent"
              : "hover:bg-transparent"
          }`}
          onClick={() => handleButton("collections")}
        >
          Collections
        </button>
      </div>
      <div className="flex-grow p-4">
        <Suspense fallback={<h4>Loading...</h4>}>
          {selectedComponent === "posts" ? (
            <ReviewList reviews={props.reviews} byUserId={props.byUserId}/>
          ) : (
            <CollectionList />
          )}
        </Suspense>
      </div>
    </div>
  );
}
