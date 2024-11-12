"use client";
import { useEffect, useState } from "react";
import {
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  Marker,
} from "@vis.gl/react-google-maps";

const INITIAL_CAMERA: MapCameraProps = {
  center: { lat: 6.164671239329751, lng: -75.59062236353836 },
  zoom: 14,
};

const MapCoworking = ({
  locationByAdress,
  setLocationClient,
}: {
  locationByAdress: { lat: number; lng: number };
  setLocationClient: any;
}) => {
  const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA);

  const handleCameraChange = (ev: MapCameraChangedEvent) => {
    console.log(ev.detail);
    setCameraProps(ev.detail);
  };

  useEffect(() => {
    console.log("locationByAdress", locationByAdress);
    setCameraProps({
      center: { lat: locationByAdress.lat, lng: locationByAdress.lng },
      zoom: 17,
    });
  }, [locationByAdress]);

  const handleMapClick = (event: any) => {
    
    console.log("event", event);
    setLocationClient({
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng,
    });
    
  };

  return (
    <Map
      {...cameraProps}
      onCameraChanged={handleCameraChange}
      onClick={handleMapClick}  
      style={{
        width: "100%",
        height: "300px",
      }}
      reuseMaps={true}
    >
      <Marker position={locationByAdress} />
    </Map>
  );
};

export default MapCoworking;
