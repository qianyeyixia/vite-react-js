import { Button } from 'antd';
import React from 'react';

function Home() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      Home
      <Button onClick={() => {
        setCount(count + 1);
      }}>
        {count} ++
      </Button>
    </div>
  );
}

export default Home;
