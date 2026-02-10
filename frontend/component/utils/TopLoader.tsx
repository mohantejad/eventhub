'use client';

import NextTopLoader from 'nextjs-toploader';

const TopLoader = () => {
  return (
    <NextTopLoader
      color="#81a7e3"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #004aad,0 0 5px #004aad"
    />
  );
};

export default TopLoader;
