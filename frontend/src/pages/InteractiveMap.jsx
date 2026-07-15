import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Crosshair,
  Filter,
  LocateFixed,
  MapPin,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Route,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  MAP_CATEGORIES,
  MAP_DISTRICTS,
  MAP_MICRO_POIS,
  MAP_PLACES,
  MAP_ROUTES,
  MAP_SIZE,
  TILE_SIZE,
} from "@/data/mapData";

const MIN_ZOOM = 0.04;
const MAX_ZOOM = 1.1;
const TILE_VERSION = "20260715-2";
const LEVELS = {
  0: { size: 1536, cols: 3 },
  1: { size: 3072, cols: 6 },
  2: { size: 6144, cols: 12 },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const chooseLevel = (zoom) => {
  if (zoom < 0.2) return 0;
  if (zoom < 0.52) return 1;
  return 2;
};

const getMinZoom = (viewport) => {
  if (!viewport.width || !viewport.height) return MIN_ZOOM;
  return Math.max(MIN_ZOOM, Math.min(viewport.width / MAP_SIZE, viewport.height / MAP_SIZE) * 0.94);
};

const getInitialView = (viewport) => {
  const zoom = getMinZoom(viewport);
  return clampView({ x: 0, y: 0, zoom }, viewport);
};

const categoryColor = {
  district: "bg-vicepink text-white shadow-[0_0_20px_rgba(246,107,180,0.45)]",
  transport: "bg-ocean text-vice-bg shadow-[0_0_20px_rgba(86,210,255,0.42)]",
  service: "bg-gold text-vice-bg shadow-[0_0_20px_rgba(212,175,82,0.38)]",
  activity: "bg-sunset text-vice-bg shadow-[0_0_20px_rgba(255,123,84,0.4)]",
  hidden: "bg-[#a78bfa] text-vice-bg shadow-[0_0_20px_rgba(167,139,250,0.36)]",
};

function clampView(next, viewport) {
  if (!viewport.width || !viewport.height) return next;
  const zoom = clamp(next.zoom, getMinZoom(viewport), MAX_ZOOM);
  const visibleW = viewport.width / zoom;
  const visibleH = viewport.height / zoom;
  const clampAxis = (value, visibleSize) => (
    visibleSize >= MAP_SIZE
      ? (MAP_SIZE - visibleSize) / 2
      : clamp(value, 0, MAP_SIZE - visibleSize)
  );
  return {
    ...next,
    zoom,
    x: clampAxis(next.x, visibleW),
    y: clampAxis(next.y, visibleH),
  };
}

function useViewport(ref) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return undefined;
    const update = () => {
      const rect = ref.current.getBoundingClientRect();
      setViewport({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return viewport;
}

function useVisibleTiles(view, viewport) {
  return useMemo(() => {
    const level = chooseLevel(view.zoom);
    const levelInfo = LEVELS[level];
    const logicalTile = TILE_SIZE * (MAP_SIZE / levelInfo.size);
    const pad = logicalTile * 1.25;
    const minX = Math.max(0, view.x - pad);
    const minY = Math.max(0, view.y - pad);
    const maxX = Math.min(MAP_SIZE, view.x + viewport.width / view.zoom + pad);
    const maxY = Math.min(MAP_SIZE, view.y + viewport.height / view.zoom + pad);
    const startX = clamp(Math.floor(minX / logicalTile), 0, levelInfo.cols - 1);
    const endX = clamp(Math.floor(maxX / logicalTile), 0, levelInfo.cols - 1);
    const startY = clamp(Math.floor(minY / logicalTile), 0, levelInfo.cols - 1);
    const endY = clamp(Math.floor(maxY / logicalTile), 0, levelInfo.cols - 1);
    const tiles = [];

    for (let y = startY; y <= endY; y += 1) {
      for (let x = startX; x <= endX; x += 1) {
        tiles.push({
          key: `${level}-${x}-${y}`,
          src: `/map-tiles/${level}/${x}_${y}.webp?v=${TILE_VERSION}`,
          left: x * logicalTile,
          top: y * logicalTile,
          size: logicalTile,
        });
      }
    }

    return tiles;
  }, [view, viewport]);
}

export default function InteractiveMap() {
  const viewportRef = useRef(null);
  const mapLayerRef = useRef(null);
  const dragRef = useRef(null);
  const viewRef = useRef({ x: 0, y: 0, zoom: MIN_ZOOM });
  const wheelFrameRef = useRef(null);
  const wheelDeltaRef = useRef(0);
  const wheelPointRef = useRef(null);
  const initializedRef = useRef(false);
  const viewport = useViewport(viewportRef);
  const [view, setView] = useState({ x: 0, y: 0, zoom: MIN_ZOOM });
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("vice-city");
  const [routePreview, setRoutePreview] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 768);
  const [rightPanelOpen, setRightPanelOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 768);
  const [isDragging, setIsDragging] = useState(false);
  const tiles = useVisibleTiles(view, viewport);

  const applyTransform = useCallback((nextView) => {
    if (!mapLayerRef.current) return;
    mapLayerRef.current.style.transform = `translate(${-nextView.x * nextView.zoom}px, ${-nextView.y * nextView.zoom}px) scale(${nextView.zoom})`;
  }, []);

  useEffect(() => {
    if (initializedRef.current || !viewport.width) return;
    initializedRef.current = true;
    setView(getInitialView(viewport));
  }, [viewport]);

  useEffect(() => {
    if (!initializedRef.current || !viewport.width) return;
    setView((current) => clampView(current, viewport));
  }, [viewport]);

  useEffect(() => {
    viewRef.current = view;
    applyTransform(view);
  }, [applyTransform, view]);

  useEffect(() => () => {
    if (wheelFrameRef.current) cancelAnimationFrame(wheelFrameRef.current);
  }, []);

  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MAP_PLACES.filter((place) => {
      const categoryOk = activeCategory === "all" || place.category === activeCategory;
      const queryOk = !q || `${place.name} ${place.type} ${place.detail}`.toLowerCase().includes(q);
      return categoryOk && queryOk;
    });
  }, [activeCategory, query]);

  const selected = useMemo(
    () => MAP_PLACES.find((place) => place.id === selectedId) || filteredPlaces[0] || MAP_PLACES[0],
    [selectedId, filteredPlaces]
  );

  const updateView = useCallback((next) => {
    setView((current) => clampView(typeof next === "function" ? next(current) : next, viewport));
  }, [viewport]);

  const focusPlace = useCallback((place) => {
    setSelectedId(place.id);
    if (viewport.width < 768) {
      setLeftPanelOpen(false);
      setRightPanelOpen(true);
    }
    updateView((current) => clampView({
      zoom: Math.max(current.zoom, viewport.width < 640 ? 0.42 : 0.54),
      x: place.x - viewport.width / (Math.max(current.zoom, viewport.width < 640 ? 0.42 : 0.54) * 2),
      y: place.y - viewport.height / (Math.max(current.zoom, viewport.width < 640 ? 0.42 : 0.54) * 2),
    }, viewport));
  }, [updateView, viewport]);

  const zoomAt = useCallback((factor, point) => {
    updateView((current) => {
      const nextZoom = clamp(current.zoom * factor, getMinZoom(viewport), MAX_ZOOM);
      const anchor = point || { x: viewport.width / 2, y: viewport.height / 2 };
      const mapX = current.x + anchor.x / current.zoom;
      const mapY = current.y + anchor.y / current.zoom;
      return {
        zoom: nextZoom,
        x: mapX - anchor.x / nextZoom,
        y: mapY - anchor.y / nextZoom,
      };
    });
  }, [updateView, viewport]);

  const resetView = () => updateView(getInitialView(viewport));

  const onWheel = (event) => {
    event.preventDefault();
    const rect = viewportRef.current.getBoundingClientRect();
    wheelDeltaRef.current += event.deltaY;
    wheelPointRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (wheelFrameRef.current) return;
    wheelFrameRef.current = requestAnimationFrame(() => {
      const factor = clamp(Math.exp(-wheelDeltaRef.current * 0.0015), 0.78, 1.28);
      wheelDeltaRef.current = 0;
      wheelFrameRef.current = null;
      zoomAt(factor, wheelPointRef.current);
    });
  };

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      view: viewRef.current,
    };
    setIsDragging(true);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const nextView = clampView({
      ...drag.view,
      x: drag.view.x - dx / drag.view.zoom,
      y: drag.view.y - dy / drag.view.zoom,
    }, viewport);
    viewRef.current = nextView;
    applyTransform(nextView);
  };

  const onPointerUp = () => {
    if (dragRef.current) setView(viewRef.current);
    dragRef.current = null;
    setIsDragging(false);
  };

  const transformStyle = {
    width: MAP_SIZE,
    height: MAP_SIZE,
    transform: `translate(${-view.x * view.zoom}px, ${-view.y * view.zoom}px) scale(${view.zoom})`,
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#09050C] text-tprimary">
      <div className="relative h-[100dvh] min-h-[540px]">
        <div
          ref={viewportRef}
          data-testid="interactive-map-canvas"
          className="absolute inset-0 touch-none cursor-grab overflow-hidden bg-[#130a1a] active:cursor-grabbing"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="map-water pointer-events-none absolute inset-0 z-0" />
          <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(9,5,12,0.18),transparent_20%,transparent_78%,rgba(9,5,12,0.34))]" />
          <div ref={mapLayerRef} className="absolute left-0 top-0 origin-top-left will-change-transform" style={transformStyle}>
            {tiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.src}
                alt=""
                draggable={false}
                loading="eager"
                className="absolute select-none"
                style={{ left: tile.left, top: tile.top, width: tile.size + 1, height: tile.size + 1 }}
              />
            ))}

            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
              {MAP_DISTRICTS.map((district) => (
                <polygon
                  key={district.id}
                  points={district.points}
                  fill={district.color}
                  opacity="0.035"
                  stroke={district.color}
                  strokeDasharray="28 22"
                  strokeLinejoin="round"
                  strokeWidth="8"
                />
              ))}
              {routePreview && MAP_ROUTES.map((route, index) => (
                <path
                  key={route}
                  d={route}
                  fill="none"
                  stroke={index === 0 ? "#ff7b54" : "#f46bb4"}
                  strokeDasharray={index === 0 ? "30 20" : "12 24"}
                  strokeLinecap="round"
                  strokeWidth={index === 0 ? 12 : 7}
                  opacity={index === 0 ? 0.58 : 0.3}
                />
              ))}
            </svg>

            {view.zoom >= 0.4 && MAP_MICRO_POIS.map((poi) => (
              <div
                key={poi.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: poi.x, top: poi.y }}
              >
                <span className={`block h-8 w-8 rounded-full border-[5px] border-[#09050C]/70 ${categoryColor[poi.category] || categoryColor.district}`} />
              </div>
            ))}

            {filteredPlaces.map((place) => {
              const active = selected?.id === place.id;
              return (
                <button
                  key={place.id}
                  type="button"
                  data-testid={`map-marker-${place.id}`}
                  className={`pointer-events-auto absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-[0_10px_24px_rgba(0,0,0,0.34)] transition-transform hover:scale-110 ${
                    active
                      ? "border-white/80 bg-[#170b1b] text-white"
                      : "border-white/30 bg-[#09050C]/80 text-white/80"
                  }`}
                  style={{ left: place.x, top: place.y }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    focusPlace(place);
                  }}
                >
                  <span className={`h-8 w-8 rounded-full ${categoryColor[place.category] || categoryColor.district}`} />
                </button>
              );
            })}
          </div>

          {!isDragging && selected && view.zoom >= 0.3 && (() => {
            const x = (selected.x - view.x) * view.zoom;
            const y = (selected.y - view.y) * view.zoom;
            if (x < 16 || x > viewport.width - 16 || y < 88 || y > viewport.height - 16) return null;
            return (
              <div
                className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full rounded-lg border border-white/15 bg-[#09050C]/92 px-3 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.42)]"
                style={{ left: x, top: y - 10 }}
              >
                <p className="whitespace-nowrap text-sm font-semibold text-white">{selected.name}</p>
                <p className="mt-0.5 whitespace-nowrap text-[11px] text-tsec">{selected.type}</p>
              </div>
            );
          })()}
        </div>

        <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
          <div className="pointer-events-auto mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#09050C] px-4 shadow-[0_18px_60px_rgba(0,0,0,0.36)] sm:px-5">
            <div className="flex items-center gap-4">
              <Link to="/" data-testid="map-back-home" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-tsec transition-colors hover:border-sunset/40 hover:text-tprimary">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <Logo withText />
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="rounded-full border border-sunset/25 bg-sunset/[0.12] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sunset">
                Live Interactive Map
              </span>
              <button
                type="button"
                data-testid="map-route-toggle"
                onClick={() => setRoutePreview((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  routePreview ? "border-sunset/40 bg-sunset/[0.16] text-sunset" : "border-white/10 text-tsec hover:text-tprimary"
                }`}
              >
                <Route className="h-4 w-4" />
                Roads
              </button>
            </div>
          </div>
        </header>

        {leftPanelOpen ? (
        <aside className="pointer-events-none absolute bottom-4 left-4 right-4 z-40 md:bottom-6 md:left-6 md:right-auto md:top-24 md:w-[22rem]">
          <div className="pointer-events-auto max-h-[44vh] overflow-hidden rounded-2xl border border-white/10 bg-[#09050C] shadow-[0_24px_90px_rgba(0,0,0,0.5)] md:max-h-[calc(100vh-8rem)]">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sunset">
                  <Filter className="h-3.5 w-3.5" />
                  Leonida Index
                </div>
                <button
                  type="button"
                  data-testid="map-hide-left-panel"
                  title="Hide place index"
                  onClick={() => setLeftPanelOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-tsec transition-colors hover:border-sunset/35 hover:text-white"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-tsec/70">
                Districts, routes, services, and discovery points rendered as live map layers.
              </p>
              <label className="mt-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-tsec">
                <Search className="h-4 w-4 text-tsec/60" />
                <input
                  data-testid="map-search-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search places..."
                  className="min-w-0 flex-1 bg-transparent text-tprimary outline-none placeholder:text-tsec/45"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="text-tsec hover:text-tprimary">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
              <div className="mt-3 flex flex-wrap gap-2 pb-1">
                {MAP_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    data-testid={`map-filter-${category.id}`}
                    onClick={() => setActiveCategory(category.id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      activeCategory === category.id
                        ? "border-sunset/45 bg-sunset/[0.16] text-sunset"
                        : "border-white/10 text-tsec/70 hover:text-tprimary"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[17rem] overflow-y-auto p-2 md:max-h-[calc(100vh-22rem)]">
              {filteredPlaces.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  data-testid={`map-place-${place.id}`}
                  onClick={() => focusPlace(place)}
                  className={`mb-2 w-full rounded-xl border p-3 text-left transition-colors ${
                    selected?.id === place.id
                      ? "border-sunset/35 bg-sunset/[0.12]"
                      : "border-white/5 bg-white/[0.025] hover:border-white/12 hover:bg-white/[0.045]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading text-base font-medium text-tprimary">{place.name}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${categoryColor[place.category] || categoryColor.district}`} />
                  </div>
                  <p className="mt-1 text-xs text-tsec/70">{place.type}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
        ) : (
          <button
            type="button"
            data-testid="map-show-left-panel"
            title="Show place index"
            onClick={() => {
              setLeftPanelOpen(true);
              if (viewport.width < 768) setRightPanelOpen(false);
            }}
            className="pointer-events-auto absolute left-4 top-24 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-[#09050C]/92 text-tsec shadow-[0_12px_34px_rgba(0,0,0,0.4)] transition-colors hover:border-sunset/40 hover:text-white md:left-6"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}

        {rightPanelOpen ? (
        <section className="pointer-events-none absolute bottom-4 left-4 right-4 z-40 md:bottom-auto md:left-auto md:right-4 md:top-24 md:w-[23rem] lg:right-6">
          <div className="pointer-events-auto max-h-[48vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#09050C] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.52)] md:max-h-[calc(100vh-8rem)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sunset">{selected?.status}</p>
                <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-tprimary">{selected?.name}</h1>
                <p className="mt-1 text-sm text-tsec">{selected?.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${categoryColor[selected?.category] || categoryColor.district}`}>
                  <MapPin className="h-5 w-5" />
                </span>
                <button
                  type="button"
                  data-testid="map-hide-right-panel"
                  title="Hide place details"
                  onClick={() => setRightPanelOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-tsec transition-colors hover:border-sunset/35 hover:text-white"
                >
                  <PanelRightClose className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-tsec">{selected?.detail}</p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="uppercase tracking-[0.18em] text-tsec/45">Map Grid</p>
                  <p className="mt-1 font-semibold text-tprimary">
                    {Math.round(selected?.x / 64)}.{Math.round(selected?.y / 64)}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.18em] text-tsec/45">Layer</p>
                  <p className="mt-1 font-semibold text-tprimary">{selected?.category}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {["Route", "Nearby", "Save"].map((item) => (
                <span key={item} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-center text-xs font-semibold text-tsec">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-sunset/20 bg-sunset/[0.08] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-sunset">
                <Sparkles className="h-4 w-4" />
                AI route hint
              </div>
              <p className="mt-2 text-xs leading-6 text-tsec/80">
                Start from {selected?.name}, then follow highlighted arterial roads toward Vice City for a balanced exploration pass.
              </p>
            </div>
          </div>
        </section>
        ) : (
          <button
            type="button"
            data-testid="map-show-right-panel"
            title="Show place details"
            onClick={() => {
              setRightPanelOpen(true);
              if (viewport.width < 768) setLeftPanelOpen(false);
            }}
            className="pointer-events-auto absolute right-4 top-24 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-[#09050C]/92 text-tsec shadow-[0_12px_34px_rgba(0,0,0,0.4)] transition-colors hover:border-sunset/40 hover:text-white lg:right-6"
          >
            <PanelRightOpen className="h-5 w-5" />
          </button>
        )}

        <div className="pointer-events-auto absolute bottom-6 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#09050C] shadow-[0_20px_70px_rgba(0,0,0,0.5)] md:right-6">
          <button type="button" data-testid="map-zoom-in" onClick={() => zoomAt(1.22)} className="p-3 text-tsec transition-colors hover:bg-white/[0.06] hover:text-tprimary">
            <Plus className="h-5 w-5" />
          </button>
          <button type="button" data-testid="map-zoom-out" onClick={() => zoomAt(0.82)} className="border-t border-white/10 p-3 text-tsec transition-colors hover:bg-white/[0.06] hover:text-tprimary">
            <Minus className="h-5 w-5" />
          </button>
          <button type="button" data-testid="map-reset-view" onClick={resetView} className="border-t border-white/10 p-3 text-tsec transition-colors hover:bg-white/[0.06] hover:text-tprimary">
            <LocateFixed className="h-5 w-5" />
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#09050C] px-4 py-2 text-xs text-tsec lg:flex">
          <Crosshair className="h-3.5 w-3.5 text-sunset" />
          Drag to pan. Scroll to zoom. Select a marker for details.
        </div>
      </div>
    </main>
  );
}
