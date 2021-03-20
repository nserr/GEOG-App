import React, { useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import { Marker, useMap } from "react-leaflet";

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import "../../node_modules/leaflet-geosearch/dist/geosearch.css";

import { promiseToFlyTo, getCurrentLocation } from "lib/map";

import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";

import house_icon from "assets/images/transparent-house-icon.jpg";

const LOCATION = {
  lat: 48.46363,
  lng: -123.31154,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
const ZOOM = 10;

const timeToZoom = 2000;
const timeToOpenPopupAfterZoom = 4000;
const timeToUpdatePopupAfterZoom = timeToOpenPopupAfterZoom + 3000;

const popupContentHello = `<p>My Location</p>`;
const popupContentCurLocation = `
  <div class="popup-gatsby">
    <div class="popup-gatsby-image">
      <img class="house-icon" src=${house_icon} />
    </div>
    <div class="popup-gatsby-content">
      <h1>Current Location</h1>
      <p>Enter an address in the search bar to view a new location.</p>
    </div>
  </div>
`;

/**
 * MapEffect
 * @description This is an example of creating an effect used to zoom in and set a popup on load
 */

const MapEffect = ({ markerRef }) => {
  const map = useMap();

  const provider = new OpenStreetMapProvider();
  const searchControl = new GeoSearchControl({
    provider: provider,
    style: 'bar',
    searchLabel: "Search for an address..."
  });

  map.addControl(searchControl);

  useEffect(() => {
    if (!markerRef.current || !map) return;

    (async function run() {
      const popup = L.popup({
        maxWidth: 800,
      });

      const location = await getCurrentLocation().catch(() => LOCATION);

      const { current: marker } = markerRef || {};

      marker.setLatLng(location);
      popup.setLatLng(location);
      popup.setContent(popupContentHello);

      setTimeout(async () => {
        await promiseToFlyTo(map, {
          zoom: ZOOM,
          center: location,
        });

        marker.bindPopup(popup);

        setTimeout(() => marker.openPopup(), timeToOpenPopupAfterZoom);
        setTimeout(
          () => marker.setPopupContent(popupContentCurLocation),
          timeToUpdatePopupAfterZoom
        );
      }, timeToZoom);
    })();
  }, [map, markerRef]);

  return null;
};

const IndexPage = () => {
  const markerRef = useRef();

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}>
        <MapEffect markerRef={markerRef} />
        <Marker ref={markerRef} position={CENTER} />
      </Map>

      <div className="sameRow">
        <Container type="content" className="text-center home-start">
          <h2>Panel 1</h2>
        </Container>
        <Container type="content" className="text-center home-start">
          <h2>Panel 2</h2>
        </Container>
        <Container type="content" className="text-center home-start">
          <h2>Panel 3</h2>
        </Container>
      </div>
    </Layout>
  );
};

export default IndexPage;
