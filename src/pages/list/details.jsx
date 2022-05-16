import React from 'react';
import { Button } from 'antd';
function ListDetails() {
  const [count, setCount] = React.useState(5);
  return (
    <div>
      ListDetails
      <Button onClick={() => {
        setCount(count + 1);
      }}>
        {count} ++
      </Button>
    </div>
  );
}

export default ListDetails;
