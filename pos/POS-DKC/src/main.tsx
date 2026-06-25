// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { Provider } from "react-redux";
// import { store } from "./app/store";
// import "./index.css";
// import { CartProvider } from "./auth/cartContext";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <CartProvider>
//         <App />
//       </CartProvider>
//     </Provider>
//   </React.StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import { CartProvider } from "./auth/cartContext";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <CartProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </CartProvider>
    </Provider>
  </React.StrictMode>
);