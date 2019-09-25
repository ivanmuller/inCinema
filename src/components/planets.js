import React, { useState, useEffect } from "react";

const Planets = () => {
  const [hasError, setErrors] = useState(false);
  const [planets, setPlanets] = useState({});
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/2"
  );

  async function fetchData() {
    const res = await fetch(url);
    res
      .json()
      .then(res => setPlanets(res))
      .catch(err => setErrors(err));
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return (
    <div>
      <span>{JSON.stringify(planets)}</span>
      <hr />
      <a
        href="#"
        onClick={() => setUrl("https://jsonplaceholder.typicode.com/todos/1")}
      >
        {url}
      </a>
      <span>Has error: {JSON.stringify(hasError)}</span>
    </div>
  );
};
export default Planets;
