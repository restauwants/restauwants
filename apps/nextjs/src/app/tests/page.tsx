"use client";

import { api } from "~/trpc/react";

export default function Tests() {
  const res = api.test.hello.useQuery();
  //const res2 = api.test.getSecretMessage.useQuery();
  //const res3 = api.user.current.useQuery();
  console.log(res);
  return <p>{"test"}</p>;
}
