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
import eye_show from "assets/images/eye-show.png";
import plus_icon from "assets/images/plus-icon.png";

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

      <div className="same-row">
        <Container type="content" className="text-center home-start">
          <h2>Layers</h2>
          <ul>
            <li>Distance to Campus<img class="eye-show" src={eye_show}></img></li>
            <li>Bus Stops <img class="eye-show" src={eye_show}></img></li>
            <li>Bike Lanes <img class="eye-show" src={eye_show}></img></li>
            <li>Mean Household Income<img class="eye-show" src={eye_show}></img></li>
            <li>Mean Household Age<img class="eye-show" src={eye_show}></img></li>
          </ul>
          <img class="plus-icon" src={plus_icon}></img>
        </Container>
        <Container type="content" className="text-center home-start">
          <h2>Input Address</h2>
          <div className="address-wrap">
            <span className="address">3964 Ansell Road</span>
            <span className="address">Saanich</span>
            <span className="address">V8P 4W4</span>
          </div>
          <div className="address-info-wrap">
            <span className="address-info type-address">Address</span>
            <span className="address-info type-region">Region</span>
            <span className="address-info type-postal-code">Postal Code</span>
          </div>
          <div className="score-button">
            Score
          </div>
        </Container>
        <Container type="content" className="text-center home-start">
          <h2>Score</h2>
          <div className="score-circle"><span className="score">95</span></div>
          <p>Your input address scored a <span className="score-2">95</span>.</p>
          <p>This is an ideal location for UVic students!</p>
        </Container>
      </div>
    </Layout>
  );
};

export default IndexPage;
