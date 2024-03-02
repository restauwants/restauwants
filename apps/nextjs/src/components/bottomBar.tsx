import React from "react";

export function BottomBar(props: { children: React.ReactNode }) {
  const numChildren = React.Children.count(props.children);
  return (
    <div
      className={`fixed bottom-4 grid w-full grid-cols-${numChildren} justify-items-center gap-4`}
    >
      {props.children}
    </div>
  );
}
