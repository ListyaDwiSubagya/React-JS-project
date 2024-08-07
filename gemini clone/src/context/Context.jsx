import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recent, setRecent] = useState("");
    const [previous, setPrevious] = useState([]);
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const onSend = async(prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecent(input)
        const response = await run(input)
        setResultData(response)
        setLoading(false)
        setInput("")

    }


    const contextValue = {
        previous,
        setPrevious,
        onSend,
        setRecent,
        recent,
        showResult,
        loading,
        resultData,
        input,
        setInput
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider