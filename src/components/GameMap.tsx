/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

interface GameMapProps {
  onPinDrop: (lat: number, lng: number) => void;
  selectedPos: { lat: number; lng: number } | null;
  resultPos?: { guessLat: number; guessLng: number; actualLat: number; actualLng: number } | null;
  mini?: boolean;
}

declare global {
  interface Window { L: any; }
}

export default function GameMap({ onPinDrop, selectedPos, resultPos, mini = false }: GameMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const resultLayerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tryInit = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;
      if (!L) { setTimeout(tryInit, 300); return; }

      const map = L.map(mapRef.current, {
        center: [20, 10],
        zoom: mini ? 1 : 2,
        zoomControl: !mini,
        scrollWheelZoom: true,
        attributionControl: false,
        minZoom: 1,
        maxZoom: mini ? 3 : 8,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
      }).addTo(map);

      if (!mini) {
        map.on('click', (e: any) => {
          onPinDrop(e.latlng.lat, e.latlng.lng);
        });
      }

      mapInstanceRef.current = map;
      setReady(true);
    };

    tryInit();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const L = window.L;
    if (markerRef.current) { mapInstanceRef.current.removeLayer(markerRef.current); markerRef.current = null; }
    if (!selectedPos) return;
    const icon = L.divIcon({
      html: `<div style="width:24px;height:24px;background:hsl(45,90%,55%);border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.4);"></div>`,
      className: '', iconSize: [24, 24], iconAnchor: [12, 24],
    });
    markerRef.current = L.marker([selectedPos.lat, selectedPos.lng], { icon }).addTo(mapInstanceRef.current);
  }, [selectedPos, ready]);

  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const L = window.L;
    if (resultLayerRef.current) { mapInstanceRef.current.removeLayer(resultLayerRef.current); resultLayerRef.current = null; }
    if (!resultPos) return;

    const group = L.layerGroup();
    const guessIcon = L.divIcon({
      html: `<div style="width:20px;height:20px;background:hsl(45,90%,55%);border:3px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.5);"></div>`,
      className: '', iconSize: [20, 20], iconAnchor: [10, 10],
    });
    const actualIcon = L.divIcon({
      html: `<div style="width:20px;height:20px;background:hsl(175,70%,45%);border:3px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.5);"></div>`,
      className: '', iconSize: [20, 20], iconAnchor: [10, 10],
    });

    L.marker([resultPos.guessLat, resultPos.guessLng], { icon: guessIcon }).addTo(group);
    L.marker([resultPos.actualLat, resultPos.actualLng], { icon: actualIcon }).addTo(group);
    L.polyline([[resultPos.guessLat, resultPos.guessLng], [resultPos.actualLat, resultPos.actualLng]], {
      color: 'hsl(45,90%,55%)', weight: 2, opacity: 0.7, dashArray: '6,6'
    }).addTo(group);

    group.addTo(mapInstanceRef.current);
    resultLayerRef.current = group;

    const bounds = L.latLngBounds(
      [resultPos.guessLat, resultPos.guessLng],
      [resultPos.actualLat, resultPos.actualLng]
    );
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  }, [resultPos, ready]);

  return (
    <div ref={mapRef} className="map-container w-full h-full" style={{ minHeight: mini ? 120 : 300 }} />
  );
}
