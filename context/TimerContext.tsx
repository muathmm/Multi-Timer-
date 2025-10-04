import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import NotificationService from "../app/src/services/NotificationService";

export type Timer = {
  id: string;
  label: string;
  duration: number;
  remaining: number;
  status: "running" | "paused" | "completed";
  endTime?: number;
  notificationIdentifier?: string;
  createdAt: number;
  repeat?: boolean;
};

type State = { timers: Timer[]; now: number };

type Action =
  | { type: "ADD"; timer: Timer }
  | { type: "UPDATE"; timer: Timer }
  | { type: "DELETE"; id: string }
  | { type: "TICK"; now: number }
  | { type: "COMPLETE"; id: string }
  | { type: "REORDER"; timers: Timer[] }
  | { type: "LOAD"; timers: Timer[] };

const TimerContext = createContext<any>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return { ...state, timers: action.timers };

    case "ADD":
      return { ...state, timers: [...state.timers, action.timer] };

    case "UPDATE":
      return {
        ...state,
        timers: state.timers.map((t) =>
          t.id === action.timer.id ? action.timer : t
        ),
      };

    case "DELETE":
      return { ...state, timers: state.timers.filter((t) => t.id !== action.id) };

    case "TICK": {
      const updatedTimers = state.timers.map((t) => {
        if (t.status === "running" && t.endTime && t.endTime <= action.now) {
          return { ...t, status: "completed", remaining: 0, endTime: t.endTime || action.now };
        }
        if (t.status === "running" && t.endTime) {
          const remaining = Math.max(0, Math.ceil((t.endTime - action.now) / 1000));
          return { ...t, remaining };
        }
        return t;
      });
      return { ...state, now: action.now, timers: updatedTimers };
    }

    case "COMPLETE":
      return {
        ...state,
        timers: state.timers.map((t) =>
          t.id === action.id
            ? { ...t, status: "completed", remaining: 0, endTime: Date.now() }
            : t
        ),
      };

    case "REORDER":
      return { ...state, timers: action.timers };

    default:
      return state;
  }
}

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { timers: [], now: Date.now() });

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("timers");
      if (stored) {
        dispatch({ type: "LOAD", timers: JSON.parse(stored) });
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("timers", JSON.stringify(state.timers));
  }, [state.timers]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK", now: Date.now() });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTimer = async (
    label: string,
    durationSec: number,
    options?: { repeat?: boolean; autoStart?: boolean }
  ) => {
    const now = Date.now();

    const newTimer: Timer = {
      id: uuidv4(),
      label,
      duration: durationSec,
      remaining: durationSec,
      status: options?.autoStart ? "running" : "paused",
      endTime: options?.autoStart ? now + durationSec * 1000 : undefined,
      createdAt: now,
      repeat: options?.repeat,
    };

    dispatch({ type: "ADD", timer: newTimer });

    if (options?.autoStart) {
      const notifId = await NotificationService.scheduleNotification({
        title: "Timer Finished",
        body: `${label} انتهى!`,
        date: new Date(now + durationSec * 1000),
      });
      dispatch({ type: "UPDATE", timer: { ...newTimer, notificationIdentifier: notifId } });
    }
  };

  const startTimer = (id: string) => {
    const t = state.timers.find((x) => x.id === id);
    if (!t) return;
    dispatch({
      type: "UPDATE",
      timer: { ...t, status: "running", endTime: Date.now() + t.remaining * 1000 },
    });
  };

  const pauseTimer = (id: string) => {
    const t = state.timers.find((x) => x.id === id);
    if (!t) return;
    const remaining = t.endTime ? Math.max(0, Math.ceil((t.endTime - Date.now()) / 1000)) : t.remaining;
    dispatch({ type: "UPDATE", timer: { ...t, status: "paused", remaining, endTime: undefined } });
  };

  const deleteTimer = (id: string) => dispatch({ type: "DELETE", id });


  const completeTimer = (id: string) => {
    const t = state.timers.find((x) => x.id === id);
    if (!t) return;

    dispatch({ type: "COMPLETE", id });

    if (t.repeat) {
   
      setTimeout(() => addTimer(t.label, t.duration, { autoStart: true, repeat: true }), 1000);
    }
  };


  const resetTimer = (id: string) => {
    const t = state.timers.find((x) => x.id === id);
    if (!t) return;

  
    dispatch({
      type: "UPDATE",
      timer: { ...t, remaining: t.duration, status: "paused", endTime: undefined },
    });
  };

  const reorderTimers = (timers: Timer[]) => dispatch({ type: "REORDER", timers });

  return (
    <TimerContext.Provider
      value={{
        timers: state.timers,
        now: state.now,
        addTimer,
        startTimer,
        pauseTimer,
        deleteTimer,
        completeTimer,
        resetTimer,
        reorderTimers,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimers = () => useContext(TimerContext);
