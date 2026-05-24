/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

interface StreetViewProps {
  lat: number;
  lng: number;
  apiKey: string;
}

declare global {
  interface Window {
    google: any;
    initStreetView: () => void;
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const callbacks: (() => void)[] = [];

function loadGoogleMaps(apiKey: string, onReady: () => void) {
  if (scriptLoaded) { onReady(); return; }
  callbacks.push(onReady);
  if (scriptLoading) return;
  scriptLoading = true;

  window.initStreetView = () => {
    scriptLoaded = true;
    callbacks.forEach(cb => cb());
    callbacks.length = 0;
  };

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initStreetView`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export default function StreetView({ lat, lng, apiKey }: StreetViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (!apiKey) { setStatus('error'); return; }

    loadGoogleMaps(apiKey, () => {
      if (!containerRef.current) return;
      const google = window.google;
      if (!google?.maps?.StreetViewPanorama) { setStatus('error'); return; }

      const sv = new google.maps.StreetViewService();
      sv.getPanorama(
        { location: { lat, lng }, radius: 5000, preference: google.maps.StreetViewPreference.NEAREST },
        (data: any, googleStatus: any) => {
          if (googleStatus !== google.maps.StreetViewStatus.OK) {
            setNoData(true);
            setStatus('error');
            return;
          }

          if (panoramaRef.current) {
            panoramaRef.current.setPosition({ lat, lng });
            panoramaRef.current.setVisible(true);
          } else {
            panoramaRef.current = new google.maps.StreetViewPanorama(containerRef.current!, {
              position: data.location.latLng,
              pov: { heading: 0, pitch: 0 },
              zoom: 1,
              addressControl: false,
              showRoadLabels: false,
              linksControl: true,
              panControl: true,
              enableCloseButton: false,
              motionTracking: false,
              motionTrackingControl: false,
              fullscreenControl: false,
            });
          }
          setStatus('ok');
        }
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <div className="relative w-full h-full bg-surface-1">
      {/* Street View container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ opacity: status === 'ok' ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-1">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Загружаю Street View...</p>
        </div>
      )}

      {/* Error / no data overlay */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-1 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary/60 flex items-center justify-center mb-1">
            <Icon name="MapPin" size={28} className="text-muted-foreground" />
          </div>
          {!apiKey ? (
            <>
              <p className="text-sm font-medium text-foreground">Street View не подключён</p>
              <p className="text-xs text-muted-foreground">Добавь Google Maps API ключ в настройках проекта</p>
            </>
          ) : noData ? (
            <>
              <p className="text-sm font-medium text-foreground">Street View недоступен</p>
              <p className="text-xs text-muted-foreground">Для этой локации нет панорамы Google</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">Ошибка загрузки</p>
              <p className="text-xs text-muted-foreground">Проверь API ключ Google Maps</p>
            </>
          )}
        </div>
      )}

      {/* Compass overlay hint */}
      {status === 'ok' && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5 pointer-events-none">
          <Icon name="MousePointer2" size={12} className="text-gold" />
          <span className="text-xs text-muted-foreground">Перетащи для осмотра</span>
        </div>
      )}
    </div>
  );
}
