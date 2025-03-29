import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";

const FoodForecast = () => {
  const [predictedDemand, setPredictedDemand] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "food_requests"));
      const data = snapshot.docs.map(doc => doc.data().quantity);

      const xs = tf.tensor2d(data.map((_, i) => [i]), [data.length, 1]);
      const ys = tf.tensor2d(data, [data.length, 1]);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

      await model.fit(xs, ys, { epochs: 50 });

      const nextWeek = [data.length, data.length + 1, data.length + 2];
      const inputTensor = tf.tensor2d(nextWeek.map(i => [i]), [3, 1]);
      const predictions = model.predict(inputTensor).dataSync();

      setPredictedDemand(predictions);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>AI-Based Food Demand Forecasting</h2>
      <p>Next week estimated food requests: {predictedDemand.join(", ")}</p>
    </div>
  );
};

export default FoodForecast;
