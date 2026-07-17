import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 3000; // 3s default

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;

type AddToastAction = {
  type: ActionType["ADD_TOAST"];
  toast: ToasterToast;
};

type UpdateToastAction = {
  type: ActionType["UPDATE_TOAST"];
  toast: Partial<ToasterToast> & { id: string };
};

type DismissToastAction = {
  type: ActionType["DISMISS_TOAST"];
  toastId?: string;
};

type RemoveToastAction = {
  type: ActionType["REMOVE_TOAST"];
  toastId?: string;
};

type Action =
  | AddToastAction
  | UpdateToastAction
  | DismissToastAction
  | RemoveToastAction;

interface State {
  toasts: ToasterToast[];
}

let count = 0;
function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string): void => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) addToRemoveQueue(toastId);
      else state.toasts.forEach((t) => addToRemoveQueue(t.id));

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          !toastId || t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      };

    default:
      return state;
  }
};

type Listener = (state: State) => void;

const listeners: Listener[] = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action): void {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type ToastOptions = Omit<ToasterToast, "id">;

function toast(props: ToastOptions) {
  const id = genId();

  const update = (updateProps: Partial<ToasterToast>): void => {
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...updateProps, id },
    });
  };

  const dismiss = (): void => {
    dispatch({ type: "DISMISS_TOAST", toastId: id });
  };

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    const listener: Listener = (newState) => setState(newState);
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []); // subscribe once

  const dismiss = React.useCallback((toastId?: string): void => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, []);

  return {
    ...state,
    toast,
    dismiss,
  };
}

export { useToast, toast };
