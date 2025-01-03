import React, { useState } from 'react';
import './styles.scss';

const Training = () => {
  const videos = [
    {
      desc: '1. Introduction',
      link: 'https://youtube.com/embed/Xut74N-EQTs?rel=0',
    },
    {
      desc: '2. Input Decisions',
      link: 'https://youtube.com/embed/b3MR8bVGZ2Q?rel=0',
    },
    {
      desc: '3. Machinery Decisions',
      link: 'https://youtube.com/embed/uwVywoGJN5k?rel=0',
    },
    {
      desc: '4. Complex Decisions',
      link: 'https://youtube.com/embed/74WXAn7SVtE?rel=0',
    },
    {
      desc: '5. Financial Benefits',
      link: 'https://youtube.com/embed/I4lRDczGAss?rel=0',
    },
  ];

  const [selected, setSelected] = useState(videos[0]);

  return (
    <div id="Training">
      <h1>Training Videos</h1>
      <p>These videos illustrate how to use the Cover Crop Economic Decision Support Tool.</p>
      {
        videos.map((video) => (
          <a
            key={video.desc}
            onClick={() => setSelected(video)}
            target="frame"
            className={`button ${video.desc === selected.desc ? 'selected' : ''}`}
            href={video.link}
          >
            {video.desc}
          </a>
        ))
      }
      <div id="Video">
        <iframe
          name="frame"
          src={selected.link}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        />
      </div>
    </div>
  );
};

Training.menu = (
  <span>
    Trainin
    <u>g</u>
    &nbsp;Videos
  </span>
);

export default Training;
