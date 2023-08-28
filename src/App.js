import { useReducer } from "react";
import "./App.css";
import "./style.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentOprand: payload.digit,
          overwrite:false,
        }
      }
      if (payload.digit === "0" && state.currentOprand === "0") return state;
      if (payload.digit === "." && state.currentOprand.includes("."))
        return state;
      return {
        ...state,
        currentOprand: `${state.currentOprand || ""}${payload.digit}`,
      };
     case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) return {
        ...state,
        overwrite:false,
        currentOprand:null
      }
      if(state.currentOprand == null ) return state
      if(state.currentOprand.length === 1){
        return {
          ...state, currentOprand: null
        }
      }
      return {
        ...state,
        currentOprand: state.currentOprand.slice(0, -1)
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOprand === null && state.previousOprand === null) {
        return state;
      }

      if (state.currentOprand === null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOprand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOprand: state.currentOprand,
          currentOprand: null,
        };
      }

      return {
        ...state,
        previousOprand: evaluate(state),
        operation: payload.operation,
        currentOprand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousOprand == null ||
        state.currentOprand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite:true,
        previousOprand:null,
        operation:null,
        currentOprand:evaluate(state),
      }

      default:
        return state;
  }
}

function evaluate({ previousOprand, currentOprand, operation }) {
  const prev = parseFloat(previousOprand);
  const current = parseFloat(currentOprand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const  INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})

function formatOperand (operand){
  if(operand == null) return 
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOprand, previousOprand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-oprand">
          {formatOperand(previousOprand)}
          {operation}
        </div>
        <div className="current-oprand">{formatOperand(currentOprand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button  onClick={() => {
          dispatch({ type: ACTIONS.DELETE_DIGIT });
        }}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />

      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.EVALUATE });
        }}
      >
        =
      </button>
    </div>
  );
}

export default App;
