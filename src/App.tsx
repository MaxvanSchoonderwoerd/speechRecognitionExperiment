import { useState } from "react";
import "./App.css";
import WordComponent from "./components/WordComponent";

function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);

  const recognition: SpeechRecognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.interimResults = true;
  recognition.continuous = true;

  const sentenceToRead: string = "De kat krabt de krullen van de trap elke dag";
  const sentencesToRead: string[] = ["De koeien grazen in de wei terwijl de zon langzaam ondergaat.", "De jongen rent naar huis en zwaait naar zijn vrienden op straat.", "Mijn oma bakt altijd de lekkerste appeltaart met kaneel en rozijnen.", "De kat ligt te slapen op de vensterbank in de warme zonnestralen.", "Op vakantie ga ik het liefst naar de bergen om te wandelen en te genieten van het uitzicht."];

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[sentenceIndex][0].transcript;
    if (event.results[sentenceIndex].isFinal) {
      //compare the word
      evaluate(sentencesToRead[sentenceIndex].split(" "), transcript.split(" "));

      //place the spoken word in dom
      const transcriptElement = document.createElement("p");
      transcriptElement.innerText = transcript;
      document.querySelector(".wordContainer")?.appendChild(transcriptElement);

      //if not on the last sentence to read, go to next sentence
      if (sentenceIndex != sentencesToRead.length) setSentenceIndex(sentenceIndex + 1);
    }
  };

  const evaluate = (sentenceToReadArray: string[], transcriptArray: string[]) => {
    transcriptArray.map((word: string, idx: number) => {
      let wordElem = document.getElementById(`${sentenceIndex}${word}${idx}`);
      if (!wordElem) return;
      if (word.toLowerCase() === sentenceToReadArray[idx].toLowerCase()) {
        wordElem.style.color = "green";
      } else {
        wordElem.style.color = "red";
      }
    });
  };

  const newSentence = () => {
    return sentencesToRead[sentenceIndex].split(" ").map((word: string, idx: number) => <WordComponent key={`${sentenceIndex}${word}${idx}`} word={word} idx={`${sentenceIndex}${word}${idx}`} />);
  };

  recognition.onaudiostart = () => {
    console.log("Audio capturing started");
  };

  recognition.onend = () => {
    console.log("Speech recognition service disconnected");
  };

  recognition.onspeechend = () => {
    console.log("Speech has stopped being detected");
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error(`Speech recognition error detected: ${event.error}`);
  };

  const handleSwitchRecognition = () => {
    if (!hasStarted) {
      recognition.start();
    } else {
      recognition.stop();
    }
    setHasStarted(!hasStarted);
  };

  return (
    <div className="App">
      <h1>Speech recognition test</h1>
      <button onClick={() => handleSwitchRecognition()}>
        {hasStarted ? "Stop" : "Start"} Speech Recognition {hasStarted}
      </button>
      <p>Lees voor:</p>
      {newSentence()}
      <div className="wordContainer"></div>
    </div>
  );
}

export default App;
