import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BeatLoader, RingLoader } from "react-spinners";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function App() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [questionPrompt, setquestionPrompt] = useState("");
  const [message, setMessage] = useState([]);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setInputText("");
    setquestionPrompt(inputText);
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/generate-text", {
        text: inputText
      });
      setResponse(response.data);
      setLoading(false);
      setMessage([...message, response.data]);
    } catch (error) {
      console.error("Error generating response", error.message);
    }
  };
  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const scrolltoBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrolltoBottom();
  }, [message]);

  return (
    <div className="app">
      <section className="side-bar">
        <aside
          id="default-sidebar"
          className="fixed top-0 left-0 z-40 w-60 h-full transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-black dark:bg-zinc-800">
            <ul className="space-y-2 font-medium text-white text-sm">
              <li>
                <a
                  href="/"
                  className="flex items-center p-2 text-white hover:bg-zinc-800 rounded-lg"
                >
                  <div className="bg-white rounded-full p-1">
                    <img
                      src="openai-black.png"
                      alt="black-logo"
                      className="w-4 h-4"
                    />
                  </div>
                  <span className="ms-2 text-xs">New Chat</span>
                  <img
                    src="new-chat.png"
                    alt="new chat"
                    className="w-4 h-4 ml-24"
                  />
                </a>
              </li>
            </ul>
            <ol className="text-white mt-8 text-sm">
              {message.map((message, index) => (
                <li key={index} className="px-3 py-2 m-1 rounded-lg hover:bg-zinc-800">
                {message[0].message.length > 25 ? message[0].message.slice(0, 25) + "..." : message[0].message}
              </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      <section className="main bg-zinc-900 text-white min-h-screen pb-32 w-120 ml-60">
        <div className="py-4 fixed w-full bg-zinc-900">
          <span className="mx-4 py-3 text-md font-bold">Falcon</span>
          <span className="text-md font-bold text-gray-300 opacity-90">3</span>
        </div>

        {questionPrompt || response ? (
          <div className="pt-12">
            {message.map((message, index) => (
              <div key={index}
                className="right2 w-full flex flex-col items-center h-fit">
                <div className="box1 m-auto py-7 flex justify-start w-[50vw] items-center space-x-6">
                  <div className="w-[50vw] flex justify-start space-x-6">
                  <img src="user.png" alt="user" className="w-5 h-5"/>
                  <div className="flex space-y-4 flex-col">
                    <div id="question">
                      {message[0].role === "user" ? message[0].message : ""}
                    </div>
                  </div>
                  </div>
                </div>

                <div ref={messagesEndRef}
                  className="box2 bg-zinc-800 py-7 flex justify-center w-4/6 items-center rounded-2xl">
                  <div className="w-[50vw] flex justify-start space-x-6">
                    <img className="w-5 h-5" src="openai-white.png" alt="GPT" />
                    <div className="flex space-y-4 flex-col leading-7 w-11/12">
                      <div id="solution">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {message[1].role === "assistant" ? message[1].message : "" && (<p className="text-white">{message[1].role === "assistant"? message[1].message: ""}</p>)}
                      </Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="right1 w-full flex flex-col items-center h-fit">
            <div className="bg-white rounded-full p-2 flex justify-center mt-48">
              <img
                src="openai-black.png"
                alt="black-logo"
                className="w-8 h-8"
              />
            </div>
            <h2 className="text-white text-2xl font-bold mt-3">
              How can I help you today?
            </h2>
            <h6 className="text-xs mt-3 opacity-60">
              Falcon can make mistakes
            </h6>
          </div>
        )}

        <div className="fixed top-0 left-60 right-0 flex justify-center p-4">
          {loading && <BeatLoader color="#fff" />}
        </div>

        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0.5 left-72 right-0 flex justify-center p-4 bg-zinc-900"
        >
          <textarea
            rows="1"
            type="text"
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="w-4/6 px-4 py-3 block scroll-auto bg-zinc-900 text-white border border-zinc-700 rounded-2xl focus:outline-none focus:border-zinc-600"
            placeholder="Message Falcon..."
          />
          
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`relative inset-y-0 right-14 px-4 ${
              !inputText.trim() ? "opacity-10" : ""
            }`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-black bg-white dark:text-black rounded-lg"
            >
              <path
                d="M7 11L12 6L17 11M12 18V7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </form>
      </section>
    </div>
  );
}
