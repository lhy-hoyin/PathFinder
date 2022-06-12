import React from "react";
import Tree from 'react-d3-tree';

export default function graph() {

    const testing = {
        name: 'CS2040',
        children: [
          {
            name: 'CS1231S',
            children: [
              {
                name: 'MA1521',
              }
            ]
          }
        ]
      };

    return (
        <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
            <Tree data={testing} 
            />
        </div>
    );


}