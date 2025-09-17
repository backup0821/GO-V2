import React, { useEffect, useRef, useState } from 'react';
import { Box, Alert, CircularProgress, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setMapLoading, setMapError, setMapMarkers } from '../../store/slices/mapSlice';
import { useSearchNearbyToiletsQuery } from '../../store/api/toiletApi';

interface MapComponentProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  showUserLocation?: boolean;
  height?: string;
  width?: string;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    type: string;
    grade: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (position: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = 15,
  showUserLocation = false,
  height = '400px',
  width = '100%',
  markers = [],
  onMarkerClick,
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const mapMarkersRef = useRef<any[]>([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { userLocation } = useSelector((state: RootState) => state.search);

  // 如果沒有提供markers，自動搜尋附近廁所
  const shouldSearchToilets = markers.length === 0 && userLocation;
  
  const { data: nearbyToilets, isLoading: isSearchingToilets } = useSearchNearbyToiletsQuery(
    {
      location: userLocation,
      limit: 50,
    },
    {
      skip: !shouldSearchToilets,
    }
  );

  // 載入Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      
      script.onerror = () => {
        setMapError('無法載入Google Maps，請檢查網路連線');
        dispatch(setMapError('無法載入Google Maps，請檢查網路連線'));
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [dispatch]);

  // 初始化地圖
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapRef.current) return;

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        accessibility: {
          keyboardShortcuts: true,
        },
      });

      // 地圖點擊事件
      if (onMapClick) {
        mapInstanceRef.current.addListener('click', (event: any) => {
          onMapClick({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
        });
      }

      dispatch(setMapLoading(false));
    } catch (error) {
      console.error('地圖初始化失敗:', error);
      setMapError('地圖初始化失敗');
      dispatch(setMapError('地圖初始化失敗'));
    }
  }, [isGoogleMapsLoaded, center, zoom, onMapClick, dispatch]);

  // 更新地圖中心
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center]);

  // 更新地圖縮放
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);

  // 顯示使用者位置
  useEffect(() => {
    if (!mapInstanceRef.current || !showUserLocation || !userLocation) return;

    // 移除舊的使用者位置標記
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.setMap(null);
    }

    // 新增使用者位置標記
    userLocationMarkerRef.current = new window.google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map: mapInstanceRef.current,
      title: '您的位置',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      zIndex: 1000,
    });

    // 新增資訊視窗
    const infoWindow = new window.google.maps.InfoWindow({
      content: '<div><strong>您的位置</strong></div>',
    });

    userLocationMarkerRef.current.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, userLocationMarkerRef.current);
    });

    return () => {
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setMap(null);
      }
    };
  }, [showUserLocation, userLocation]);

  // 更新地圖標記
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 清除舊標記
    mapMarkersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    mapMarkersRef.current = [];

    // 使用提供的markers或搜尋結果
    const markersToShow = markers.length > 0 ? markers : 
      (nearbyToilets?.toilets.map(toilet => ({
        id: toilet.id,
        position: { lat: toilet.latitude, lng: toilet.longitude },
        title: toilet.name,
        type: toilet.type,
        grade: toilet.grade,
      })) || []);

    // 建立標記圖示
    const getMarkerIcon = (type: string, grade: string) => {
      let color = '#757575'; // 預設灰色
      
      if (type.includes('無障礙')) {
        color = '#4CAF50'; // 綠色 - 無障礙廁所
      } else if (grade === '特優級') {
        color = '#2196F3'; // 藍色 - 特優級
      } else if (grade === '優級') {
        color = '#9C27B0'; // 紫色 - 優級
      } else if (grade === '良級') {
        color = '#FF9800'; // 橙色 - 良級
      } else if (grade === '普通級') {
        color = '#795548'; // 棕色 - 普通級
      } else if (grade === '不合格') {
        color = '#F44336'; // 紅色 - 不合格
      }

      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: color,
        fillOpacity: 0.8,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      };
    };

    // 新增標記
    markersToShow.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: getMarkerIcon(markerData.type, markerData.grade),
        zIndex: 100,
      });

      // 標記點擊事件
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(markerData.id);
        }

        // 顯示資訊視窗
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 4px 0; font-size: 14px;">${markerData.title}</h4>
              <p style="margin: 0; font-size: 12px; color: #666;">
                類型: ${markerData.type}<br/>
                等級: ${markerData.grade}
              </p>
            </div>
          `,
        });
        infoWindow.open(mapInstanceRef.current, marker);
      });

      mapMarkersRef.current.push(marker);
    });

    // 如果有標記，調整地圖視圖以顯示所有標記
    if (markersToShow.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersToShow.forEach(marker => {
        bounds.extend(marker.position);
      });
      
      // 如果顯示使用者位置，也包含在邊界內
      if (showUserLocation && userLocation) {
        bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
      }
      
      mapInstanceRef.current.fitBounds(bounds);
      
      // 確保縮放級別不會太小
      const listener = window.google.maps.event.addListener(
        mapInstanceRef.current,
        'idle',
        () => {
          if (mapInstanceRef.current.getZoom() > 15) {
            mapInstanceRef.current.setZoom(15);
          }
          window.google.maps.event.removeListener(listener);
        }
      );
    }

    // 更新Redux狀態
    dispatch(setMapMarkers(markersToShow.map(marker => ({
      id: marker.id,
      position: marker.position,
      title: marker.title,
      type: marker.type,
      grade: marker.grade,
      data: {} as any, // 這裡可以根據需要填入完整的廁所資料
    }))));

  }, [markers, nearbyToilets, onMarkerClick, showUserLocation, userLocation, dispatch]);

  if (mapError) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">
          {mapError}
        </Alert>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {!isGoogleMapsLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1,
          overflow: 'hidden',
        }}
        role="application"
        aria-label="地圖"
        tabIndex={0}
      />
      
      {/* 地圖圖例 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 1,
          borderRadius: 1,
          fontSize: '0.75rem',
          zIndex: 2,
        }}
      >
        <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>圖例</Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              mr: 0.5,
            }}
          />
          無障礙廁所
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#2196F3',
              mr: 0.5,
            }}
          />
          特優級
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#757575',
              mr: 0.5,
            }}
          />
          一般廁所
        </Box>
      </Box>
    </Box>
  );
};

export default MapComponent;
