import { useEffect } from "react";
import "./App.css";

import TodoList from "./components/TodoList";

function App() {
  useEffect(() => {
    localStorage.setItem("name", "Smith");

    let name = localStorage.getItem("name");
    console.log(name);
  }, []);

  //
  //
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
