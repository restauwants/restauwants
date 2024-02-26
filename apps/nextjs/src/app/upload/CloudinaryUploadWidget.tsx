import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext({ loaded: false });

interface UwConfig {
  cloudName: string;
  uploadPreset: string;
  // Add other properties as needed
}

interface uploadWidget {
  open: () => void;
}

interface cloudinaryResult {
  event: string;
  info: {
    public_id?: string,
    resource_type?: string;
  };
}

interface Cloudinary {
  createUploadWidget: (config: unknown, callback: (error: string, result: cloudinaryResult) => void) => uploadWidget;
  // Add other methods and properties as needed
}

declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}

function CloudinaryUploadWidget({ uwConfig, setPublicId }: { uwConfig: UwConfig, setPublicId: (arg0: string) => undefined }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error: string|null, result: cloudinaryResult) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            if (result.info.public_id) {
              setPublicId(result.info.public_id);
            }
          }
        }
      );

      document.getElementById("upload_widget")?.addEventListener(
        "click", () => myWidget.open(), false);
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
