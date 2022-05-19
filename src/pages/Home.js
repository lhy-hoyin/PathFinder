import { useState } from "react";
import {Link} from "react-router-dom"

export default function Home() {
  
  return (
    
        <body>
          <section className = "header">
            <nav>
              <a href="index.html"><img src = {"images/PathfinderLogo.png"} alt = "Pathfinder"/></a>
              <p className = "nav_PathFinder">PathFinder </p>
              <div className ="nav-links">
          
                <ul>
                    <li>
                    <a href="/Login"> Login</a>
                    </li>
                    <li>
                    <a href="/SignUp"> Sign Up</a>
                    </li>
                </ul>
              </div>
            </nav>
        
          <div className = "textbox"> 
            <h1> Design YOUR path  today</h1>
            <p> lol idk only limited to SoC</p>
            <p> Maybe put a getting started button here as a "tutorial"</p>
          </div>
        
          </section>

        </body>
  );
}
