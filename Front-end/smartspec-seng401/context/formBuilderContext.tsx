"use client";

import { Component } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface FormBuilderContextInterface {
  /* We need the following attributes:
    - User's Budget: number
    - List of Users Games: string[]
    - Display resolution: string
    - Minimum fps: number
    - Graphical Quality: string
    - Pre-owned Hardware: list[{ComponentType: string, name: string}]

    Then of course, we'd like the following actions:
    - Change budget: () => number
    - Submit form: () => {},
    */

  /*ATTRIBUTES*/
  budget: number;
  minFps: number;
  gamesList: string[];
  displayResolution: string;
  graphicalQuality: string;
  preOwnedHardware: Component[];

  /*METHODS*/
  changeBudget: (value: number) => void;
  changeMinFps: (value: number) => void;
  addToGamesList: (game: string) => void;
  removeFromGamesList: (index: number) => void;
  updateGameFromList: (index: number, newGame: string) => void;
  changeDisplayResolution: (resolution: string) => void;
  changeGraphicalQuality: (quality: string) => void;
  addToPreOwnedHardware: (component: Component) => void;
  removeFromPreOwnedHardware: (index: number) => void;
  updatePreOwnedHardware: (index: number, newComponent: Component) => void;

  // For Debugging Purposes
  debugPrint: () => void;
}

const FormBuilderContextDefaultValues: FormBuilderContextInterface = {
  budget: 0,
  minFps: 0,
  gamesList: [],
  displayResolution: "",
  graphicalQuality: "",
  preOwnedHardware: [],
  changeBudget: () => {},
  changeMinFps: () => {},
  addToGamesList: () => {},
  removeFromGamesList: () => {},
  updateGameFromList: () => {},
  changeDisplayResolution: () => {},
  changeGraphicalQuality: () => {},
  addToPreOwnedHardware: () => {},
  removeFromPreOwnedHardware: () => {},
  updatePreOwnedHardware: () => {},
  // For Debugging Purposes
  debugPrint: () => {},
};

const FormBuilderContext = createContext<FormBuilderContextInterface>(
  FormBuilderContextDefaultValues
);

export function useFormBuilderContext() {
  return useContext(FormBuilderContext);
}

interface Props {
  children: ReactNode;
}

export function FormBuilderProvider({ children }: Props) {
  const [budget, setBudget] = useState<number>(0);
  const [minFps, setMinFps] = useState<number>(0);
  const [gamesList, setGamesList] = useState<string[]>([]);
  const [displayResolution, setDisplayResolution] = useState<string>("");
  const [graphicalQuality, setGraphicalQuality] = useState<string>("");
  const [preOwnedHardware, setPreOwnedHardware] = useState<Component[]>([]);

  function changeBudget(value: number) {
    setBudget(value);
  }

  function changeMinFps(value: number) {
    setMinFps(value);
  }

  function addToGamesList(game: string) {
    setGamesList([...gamesList, game]);
  }

  function removeFromGamesList(index: number) {
    setGamesList((prev) => {
      return prev.filter((_, i) => {
        return i != index;
      });
    });
  }

  function updateGameFromList(index: number, newGame: string) {
    setGamesList((prev) => {
      const newArray = [...prev];
      newArray[index] = newGame;
      return newArray;
    });
  }

  function changeDisplayResolution(resolution: string) {
    setDisplayResolution(resolution);
  }

  function changeGraphicalQuality(quality: string) {
    setGraphicalQuality(quality);
  }

  function addToPreOwnedHardware(component: Component) {
    setPreOwnedHardware([...preOwnedHardware, component]);
  }

  function removeFromPreOwnedHardware(index: number) {
    setPreOwnedHardware((prev) => {
      return prev.filter((_, i) => {
        return i != index;
      });
    });
  }

  function updatePreOwnedHardware(index: number, newComponent: Component) {
    setPreOwnedHardware((prev) => {
      const newArray = [...prev];
      newArray[index] = newComponent;
      return newArray;
    });
  }

  function debugPrint() {
    console.log(
      "Budget: ",
      budget,
      "\nMinFps: ",
      minFps,
      "\nGames: ",
      gamesList,
      "\nDisplay Resolution: ",
      displayResolution,
      "\nGraphical Quality: ",
      graphicalQuality,
      "\nPre-owned Hardware: ",
      preOwnedHardware
    );
  }

  useEffect(() => {
    debugPrint();
  }, [
    budget,
    minFps,
    gamesList,
    displayResolution,
    graphicalQuality,
    preOwnedHardware,
  ]);

  const value = {
    budget,
    minFps,
    gamesList,
    displayResolution,
    graphicalQuality,
    preOwnedHardware,
    changeBudget,
    changeMinFps,
    addToGamesList,
    removeFromGamesList,
    updateGameFromList,
    changeDisplayResolution,
    changeGraphicalQuality,
    addToPreOwnedHardware,
    removeFromPreOwnedHardware,
    updatePreOwnedHardware,
    debugPrint,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
