import React from "react";

export default function RestaurantDetail({
  params,
}: {
  params: { restName: string };
}) {
  return <h1>{params.restName}</h1>;
}
