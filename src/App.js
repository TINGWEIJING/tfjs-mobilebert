import * as qna from "@tensorflow-models/qna";
import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useRef, useState } from "react";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Oval } from "react-loader-spinner";
import "./App.css";
import * as tfgl from "@tensorflow/tfjs-backend-webgl";

const App = () => {
    // 3. Setup references and state hooks
    const passageRef = useRef(null);
    const questionRef = useRef(null);
    const [answer, setAnswer] = useState();
    const [model, setModel] = useState(null);

    // 4. Load Tensorflow Model
    const loadModel = async () => {
        const loadedModel = await qna.load();
        setModel(loadedModel);
        console.log("Model loaded.");
    };

    // 5. Handle Questions
    const answerQuestion = async (e) => {
        if (e.which === 13 && model !== null) {
            console.log("Question submitted.");
            const passage = passageRef.current.value;
            const question = questionRef.current.value;

            const answers = await model.findAnswers(question, passage);
            setAnswer(answers);
            console.log(answers.length);
        }
    };

    useEffect(() => {
        console.log(tfgl.version_webgl);
        console.log(tf.getBackend());
        tfgl.webgl.forceHalfFloat();
        var maxSize = tfgl.webgl_util.getWebGLMaxTextureSize(tfgl.version_webgl);
        console.log(maxSize);
        tf.ready().then((_) => {
            tf.enableProdMode();
            console.log("tfjs is ready");
            loadModel();
        });
    }, []);

    // 2. Setup input, question and result area
    return (
        <div className="App">
            <header className="App-header">
                {model == null ? (
                    <div>
                        <div>Model Loading</div>
                        <Oval type="Puff" color="#00BFFF" height={100} width={100} />
                    </div>
                ) : (
                    <React.Fragment>
                        Passage
                        <textarea ref={passageRef} rows="30" cols="100"></textarea>
                        Ask a Question (Hit "Enter" to submit)
                        <input ref={questionRef} onKeyPress={answerQuestion} size="80"></input>
                        <br />
                        Answers
                        {answer
                            ? answer.map((ans, idx) => (
                                  <div>
                                      <b>Answer {idx + 1} - </b> {ans.text} ({Math.floor(ans.score * 100) / 100})
                                  </div>
                              ))
                            : ""}
                    </React.Fragment>
                )}
            </header>
        </div>
    );
};

export default App;
