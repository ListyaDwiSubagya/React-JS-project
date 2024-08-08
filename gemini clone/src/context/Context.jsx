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

    const delayPara = (index,nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSend = async(prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if (prompt !== undefined) {
            response =  await run(prompt)
            setRecent(prompt)
        } else {
            setPrevious(prev => [...prev, input])
            setRecent(input)
            response = await run(input)
        }
        let responseArray = response.split("**");
        let newResponse= "";
        for (let i = 0; i < responseArray.length; i++)
        {
            if (i === 0 || i%2 !== 1){
                newResponse += responseArray[i];

            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</b>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i < newResponseArray.length; i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ")
        }
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
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider