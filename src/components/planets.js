import React, { useState, useEffect } from "react";

const Planets = () => {
  const [hasError, setErrors] = useState(false);
  const [planets, setPlanets] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/2"
  );

  async function fetchData() {
    setIsLoading(true);
    const res = await fetch(url);
    res
      .json()
      .then(res => {
        setPlanets(res);
        setIsLoading(false);
      })
      .catch(err => {
        setErrors(err);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return (
    <div>
      <span>{isLoading ? 'Is Loading' : JSON.stringify(planets)}</span>
      <hr />
      <a
        href="#"
        onClick={() => setUrl("https://jsonplaceholder.typicode.com/comments")}
      >
        {url}
      </a>
      <span>Has error: {JSON.stringify(hasError)}</span>
    </div>
  );
};
export default Planets;
