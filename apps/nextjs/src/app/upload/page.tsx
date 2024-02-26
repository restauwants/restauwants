'use client'

import React, { useState } from "react";

import { Button } from "@restauwants/ui/button";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";


export default function Upload() {
    const [imagePublicId, setImagePublicId] = useState("");
    return (
        <>
            <CloudinaryUploadWidget uwConfig={{ cloudName: "doxmtdxjq", uploadPreset: "stkg3ddt" }} setPublicId={ setImagePublicId }/>
        </>
    );
}
