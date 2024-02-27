"use client";

import { Suspense, useState } from "react";

import { CollectionList } from "../_components/collections";
import { PostList } from "../_components/posts";

interface ButtonProps {
  onButtonClick: (buttonName: string) => void;
}

export function Posts_collection(props: any) {
  const [activeButton, setActiveButton] = useState("posts");
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
            <PostList posts={props.posts} />
          ) : (
            <CollectionList />
          )}
        </Suspense>
      </div>
    </div>
  );
}
