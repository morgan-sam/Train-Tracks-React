import React, { useEffect, useState } from "react";
import Screen from "js/components/Screen";

import { generateNewMap } from "js/generation/map/generateMap";
import { generateUnknownTrackIcon } from "js/generation/icon/generateUnknownTrackIcon";
import { generateCrossTrackIcon } from "js/generation/icon/generateCrossTrackIcon";
import { roygbivArray } from "js/utility/colorFunctions";
import { getRandomSeed } from "js/utility/utilityFunctions";
import { defaultGameState } from "js/data/defaultState";

export const App = () => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [mobileView, setMobileView] = useState(false);
  const [gameState, setGameState] = useState(defaultGameState);
  const [currentScreen, setCurrentScreen] = useState("mainMenu");
  const [tileRemSize, setTileRemSize] = useState(3.5);
  const [railImages, setRailImages] = useState({
    unknown: generateUnknownTrackIcon(tileRemSize),
    cross: generateCrossTrackIcon(tileRemSize),
  });
  const [themeColor, setThemeColor] = useState({
    available: roygbivArray(),
    selected: 0,
  });
  const [visualEffects, setVisualEffects] = useState(true);

  const generateMap = (seed = gameState.seed) => {
    const gameParameters = {
      size: gameState.size,
      seed,
      difficulty: gameState.difficulty,
    };
    const mapObject = generateNewMap(gameParameters);
    setGameState({
      ...gameState,
      seed,
      mapObject,
      active: true,
    });
  };

  const inGameNewMap = () => generateMap(getRandomSeed());

  const quitGame = () => {
    setCurrentScreen("mainMenu");
    setGameState({
      ...gameState,
      mapObject: null,
      seed: getRandomSeed(),
      active: false,
    });
  };

  useEffect(() => {
    if (gameState.mapObject !== null && gameState.active)
      setCurrentScreen("game");
  }, [gameState.mapObject, gameState.active]);

  useEffect(() => {
    const mapSeedInput = document.getElementById("mapSeedInput");
    if (mapSeedInput) mapSeedInput.value = gameState.seed;
  }, [gameState.seed]);

  const screenProps = {
    currentScreen,
    setCurrentScreen,
    gameState,
    setGameState,
    inGameNewMap,
    generateMap,
    quitGame,
    tileRemSize,
    railImages,
    themeColor,
    setThemeColor,
    visualEffects,
    setVisualEffects,
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
      setMobileView(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div key={"app"} className="app">
      <div key={"screenContainer"} className="screenContainer">
        <Screen {...screenProps} />
      </div>
    </div>
  );
};

export default App;
