"use client";

import { Suspense, useState } from "react";

import type { RouterOutputs } from "@restauwants/api";

import { CollectionList } from "../components/collections";
import { ReviewList } from "../components/reviews";

//types of each field in default - try this

export function Posts_collection(props: {
  collections: Promise<RouterOutputs["collection"]["all"]>;
  reviews: Promise<RouterOutputs["review"]["all"]>;
  curUser: string;
}) {
  const [selectedComponent, setSelectedComponent] = useState("posts");

  const handleButton = (buttonName: string) => {
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
            <ReviewList reviews={props.reviews} curUser={props.curUser} />
          ) : (
            <CollectionList collections={props.collections} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
