"use client";

import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MAPS_API_KEY } from "@/constants/mapsApiKey";
import TourLoading from "../loadingSpinners/TourLoading";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const libraries = ["places"];

export default function Map({ address }) {
  const [coordinates, setCoordinates] = useState(center);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (address && isLoaded) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: address }, (results, status) => {
        setIsLoading(false);

        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setCoordinates({ lat: lat(), lng: lng() });
        } else {
          setIsError(true);
        }
      });
    }
  }, [address, isLoaded]);

  if (isLoading) {
    return <TourLoading />;
  }

  if (isError || loadError) {
    return null;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coordinates}
      zoom={16}
    >
      <Marker position={coordinates} />
    </GoogleMap>
  );
}
