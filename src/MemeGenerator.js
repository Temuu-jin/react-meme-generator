import './MemeGenerator.scss'; // Import the SCSS file
import React, { useEffect, useState } from 'react';

function OneOrTwo({
  isTwo,
  topText,
  bottomText,
  handleInputChangeTop,
  handleInputChangeBottom,
}) {
  return isTwo ? (
    <>
      <input
        placeholder="Top Text"
        value={topText}
        onChange={handleInputChangeTop}
      />
      <input
        placeholder="Bottom Text"
        value={bottomText}
        onChange={handleInputChangeBottom}
      />
    </>
  ) : (
    <input
      placeholder="Top Text"
      value={topText}
      onChange={handleInputChangeTop}
    />
  );
}

function MemeGenerator() {
  const [randomTemplate, setRandomTemplate] = useState(null);
  const [topText, setTopText] = useState(' ');
  const [bottomText, setBottomText] = useState(' ');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTwo, setIsTwo] = useState(null);

  const fetchRandomTemplate = () => {
    fetch('https://api.memegen.link/templates')
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomTemplate(data[randomIndex]);
        const isTemplateWithTwoLines = data[randomIndex].lines === 2;

        setIsTwo(isTemplateWithTwoLines);

        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Error fetching template:', error);
      });
  };
  useEffect(() => {
    fetchRandomTemplate();
  }, []);

  const handleInputChangeTop = (e) => {
    setTopText(e.target.value);
  };
  const handleInputChangeBottom = (e) => {
    setBottomText(e.target.value);
  };

  const generateMemeUrl = () => {
    let memeUrl = `https://api.memegen.link/images/${randomTemplate.id}/`;
    memeUrl += `${encodeURIComponent(topText)}`;
    memeUrl += `/${encodeURIComponent(bottomText)}`;
    memeUrl += `.png`;

    return memeUrl;
  };

  return (
    <div>
      <h1>Meme Generator</h1>
      {isLoaded ? (
        <div className="meme-generator">
          <h2>Selected Template: {randomTemplate.name}</h2>

          <img src={generateMemeUrl()} alt="Generate Meme" />
          <OneOrTwo
            isTwo={isTwo}
            topText={topText}
            bottomText={bottomText}
            handleInputChangeTop={handleInputChangeTop}
            handleInputChangeBottom={handleInputChangeBottom}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MemeGenerator;
